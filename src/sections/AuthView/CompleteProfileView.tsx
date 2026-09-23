"use client";

import { useState, useEffect } from "react";
import {
  Autocomplete,
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
import { Loader } from "src/components/Loader/Loader";
import { useAuth } from "src/contexts/AuthContext";
import { completeProfileAction } from "src/actions/auth";
import { getOrdersCatalog } from "src/actions/orders";
import type { OrderCatalogItem } from "src/types/order";
import type { SxProps, Theme } from "@mui/material";

const GREEN = "#1E8E59";

function Field({
  label,
  children,
  sx,
}: {
  label: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box sx={sx}>
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

  const cities =
    locale === "ar" ? ["القاهرة", "الرياض", "دبي"] : ["Cairo", "Riyadh", "Dubai"];

  const completionToken = authFlow?.completionToken;
  const registeredPhone = authFlow?.phoneNumber ?? "";

  const [categories, setCategories] = useState<OrderCatalogItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getOrdersCatalog();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    })();
  }, []);

  const [form, setForm] = useState({
    legalName: "",
    phone: registeredPhone,
    email: "",
    categoryCodes: [] as string[],
    taxNumber: "",
    commercialRecord: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
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
      "taxNumber",
      "commercialRecord",
      "city",
      "address",
    ];
    if (required.some((field) => !form[field]) || form.categoryCodes.length === 0) {
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
          categoryCodes: form.categoryCodes,
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
          <Field label={t("category")} sx={{ gridColumn: "1 / -1" }}>
            <Autocomplete
              multiple
              fullWidth
              size="small"
              options={categories}
              getOptionLabel={(cat) => (locale === "ar" ? cat.nameAr : cat.nameEn)}
              value={categories.filter((cat) => form.categoryCodes.includes(cat.code))}
              onChange={(_, value) => update("categoryCodes", value.map((v) => v.code))}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              slotProps={{
                chip: {
                  size: "small",
                  sx: {
                    bgcolor: "#EAF3EF",
                    color: "#1E8057",
                    fontWeight: 600,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      bgcolor: "#D94141",
                      color: "#fff",
                      "& .MuiChip-deleteIcon": { color: "#fff" },
                    },
                    "& .MuiChip-deleteIcon": {
                      color: "#1E8057",
                      marginInlineStart: "4px",
                      marginInlineEnd: "2px",
                    },
                  },
                },
                listbox: {
                  sx: {
                    "& .MuiAutocomplete-option": {
                      "&:hover": { bgcolor: "#F4F9F7" },
                      "&.Mui-focused": { bgcolor: "#F4F9F7" },
                    },
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    form.categoryCodes.length > 0
                      ? ""
                      : t("category_placeholder_multi")
                  }
                />
              )}
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
            {loading ? (
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <Loader variant="inline" size={18} color="inherit" />
                {t("loading")}
              </Box>
            ) : (
              t("save")
            )}
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
