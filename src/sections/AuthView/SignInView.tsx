"use client";

import { useState } from "react";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import PasswordField from "./PasswordField";
import { useRouter } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";
import { Loader } from "src/components/Loader/Loader";
import { useAuth } from "src/contexts/AuthContext";
import { loginAction } from "src/actions/auth";
import { UI_TO_ROLE } from "src/types/auth";
import * as Yup from "yup";
import { keyframes } from "@mui/system";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
`;

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
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setPhoneError("");
    if (!role) {
      setRoleError(true);
      return;
    }
    if (!password) {
      toast.error(t("signin_required"));
      return;
    }

    const LoginSchema = Yup.object().shape({
      phone: Yup.string()
        .required(t("phone_required") || "Phone is required")
        .min(9, t("phone_invalid") || "Invalid phone number")
        .max(15, t("phone_invalid") || "Invalid phone number")
        .matches(/^\+?[0-9\s\-]+$/, t("phone_invalid") || "Invalid phone number"),
    });

    try {
      await LoginSchema.validate({ phone });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setPhoneError(err.message);
        return;
      }
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
                    bgcolor: active ? GREEN : (roleError ? "#FDEDED" : "#F3F4F6"),
                    color: active ? "#fff" : (roleError ? "#D32F2F" : "#6B7280"),
                    border: roleError ? "1px solid #D32F2F" : "1px solid transparent",
                    animation: roleError ? `${shake} 0.4s ease-in-out` : "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: active ? GREEN_HOVER : (roleError ? "#F8DADA" : "#E5E7EB"),
                    },
                  }}
                >
                  {t(r)}
                </Button>
              );
            })}
          </Stack>
          {roleError && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.5, px: 1 }}>
              <Typography sx={{ fontSize: 12, color: "#D32F2F", fontWeight: 600 }}>
                ⚠️ {t("role_required")}
              </Typography>
            </Stack>
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
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError("");
            }}
            error={!!phoneError}
            helperText={phoneError}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            {t("password")}
          </Typography>
          <PasswordField
            fullWidth
            size="small"
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
          {loading ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <Loader variant="inline" size={18} color="inherit" />
              {t("loading")}
            </Box>
          ) : (
            t("signin_cta")
          )}
        </Button>
      </Stack>
    </AuthShell>
  );
}
