"use server";

import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import type { SessionMeta, UserSession } from "src/types/auth";
import {
  logoutAction,
  refreshTokenAction,
  verifyLoginOtpAction,
} from "src/actions/auth";
import type { VerifyLoginOtpPayload } from "src/actions/auth";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const SESSION_META_COOKIE = "auth_session";
const EXPIRY_BUFFER_MS = 30_000;

function isTokenExpired(expiresAt?: string, bufferMs = EXPIRY_BUFFER_MS): boolean {
  if (!expiresAt) return false;
  const time = new Date(expiresAt).getTime();
  if (Number.isNaN(time)) return false;
  return time - bufferMs <= Date.now();
}

function cookieMaxAge(expiresAt?: string): number | undefined {
  if (!expiresAt) return undefined;
  const time = new Date(expiresAt).getTime();
  if (Number.isNaN(time)) return undefined;
  return Math.max(0, Math.floor((time - Date.now()) / 1000));
}

function buildCookieOptions(expiresAt?: string) {
  const maxAge = cookieMaxAge(expiresAt);
  // Default to secure in production, unless explicitly disabled via environment variable
  const isSecure =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ALLOW_INSECURE_COOKIES !== "true";
  return {
    httpOnly: true,
    secure: isSecure,
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
    avatarUrl: session.avatarUrl,
    role: session.role,
    accountType: session.accountType,
    profileCompleted: session.profileCompleted,
    accessTokenExpireAt: session.accessTokenExpireAt,
    refreshTokenExpireAt: session.refreshTokenExpireAt,
  };
}

/** Server-only: full session including tokens. */
export async function getAuthSession(): Promise<UserSession | null> {
  const store = await cookies();
  // The access-token cookie may already be gone/expired while the refresh token
  // is still valid — that is exactly when we need to refresh, so it is optional.
  const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value ?? "";
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;
  const meta = parseMeta(store.get(SESSION_META_COOKIE)?.value);

  if (!refreshToken || !meta) return null;

  return { ...meta, accessToken, refreshToken };
}

/** Safe for the client: session metadata without tokens. */
export async function getPublicSession(): Promise<SessionMeta | null> {
  const session = await getAuthSession();
  if (!session) return null;
  return toMeta(session);
}

export async function saveAuthSession(session: UserSession | null): Promise<void> {
  const store = await cookies();

  if (!session) {
    await clearAuthSession();
    return;
  }

  // Keep the access-token cookie alive for as long as the refresh token so a
  // silently refreshed token can be written back. Its real expiry is tracked in
  // the meta cookie (accessTokenExpireAt) and enforced server-side.
  store.set(ACCESS_TOKEN_COOKIE, session.accessToken, buildCookieOptions(session.refreshTokenExpireAt));
  store.set(REFRESH_TOKEN_COOKIE, session.refreshToken, buildCookieOptions(session.refreshTokenExpireAt));
  store.set(SESSION_META_COOKIE, JSON.stringify(toMeta(session)), buildCookieOptions(session.refreshTokenExpireAt));
}

export async function clearAuthSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  store.delete(SESSION_META_COOKIE);
}

export type SessionMetaPatch = Partial<
  Pick<SessionMeta, "name" | "phoneNumber" | "email" | "avatarUrl" | "profileCompleted">
>;

export async function updateAuthSessionMeta(patch: SessionMetaPatch): Promise<void> {
  const store = await cookies();
  const meta = parseMeta(store.get(SESSION_META_COOKIE)?.value);
  if (!meta) return;

  const next: SessionMeta = { ...meta, ...patch };
  store.set(SESSION_META_COOKIE, JSON.stringify(next), buildCookieOptions(meta.refreshTokenExpireAt));
}

type RefreshResponse = Awaited<ReturnType<typeof refreshTokenAction>>;
const refreshRequests = new Map<string, Promise<RefreshResponse>>();

function refreshSessionToken(token: string): Promise<RefreshResponse> {
  const key = createHash("sha256").update(token).digest("hex");
  const existing = refreshRequests.get(key);
  if (existing) return existing;

  const request = refreshTokenAction(token);
  refreshRequests.set(key, request);
  const remove = () => {
    if (refreshRequests.get(key) === request) refreshRequests.delete(key);
  };
  void request.then((result) => {
    // Briefly retain a successful rotation for requests carrying the old cookie.
    if (result.success && result.data) setTimeout(remove, 5000).unref();
    else remove();
  }, remove);
  return request;
}

export async function refreshAuthSession(force = false): Promise<UserSession | null> {
  const session = await getAuthSession();
  if (!session) return null;

  if (!force && session.accessToken && !isTokenExpired(session.accessTokenExpireAt)) {
    return session;
  }

  if (!session.refreshToken) {
    await clearAuthSession();
    return null;
  }

  try {
    // Each caller must write cookies in its own request context, even when
    // the backend rotation was shared with another request from this session.
    const nextRes = await refreshSessionToken(session.refreshToken);
    if (!nextRes.success || !nextRes.data) {
      const status = nextRes.status;
      // Only a definitive auth rejection invalidates the session. Transient
      // failures (5xx, network, unknown) keep the session so it can retry later.
      if (status === 400 || status === 401 || status === 403) {
        await clearAuthSession();
      }
      return null;
    }
    await saveAuthSession(nextRes.data);
    return nextRes.data;
  } catch {
    // Network/exception — keep the session for a later retry.
    return null;
  }
}

/**
 * Server action for the client guard: returns whether a valid session exists
 * (refreshing when possible) without ever exposing tokens to the caller.
 */
export async function ensureAuthSessionFresh(): Promise<boolean> {
  const session = await getAuthSession();
  if (!session) return false;
  if (session.accessToken && !isTokenExpired(session.accessTokenExpireAt)) return true;

  await refreshAuthSession(false);

  // Authenticated if the session survived (a transient refresh failure keeps it).
  return Boolean(await getAuthSession());
}

/**
 * Returns a valid access token for the SignalR realtime hub.
 *
 * Tokens normally live only in httpOnly cookies, but the browser SignalR
 * client must send the token itself (`accessTokenFactory`), so this server
 * action hands the current (auto-refreshed) token to the client for the sole
 * purpose of opening the realtime connection.
 */
export async function getRealtimeAccessToken(): Promise<
  { success: true; token: string } | { success: false; error: string }
> {
  let session = await getAuthSession();
  if (!session) return { success: false, error: "unauthenticated" };

  if (!session.accessToken || isTokenExpired(session.accessTokenExpireAt)) {
    session = await refreshAuthSession(false);
    if (!session || !session.accessToken) {
      return { success: false, error: "token_refresh_failed" };
    }
  }

  return { success: true, token: session.accessToken };
}

// ----------------------------------------------------------------------

export type LoginOtpResult = {
  success: boolean;
  error?: string;
  profileCompleted?: boolean;
};

/**
 * Verifies the login OTP and persists the session server-side, so the tokens
 * never reach the browser.
 */
export async function loginWithOtp(
  payload: VerifyLoginOtpPayload,
  lang?: string
): Promise<LoginOtpResult> {
  const res = await verifyLoginOtpAction(payload, lang);
  if (!res.success || !res.data) {
    return { success: false, error: res.error };
  }

  await saveAuthSession(res.data);
  return { success: true, profileCompleted: res.data.profileCompleted };
}

/**
 * Revokes the refresh token on the backend (using the httpOnly cookie) and
 * clears the local session.
 */
export async function logoutAuthSession(lang?: string): Promise<void> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    try {
      await logoutAction(refreshToken, lang);
    } catch {
      /* ignore logout network errors */
    }
  }

  await clearAuthSession();
}
