"use client";

import { Avatar, Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTranslations } from "next-intl";
import type { AppNotification } from "src/types/notification";

type NotificationItemProps = {
  notification: AppNotification;
  onDismiss: (id: string) => void;
  showDivider: boolean;
};

function formatNotificationDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function NotificationItem({
  notification,
  onDismiss,
  showDivider,
}: NotificationItemProps) {
  const t = useTranslations("Notifications");

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "flex-start",
          px: { xs: 2, md: 3 },
          py: 2.5,
        }}
      >
        <Avatar
          src={notification.avatarUrl ?? undefined}
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
          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.7 }}>
            {notification.message}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.75 }}>
            {formatNotificationDate(notification.createdAt)}
          </Typography>
        </Box>

        <IconButton
          aria-label={t("dismiss")}
          size="small"
          onClick={() => onDismiss(notification.id)}
          sx={{ color: "text.secondary", mt: 0.25 }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
      {showDivider && <Divider />}
    </>
  );
}
