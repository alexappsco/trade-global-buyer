"use client";

import { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { usePathname, useRouter } from "src/i18n/routing";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "src/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function isRootPath(pathnameWithoutLocale: string) {
  return pathnameWithoutLocale === "" || pathnameWithoutLocale === "/";
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { refreshSession, resetSession, session } = useAuth();
  const pathnameWithoutLocale = pathname?.replace(/^\/(?:ar|en)/, "") ?? "";
  const isAuthPage = pathnameWithoutLocale.startsWith("/auth");
  const isStandaloneLanding = pathnameWithoutLocale === "/landing";
  const isGuestLanding = !isStandaloneLanding && !session && isRootPath(pathnameWithoutLocale);
  const staticPageRoutes = [
    "/about-us",
    "/terms-and-conditions",
    "/privacy-policy",
    "/platform-policy",
    "/pages",
  ];
  const isStaticPage = staticPageRoutes.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );
  const isPublicPage = isAuthPage || isStandaloneLanding || isGuestLanding || isStaticPage;


  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      if (isPublicPage) {
        return;
      }

      const authenticated = await refreshSession();
      if (cancelled) return;

      if (!authenticated) {
        resetSession();
        router.replace("/auth/login");
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [isPublicPage, refreshSession, resetSession, router]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: "#f9fafb",
            color: "#171717",
            minWidth: 0,
            maxWidth: "100%",
            borderTop: "1px solid #1B83541A",
            [theme.breakpoints.up("md")]: {
              borderInlineStart: "1px solid #1B83541A",
            },
          }}
        >
          <Box sx={{ maxWidth: "1536px", mx: "auto", width: "100%" }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}