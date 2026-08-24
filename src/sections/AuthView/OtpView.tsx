"use client";

import { useRef, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";
const OTP_LENGTH = 4;

export default function OtpView() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const toast = useToast();
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleConfirm = () => {
    console.log("otp", code.join(""));
    toast.success(t("otp_verified"));
    router.push("/");
  };

  const handleResend = () => {
    toast.success(t("otp_resent"));
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
          sx={{
            bgcolor: GREEN,
            color: "#fff",
            borderRadius: "8px",
            py: 1.5,
            "&:hover": { bgcolor: GREEN_HOVER },
          }}
        >
          {t("confirm")}
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
