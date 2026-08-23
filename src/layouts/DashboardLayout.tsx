"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          }}
        >
          <Box sx={{ maxWidth: "1536px", mx: "auto", width: "100%" }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
