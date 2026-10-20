import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // SignalR can hold a long poll for 90 seconds. Next's default proxy
    // timeout is 30 seconds, which would repeatedly disconnect idle clients.
    proxyTimeout: 120_000,
  },
  outputFileTracingIncludes: {
    '/*': ['./messages/**/*'],
  },
};

export default withNextIntl(nextConfig);
