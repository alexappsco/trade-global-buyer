import { HOST_API } from 'src/config-global';

const SESSION_KEY = 'auth_session';

type RequestConfig = RequestInit & {
  data?: unknown;
  url?: string;
  /** When true, do not attach the Authorization header. */
  skipAuth?: boolean;
};

interface StoredSession {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

function readSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession | null) {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    /* ignore */
  }
}

async function request<T = unknown>(url: string, config: RequestConfig = {}): Promise<T> {
  const { data, headers, skipAuth, ...rest } = config;

  const session = readSession();
  const accessToken = skipAuth ? undefined : session?.accessToken;

  const response = await fetch(`${HOST_API}${url}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: data === undefined ? rest.body : JSON.stringify(data),
  });

  // Attempt a single refresh on 401 then retry once.
  if (response.status === 401 && accessToken && !skipAuth) {
    const refreshed = await attemptRefresh(session);
    if (refreshed) {
      return request<T>(url, { ...config, skipAuth: false });
    }
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const status = response.status || 500;
    const message = getErrorMessage(responseData);

    if (status === 403 && (message === 'message.permission_denied' || responseData?.message === 'message.permission_denied')) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('permission_denied'));
      }
    }

    return Promise.reject({ message, status });
  }

  return responseData as T;
}

let refreshInFlight: Promise<boolean> | null = null;

async function attemptRefresh(session: StoredSession | null): Promise<boolean> {
  const refreshToken = session?.refreshToken;
  if (!refreshToken) return false;

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${HOST_API}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': 'en',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearSession();
        return false;
      }

      const nextSession: StoredSession = await response.json();
      // Merge: keep other fields but replace tokens atomically.
      writeSession({
        ...session,
        accessToken: nextSession.accessToken,
        refreshToken: nextSession.refreshToken,
        accessTokenExpireAt: nextSession.accessTokenExpireAt,
        refreshTokenExpireAt: nextSession.refreshTokenExpireAt,
      });
      return true;
    } catch {
      clearSession();
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

function clearSession() {
  writeSession(null);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth_expired'));
  }
}

const axiosInstance = {
  delete: <T = unknown>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'DELETE' }),
  get: <T = unknown>(url: string, config?: RequestConfig) =>
    request<T>(url, { ...config, method: 'GET' }),
  patch: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>(url, { ...config, data, method: 'PATCH' }),
  post: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>(url, { ...config, data, method: 'POST' }),
  put: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>(url, { ...config, data, method: 'PUT' }),
};

export default axiosInstance;

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Something went wrong';
};
