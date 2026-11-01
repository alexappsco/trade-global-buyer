import type { Metadata } from "next";

export const metadata: Metadata = {
  verification: {
    google: "JGASa1keXhBWoQJpjnsi6dAzhYCROdu2DpN8-0f405U",
  },
};

// This root layout is intentionally minimal.
// All locale-specific configuration (lang, dir, providers) is handled
// in src/app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
