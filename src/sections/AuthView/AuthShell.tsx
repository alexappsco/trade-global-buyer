"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Iconify from "src/components/iconify";
import { useTranslations } from "next-intl";

const BRAND_GREEN = "#1B8354";

export function AuthBanner({
  title,
  subtitle,
  linkText,
  linkHref,
}: {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
}) {
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";

  return (
    <Box
      sx={{
        bgcolor: "#D8E8E0",
        width: "100%",
        minHeight: { xs: "140px", md: "18vh" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        py: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#171717" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "#6B7280", mt: 1, maxWidth: 520 }}>
          {subtitle}
        </Typography>
      )}
      {linkText && linkHref && (
        <Stack
          direction="row"
          spacing={0.5}
          component="a"
          href={linkHref}
          sx={{
            mt: 2,
            alignItems: "center",
            textDecoration: "none",
            color: "#171717",
            fontWeight: 700,
            fontSize: 14,
            "&:hover": { color: BRAND_GREEN },
            transition: "color 0.2s",
          }}
        >
          <span>{linkText}</span>
          <Iconify
            icon={isRtl ? "eva:arrow-ios-back-fill" : "eva:arrow-ios-forward-fill"}
            width={18}
          />
        </Stack>
      )}
    </Box>
  );
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function StatValue({ value }: { value: string }) {
  const match = value.match(/^(\+?)(\d+)(%)?$/);
  const current = useCountUp(match ? Number(match[2]) : 0);

  if (!match) return <>{value}</>;

  return (
    <>
      {match[1]}
      {current}
      {match[3] ?? ""}
    </>
  );
}

export function MarketingCard() {
  const t = useTranslations("Auth");

  const features = [
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 22, color: "#fff" }} />,
      title: t("feature_1_title"),
      desc: t("feature_1_desc"),
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 22, color: "#fff" }} />,
      title: t("feature_2_title"),
      desc: t("feature_2_desc"),
    },
  ];

  const stats = [
    { value: "+5000", label: t("stats_label_1") },
    { value: "98%", label: t("stats_label_2") },
    { value: "98%", label: t("stats_label_3") },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#F3F4F6",
        borderRadius: "16px",
        boxShadow:
          "0px 4px 8px -2px rgba(16, 24, 40, 0.08), 0px 16px 32px -4px rgba(16, 24, 40, 0.14)",
        p: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, color: "#171717", mb: 3 }}>
        {t("why_title")}
      </Typography>

      <Stack spacing={3}>
        {features.map((feature) => (
          <Stack key={feature.title} direction="row" spacing={2}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "#0F8259",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {feature.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#171717" }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                {feature.desc}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>

      <Box sx={{ height: "1px", bgcolor: "#E5E7EB", my: 3.5 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 1,
          textAlign: "center",
        }}
      >
        {stats.map((stat, index) => (
          <Box key={`${stat.label}-${index}`}>
            <Typography sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 800, color: "#6B7280" }}>
              <StatValue value={stat.value} />
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 0.5, color: "#6B7280" }}
            >
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export function PoliciesCheckbox() {
  const t = useTranslations("Auth");

  return (
    <Tooltip title={t("legal_tooltip")} arrow placement="top">
      <FormControlLabel
        control={<Checkbox size="small" sx={{ color: BRAND_GREEN }} />}
        label={
          <Typography variant="caption" sx={{ color: "#6B7280" }}>
            {t("agree_label")}
          </Typography>
        }
        sx={{ width: "100%", m: 0, alignItems: "center" }}
      />
    </Tooltip>
  );
}

export default function AuthShell({
  banner,
  children,
}: {
  banner: {
    title: string;
    subtitle?: string;
    linkText?: string;
    linkHref?: string;
  };
  children: ReactNode;
}) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FAFBFA", pb: { xs: 5, md: 10 } }}>
      <AuthBanner {...banner} />
      <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#fff",
              borderRadius: "16px",
              boxShadow:
                "0px 4px 8px -2px rgba(16, 24, 40, 0.08), 0px 16px 32px -4px rgba(16, 24, 40, 0.14)",
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box component="form" sx={{ flex: 1 }}>
              {children}
            </Box>
            <Box sx={{ mt: 3 }}>
              <PoliciesCheckbox />
            </Box>
          </Paper>

          <MarketingCard />
        </Box>
      </Container>
    </Box>
  );
}
