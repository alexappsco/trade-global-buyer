"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  Pagination,
  Stack,
  IconButton,
  Skeleton,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslations, useLocale } from "next-intl";
import EmptyContent from "src/components/empty-content";
import { useToast } from "src/components/toast";
import Iconify from "src/components/iconify";
import type { AppNotification, NotificationType } from "src/types/notification";
import {
  getNotifications,
  getNotificationUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from "src/actions/notifications";

const PAGE_SIZE = 10;

// ─── Icon / color map per notification type ───────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationType | "default",
  { icon: string; bg: string; color: string }
> = {
  quotation_offer_received:     { icon: "solar:inbox-archive-bold-duotone",    bg: "#E3F2FD", color: "#1565C0" },
  quotation_offer_accepted:     { icon: "solar:check-circle-bold-duotone",     bg: "#E8F5E9", color: "#2E7D32" },
  quotation_offer_declined:     { icon: "solar:close-circle-bold-duotone",     bg: "#FFEBEE", color: "#C62828" },
  quotation_offer_auto_declined:{ icon: "solar:clock-circle-bold-duotone",     bg: "#FFF3E0", color: "#E65100" },
  quotation_offer_closed:       { icon: "solar:lock-bold-duotone",             bg: "#F3E5F5", color: "#6A1B9A" },
  support_status_changed:       { icon: "solar:headphones-round-sound-bold-duotone", bg: "#E8EAF6", color: "#3949AB" },
  support_reply_added:          { icon: "solar:chat-round-dots-bold-duotone",  bg: "#E0F7FA", color: "#00695C" },
  default:                      { icon: "solar:bell-bold-duotone",             bg: "#F5F5F5", color: "#616161" },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type as NotificationType] ?? TYPE_CONFIG.default;
}

function timeAgo(iso: string, locale: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return locale === "ar" ? "الآن" : "Just now";
  if (mins < 60)
    return locale === "ar" ? `منذ ${mins} د` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)
    return locale === "ar" ? `منذ ${hrs} س` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)
    return locale === "ar" ? `منذ ${days} أيام` : `${days}d ago`;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(iso));
}

