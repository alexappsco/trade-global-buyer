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
import { ROLE_TO_UI } from "src/types/auth";
import { logoutAction } from "src/actions/auth";

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

  persistSession: (flow: AuthFlowState, session: UserSession) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_KEY = "user_role";
const SESSION_KEY = "auth_session";
const FLOW_KEY = "auth_flow";

function readLocal<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLocal(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function removeLocal(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function getInitialRole(): UserRole {
  const saved = readLocal<string>(ROLE_KEY);
  if (saved === "buyer" || saved === "supplier") return saved;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(getInitialRole);
  const [session, setSession] = useState<UserSession | null>(() =>
    readLocal<UserSession>(SESSION_KEY)
  );
  const [authFlow, setAuthFlowState] = useState<AuthFlowState>(() =>
    readLocal<AuthFlowState>(FLOW_KEY) ?? { mode: null }
  );

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      writeLocal(ROLE_KEY, newRole);
    } else {
      removeLocal(ROLE_KEY);
    }
  }, []);

  const setAuthFlow = useCallback((flow: AuthFlowState) => {
    setAuthFlowState(flow);
    writeLocal(FLOW_KEY, flow);
  }, []);

  const clearAuthFlow = useCallback(() => {
    setAuthFlowState({ mode: null });
    removeLocal(FLOW_KEY);
  }, []);

  const persistSession = useCallback((flow: AuthFlowState, nextSession: UserSession) => {
    setSession(nextSession);
    writeLocal(SESSION_KEY, nextSession);
    setAuthFlow(flow);
    const uiRole = ROLE_TO_UI[nextSession.role];
    setRoleState(uiRole);
    writeLocal(ROLE_KEY, uiRole);
  }, [setAuthFlow, setRoleState]);

  const logout = useCallback(async () => {
    const currentRefresh = readLocal<UserSession>(SESSION_KEY)?.refreshToken;
    if (currentRefresh) {
      try {
        await logoutAction(currentRefresh);
      } catch {
        /* ignore logout network errors */
      }
    }
    setSession(null);
    removeLocal(SESSION_KEY);
    removeLocal(FLOW_KEY);
    setAuthFlowState({ mode: null });
    setRoleState(null);
    removeLocal(ROLE_KEY);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      role,
      setRole,
      session,
      isAuthenticated: Boolean(session?.accessToken),
      accessToken: session?.accessToken ?? null,
      authFlow,
      setAuthFlow,
      clearAuthFlow,
      persistSession,
      logout,
    }),
    [role, setRole, session, authFlow, setAuthFlow, clearAuthFlow, persistSession, logout]
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
