"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import AuthShell from "./AuthShell";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import { completeProfileAction } from "src/actions/auth";

const GREEN = "#1E8E59";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151", mb: 0.5 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function CompleteProfileView() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { authFlow, clearAuthFlow } = useAuth();

  const sectors =
    locale === "ar"
      ? ["تجارة إلكترونية", "تجزئة", "جملة", "صناعة", "خدمات"]
      : ["E-commerce", "Retail", "Wholesale", "Manufacturing", "Services"];
  const cities =
    locale === "ar" ? ["القاهرة", "الرياض", "دبي"] : ["Cairo", "Riyadh", "Dubai"];

  const completionToken = authFlow?.completionToken;
  const registeredPhone = authFlow?.phoneNumber ?? "";

  const [form, setForm] = useState({
    legalName: "",
    phone: registeredPhone,
    email: "",
    sector: "",
    taxNumber: "",
    commercialRecord: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!completionToken) {
      toast.error(t("session_expired"));
      router.push("/auth/register");
      return;
    }

    const required: (keyof typeof form)[] = [
      "legalName",
      "phone",
      "email",
      "sector",
      "taxNumber",
      "commercialRecord",
      "city",
      "address",
    ];
    if (required.some((field) => !form[field])) {
      toast.error(t("profile_required"));
      return;
    }

    setLoading(true);
    try {
      await completeProfileAction(
        {
          completionToken,
          legalCompanyName: form.legalName,
          phoneNumber: form.phone,
          email: form.email,
          sector: form.sector,
          taxNumber: form.taxNumber,
          commercialRecord: form.commercialRecord,
          city: form.city,
          companyAddress: form.address,
        },
        locale
      );
      clearAuthFlow();
      toast.success(t("profile_saved"));
      router.push("/auth/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("profile_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      banner={{
        title: t("complete_title"),
        subtitle: t("signin_subtitle"),
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#171717" }}>
          {t("account_info_title")}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          <Field label={t("legal_company_name")}>
            <TextField
              fullWidth
              size="small"
              value={form.legalName}
              onChange={(e) => update("legalName", e.target.value)}
            />
          </Field>
          <Field label={t("phone")}>
            <TextField
              fullWidth
              size="small"
              value={form.phone}
              placeholder="+966 5 1234 5678"
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label={t("email")}>
            <TextField
              fullWidth
              size="small"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label={t("sector")}>
            <TextField
              select
              fullWidth
              size="small"
              value={form.sector}
              onChange={(e) => update("sector", e.target.value)}
            >
              {sectors.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </TextField>
          </Field>
          <Field label={t("tax_number")}>
            <TextField
              fullWidth
              size="small"
              value={form.taxNumber}
              onChange={(e) => update("taxNumber", e.target.value)}
            />
          </Field>
          <Field label={t("commercial_record")}>
            <TextField
              fullWidth
              size="small"
              value={form.commercialRecord}
              onChange={(e) => update("commercialRecord", e.target.value)}
            />
          </Field>
          <Field label={t("city")}>
            <TextField
              select
              fullWidth
              size="small"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </Field>
          <Field label={t("company_address")}>
            <TextField
              fullWidth
              size="small"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </Field>
        </Box>

        <Stack direction="row" spacing={2} sx={{ pt: 0.5 }}>
          <Button
            onClick={handleSave}
            variant="contained"
            fullWidth
            disableElevation
            disabled={loading}
            sx={{
              bgcolor: GREEN,
              color: "#fff",
              borderRadius: "8px",
              py: 1.25,
              "&:hover": { bgcolor: "#17734A" },
            }}
          >
            {loading ? t("loading") : t("save")}
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outlined"
            fullWidth
            disableElevation
            sx={{
              bgcolor: "#fff",
              color: "#374151",
              borderColor: "#D1D5DB",
              borderRadius: "8px",
              py: 1.25,
              "&:hover": { bgcolor: "#F9FAFB", borderColor: "#9CA3AF" },
            }}
          >
            {t("cancel_btn")}
          </Button>
        </Stack>
      </Stack>
    </AuthShell>
  );
}
