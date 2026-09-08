import { Avatar, Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useLocale, useTranslations } from "next-intl";
import type { AppNotification } from "src/types/notification";

type NotificationItemProps = {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  onMarkRead: (notification: AppNotification) => void;
  showDivider: boolean;
};

function formatNotificationDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function NotificationItem({
  notification,
  onDismiss,
  onMarkRead,
  showDivider,
}: NotificationItemProps) {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const isUnread = !notification.isRead;

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        onClick={() => {
          if (isUnread) onMarkRead(notification);
        }}
        sx={{
          alignItems: "flex-start",
          px: { xs: 2, md: 3 },
          py: 2.5,
          cursor: isUnread ? "pointer" : "default",
          bgcolor: isUnread ? "rgba(16, 117, 78, 0.03)" : "transparent",
          transition: "background-color 0.2s",
          "&:hover": {
            bgcolor: isUnread ? "rgba(16, 117, 78, 0.06)" : "transparent",
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            height: 44,
            width: 44,
          }}
        >
          <PersonRoundedIcon />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            {isUnread && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#006838",
                  mt: 0.6,
                  flexShrink: 0,
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                lineHeight: 1.7,
                fontWeight: isUnread ? 700 : 400,
              }}
            >
              {notification.message}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.75 }}>
            {formatNotificationDate(notification.createdAt, locale)}
          </Typography>
        </Box>

        <IconButton
          aria-label={t("dismiss")}
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            onDismiss(notification.id);
          }}
          sx={{ color: "text.secondary", mt: 0.25 }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
      {showDivider && <Divider />}
    </>
  );
}