import "server-only";

import { HOST_API } from "src/config-global";

const AUTH_BASE = `${HOST_API}/auth`;

export async function authRequest<T>(
  path: string,
  body?: unknown,
  lang?: string,
  accessToken?: string
): Promise<{ success: boolean; data?: T; error?: string; status?: number }> {
  const response = await fetch(`${AUTH_BASE}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": lang ?? "en",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const errorMsg =
      data?.message ??
      data?.error?.message ??
      (typeof data?.error === "string" ? data.error : null) ??
      data?.title ??
      `Request failed (${response.status})`;
    return { success: false, error: errorMsg, status: response.status };
  }

  return { success: true, data: data as T, status: response.status };
}
