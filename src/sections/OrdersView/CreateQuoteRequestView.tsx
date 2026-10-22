"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import QuoteSuccessDialog from "./QuoteSuccessDialog";
import QuoteConfirmDialog from "./QuoteConfirmDialog";
import CategoryDropAnimation from "./CategoryDropAnimation";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputBase,
  Autocomplete,
} from "@mui/material";
import { getOrdersCatalog, createOrder } from "src/actions/orders";
import type { OrderCatalogItem } from "src/types/order";
import { useLocale } from "next-intl";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import PageHeader from "src/components/PageHeader/PageHeader";
import DatePickerField from "src/components/DatePickerField/DatePickerField";
import { useRouter } from "src/i18n/routing";
import { Loader } from "src/components/Loader/Loader";
import * as Yup from "yup";
const GREEN = "#1E8E59";
const GREEN_HOVER = "#17734A";
const RED = "#D32F2F";
const RED_HOVER = "#B71C1C";

interface ItemRow {
  id: string;
  name: string;
  quantity: string;
  details: string;
}

interface RequestBlock {
  id: string;
  categoryCode: string;
  title: string;
  deliveryDate: string;
  items: ItemRow[];
}

interface ItemErrors {
  name?: string;
  quantity?: string;
  details?: string;
}

interface BlockErrors {
  categoryCode?: string;
  title?: string;
  deliveryDate?: string;
  items?: ItemErrors[];
}

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const createItem = (): ItemRow => ({
  id: createId(),
  name: "",
  quantity: "",
  details: "",
});

const createBlock = (categoryCode = ""): RequestBlock => ({
  id: createId(),
  categoryCode,
  title: "",
  deliveryDate: "",
  items: [createItem()],
});

function GreenButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      disableElevation
      sx={{
        bgcolor: GREEN,
        color: "#fff",
        borderRadius: "4px",
        gap: 1,
        px: 3,
        "&:hover": { bgcolor: GREEN_HOVER },
      }}
    >
      <AddIcon />
      {children}
    </Button>
  );
}

interface ItemTableRowProps {
  item: ItemRow;
  error?: ItemErrors;
  onUpdate: (itemId: string, field: keyof ItemRow, value: string) => void;
  onRemove: (itemId: string) => void;
  t: (key: string) => string;
}

const ItemTableRow = React.memo(function ItemTableRow({
  item,
  error = {},
  onUpdate,
  onRemove,
  t,
}: ItemTableRowProps) {
  return (
    <TableRow sx={{ "& td": { borderBottom: "1px solid #E2E8F0" }, "&:last-child td": { borderBottom: "none" } }}>
      <TableCell align="center" sx={{ borderInlineEnd: "1px solid #E2E8F0 !important", py: 1 }}>
        <InputBase
          value={item.name}
          onChange={(e) => onUpdate(item.id, "name", e.target.value)}
          placeholder={t("item_placeholder")}
          error={Boolean(error.name)}
          sx={{
            color: error.name ? "#EF4444" : "#111827",
            fontSize: "14px",
            fontWeight: 500,
            width: "100%",
            "& input": {
              textAlign: "center",
              p: 0.5,
              color: error.name ? "#EF4444" : "#111827",
              fontWeight: 500,
              "&::placeholder": {
                color: "#9CA3AF",
                opacity: 1,
                fontWeight: 400,
              },
            },
          }}
        />
        {error.name && <Typography sx={{ fontSize: "11px", color: "#EF4444", mt: 0.25 }}>{error.name}</Typography>}
      </TableCell>
      <TableCell align="center" sx={{ borderInlineEnd: "1px solid #E2E8F0 !important", py: 1 }}>
        <InputBase
          type="text"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 1 }}
          value={item.quantity}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^[1-9]\d*$/.test(val)) {
              onUpdate(item.id, "quantity", val);
            }
          }}
          placeholder="0"
          error={Boolean(error.quantity)}
          sx={{
            color: error.quantity ? "#EF4444" : "#111827",
            fontSize: "14px",
            fontWeight: 600,
            width: "100%",
            "& input": {
              textAlign: "center",
              p: 0.5,
              color: error.quantity ? "#EF4444" : "#111827",
              fontWeight: 600,
              "&::placeholder": {
                color: "#9CA3AF",
                opacity: 1,
                fontWeight: 400,
              },
            },
          }}
        />
        {error.quantity && <Typography sx={{ fontSize: "11px", color: "#EF4444", mt: 0.25 }}>{error.quantity}</Typography>}
      </TableCell>
      <TableCell align="center" sx={{ borderInlineEnd: "1px solid #E2E8F0 !important", py: 1 }}>
        <InputBase
          value={item.details}
          onChange={(e) => onUpdate(item.id, "details", e.target.value)}
          placeholder={t("details_placeholder")}
          error={Boolean(error.details)}
          sx={{
            color: error.details ? "#EF4444" : "#1F2937",
            fontSize: "14px",
            fontWeight: 400,
            width: "100%",
            "& input": {
              textAlign: "center",
              p: 0.5,
              color: error.details ? "#EF4444" : "#1F2937",
              "&::placeholder": {
                color: "#9CA3AF",
                opacity: 1,
              },
            },
          }}
        />
        {error.details && <Typography sx={{ fontSize: "11px", color: "#EF4444", mt: 0.25 }}>{error.details}</Typography>}
      </TableCell>
      <TableCell align="center" sx={{ py: 1 }}>
        <IconButton
          size="small"
          onClick={() => onRemove(item.id)}
          sx={{
            color: "#EF4444",
            transition: "all 0.15s ease",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
          }}
        >
          <DeleteIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