// ─── Single notification card ─────────────────────────────────────────────────
function NotificationCard({
  notification,
  onDismiss,
  onMarkRead,
}: {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  onMarkRead: (n: AppNotification) => void;
}) {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const isUnread = !notification.isRead;
  const cfg = getTypeConfig(notification.type);

  return (
    <Box
      onClick={() => { if (isUnread) onMarkRead(notification); }}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        px: 3,
        py: 1.5,
        cursor: isUnread ? "pointer" : "default",
        position: "relative",
        transition: "background 0.2s",
        borderRadius: 2,
        bgcolor: isUnread ? alpha(cfg.color, 0.04) : "transparent",
        "&:hover": {
          bgcolor: isUnread ? alpha(cfg.color, 0.08) : alpha("#000", 0.02),
        },
        // unread left accent
        "&::before": isUnread
          ? {
              content: '""',
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: "60%",
              borderRadius: "0 4px 4px 0",
              bgcolor: cfg.color,
            }
          : {},
      }}
    >
      {/* Icon avatar */}
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: "14px",
          bgcolor: cfg.bg,
          color: cfg.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: 0.25,
        }}
      >
        <Iconify icon={cfg.icon} width={24} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          {isUnread && (
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: cfg.color,
                flexShrink: 0,
              }}
            />
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: isUnread ? 700 : 400,
              color: "text.primary",
              lineHeight: 1.6,
            }}
          >
            {notification.message}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 500 }}>
          {timeAgo(notification.createdAt, locale)}
        </Typography>
      </Box>

      {/* Dismiss */}
      <Tooltip title={t("dismiss")}>
        <IconButton
          onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
          sx={{
            color: "text.disabled",
            flexShrink: 0,
            mt: 0.25,
            width: 40,
            height: 40,
            "&:hover": { color: "error.main", bgcolor: alpha("#FF3B30", 0.08) },
          }}
        >
          <Iconify icon="solar:close-circle-bold" width={26} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function NotificationSkeleton() {
  return (
    <Box sx={{ display: "flex", gap: 2, px: 3, py: 2.5 }}>
      <Skeleton variant="rounded" width={46} height={46} sx={{ borderRadius: "14px", flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton width="80%" height={18} sx={{ mb: 1 }} />
        <Skeleton width="40%" height={14} />
      </Box>
    </Box>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function NotificationsView() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const toast = useToast();
  const isRtl = locale === "ar";

  const [allNotifications, setAllNotifications] = useState<AppNotification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const dispatchUnread = (count: number) => {
    window.dispatchEvent(
      new CustomEvent("notification-unread-changed", { detail: { count } })
    );
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      const [listRes, countRes] = await Promise.all([
        getNotifications({ skipCount: (page - 1) * PAGE_SIZE, maxResultCount: PAGE_SIZE }),
        getNotificationUnreadCount(),
      ]);
      if (cancelled) return;
      if (!listRes.success) {
        toast.error(listRes.error);
        setIsLoading(false);
        return;
      }
      setAllNotifications(listRes.data?.items || []);
      setTotalCount(listRes.data?.totalCount || 0);
      if (countRes.success && countRes.data) {
        setUnreadCount(countRes.data.unreadCount);
      }
      setIsLoading(false);
    };
    run();
    return () => { cancelled = true; };
  }, [page]);

  const handleDismiss = async (id: string) => {
    const target = allNotifications.find((n) => n.id === id);
    const res = await dismissNotification(id);
    if (!res.success) { toast.error(res.error); return; }
    setAllNotifications((prev) => prev.filter((item) => item.id !== id));
    setTotalCount((c) => c - 1);
    if (target && !target.isRead) {
      const next = Math.max(0, unreadCount - 1);
      setUnreadCount(next);
      dispatchUnread(next);
    }
    toast.success(t("dismissed"));
  };

  const handleMarkRead = async (notification: AppNotification) => {
    if (notification.isRead) return;
    const res = await markNotificationRead(notification.id);
    if (!res.success) { toast.error(res.error); return; }
    setAllNotifications((prev) =>
      prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
    );
    const next = Math.max(0, unreadCount - 1);
    setUnreadCount(next);
    dispatchUnread(next);
  };

  const handleMarkAllRead = async () => {
    if (isMarkingAll) return;
    setIsMarkingAll(true);
    const res = await markAllNotificationsRead();
    setIsMarkingAll(false);
    if (!res.success) { toast.error(res.error); return; }
    setAllNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
    dispatchUnread(0);
  };

  const displayed = tab === "unread"
    ? allNotifications.filter((n) => !n.isRead)
    : allNotifications;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ── Header card ───────────────────────────────────────────────── */}
      <Box
        sx={{
          borderRadius: 2.5,
          overflow: "hidden",
          background: "linear-gradient(135deg, #0B5A3C 0%, #1B8354 60%, #2AA76E 100%)",
          p: { xs: 2, md: 2.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          boxShadow: "0 6px 24px rgba(11,90,60,0.22)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha("#fff", 0.15),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Iconify icon="solar:bell-bold-duotone" width={22} sx={{ color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 800, lineHeight: 1.2 }}>
              {t("title")}
            </Typography>
            {!isLoading && (
              <Typography variant="caption" sx={{ color: alpha("#fff", 0.75) }}>
                {unreadCount > 0
                  ? (isRtl ? `${unreadCount} إشعار غير مقروء` : `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`)
                  : (isRtl ? "لا توجد إشعارات غير مقروءة" : "All caught up!")}
              </Typography>
            )}
          </Box>
        </Box>

        {!isLoading && unreadCount > 0 && (
          <Button
            variant="contained"
            size="small"
            disabled={isMarkingAll}
            onClick={handleMarkAllRead}
            startIcon={<Iconify icon="solar:check-read-bold" width={16} />}
            sx={{
              bgcolor: alpha("#fff", 0.15),
              color: "#fff",
              fontWeight: 700,
              borderRadius: "10px",
              textTransform: "none",
              px: 2.5,
              py: 1,
              backdropFilter: "blur(4px)",
              border: "1px solid",
              borderColor: alpha("#fff", 0.25),
              "&:hover": { bgcolor: alpha("#fff", 0.25) },
            }}
          >
            {isMarkingAll ? t("marking") : t("mark_all_read")}
          </Button>
        )}
      </Box>

      {/* ── Main content card ─────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <Box
          sx={{
            px: 3,
            pt: 2,
            pb: 0,
            borderBottom: "1px solid",
            borderColor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 48,
                fontSize: "0.875rem",
                px: 3,
                mr: 1,
              },
              "& .Mui-selected": { color: "#1B8354 !important" },
              "& .MuiTabs-indicator": { bgcolor: "#1B8354" },
            }}
          >
            <Tab
              value="all"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isRtl ? "الكل" : "All"}
                  {!isLoading && (
                    <Chip
                      size="small"
                      label={totalCount}
                      sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700, bgcolor: "grey.100", color: "text.secondary" }}
                    />
                  )}
                </Box>
              }
            />
            <Tab
              value="unread"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isRtl ? "غير مقروء" : "Unread"}
                  {!isLoading && unreadCount > 0 && (
                    <Chip
                      size="small"
                      label={unreadCount}
                      sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700, bgcolor: "rgba(27,131,84,0.1)", color: "#1B8354" }}
                    />
                  )}
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* List */}
        <Box>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)
          ) : displayed.length === 0 ? (
            <EmptyContent
              title={isRtl ? "لا توجد إشعارات" : "No notifications"}
              sx={{ py: 10 }}
            />
          ) : (
            <Stack divider={<Box sx={{ height: 1, bgcolor: "grey.100", mx: 3 }} />}>
              {displayed.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onDismiss={handleDismiss}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && tab === "all" && (
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderTop: "1px solid",
              borderColor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
              {isRtl
                ? `عرض ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, totalCount)} من ${totalCount}`
                : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, totalCount)} of ${totalCount}`}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              shape="rounded"
              size="small"
              sx={{
                "& .MuiPaginationItem-root": { fontWeight: 600 },
                "& .Mui-selected": {
                  bgcolor: "#1B8354 !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}