"use client";

import { useState } from "react";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";

export default function ForgotPasswordView() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    console.log("forgot_password", phone);
    toast.success(t("otp_resent"));
    router.push("/auth/otp");
  };

  return (
    <AuthShell
      banner={{
        title: t("signin_title"),
        subtitle: t("signin_subtitle"),
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#171717" }}>
            {t("forgot_title")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
            {t("forgot_subtitle")}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            {t("phone")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={phone}
            placeholder="+20 1236765"
            onChange={(e) => setPhone(e.target.value)}
          />
        </Box>

        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disableElevation
          sx={{
            bgcolor: GREEN,
            color: "#fff",
            borderRadius: "8px",
            py: 1.5,
            "&:hover": { bgcolor: GREEN_HOVER },
          }}
        >
          {t("send")}
        </Button>

        <Link
          href="/auth/login"
          underline="none"
          align="center"
          sx={{ color: GREEN, fontWeight: 700, fontSize: 14 }}
        >
          {t("back_to_login")}
        </Link>
      </Stack>
    </AuthShell>
  );
}
