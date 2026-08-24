"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useLocale, useTranslations } from "next-intl";
import type { SupportRequest } from "src/types/support";

type SupportRequestCardProps = {
  request: SupportRequest;
  onDelete: (id: string) => void;
};

function formatRequestDate(iso: string, locale: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

function formatRequestTime(iso: string, locale: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function SupportRequestCard({ request, onDelete }: SupportRequestCardProps) {
  const t = useTranslations("Support");
  const locale = useLocale();

  const metaItems = [
    { label: t("request_number"), value: `#${request.requestNumber}` },
    { label: t("request_date"), value: formatRequestDate(request.createdAt, locale) },
    { label: t("request_time"), value: formatRequestTime(request.createdAt, locale) },
    { label: t("request_status"), value: t(`status.${request.status}`), muted: true },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(4, minmax(0, 1fr))",
          },
          bgcolor: "grey.100",
          px: 3,
          py: 2,
        }}
      >
        {metaItems.map((item) => (
          <Box key={item.label}>
            <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: 700 }}>
              {item.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: item.muted ? "text.secondary" : "text.primary", mt: 0.5 }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          {t("details_label")}
        </Typography>
        <Box
          sx={{
            bgcolor: "grey.100",
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 1.5,
            minHeight: 88,
            px: 2,
            py: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
            {request.details}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={() => onDelete(request.id)}
            sx={{ minWidth: 120, fontWeight: 700 }}
          >
            {t("delete")}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
