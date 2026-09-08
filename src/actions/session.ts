"use server";

import { cookies } from "next/headers";
import type { AuthAccountType, AuthRole, UserSession } from "src/types/auth";
import { refreshTokenAction } from "src/actions/auth";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const SESSION_META_COOKIE = "auth_session";

interface SessionMeta {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: AuthRole;
  accountType: AuthAccountType;
  profileCompleted: boolean;
  accessTokenExpireAt: string;
  refreshTokenExpireAt: string;
}

function isTokenExpired(expiresAt?: string, bufferMs = 30_000): boolean {
  if (!expiresAt) return false;
  const time = new Date(expiresAt).getTime();
  if (Number.isNaN(time)) return false;
  return time - bufferMs <= Date.now();
}

function cookieMaxAge(expiresAt?: string): number | undefined {
  if (!expiresAt) return undefined;
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function buildCookieOptions(expiresAt?: string) {
  const maxAge = cookieMaxAge(expiresAt);
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}

function parseMeta(raw: string | undefined): SessionMeta | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionMeta;
    if (!parsed.accessTokenExpireAt || !parsed.refreshTokenExpireAt || !parsed.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function toMeta(session: UserSession): SessionMeta {
  return {
    id: session.id,
    name: session.name,
    phoneNumber: session.phoneNumber,
    email: session.email,
    role: session.role,
    accountType: session.accountType,
    profileCompleted: session.profileCompleted,
    accessTokenExpireAt: session.accessTokenExpireAt,
    refreshTokenExpireAt: session.refreshTokenExpireAt,
  };
}

export async function getAuthSession(): Promise<UserSession | null> {
  const store = await cookies();
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;
  const meta = parseMeta(store.get(SESSION_META_COOKIE)?.value);

  if (!accessToken || !refreshToken || !meta) return null;

  return {
    ...meta,
    accessToken,
    refreshToken,
  };
}

export async function saveAuthSession(session: UserSession | null): Promise<void> {
  const store = await cookies();

  if (!session) {
    await clearAuthSession();
    return;
  }

  store.set(ACCESS_TOKEN_COOKIE, session.accessToken, buildCookieOptions(session.accessTokenExpireAt));
  store.set(REFRESH_TOKEN_COOKIE, session.refreshToken, buildCookieOptions(session.refreshTokenExpireAt));
  store.set(SESSION_META_COOKIE, JSON.stringify(toMeta(session)), buildCookieOptions(session.refreshTokenExpireAt));
}

export async function clearAuthSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  store.delete(SESSION_META_COOKIE);
}

export async function refreshAuthSession(): Promise<UserSession | null> {
  const session = await getAuthSession();
  if (!session) return null;

  if (!isTokenExpired(session.accessTokenExpireAt)) {
    return session;
  }

  if (!session.refreshToken) {
    await clearAuthSession();
    return null;
  }

  try {
    const next = await refreshTokenAction(session.refreshToken);
    await saveAuthSession(next);
    return next;
  } catch {
    await clearAuthSession();
    return null;
  }
}