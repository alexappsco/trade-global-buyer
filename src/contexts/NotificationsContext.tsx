"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { REALTIME_HUB_PATH, getRealtimeApiOrigin } from "src/config-global";
import { useAuth } from "src/contexts/AuthContext";
import {
  getNotifications,
  getNotificationUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from "src/actions/notifications";
import { getRealtimeAccessToken } from "src/actions/session";
import type { AppNotification } from "src/types/notification";

export const UNREAD_CHANGED_EVENT = "notification-unread-changed";

const PREVIEW_COUNT = 8;
const MAX_RETRY_DELAY_MS = 30_000;

async function fetchAccessToken(): Promise<string> {
  const res = await getRealtimeAccessToken();
  if (res.success) return res.token;
  throw new Error(res.error);
}

type ConnectionState = "idle" | "connecting" | "connected" | "reconnecting";

interface NotificationsContextType {
  unreadCount: number;
  recentNotifications: AppNotification[];
  totalCount: number;
  isLoading: boolean;
  connectionState: ConnectionState;
  /** Bumped on every successful refresh — use it as a refetch trigger. */
  refreshTick: number;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<boolean>;
  markAllRead: () => Promise<boolean>;
  dismiss: (id: string) => Promise<boolean>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, session } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<AppNotification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchingRef = useRef(false);
  const pendingRef = useRef(false);
  const refreshRef = useRef<() => Promise<void>>(async () => {});

  /** Coalesced refresh: concurrent calls collapse; events during a fetch queue one follow-up. */
  const refresh = useCallback(async () => {
    if (fetchingRef.current) {
      pendingRef.current = true;
      return;
    }
    fetchingRef.current = true;
    setIsLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        getNotifications({ skipCount: 0, maxResultCount: PREVIEW_COUNT }),
        getNotificationUnreadCount(),
      ]);

      if (listRes.success && listRes.data) {
        setRecentNotifications(listRes.data.items ?? []);
        setTotalCount(listRes.data.totalCount ?? 0);
      }
      if (countRes.success && countRes.data) {
        setUnreadCount(countRes.data.unreadCount);
      }

      setRefreshTick((tick) => tick + 1);
      window.dispatchEvent(
        new CustomEvent(UNREAD_CHANGED_EVENT, {
          detail: {
            count: countRes.success && countRes.data ? countRes.data.unreadCount : 0,
          },
        })
      );
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        queueMicrotask(() => {
          void refreshRef.current();
        });
      }
    }
  }, []);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  // ── SignalR connection lifecycle ────────────────────────────────────────
  //
  // Transport strategy:
  // 1. WebSockets DIRECTLY against the API (`wss://…/hubs/notifications`,
  //    skipNegotiation) — WebSockets are not subject to CORS, so no proxy
  //    and no CORS headers are needed.
  // 2. If WebSockets cannot start (e.g. a proxy blocks the upgrade), fall
  //    back to long polling through the same-origin Next.js proxy
  //    (src/proxy.ts). Long polling is plain request/response HTTP, so it
  //    passes through proxies reliably (SSE does not — streams get buffered
  //    or cut, which kills the SignalR handshake).
  useEffect(() => {
    if (!isAuthenticated || !session?.id) return;

    let disposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let mode: "websocket" | "longpolling" = "websocket";
    let failureCount = 0;
    let connection: HubConnection | null = null;

    const buildConnection = (useWebSocket: boolean): HubConnection => {
      const url = useWebSocket
        ? `${getRealtimeApiOrigin()}/hubs/notifications`
        : REALTIME_HUB_PATH;
      const options = useWebSocket
        ? {
            transport: HttpTransportType.WebSockets,
            skipNegotiation: true,
            accessTokenFactory: fetchAccessToken,
          }
        : {
            transport: HttpTransportType.LongPolling,
            accessTokenFactory: fetchAccessToken,
          };
      return new HubConnectionBuilder()
        .withUrl(url, options)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();
    };

    const scheduleRestart = () => {
      if (disposed) return;
      setConnectionState("reconnecting");
      const delay = Math.min(MAX_RETRY_DELAY_MS, 1000 * 2 ** failureCount);
      retryTimer = setTimeout(() => {
        void startConnection();
      }, delay);
    };

    const wireConnection = (conn: HubConnection) => {
      // The live event is only a change signal — always reload list + count via REST.
      conn.on("NotificationsChanged", () => {
        void refresh();
      });
      conn.onreconnected(() => {
        if (disposed || conn !== connection) return;
        setConnectionState("connected");
        // Events are not replayed — reload everything after reconnecting.
        void refresh();
      });
      conn.onclose(() => {
        if (disposed || conn !== connection) return;
        // Automatic retries were exhausted (or the token expired) — restart
        // manually for as long as the user stays signed in.
        scheduleRestart();
      });
    };

    const startConnection = async () => {
      if (disposed) return;
      if (!connection) {
        connection = buildConnection(mode === "websocket");
        wireConnection(connection);
      }
      const conn = connection;
      try {
        setConnectionState(
          conn.state === HubConnectionState.Reconnecting ? "reconnecting" : "connecting"
        );
        await conn.start();
        if (disposed || conn !== connection) return;
        failureCount = 0;
        setConnectionState("connected");
        void refresh();
      } catch {
        if (disposed || conn !== connection) return;
        failureCount += 1;
        // WebSockets failed twice in a row — switch to long polling via proxy.
        if (mode === "websocket" && failureCount >= 2) {
          mode = "longpolling";
          failureCount = 0;
          try {
            await conn.stop();
          } catch {
            /* ignore */
          }
          connection = null;
        }
        scheduleRestart();
      }
    };

    void startConnection();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (connection && connection.state !== HubConnectionState.Disconnected) {
        void connection.stop();
      }
      setConnectionState("idle");
    };
  }, [isAuthenticated, session?.id, refresh]);

  // ── Refresh when the tab returns to the foreground (missed events) ──────
  useEffect(() => {
    if (!isAuthenticated) return;
    const onFocus = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [isAuthenticated, refresh]);

  // ── Actions (refresh from REST after every successful mutation) ─────────
  const markRead = useCallback(
    async (id: string) => {
      const res = await markNotificationRead(id);
      if (!res.success) return false;
      void refresh();
      return true;
    },
    [refresh]
  );

  const markAllRead = useCallback(async () => {
    const res = await markAllNotificationsRead();
    if (!res.success) return false;
    void refresh();
    return true;
  }, [refresh]);

  const dismiss = useCallback(
    async (id: string) => {
      const res = await dismissNotification(id);
      if (!res.success) return false;
      void refresh();
      return true;
    },
    [refresh]
  );

  const value = useMemo(
    () => ({
      unreadCount,
      recentNotifications,
      totalCount,
      isLoading,
      connectionState,
      refreshTick,
      refresh,
      markRead,
      markAllRead,
      dismiss,
    }),
    [
      unreadCount,
      recentNotifications,
      totalCount,
      isLoading,
      connectionState,
      refreshTick,
      refresh,
      markRead,
      markAllRead,
      dismiss,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextType {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
}
