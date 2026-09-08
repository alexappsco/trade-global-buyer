"use client";

import { useState, useEffect } from "react";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import EmptyContent from "src/components/empty-content";
import { useToast } from "src/components/toast";
import type { AppNotification } from "src/types/notification";
import {
  getNotifications,
  getNotificationUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from "src/actions/notifications";
import NotificationItem from "./NotificationItem";

export default function NotificationsView() {
  const t = useTranslations("Notifications");
  const toast = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const [listRes, countRes] = await Promise.all([
        getNotifications({ skipCount: 0, maxResultCount: 1000 }),
        getNotificationUnreadCount(),
      ]);
      if (!listRes.success) {
        toast.error(listRes.error);
        setIsLoading(false);
        return;
      }
      setNotifications(listRes.data.items || []);
      if (countRes.success) {
        setUnreadCount(countRes.data.unreadCount);
      }
      setIsLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleDismiss = async (id: string) => {
    const res = await dismissNotification(id);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    if (target && !target.isRead) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    toast.success(t("dismissed"));
  };

  const handleMarkRead = async (notification: AppNotification) => {
    if (notification.isRead) return;
    const res = await markNotificationRead(notification.id);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    setNotifications((prev) =>
      prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    if (isMarkingAll) return;
    setIsMarkingAll(true);
    const res = await markAllNotificationsRead();
    setIsMarkingAll(false);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {t("title")}
        </Typography>

        {!isLoading && notifications.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {unreadCount > 0 && (
              <Chip
                size="small"
                label={t("unread_count", { count: unreadCount })}
                sx={{
                  bgcolor: "rgba(16, 117, 78, 0.1)",
                  color: "#006838",
                  fontWeight: 700,
                  borderRadius: "8px",
                }}
              />
            )}
            {unreadCount > 0 && (
              <Button
                size="small"
                variant="outlined"
                disabled={isMarkingAll}
                onClick={handleMarkAllRead}
                sx={{
                  borderColor: "#10754E",
                  color: "#10754E",
                  fontWeight: 700,
                  borderRadius: "8px",
                  textTransform: "none",
                  px: 1.5,
                  gap: 1,
                  "&:hover": { borderColor: "#0c5b3c", bgcolor: "rgba(16,117,78,0.04)" },
                }}
              >
                {isMarkingAll ? t("marking") : t("mark_all_read")}
              </Button>
            )}
          </Box>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("loading")}
          </Typography>
        </Box>
      ) : notifications.length === 0 ? (
        <EmptyContent title={t("empty")} sx={{ py: 8 }} />
      ) : (
        notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={handleDismiss}
            onMarkRead={handleMarkRead}
            showDivider={index < notifications.length - 1}
          />
        ))
      )}
    </Paper>
  );
}