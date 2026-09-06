"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type {
  AuthFlowState,
  AuthRole,
  UserSession,
} from "src/types/auth";
import { logoutAction } from "src/actions/auth";
import {
  clearAuthSession,
  refreshAuthSession,
  saveAuthSession,
} from "src/actions/session";

type UserRole = "buyer" | "supplier" | null;

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;

  session: UserSession | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  authFlow: AuthFlowState;
  setAuthFlow: (flow: AuthFlowState) => void;
  clearAuthFlow: () => void;

  persistSession: (flow: AuthFlowState, session: UserSession) => Promise<void>;
  refreshSession: () => Promise<string | null>;
  getValidAccessToken: () => Promise<string | null>;
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

function isTokenExpired(expiresAt?: string, bufferMs = 30_000): boolean {
  if (!expiresAt) return false;
  const time = new Date(expiresAt).getTime();
  if (Number.isNaN(time)) return false;
  return time - bufferMs <= Date.now();
}

export function AuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession?: UserSession | null;
}) {
  const [session, setSession] = useState<UserSession | null>(initialSession ?? null);
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

  const persistSession = useCallback(
    (flow: AuthFlowState, nextSession: UserSession) => {
      setAuthFlowState(flow);
      setSession(nextSession);
      try {
        return saveAuthSession(nextSession);
      } catch {
        return Promise.resolve();
      }
    },
    []
  );

  const refreshSession = useCallback(async (): Promise<string | null> => {
    const next = await refreshAuthSession();
    if (!next) {
      setSession(null);
      setAuthFlowState({ mode: null });
      return null;
    }
    setSession(next);
    return next.accessToken;
  }, []);

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    if (!session?.accessToken) return null;

    if (isTokenExpired(session.accessTokenExpireAt)) {
      return refreshSession();
    }

    return session.accessToken;
  }, [session, refreshSession]);

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
    const current = session;
    if (current?.refreshToken) {
      try {
        await logoutAction(current.refreshToken);
      } catch {
        /* ignore logout network errors */
      }
    }
    await resetSession();
  }, [session, resetSession]);

  const value = useMemo<AuthContextType>(
    () => ({
      role,
      setRole,
      session,
      isAuthenticated: Boolean(session?.accessToken),
      accessToken: isTokenExpired(session?.accessTokenExpireAt)
        ? null
        : (session?.accessToken ?? null),
      authFlow,
      setAuthFlow,
      clearAuthFlow,
      persistSession,
      refreshSession,
      getValidAccessToken,
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
      persistSession,
      refreshSession,
      getValidAccessToken,
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