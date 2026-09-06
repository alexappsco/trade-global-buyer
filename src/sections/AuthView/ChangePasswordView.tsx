"use client";

import { useState } from "react";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import { changePasswordAction } from "src/actions/auth";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";

export default function ChangePasswordView() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { authFlow, clearAuthFlow } = useAuth();

  const resetToken = authFlow?.resetToken;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resetToken) {
      toast.error(t("session_expired"));
      router.push("/auth/login");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error(t("register_required"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      await changePasswordAction(
        { resetToken, newPassword, confirmPassword },
        locale
      );
      clearAuthFlow();
      toast.success(t("password_changed"));
      router.push("/auth/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("password_change_failed"));
    } finally {
      setLoading(false);
    }
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
            {t("change_password_title")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
            {t("change_password_subtitle")}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            {t("new_password")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            {t("confirm_password")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="password"
            value={confirmPassword}
            error={Boolean(confirmPassword) && confirmPassword !== newPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>

        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disableElevation
          disabled={loading}
          sx={{
            bgcolor: GREEN,
            color: "#fff",
            borderRadius: "8px",
            py: 1.5,
            "&:hover": { bgcolor: GREEN_HOVER },
          }}
        >
          {loading ? t("loading") : t("save")}
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
