"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type {
  AuthFlowState,
  AuthRole,
  SessionMeta,
} from "src/types/auth";
import {
  clearAuthSession,
  ensureAuthSessionFresh,
  getPublicSession,
  logoutAuthSession,
  updateAuthSessionMeta,
} from "src/actions/session";
import type { SessionMetaPatch } from "src/actions/session";

type UserRole = "buyer" | "supplier" | null;

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;

  /** Public session metadata (never contains tokens). */
  session: SessionMeta | null;
  isAuthenticated: boolean;

  authFlow: AuthFlowState;
  setAuthFlow: (flow: AuthFlowState) => void;
  clearAuthFlow: () => void;

  /** Re-read the session from the server cookies into client state. */
  syncSession: () => Promise<SessionMeta | null>;
  patchSession: (patch: SessionMetaPatch) => Promise<void>;
  /** Ensure a valid access token exists (refreshing if needed). Returns authentication status. */
  refreshSession: () => Promise<boolean>;
  resetSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function uiRoleOf(role?: string): UserRole {
  if (role === "Buyer") return "buyer";
  if (role === "Supplier") return "supplier";
  return null;
}

function uiRoleValue(role: UserRole): AuthRole | undefined {
  if (role === "buyer") return "Buyer";
  if (role === "supplier") return "Supplier";
  return undefined;
}

export function AuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession?: SessionMeta | null;
}) {
  const [session, setSession] = useState<SessionMeta | null>(initialSession ?? null);
  const [authFlow, setAuthFlowState] = useState<AuthFlowState>({ mode: null });

  const role: UserRole = session ? uiRoleOf(session.role) : null;

  const setRole = useCallback((newRole: UserRole) => {
    const roleValue = uiRoleValue(newRole);
    setSession((prev) => (prev && roleValue ? { ...prev, role: roleValue } : prev));
  }, []);

  const setAuthFlow = useCallback((flow: AuthFlowState) => {
    setAuthFlowState(flow);
  }, []);

  const clearAuthFlow = useCallback(() => {
    setAuthFlowState({ mode: null });
  }, []);

  const syncSession = useCallback(async (): Promise<SessionMeta | null> => {
    try {
      const next = await getPublicSession();
      setSession(next);
      return next;
    } catch {
      return null;
    }
  }, []);

  const patchSession = useCallback(async (patch: SessionMetaPatch) => {
    setSession((prev) => (prev ? { ...prev, ...patch } : prev));
    try {
      await updateAuthSessionMeta(patch);
    } catch {
      /* meta will be re-synced on the next session refresh */
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const authenticated = await ensureAuthSessionFresh();
    await syncSession();
    if (!authenticated) {
      setAuthFlowState({ mode: null });
    }
    return authenticated;
  }, [syncSession]);

  const resetSession = useCallback(async () => {
    setSession(null);
    setAuthFlowState({ mode: null });
    try {
      await clearAuthSession();
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAuthSession();
    } catch {
      /* ignore logout network errors */
    }
    setSession(null);
    setAuthFlowState({ mode: null });
  }, []);

  // Keep client state in sync with the cookie session (e.g. expiry/session
  // cleared by a server-side refresh failure) when the tab regains focus.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void syncSession();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [syncSession]);

  const value = useMemo<AuthContextType>(
    () => ({
      role,
      setRole,
      session,
      isAuthenticated: Boolean(session),
      authFlow,
      setAuthFlow,
      clearAuthFlow,
      syncSession,
      patchSession,
      refreshSession,
      resetSession,
      logout,
    }),
    [
      role,
      setRole,
      session,
      authFlow,
      setAuthFlow,
      clearAuthFlow,
      syncSession,
      patchSession,
      refreshSession,
      resetSession,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { AuthRole };
