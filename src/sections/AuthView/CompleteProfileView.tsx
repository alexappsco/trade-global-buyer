"use client";

import { useState, useEffect, forwardRef } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Zoom,
  keyframes,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
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

const glowPulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(30, 142, 89, 0.4);
  }
  70% {
    transform: scale(1.08);
    box-shadow: 0 0 0 18px rgba(30, 142, 89, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(30, 142, 89, 0);
  }
`;

const floatBadge = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`;

const DialogTransition = forwardRef(function DialogTransition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} timeout={{ enter: 380, exit: 260 }} />;
});

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
  const [infoOpen, setInfoOpen] = useState(variant === "profile");

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
        <Dialog
          open={infoOpen}
          keepMounted
          slots={{ transition: DialogTransition }}
          onClose={() => setInfoOpen(false)}
          aria-labelledby="complete-profile-info-title"
          aria-describedby="complete-profile-info-desc"
          slotProps={{
            paper: {
              sx: {
                borderRadius: "20px",
                boxShadow: "0 32px 80px -16px rgba(15, 23, 42, 0.35)",
                overflow: "hidden",
                border: "1px solid rgba(30, 142, 89, 0.15)",
                maxWidth: 380,
                width: "100%",
                m: 2,
                background:
                  "radial-gradient(circle at 50% 0%, rgba(30, 142, 89, 0.08) 0%, #FFFFFF 65%)",
              },
            },
            backdrop: {
              sx: {
                backgroundColor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease-in-out",
              },
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              px: 3,
              pt: 3.5,
              pb: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={() => setInfoOpen(false)}
              aria-label="close"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: locale === "ar" ? "auto" : 12,
                left: locale === "ar" ? 12 : "auto",
                color: "#64748B",
                bgcolor: "rgba(241, 245, 249, 0.8)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                transition: "all 0.25s ease-in-out",
                "&:hover": {
                  bgcolor: "#E2E8F0",
                  color: "#0F172A",
                  transform: "rotate(90deg) scale(1.1)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 17 }} />
            </IconButton>

            {/* Glowing & Floating Icon Badge Container */}
            <Box
              sx={{
                position: "relative",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Pulse Ambient Outer Ring */}
              <Box
                sx={{
                  position: "absolute",
                  width: 72,
                  height: 72,
                  borderRadius: "20px",
                  bgcolor: "rgba(30, 142, 89, 0.12)",
                  animation: `${glowPulse} 3s infinite ease-in-out`,
                }}
              />

              {/* Central Floating Badge */}
              <Box
                sx={{
                  position: "relative",
                  width: 60,
                  height: 60,
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #1E8E59 0%, #115E3B 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 28px -6px rgba(30, 142, 89, 0.5)",
                  animation: `${floatBadge} 4s ease-in-out infinite`,
                }}
              >
                <VerifiedUserRoundedIcon sx={{ fontSize: 32, color: "#FFFFFF" }} />
              </Box>

              {/* Status Badge Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: locale === "ar" ? "auto" : -2,
                  left: locale === "ar" ? -2 : "auto",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  bgcolor: "#10B981",
                  border: "2px solid #FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 11, color: "#FFFFFF" }} />
              </Box>
            </Box>

            {/* Header Badge Pill */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.6,
                px: 1.5,
                py: 0.4,
                borderRadius: 999,
                bgcolor: "rgba(30, 142, 89, 0.08)",
                border: "1px solid rgba(30, 142, 89, 0.2)",
                color: "#1E8E59",
                fontSize: 12,
                fontWeight: 700,
                mb: 1.5,
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 14 }} />
              {locale === "ar" ? "خطوة هامة لتفعيل الحساب" : "Important Profile Step"}
            </Box>

            {/* Title */}
            <Typography
              id="complete-profile-info-title"
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {t("complete_title")}
            </Typography>

            {/* Description */}
            <Typography
              id="complete-profile-info-desc"
              sx={{
                color: "#475569",
                lineHeight: 1.65,
                fontSize: 13.5,
                mb: 2.5,
              }}
            >
              {t("complete_profile_hint")}
            </Typography>

            {/* CTA Button with Shimmer & Glowing Hover */}
            <Button
              onClick={() => setInfoOpen(false)}
              variant="contained"
              disableElevation
              fullWidth
              sx={{
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(135deg, #1E8E59 0%, #157347 100%)",
                color: "#FFFFFF",
                borderRadius: "12px",
                py: 1.2,
                px: 4,
                fontSize: 14.5,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 8px 20px -4px rgba(30, 142, 89, 0.4)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #17734A 0%, #0F5C37 100%)",
                  boxShadow: "0 12px 26px -4px rgba(30, 142, 89, 0.55)",
                  transform: "translateY(-2px)",
                  "& .cta-arrow": {
                    transform: locale === "ar" ? "translateX(-4px)" : "translateX(4px)",
                  },
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  transform: "skewX(-20deg)",
                  animation: `${shimmer} 3.5s infinite`,
                },
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                  zIndex: 1,
                }}
              >
                <span>{t("understood")}</span>
                {locale === "ar" ? (
                  <ArrowBackIcon
                    className="cta-arrow"
                    sx={{ fontSize: 16, transition: "transform 0.25s" }}
                  />
                ) : (
                  <ArrowForwardIcon
                    className="cta-arrow"
                    sx={{ fontSize: 16, transition: "transform 0.25s" }}
                  />
                )}
              </Box>
            </Button>
          </Box>
        </Dialog>
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
