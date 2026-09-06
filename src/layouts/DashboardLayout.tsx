"use client";

import { useEffect, useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { usePathname, useRouter } from "src/i18n/routing";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "src/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { getValidAccessToken, resetSession } = useAuth();
  const pathnameWithoutLocale = pathname?.replace(/^\/(?:ar|en)/, "") ?? "";
  const isAuthPage = pathnameWithoutLocale.startsWith("/auth");

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      if (isAuthPage) {
        setChecking(false);
        return;
      }

      const token = await getValidAccessToken();
      if (cancelled) return;

      if (token) {
        setChecking(false);
        return;
      }

      resetSession();
      router.replace("/auth/login");
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [isAuthPage, getValidAccessToken, resetSession, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f9fafb",
        }}
      >
        <Typography variant="body2" sx={{ color: "#9DA4AE" }}>
          ...
        </Typography>
      </Box>
    );
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
            p: 4,
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