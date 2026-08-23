"use client";

import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import EmptyContent from "src/components/empty-content";
import { useToast } from "src/components/toast";
import type { AppNotification } from "src/types/notification";
import { MOCK_NOTIFICATIONS } from "./mock-notifications";
import NotificationItem from "./NotificationItem";

export default function NotificationsView() {
  const t = useTranslations("Notifications");
  const { success } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    success(t("dismissed"));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {t("title")}
        </Typography>
      </Box>

      {notifications.length === 0 ? (
        <EmptyContent title={t("empty")} sx={{ py: 8 }} />
      ) : (
        notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={handleDismiss}
            showDivider={index < notifications.length - 1}
          />
        ))
      )}
    </Paper>
  );
}
