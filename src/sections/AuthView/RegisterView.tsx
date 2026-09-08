"use client";

import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import { registerAction } from "src/actions/auth";
import { UI_TO_ROLE, type AuthAccountType } from "src/types/auth";

const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";

type EntityTab = "supplier" | "buyer";

function ToggleTabs({
  value,
  onChange,
  options,
}: {
  value: EntityTab;
  onChange: (value: EntityTab) => void;
  options: { value: EntityTab; label: string }[];
}) {
  return (
    <Stack direction="row" spacing={1}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
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
            {option.label}
          </Button>
        );
      })}
    </Stack>
  );
}

function AccountTypeRadio({
  value,
  onChange,
  options,
}: {
  value: AuthAccountType;
  onChange: (value: AuthAccountType) => void;
  options: { value: AuthAccountType; label: string }[];
}) {
  return (
    <Stack direction="row" spacing={2}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1,
              borderRadius: "8px",
              borderColor: active ? GREEN : "#D1D5DB",
              color: active ? GREEN : "#6B7280",
              bgcolor: active ? "#EDF4F2" : "transparent",
              "&:hover": {
                borderColor: GREEN,
                bgcolor: active ? "#EDF4F2" : "#F9FAFB",
              },
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </Stack>
  );
}

export default function RegisterView() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { setAuthFlow } = useAuth();

  const [entity, setEntity] = useState<EntityTab>("buyer");
  const [accountType, setAccountType] = useState<AuthAccountType>("Company");
  const [nameOrCompany, setNameOrCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nameOrCompany || !phone || !password || !confirmPassword) {
      toast.error(t("register_required"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      const result = await registerAction(
        {
          role: UI_TO_ROLE[entity],
          type: accountType,
          name: nameOrCompany,
          phoneNumber: phone,
          password,
          confirmPassword,
        },
        locale
      );
      setAuthFlow({
        mode: "register",
        completionToken: result.completionToken,
        phoneNumber: result.phoneNumber,
      });
      router.push("/auth/complete-profile");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("register_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      banner={{
        title: t("new_account_title"),
        subtitle: t("signin_subtitle"),
        linkText: t("go_login"),
        linkHref: "/auth/login",
      }}
    >
      <Stack spacing={1.5}>
        <ToggleTabs
          value={entity}
          onChange={setEntity}
          options={[
            { value: "supplier", label: t("supplier") },
            { value: "buyer", label: t("buyer") },
          ]}
        />

        <AccountTypeRadio
          value={accountType}
          onChange={setAccountType}
          options={[
            { value: "Company", label: t("company") },
            { value: "Individual", label: t("individual") },
          ]}
        />

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            {accountType === "Company" ? t("company_name") : t("full_name")}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={nameOrCompany}
            onChange={(e) => setNameOrCompany(e.target.value)}
          />
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
            error={Boolean(confirmPassword) && confirmPassword !== password}
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
            py: 1.25,
            mt: 1,
            "&:hover": { bgcolor: GREEN_HOVER },
          }}
        >
          {loading ? t("loading") : t("register_cta")}
        </Button>
      </Stack>
    </AuthShell>
  );
}
