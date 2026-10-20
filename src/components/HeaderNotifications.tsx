"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "src/i18n/routing";
import Iconify from "src/components/iconify";
import { useNotifications } from "src/contexts/NotificationsContext";
import {
  getNotificationTypeConfig,
  notificationTimeAgo,
} from "src/utils/notification-config";
import type { AppNotification } from "src/types/notification";

function NotificationPreviewItem({
  notification,
  onMarkRead,
  onDismiss,
  onOpen,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onOpen: () => void;
}) {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const isUnread = !notification.isRead;
  const cfg = getNotificationTypeConfig(notification.type);

  return (
    <Box
      onClick={() => {
        if (isUnread) onMarkRead(notification.id);
        onOpen();
      }}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        px: 2,
        py: 1.25,
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        bgcolor: isUnread ? alpha(cfg.color, 0.04) : "transparent",
        "&:hover": {
          bgcolor: isUnread ? alpha(cfg.color, 0.08) : alpha("#000", 0.02),
          "& .notif-dismiss": { opacity: 1 },
        },
        "&::before": isUnread
          ? {
              content: '""',
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: "55%",
              borderRadius: "0 4px 4px 0",
              bgcolor: cfg.color,
            }
          : {},
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "12px",
          bgcolor: cfg.bg,
          color: cfg.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Iconify icon={cfg.icon} width={20} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isUnread ? 700 : 400,
            color: "#161C24",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {notification.message}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#9DA4AE", fontWeight: 500, mt: 0.25, display: "block" }}
        >
          {notificationTimeAgo(notification.createdAt, locale)}
        </Typography>
      </Box>

      <Tooltip title={t("dismiss")}>
        <IconButton
          className="notif-dismiss"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            color: "#9DA4AE",
            opacity: 0,
            transition: "opacity 0.2s",
            "&:hover": { color: "#D32F2F", bgcolor: alpha("#D32F2F", 0.08) },
          }}
        >
          <Iconify icon="solar:close-circle-bold" width={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function HeaderNotifications() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const router = useRouter();
  const {
    unreadCount,
    recentNotifications,
    isLoading,
    connectionState,
    markRead,
    markAllRead,
    dismiss,
    refresh,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    void refresh();
  };

  const handleClose = () => setAnchorEl(null);

  const handleGoToPage = () => {
    handleClose();
    router.push("/notifications");
  };

  const handleMarkRead = (id: string) => {
    void markRead(id);
  };

  const handleDismiss = (id: string) => {
    void dismiss(id);
  };

  const handleMarkAllRead = async () => {
    if (isMarkingAll || unreadCount === 0) return;
    setIsMarkingAll(true);
    await markAllRead();
    setIsMarkingAll(false);
  };

  const isLive = connectionState === "connected";

  return (
    <>
      <Tooltip title={t("title")}>
        <IconButton
          onClick={handleOpen}
          aria-label={t("title")}
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          sx={{
            position: "relative",
            color: "#171717",
            width: 40,
            height: 40,
            "&:hover": { bgcolor: "rgba(0,0,0,0.06)" },
          }}
        >
          <Badge
            badgeContent={unreadCount > 99 ? "99+" : unreadCount}
            color="error"
            invisible={unreadCount === 0}
            sx={{
              "& .MuiBadge-badge": {
                fontWeight: 700,
                fontSize: 10,
                minWidth: 16,
                height: 16,
                bgcolor: "#D32F2F",
                boxShadow: "0 0 0 2px #FFFFFF",
              },
            }}
          >
            <Iconify icon="solar:bell-bold-duotone" width={24} />
          </Badge>
          {connectionState === "connecting" && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#FAAD14",
                position: "absolute",
                bottom: 4,
                insetInlineEnd: 4,
                border: "1.5px solid #fff",
              }}
            />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: { xs: "calc(100vw - 32px)", sm: 400 },
              maxWidth: 400,
              borderRadius: "16px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
              border: "1px solid",
              borderColor: "grey.100",
              overflow: "hidden",
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            bgcolor: "#F8FBFA",
            borderBottom: "1px solid #E6EFEA",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ color: "#161C24", fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}
            >
              {t("title")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 0.75,
                py: 0.25,
                borderRadius: "999px",
                bgcolor: isLive ? alpha("#1B8354", 0.1) : alpha("#FAAD14", 0.12),
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: isLive ? "#1B8354" : "#FAAD14",
                  animation: isLive ? "pulseDot 1.6s ease-in-out infinite" : "none",
                  "@keyframes pulseDot": {
                    "0%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.4, transform: "scale(0.8)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isLive ? "#1B8354" : "#B7791F",
                  lineHeight: 1,
                }}
              >
                {isLive ? t("live") : t("connecting")}
              </Typography>
            </Box>
          </Box>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              sx={{
                color: "#1B8354",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "none",
                minWidth: "auto",
                px: 1,
                py: 0.5,
                borderRadius: "8px",
                "&:hover": { bgcolor: alpha("#1B8354", 0.08) },
              }}
            >
              {isMarkingAll ? t("marking") : t("mark_all_read")}
            </Button>
          )}
        </Box>

        {/* Live region label */}
        {unreadCount > 0 && (
          <Typography
            sx={{
              px: 2,
              pt: 1.25,
              fontSize: 11,
              fontWeight: 700,
              color: "#9DA4AE",
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {t("unread_count", { count: unreadCount })}
          </Typography>
        )}

        {/* List */}
        <Box
          sx={{
            maxHeight: 380,
            overflowY: "auto",
            py: unreadCount > 0 ? 0.5 : 0,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "grey.300",
              borderRadius: 3,
            },
          }}
        >
          {isLoading && recentNotifications.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} sx={{ display: "flex", gap: 1.5, px: 2, py: 1.25 }}>
                <Skeleton variant="rounded" width={38} height={38} sx={{ borderRadius: "12px", flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="85%" height={14} sx={{ mb: 0.75 }} />
                  <Skeleton width="40%" height={11} />
                </Box>
              </Box>
            ))
          ) : recentNotifications.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                py: 5,
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "18px",
                  bgcolor: "#F5F5F5",
                  color: "#9DA4AE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Iconify icon="solar:bell-bing-bold-duotone" width={30} />
              </Box>
              <Typography sx={{ color: "#637381", fontSize: 13, fontWeight: 600 }}>
                {t("empty")}
              </Typography>
            </Box>
          ) : (
            recentNotifications.map((notification, index) => (
              <Box key={notification.id}>
                <NotificationPreviewItem
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDismiss={handleDismiss}
                  onOpen={handleGoToPage}
                />
                {index < recentNotifications.length - 1 && (
                  <Divider sx={{ mx: 2, borderColor: "#F4F6F8" }} />
                )}
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        <Box
          onClick={handleGoToPage}
          sx={{
            borderTop: "1px solid #E6EFEA",
            py: 1.25,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            bgcolor: "#FCFDFC",
            "&:hover": { bgcolor: alpha("#1B8354", 0.05) },
            transition: "background 0.2s",
          }}
        >
          <Typography sx={{ color: "#1B8354", fontSize: 13, fontWeight: 700 }}>
            {t("view_all")}
          </Typography>
          <Iconify
            icon={locale === "ar" ? "solar:alt-arrow-left-linear" : "solar:alt-arrow-right-linear"}
            width={14}
            sx={{ color: "#1B8354" }}
          />
        </Box>
      </Popover>
    </>
  );
}
