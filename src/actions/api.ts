"use server";

import { HOST_API } from "src/config-global";
import { getAuthSession, refreshAuthSession } from "src/actions/session";

export interface ApiRequestOptions {
  lang?: string;
  accessToken?: string;
  skipAuth?: boolean;
}

interface ApiErrorBody {
  message?: string;
  details?: unknown;
}

function isTokenExpired(expiresAt?: string, bufferMs = 30_000): boolean {
  if (!expiresAt) return false;
  const time = new Date(expiresAt).getTime();
  if (Number.isNaN(time)) return false;
  return time - bufferMs <= Date.now();
}

async function resolveAccessToken(options: ApiRequestOptions): Promise<string | null> {
  if (options.accessToken) return options.accessToken;
  if (options.skipAuth) return null;

  const session = await getAuthSession();
  if (!session?.accessToken) return null;

  if (isTokenExpired(session.accessTokenExpireAt)) {
    const refreshed = await refreshAuthSession();
    return refreshed?.accessToken ?? null;
  }

  return session.accessToken;
}

async function apiRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { lang = "en", skipAuth } = options;
  const accessToken = await resolveAccessToken(options);

  const response = await fetch(`${HOST_API}${url}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": lang,
      ...(accessToken && !skipAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  const data: ApiErrorBody | undefined = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const error = new Error(data?.message ?? `Request failed (${response.status})`);
    (error as Error & { status?: number }).status = response.status;
    (error as Error & { details?: unknown }).details = data?.details ?? null;
    throw error;
  }

  return data as T;
}

export async function apiGet<T>(url: string, options?: ApiRequestOptions) {
  return apiRequest<T>(url, "GET", undefined, options);
}

export async function apiPost<T>(url: string, body?: unknown, options?: ApiRequestOptions) {
  return apiRequest<T>(url, "POST", body, options);
}

export async function apiPut<T>(url: string, body?: unknown, options?: ApiRequestOptions) {
  return apiRequest<T>(url, "PUT", body, options);
}

export async function apiPatch<T>(url: string, body?: unknown, options?: ApiRequestOptions) {
  return apiRequest<T>(url, "PATCH", body, options);
}

export async function apiDelete<T>(url: string, options?: ApiRequestOptions) {
  return apiRequest<T>(url, "DELETE", undefined, options);
}