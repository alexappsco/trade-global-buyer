"use client";

import { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
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
import PageHeader from "src/components/PageHeader/PageHeader";
import { useAuth } from "src/contexts/AuthContext";
import { completeProfileAction } from "src/actions/auth";
import { completeProfileForSession, getMyInfo } from "src/actions/profile";
import { getOrdersCatalog } from "src/actions/orders";
import { sanitizeEmail } from "src/utils/sanitize-email";
import type { MyInfo } from "src/types/auth";
import type { OrderCatalogItem } from "src/types/order";
import type { SxProps, Theme } from "@mui/material";

const GREEN = "#1E8E59";

interface CompleteProfileViewProps {
  /** "auth" = registration flow (AuthShell), "profile" = dashboard gate inside the profile page */
  variant?: "auth" | "profile";
  /** Already loaded profile used to prefill the form in the "profile" variant */
  initialProfile?: MyInfo | null;
  /** Called after a successful save in the "profile" variant so the parent can reload */
  onCompleted?: () => void | Promise<void>;
}

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

export default function CompleteProfileView({
  variant = "auth",
  initialProfile = null,
  onCompleted,
}: CompleteProfileViewProps) {
  const t = useTranslations("Auth");
  const tSidebar = useTranslations("Sidebar");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { authFlow, clearAuthFlow, patchSession } = useAuth();

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

  const buildForm = (source: MyInfo | null) => ({
    legalName: source?.legalCompanyName ?? "",
    phone: source?.phoneNumber ?? registeredPhone,
    email: sanitizeEmail(source?.email),
    categoryCodes: (source?.categories ?? []).map((cat) => cat.code),
    taxNumber: source?.taxNumber ?? "",
    commercialRecord: source?.commercialRecord ?? "",
    city: source?.city ?? "",
    address: source?.companyAddress ?? "",
  });

  const [form, setForm] = useState(() =>
    buildForm(variant === "profile" ? initialProfile : null)
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (variant !== "profile" || initialProfile) return;
    (async () => {
      const res = await getMyInfo();
      if (res.success && res.data) {
        setForm(buildForm(res.data));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, initialProfile]);

  const update = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const hasAllRequiredFields =
    Boolean(form.legalName) &&
    Boolean(form.phone) &&
    Boolean(form.email) &&
    Boolean(form.taxNumber) &&
    Boolean(form.commercialRecord) &&
    Boolean(form.city) &&
    Boolean(form.address) &&
    form.categoryCodes.length > 0;

  const handleSave = async () => {
    if (variant === "auth" && !completionToken) {
      toast.error(t("session_expired"));
      router.push("/auth/register");
      return;
    }

    if (!hasAllRequiredFields) {
      toast.error(t("profile_required"));
      return;
    }

    setLoading(true);
    try {
      if (variant === "profile") {
        const res = await completeProfileForSession({
          completionToken,
          legalCompanyName: form.legalName,
          phoneNumber: form.phone,
          email: form.email,
          categoryCodes: form.categoryCodes,
          taxNumber: form.taxNumber,
          commercialRecord: form.commercialRecord,
          city: form.city,
          companyAddress: form.address,
        });

        if (!res.success) {
          toast.error(res.error || t("profile_failed"));
          return;
        }

        patchSession({ profileCompleted: true });
        clearAuthFlow();
        toast.success(t("profile_saved"));
        await onCompleted?.();
        return;
      }

      await completeProfileAction(
        {
          completionToken: completionToken as string,
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
      console.error("[CompleteProfile] Exception:", err);
      toast.error(err instanceof Error && err.message ? err.message : t("profile_failed"));
    } finally {
      setLoading(false);
    }
  };

  const cityOptions =
    form.city && !cities.includes(form.city) ? [...cities, form.city] : cities;

  const fields = (
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
          {cityOptions.map((city) => (
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
  );

  const actions = (
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
  );

  if (variant === "profile") {
    return (
      <Box
        sx={{
          bgcolor: "#F3F6F5",
          minHeight: "100vh",
          py: 4,
          px: { xs: 2, lg: 3 },
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 3 }}>
            <PageHeader
              title={t("complete_title")}
              crumbs={[{ label: tSidebar("profile"), href: "/profile" }]}
              back="/profile"
            />
          </Box>

          <Box
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #E4ECE7",
              borderRadius: "14px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#171717" }}>
                  {t("account_info_title")}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#6B7A74" }}>
                  {t("complete_profile_hint")}
                </Typography>
              </Box>

              {fields}
              {actions}
            </Stack>
          </Box>
        </Container>
      </Box>
    );
  }

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

        {fields}
        {actions}
      </Stack>
    </AuthShell>
  );
}
