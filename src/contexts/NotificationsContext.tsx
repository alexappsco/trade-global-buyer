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
import { getRealtimeApiOrigin } from "src/config-global";
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
const INITIAL_RETRY_DELAY_MS = 2000;
const MAX_RETRY_DELAY_MS = 30000;

export type ConnectionState = "idle" | "connecting" | "connected" | "reconnecting";

export interface NotificationsContextType {
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

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, session } = useAuth();

  // Remount when session changes so cached notifications and active connections
  // belong strictly to the authenticated user.
  return (
    <SessionNotificationsProvider key={isAuthenticated ? session?.id : "signed-out"}>
      {children}
    </SessionNotificationsProvider>
  );
}

function SessionNotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, syncSession } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<AppNotification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(isAuthenticated);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchingRef = useRef(false);
  const pendingRef = useRef(false);
  const refreshRef = useRef<() => Promise<void>>(async () => {});
  const activeRef = useRef(false);
  const connectionRef = useRef<HubConnection | null>(null);

  /**
   * Coalesced refresh: concurrent calls collapse into one;
   * events arriving during an in-flight fetch schedule one follow-up.
   */
  const refresh = useCallback(async () => {
    if (!isAuthenticated || !activeRef.current) return;
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

      if (!activeRef.current) return;

      if (listRes.success && listRes.data) {
        setRecentNotifications(listRes.data.items ?? []);
        setTotalCount(listRes.data.totalCount ?? 0);
      }
      if (countRes.success && countRes.data) {
        setUnreadCount(countRes.data.unreadCount);
      }

      if (listRes.success) setRefreshTick((tick) => tick + 1);

      if (countRes.success && countRes.data) {
        window.dispatchEvent(
          new CustomEvent(UNREAD_CHANGED_EVENT, {
            detail: { count: countRes.data.unreadCount },
          })
        );
      }
    } catch {
      // Keep existing cached data if a network request fails.
    } finally {
      if (activeRef.current) setIsLoading(false);
      fetchingRef.current = false;
      if (pendingRef.current && activeRef.current) {
        pendingRef.current = false;
        queueMicrotask(() => {
          void refreshRef.current();
        });
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    activeRef.current = true;
    const timer = setTimeout(() => {
      void refresh();
    }, 0);
    return () => {
      activeRef.current = false;
      clearTimeout(timer);
    };
  }, [refresh]);

  // ── SignalR Realtime Connection ─────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    let disposed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let failureCount = 0;

    const fetchAccessToken = async (): Promise<string> => {
      if (disposed) throw new Error("Connection disposed");
      const res = await getRealtimeAccessToken();
      if (disposed) throw new Error("Connection disposed");

      if (res.success) {
        return res.token;
      }

      // If token refresh failed definitively, sync session to handle logout/redirect.
      await syncSession();
      throw new Error(res.error);
    };

    const buildConnection = (): HubConnection => {
      const hubUrl = `${getRealtimeApiOrigin()}/hubs/notifications`;

      return new HubConnectionBuilder()
        .withUrl(hubUrl, {
          transport: HttpTransportType.WebSockets,
          skipNegotiation: true,
          accessTokenFactory: fetchAccessToken,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            const delays = [0, 2000, 5000, 10000, 30000];
            return delays[retryContext.previousRetryCount] ?? MAX_RETRY_DELAY_MS;
          },
        })
        .configureLogging(LogLevel.None)
        .build();
    };

    const scheduleRestart = () => {
      if (disposed) return;
      if (retryTimer) clearTimeout(retryTimer);
      setConnectionState("reconnecting");

      const delay = Math.min(
        MAX_RETRY_DELAY_MS,
        INITIAL_RETRY_DELAY_MS * 2 ** Math.max(0, failureCount - 1)
      );

      retryTimer = setTimeout(() => {
        void startConnection();
      }, delay);
    };

    const wireConnection = (conn: HubConnection) => {
      // Backend notifies of any change (created, read, deleted).
      conn.on("NotificationsChanged", () => {
        if (disposed || conn !== connectionRef.current) return;
        void refresh();
      });

      // Automatic reconnection lifecycle:
      // Note: error is undefined when the server cleanly closes an idle connection
      // or rotates tokens. This is normal SignalR behavior and not an application error.
      conn.onreconnecting((error) => {
        if (disposed || conn !== connectionRef.current) return;
        setConnectionState("reconnecting");
        if (process.env.NODE_ENV === "development" && error) {
          console.warn("[SignalR] Connection interrupted, reconnecting...", error.message);
        }
      });

      conn.onreconnected(() => {
        if (disposed || conn !== connectionRef.current) return;
        setConnectionState("connected");
        failureCount = 0;
        void refresh();
      });

      conn.onclose((error) => {
        if (disposed || conn !== connectionRef.current) return;
        setConnectionState("idle");
        if (process.env.NODE_ENV === "development" && error) {
          console.warn("[SignalR] Connection closed, scheduling retry...", error.message);
        }
        scheduleRestart();
      });
    };

    const startConnection = async () => {
      if (disposed) return;

      if (!connectionRef.current) {
        connectionRef.current = buildConnection();
        wireConnection(connectionRef.current);
      }

      const conn = connectionRef.current;
      if (conn.state !== HubConnectionState.Disconnected) return;

      try {
        setConnectionState("connecting");
        await conn.start();
        if (disposed || conn !== connectionRef.current) return;

        failureCount = 0;
        setConnectionState("connected");
        void refresh();
      } catch (err) {
        if (disposed || conn !== connectionRef.current) return;
        failureCount += 1;

        if (err instanceof Error && err.message === "token_refresh_failed") {
          await syncSession();
          return;
        }

        scheduleRestart();
      }
    };

    // Delay start slightly to let React development mount/cleanup cycle stabilize
    const startTimer = setTimeout(() => {
      void startConnection();
    }, 50);

    return () => {
      disposed = true;
      clearTimeout(startTimer);
      if (retryTimer) clearTimeout(retryTimer);

      const conn = connectionRef.current;
      connectionRef.current = null;

      if (conn && conn.state !== HubConnectionState.Disconnected) {
        void conn.stop().catch(() => {});
      }
      setConnectionState("idle");
    };
  }, [isAuthenticated, refresh, syncSession]);

  // ── Re-sync when tab returns to the foreground ──────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const onFocus = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    document.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [isAuthenticated, refresh]);

  // ── Optimistic Actions ──────────────────────────────────────────────────
  const markRead = useCallback(
    async (id: string) => {
      // Optimistic update
      setRecentNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const res = await markNotificationRead(id);
      void refresh();
      return res.success;
    },
    [refresh]
  );

  const markAllRead = useCallback(async () => {
    // Optimistic update
    setRecentNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true, readAt: new Date().toISOString() }))
    );
    setUnreadCount(0);

    const res = await markAllNotificationsRead();
    void refresh();
    return res.success;
  }, [refresh]);

  const dismiss = useCallback(
    async (id: string) => {
      // Optimistic update
      setRecentNotifications((prev) => {
        const target = prev.find((item) => item.id === id);
        if (target && !target.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((item) => item.id !== id);
      });
      setTotalCount((prev) => Math.max(0, prev - 1));

      const res = await dismissNotification(id);
      void refresh();
      return res.success;
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
