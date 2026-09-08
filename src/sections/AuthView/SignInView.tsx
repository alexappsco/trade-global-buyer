"use client";

import { useState } from "react";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import { loginAction } from "src/actions/auth";
import { UI_TO_ROLE } from "src/types/auth";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";

type UserRole = "buyer" | "supplier";

export default function SignInView() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { setAuthFlow } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setLocalRole] = useState<UserRole | null>(null);
  const [roleError, setRoleError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role) {
      setRoleError(true);
      return;
    }
    if (!phone || !password) {
      toast.error(t("signin_required"));
      return;
    }

    setLoading(true);
    try {
      const challenge = await loginAction(
        { role: UI_TO_ROLE[role], phoneNumber: phone, password },
        locale
      );
      setAuthFlow({
        mode: "login",
        challengeId: challenge.challengeId,
        phoneNumber: phone,
      });
      router.push("/auth/otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("signin_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      banner={{
        title: t("signin_title"),
        subtitle: t("signin_subtitle"),
        linkText: t("go_register"),
        linkHref: "/auth/register",
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={1}>
            {(["supplier", "buyer"] as const).map((r) => {
              const active = role === r;
              return (
                <Button
                  key={r}
                  onClick={() => {
                    setLocalRole(r);
                    setRoleError(false);
                  }}
                  fullWidth
                  variant="contained"
                  disableElevation
                  sx={{
                    py: 1.25,
                    borderRadius: "8px",
                    bgcolor: active ? GREEN : "#F3F4F6",
                    color: active ? "#fff" : "#6B7280",
                    "&:hover": {
                      bgcolor: active ? GREEN_HOVER : "#E5E7EB",
                    },
                  }}
                >
                  {t(r)}
                </Button>
              );
            })}
          </Stack>
          {roleError && (
            <Typography sx={{ fontSize: 12, color: "#D32F2F", mt: 0.5, textAlign: "center" }}>
              {t("role_required")}
            </Typography>
          )}
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            {t("phone")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={phone}
            placeholder="+966 5 1234 5678"
            onChange={(e) => setPhone(e.target.value)}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            {t("password")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: "start", mt: 1, color: "#6B7280" }}
          >
            {t("forgot_prefix")}{" "}
            <Link
              href="/auth/forgot-password"
              underline="none"
              sx={{ color: GREEN, fontWeight: 700 }}
            >
              {t("forgot_link")}
            </Link>
          </Typography>
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
          {loading ? t("loading") : t("signin_cta")}
        </Button>
      </Stack>
    </AuthShell>
  );
}
