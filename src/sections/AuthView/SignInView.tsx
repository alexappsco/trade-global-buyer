"use client";

import { useState } from "react";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";

export default function SignInView() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("signin", { phone, password });
    toast.success(t("signin_success"));
    router.push("/");
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
          sx={{
            bgcolor: GREEN,
            color: "#fff",
            borderRadius: "8px",
            py: 1.5,
            "&:hover": { bgcolor: GREEN_HOVER },
          }}
        >
          {t("signin_cta")}
        </Button>
      </Stack>
    </AuthShell>
  );
}
