"use client";

import { useRef, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import {
  resendForgetPasswordOtpAction,
  resendLoginOtpAction,
  verifyForgetPasswordOtpAction,
  verifyLoginOtpAction,
} from "src/actions/auth";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";
const OTP_LENGTH = 4;

export default function OtpView() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { authFlow, setAuthFlow, persistSession, clearAuthFlow } = useAuth();

  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const mode = authFlow?.mode ?? "login";
  const challengeId = authFlow?.challengeId ?? "";
  const phoneNumber = authFlow?.phoneNumber ?? "";

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const otp = code.join("");
    if (!challengeId || !phoneNumber) {
      toast.error(t("session_expired"));
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      if (mode === "reset") {
        const result = await verifyForgetPasswordOtpAction(
          { challengeId, phoneNumber, otp },
          locale
        );
        setAuthFlow({
          mode: "reset",
          resetToken: result.resetToken,
          phoneNumber,
        });
        router.push("/auth/change-password");
      } else {
        const session = await verifyLoginOtpAction(
          { challengeId, phoneNumber, otp },
          locale
        );
        clearAuthFlow();
        persistSession({ mode: null }, session);
        toast.success(t("otp_verified"));
        router.push("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("otp_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!challengeId || !phoneNumber) {
      toast.error(t("session_expired"));
      return;
    }
    try {
      if (mode === "reset") {
        const challenge = await resendForgetPasswordOtpAction(
          { challengeId, phoneNumber },
          locale
        );
        setAuthFlow({ mode: "reset", challengeId: challenge.challengeId, phoneNumber });
      } else {
        const challenge = await resendLoginOtpAction(
          { challengeId, phoneNumber },
          locale
        );
        setAuthFlow({ mode: "login", challengeId: challenge.challengeId, phoneNumber });
      }
      toast.success(t("otp_resent"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("otp_failed"));
    }
  };

  return (
    <AuthShell
      banner={{
        title: t("new_account_title"),
        subtitle: t("signin_subtitle"),
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#171717" }}>
            {t("otp_title")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
            {t("otp_subtitle")}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {code.map((digit, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <TextField
                inputRef={(el) => {
                  inputsRef.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e.key)}
                slotProps={{ htmlInput: { maxLength: 1, style: { textAlign: "center" } } }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                }}
              />
              {index < OTP_LENGTH - 1 && (
                <Typography sx={{ px: 0.5, fontWeight: 700, color: "#9DA4AE" }}>-</Typography>
              )}
            </Box>
          ))}
        </Stack>

        <Button
          onClick={handleConfirm}
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
          {loading ? t("loading") : t("confirm")}
        </Button>

        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "center", color: "#6B7280" }}
        >
          {t("resend_question")}{" "}
          <Box
            component="button"
            type="button"
            onClick={handleResend}
            sx={{
              bgcolor: "transparent",
              border: "none",
              p: 0,
              cursor: "pointer",
              color: GREEN,
              fontWeight: 700,
              fontSize: "inherit",
            }}
          >
            {t("resend_link")}
          </Box>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
