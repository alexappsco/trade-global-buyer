import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getRealtimeApiOrigin } from './config-global';

// Create the next-intl middleware handler
const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // Proxy SignalR hub requests to the API (same-origin for the browser, so no
  // CORS is required). The current client uses this for Long Polling;
  // direct WebSockets connect to the API origin.
  if (request.nextUrl.pathname.startsWith('/hubs/')) {
    const target = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      getRealtimeApiOrigin()
    );
    return NextResponse.rewrite(target);
  }

  const intlResponse = intlMiddleware(request);

  // Return the intl middleware response (handles rewrites/headers for locale)
  return intlResponse ?? NextResponse.next();
}

export const config = {
  matcher: [
    // Include every hub path, even names containing dots excluded below.
    '/hubs/:path*',
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
