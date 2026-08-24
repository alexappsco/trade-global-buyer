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
  const router = useRouter();
  const toast = useToast();
  const locale = useLocale();

  const sectors =
    locale === "ar"
      ? ["تجارة إلكترونية", "تجزئة", "جملة", "صناعة", "خدمات"]
      : ["E-commerce", "Retail", "Wholesale", "Manufacturing", "Services"];
  const cities =
    locale === "ar" ? ["القاهرة", "الرياض", "دبي"] : ["Cairo", "Riyadh", "Dubai"];

  const [form, setForm] = useState({
    legalName: "",
    phone: "",
    email: "",
    sector: "",
    taxNumber: "",
    commercialRecord: "",
    city: "",
    address: "",
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    console.log("complete_profile", form);
    toast.success(t("profile_saved"));
    router.push("/");
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
              placeholder="+20 1236765"
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
            sx={{
              bgcolor: GREEN,
              color: "#fff",
              borderRadius: "8px",
              py: 1.25,
              "&:hover": { bgcolor: "#17734A" },
            }}
          >
            {t("save")}
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