interface RequestFormBlockProps {
  block: RequestBlock;
  onChange: (block: RequestBlock) => void;
  onDelete: () => void;
  canDelete: boolean;
  catalog: OrderCatalogItem[];
  errors: BlockErrors;
  dropAnimation?: {
    active: boolean;
    categoryName: string;
    categoryImg?: string;
    onComplete: () => void;
  };
}

const RequestFormBlock = React.memo(function RequestFormBlock({
  block,
  onChange,
  onDelete,
  canDelete,
  catalog,
  errors,
  dropAnimation,
}: RequestFormBlockProps) {
  const t = useTranslations("CreateQuoteRequest");
  const locale = useLocale();

  const updateField = useCallback(
    (field: keyof Omit<RequestBlock, "items">, value: string) => {
      onChange({ ...block, [field]: value });
    },
    [block, onChange]
  );

  const addItem = useCallback(() => {
    onChange({ ...block, items: [...block.items, createItem()] });
  }, [block, onChange]);

  const updateItem = useCallback(
    (itemId: string, field: keyof ItemRow, value: string) => {
      onChange({
        ...block,
        items: block.items.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      });
    },
    [block, onChange]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      onChange({ ...block, items: block.items.filter((item) => item.id !== itemId) });
    },
    [block, onChange]
  );

  const [isJustDropped, setIsJustDropped] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #CBD5E1",
        borderRadius: "12px",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          border: "1px solid #CBD5E1",
          borderRadius: "8px",
          mb: "32px",
          p: { xs: "14px 16px", md: "16px 24px" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2.5,
          bgcolor: "#F8FAFC",
        }}
      >
        <Stack
          spacing={0.75}
          sx={{
            alignItems: "flex-start",
            position: "relative",
            width: "100%",
          }}
        >
          {dropAnimation?.active && (
            <CategoryDropAnimation
              categoryName={dropAnimation.categoryName}
              categoryImg={dropAnimation.categoryImg}
              isRtl={locale === "ar"}
              onDrop={() => setIsJustDropped(true)}
              onComplete={() => {
                setTimeout(() => setIsJustDropped(false), 1400);
                dropAnimation.onComplete();
              }}
            />
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
              {t("category")}
            </Typography>
            {isJustDropped && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  color: '#15803D',
                  px: 1,
                  py: 0.2,
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  animation: 'badgePop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                  '@keyframes badgePop': {
                    '0%': { transform: 'scale(0.5)', opacity: 0 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              >
                {locale === 'ar' ? 'تمت الإضافة ✨' : 'Added ✨'}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: "100%",
              bgcolor: "#FFFFFF",
              border: "1.5px solid",
              borderColor: isJustDropped
                ? "#1E8E59"
                : errors.categoryCode
                ? "#EF4444"
                : "#CBD5E1",
              borderRadius: "8px",
              px: 1.5,
              py: "4px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              transition: "border-color 0.25s ease, box-shadow 0.25s ease",
              ...(isJustDropped && {
                animation: "inputDroppedPhysics 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }),
              "&:hover": {
                borderColor: errors.categoryCode ? "#EF4444" : "#1E8E59",
              },
              "&:focus-within": {
                borderColor: "#1E8E59",
                boxShadow: "0 0 0 3px rgba(30, 142, 89, 0.15)",
              },
              "@keyframes inputDroppedPhysics": {
                "0%": {
                  transform: "scale(1) translateY(0)",
                  boxShadow: "0 0 0 0 rgba(30, 142, 89, 0)",
                },
                "22%": {
                  transform: "scale(0.96, 1.04) translateY(4px)",
                  boxShadow: "0 0 0 5px rgba(30, 142, 89, 0.45), 0 8px 24px rgba(30, 142, 89, 0.25)",
                  borderColor: "#1E8E59",
                  backgroundColor: "rgba(30, 142, 89, 0.06)",
                },
                "48%": {
                  transform: "scale(1.035, 0.97) translateY(-2px)",
                  boxShadow: "0 0 0 6px rgba(30, 142, 89, 0.3), 0 6px 18px rgba(30, 142, 89, 0.18)",
                  borderColor: "#1E8E59",
                },
                "72%": {
                  transform: "scale(0.99, 1.01) translateY(1px)",
                  boxShadow: "0 0 0 3px rgba(30, 142, 89, 0.18)",
                },
                "100%": {
                  transform: "scale(1) translateY(0)",
                  boxShadow: "0 0 0 2px rgba(30, 142, 89, 0.1)",
                },
              },
            }}
          >
            <Autocomplete
              options={catalog}
              getOptionLabel={(option) => locale === "ar" ? option.nameAr : option.nameEn}
              value={catalog.find((c) => c.code === block.categoryCode) || null}
              isOptionEqualToValue={(option, value) => option?.code === value?.code}
              onChange={(_, newValue) => updateField("categoryCode", newValue ? newValue.code : "")}
              fullWidth
              size="small"
              renderInput={(params) => {
                const { InputProps, ...rest } = params as any;
                return (
                  <TextField
                    {...rest}
                    placeholder={t("category_placeholder")}
                    variant="standard"
                    error={Boolean(errors.categoryCode)}
                    slotProps={{
                      ...rest.slotProps,
                      input: {
                        ...InputProps,
                        ...rest.slotProps?.input,
                        disableUnderline: true,
                        sx: {
                          color: "#111827",
                          fontSize: "14px",
                          fontWeight: 600,
                          "& input": {
                            textAlign: "start",
                            padding: 0,
                            color: "#111827",
                            fontWeight: 600,
                            "&::placeholder": {
                              color: "#9CA3AF",
                              opacity: 1,
                              fontWeight: 400,
                            },
                          },
                        },
                      },
                    }}
                  />
                );
              }}
            />
          </Box>
          {errors.categoryCode && (
            <Typography sx={{ fontSize: "12px", color: "#EF4444", mt: 0.5 }}>{errors.categoryCode}</Typography>
          )}
        </Stack>

        <Stack spacing={0.75} sx={{ alignItems: "flex-start", width: "100%" }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
            {t("request_title")}
          </Typography>
          <Box
            sx={{
              width: "100%",
              bgcolor: "#FFFFFF",
              border: "1.5px solid",
              borderColor: errors.title ? "#EF4444" : "#CBD5E1",
              borderRadius: "8px",
              px: 1.5,
              py: "4px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                borderColor: errors.title ? "#EF4444" : "#94A3B8",
              },
              "&:focus-within": {
                borderColor: "#1E8E59",
                boxShadow: "0 0 0 3px rgba(30, 142, 89, 0.15)",
              },
            }}
          >
            <InputBase
              value={block.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder={t("title_placeholder")}
              error={Boolean(errors.title)}
              sx={{
                color: errors.title ? "#EF4444" : "#111827",
                fontSize: "14px",
                fontWeight: 500,
                width: "100%",
                "& input": {
                  textAlign: "start",
                  p: 0,
                  color: errors.title ? "#EF4444" : "#111827",
                  fontWeight: 500,
                  "&::placeholder": {
                    color: "#9CA3AF",
                    opacity: 1,
                    fontWeight: 400,
                  },
                },
              }}
            />
          </Box>
          {errors.title && (
            <Typography sx={{ fontSize: "12px", color: "#EF4444" }}>{errors.title}</Typography>
          )}
        </Stack>

        <Stack spacing={0.75} sx={{ alignItems: "flex-start", width: "100%" }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
            {t("delivery_date")}
          </Typography>
          <DatePickerField
            value={block.deliveryDate}
            onChange={(value) => updateField("deliveryDate", value)}
            error={Boolean(errors.deliveryDate)}
          />
          {errors.deliveryDate && (
            <Typography sx={{ fontSize: "12px", color: "#EF4444" }}>{errors.deliveryDate}</Typography>
          )}
        </Stack>
      </Box>

      <Box sx={{ border: "1px solid #CBD5E1", borderRadius: "8px", overflow: "auto", mb: "16px" }}>
        <Table sx={{ minWidth: 600, width: "100%", borderCollapse: "collapse" }}>
          <TableHead sx={{ bgcolor: "#F1F5F9", height: "40px" }}>
            <TableRow>
              <TableCell align="center" sx={{ width: "27%", borderBottom: "1px solid #CBD5E1", borderInlineEnd: "1px solid #E2E8F0", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("item")}</TableCell>
              <TableCell align="center" sx={{ width: "27%", borderBottom: "1px solid #CBD5E1", borderInlineEnd: "1px solid #E2E8F0", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("quantity")}</TableCell>
              <TableCell align="center" sx={{ width: "28%", borderBottom: "1px solid #CBD5E1", borderInlineEnd: "1px solid #E2E8F0", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("details")}</TableCell>
              <TableCell align="center" sx={{ width: "18%", borderBottom: "1px solid #CBD5E1", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {block.items.map((item, idx) => (
              <ItemTableRow
                key={item.id}
                item={item}
                error={errors.items?.[idx]}
                onUpdate={updateItem}
                onRemove={removeItem}
                t={t}
              />
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap" }}>
        <Button
          onClick={addItem}
          sx={{
            height: "36px",
            bgcolor: "#15803D",
            color: "#FFFFFF",
            borderRadius: "6px",
            px: "16px",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            gap: "8px",
            "&:hover": { bgcolor: "#166534" },
          }}
        >
          <AddIcon sx={{ fontSize: "16px" }} />
          {t("add")}
        </Button>
        <Button
          onClick={onDelete}
          disabled={!canDelete}
          sx={{
            height: "36px",
            bgcolor: "#DC2626",
            color: "#FFFFFF",
            borderRadius: "6px",
            px: "16px",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            gap: "8px",
            "&:hover": { bgcolor: "#B91C1C" },
            "&.Mui-disabled": { bgcolor: "#DC2626", opacity: 0.5, color: "#fff" },
          }}
        >
          <DeleteIcon sx={{ fontSize: "16px" }} />
          {t("delete")}
        </Button>
      </Box>
    </Box>
  );
});

interface CreateQuoteRequestViewProps {
  initialCategoryCode?: string;
  initialCategoryName?: string;
  initialCategoryImg?: string;
}

export default function CreateQuoteRequestView({
  initialCategoryCode,
  initialCategoryName,
  initialCategoryImg,
}: CreateQuoteRequestViewProps = {}) {
  const t = useTranslations("CreateQuoteRequest");
  const tSidebar = useTranslations("Sidebar");
  const tAuth = useTranslations("Auth");
  const tOrders = useTranslations("Orders");
  const locale = useLocale();
  const toast = useToast();
  const router = useRouter();
  const { session } = useAuth();

  // ── Centralized guard: profile must be complete to create an order ──
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (session && !session.profileCompleted && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      toast.warning(tOrders("complete_profile_required"));
      router.replace("/profile");
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname.includes("/orders/create")) {
          window.location.replace(`/${locale}/profile`);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [session, router, locale, tOrders, toast]);
  const searchParams = useSearchParams();
  const categoryCodeParam = searchParams?.get("categoryCode") || initialCategoryCode || "";
  const categoryNameParam = searchParams?.get("categoryName") || initialCategoryName || "";
  const categoryImgParam = searchParams?.get("categoryImg") || initialCategoryImg || "";

  const [animatingDrop, setAnimatingDrop] = useState(() => Boolean(categoryCodeParam));

  const [requests, setRequests] = useState<RequestBlock[]>(() => [
    createBlock(categoryCodeParam),
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [catalog, setCatalog] = useState<OrderCatalogItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockErrors, setBlockErrors] = useState<BlockErrors[]>([{}]);

  useEffect(() => {
    if (categoryCodeParam) {
      setRequests((prev) => {
        if (prev.length > 0 && !prev[0].categoryCode) {
          return prev.map((block, idx) =>
            idx === 0 ? { ...block, categoryCode: categoryCodeParam } : block
          );
        }
        return prev;
      });
    }
  }, [categoryCodeParam]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        
        const res = await getOrdersCatalog();
        if (res.success && res.data) {
          const catalogData = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          setCatalog(catalogData);
        } else {
          const errorMsg = 'error' in res ? (res as any).error : (res as any).message || "Failed to load catalog";
          console.error("[Catalog] API Error:", errorMsg);
          console.error("[Catalog] Full error object:", res);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error("[Catalog] Exception:", err);
        toast.error("Failed to load catalog");
      }
    };
    fetchCatalog();
  }, []);

  const requestsRef = useRef(requests);
  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const addRequest = useCallback(() => {
    setRequests((prev) => [...prev, createBlock()]);
    setBlockErrors((prev) => [...prev, {}]);
  }, []);

  const updateRequest = useCallback((updated: RequestBlock) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setBlockErrors((prev) => {
      const hasAnyError = prev.some((b) => b && (b.categoryCode || b.title || b.deliveryDate || (b.items && b.items.length > 0)));
      if (!hasAnyError) return prev;
      const targetIdx = requestsRef.current.findIndex((r) => r.id === updated.id);
      if (targetIdx === -1 || !prev[targetIdx] || Object.keys(prev[targetIdx]).length === 0) return prev;
      return prev.map((e, i) => (i === targetIdx ? {} : e));
    });
  }, []);

  const deleteRequest = useCallback((id: string) => {
    setRequests((prev) => {
      if (prev.length === 1) return [createBlock()];
      return prev.filter((r) => r.id !== id);
    });
    setBlockErrors((prev) => {
      const idx = requestsRef.current.findIndex((r) => r.id === id);
      if (prev.length === 1) return [{}];
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const handleDropComplete = useCallback(() => {
    setAnimatingDrop(false);
  }, []);

  const buildSchema = () =>
    Yup.array().of(
      Yup.object({
        categoryCode: Yup.string().required(t("validation_category")),
        title: Yup.string().trim().required(t("validation_title")),
        deliveryDate: Yup.string().required(t("validation_delivery_date")),
        items: Yup.array()
          .min(1, t("validation_no_items"))
          .of(
            Yup.object({
              name: Yup.string().trim().required(t("validation_item_name")),
              quantity: Yup.string()
                .required(t("validation_item_quantity"))
                .test("is-positive", t("validation_item_quantity"), (v) =>
                  Boolean(v && parseInt(v) >= 1)
                ),
              details: Yup.string().trim().required(t("validation_item_details")),
            })
          ),
      })
    );

  const handleSubmit = async () => {
    try {
      await buildSchema().validate(requests, { abortEarly: false });
      setBlockErrors(requests.map(() => ({})));
      setShowConfirm(true);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        // Build per-block per-field errors from Yup inner errors
        const newErrors: BlockErrors[] = requests.map(() => ({ items: [] }));
        err.inner.forEach((e) => {
          // path like "[0].categoryCode" or "[0].items[1].name"
          const blockMatch = e.path?.match(/^\[(\d+)\]/);
          if (!blockMatch) return;
          const bi = parseInt(blockMatch[1]);
          if (!newErrors[bi]) return;

          const itemMatch = e.path?.match(/\.items\[(\d+)\]\.(.+)$/);
          if (itemMatch) {
            const ii = parseInt(itemMatch[1]);
            const field = itemMatch[2] as keyof ItemErrors;
            if (!newErrors[bi].items) newErrors[bi].items = [];
            if (!newErrors[bi].items![ii]) newErrors[bi].items![ii] = {};
            newErrors[bi].items![ii][field] = e.message;
          } else {
            const fieldMatch = e.path?.match(/\.([^.]+)$/);
            if (fieldMatch) {
              const field = fieldMatch[1] as keyof BlockErrors;
              if (field !== "items") (newErrors[bi] as any)[field] = e.message;
            }
          }
        });
        setBlockErrors(newErrors);
      }
    }
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    
    // Prepare the payload for createOrder
    const payload = {
      orders: requests.map((req) => ({
        categoryCode: req.categoryCode,
        classificationCode: "", // Omitted per user note
        title: req.title,
        deliveryDate: req.deliveryDate,
        items: req.items.map((item) => ({
          name: item.name,
          quantity: parseInt(item.quantity) || 1,
          details: item.details,
        })),
      }))
    };
    
    try {
      const res = await createOrder(payload);

      if (res?.success) {
        setShowSuccess(true);
      } else {
        const errorCode = (res as unknown as { code?: string; error?: { code?: string } })?.code ??
          (res as unknown as { error?: { code?: string } })?.error?.code;
        const rawError =
          typeof (res as unknown as { error?: unknown })?.error === "string"
            ? ((res as unknown as { error?: string })?.error as string)
            : undefined;

        if (errorCode === "Profiles:CompletionRequired" || rawError?.includes("Profiles:CompletionRequired")) {
          toast.error(tAuth("profile_completion_required") || rawError || "Your profile is incomplete");
          router.push("/profile");
          return;
        }

        const errorMsg = rawError || t("submit_error");
        console.error("[CreateOrder] Failed:", res);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("[CreateOrder] Exception:", err);
      toast.error(t("submit_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToOrders = () => {
    setShowSuccess(false);
    router.push("/orders");
  };

  const handleCancel = () => {
    router.push("/orders");
  };

  // Block rendering until session is hydrated, and if profile is incomplete
  if (!session || !session.profileCompleted) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={t("page_title")}
        crumbs={[{ label: tSidebar("my_orders"), href: "/orders" }]}
        back="/orders"
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 0 }}
        sx={{
          mt: 3,
          mb: 3,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#171717" }}>
            {t("create_request")}
          </Typography>
          <Typography variant="caption" sx={{ color: "#9DA4AE" }}>
            {t("create_request_hint")}
          </Typography>
        </Stack>
        <GreenButton onClick={addRequest}>{t("add")}</GreenButton>
      </Stack>

      <Stack spacing={3}>
        {requests.map((request, idx) => {
          const resolvedCategoryName =
            categoryNameParam ||
            catalog.find((c) => c.code === categoryCodeParam)?.[locale === "ar" ? "nameAr" : "nameEn"] ||
            categoryCodeParam;

          return (
            <RequestFormBlock
              key={request.id}
              block={request}
              onChange={updateRequest}
              onDelete={() => deleteRequest(request.id)}
              canDelete={requests.length > 1}
              catalog={catalog}
              errors={blockErrors[idx] || {}}
              dropAnimation={
                idx === 0 && animatingDrop && categoryCodeParam
                  ? {
                      active: true,
                      categoryName: resolvedCategoryName,
                      categoryImg: categoryImgParam,
                      onComplete: handleDropComplete,
                    }
                  : undefined
              }
            />
          );
        })}
      </Stack>

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={2}
        sx={{ mt: 4, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "center" }}
      >
        <Button
          onClick={handleCancel}
          variant="contained"
          size="medium"
          disableElevation
          sx={{
            bgcolor: RED,
            color: "#fff",
            borderRadius: "4px",
            px: { xs: 4, sm: 8 },
            "&:hover": { bgcolor: RED_HOVER },
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="medium"
          disableElevation
          disabled={isSubmitting}
          sx={{
            bgcolor: GREEN,
            color: "#fff",
            borderRadius: "4px",
            px: { xs: 4, sm: 8 },
            "&:hover": { bgcolor: GREEN_HOVER },
            "&.Mui-disabled": { bgcolor: GREEN, opacity: 0.5 },
          }}
        >
          {isSubmitting ? t("sending") : t("send")}
        </Button>
      </Stack>

      <QuoteConfirmDialog
        open={showConfirm}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />

      <QuoteSuccessDialog
        open={showSuccess}
        onGoToOrders={handleGoToOrders}
      />
    </Box>
  );
}
