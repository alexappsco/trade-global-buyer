"use client";

import { useState, useEffect } from "react";
import QuoteSuccessDialog from "./QuoteSuccessDialog";
import QuoteConfirmDialog from "./QuoteConfirmDialog";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  InputBase,
  Select,
  Autocomplete,
} from "@mui/material";
import { getOrdersCatalog, createOrder } from "src/actions/orders";
import type { OrderCatalogItem } from "src/types/order";
import { useLocale } from "next-intl";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import { useToast } from "src/components/toast";
import { useRouter } from "src/i18n/routing";
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

const createBlock = (): RequestBlock => ({
  id: createId(),
  categoryCode: "",
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

function RequestFormBlock({
  block,
  onChange,
  onDelete,
  canDelete,
  catalog,
}: {
  block: RequestBlock;
  onChange: (block: RequestBlock) => void;
  onDelete: () => void;
  canDelete: boolean;
  catalog: OrderCatalogItem[];
}) {
  const t = useTranslations("CreateQuoteRequest");
  const locale = useLocale();

  const updateField = (field: keyof Omit<RequestBlock, "items">, value: string) =>
    onChange({ ...block, [field]: value });

  const addItem = () =>
    onChange({ ...block, items: [...block.items, createItem()] });

  const updateItem = (itemId: string, field: keyof ItemRow, value: string) =>
    onChange({
      ...block,
      items: block.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    });

  const removeItem = (itemId: string) =>
    onChange({ ...block, items: block.items.filter((item) => item.id !== itemId) });

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        border: "1px solid #CBD5E1",
        borderRadius: "12px",
        p: "24px",
      }}
    >
      <Box
        sx={{
          border: "1px solid #CBD5E1",
          borderRadius: "8px",
          mb: "32px",
          p: "16px 24px",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
            {t("category")}
          </Typography>
          <Autocomplete
            options={catalog}
            getOptionLabel={(option) => locale === "ar" ? option.nameAr : option.nameEn}
            value={catalog.find((c) => c.code === block.categoryCode) || null}
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
                  slotProps={{
                    ...rest.slotProps,
                    input: {
                      ...InputProps,
                      ...rest.slotProps?.input,
                      disableUnderline: true,
                      sx: {
                        color: "#16A34A",
                        fontSize: "14px",
                        fontWeight: 400,
                        "& input": { 
                          textAlign: "start", 
                          padding: 0,
                        },
                      }
                    }
                  }}
                />
              );
            }}
          />
        </Stack>

        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
            {t("request_title")}
          </Typography>
          <InputBase
            value={block.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder={t("title_placeholder")}
            sx={{
              color: "#9CA3AF",
              fontSize: "14px",
              fontWeight: 400,
              width: "100%",
              "& input": { textAlign: "start", p: 0 }
            }}
          />
        </Stack>

        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
            {t("delivery_date")}
          </Typography>
          <InputBase
            type="date"
            value={block.deliveryDate}
            onChange={(e) => updateField("deliveryDate", e.target.value)}
            sx={{
              color: "#9CA3AF",
              fontSize: "14px",
              fontWeight: 400,
              width: "100%",
              "& input": { textAlign: "start", p: 0 }
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ border: "1px solid #CBD5E1", borderRadius: "8px", overflow: "hidden", mb: "16px" }}>
        <Table sx={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead sx={{ bgcolor: "#F1F5F9", height: "40px" }}>
            <TableRow>
              <TableCell align="center" sx={{ width: "27%", borderBottom: "1px solid #CBD5E1", borderInlineEnd: "1px solid #E2E8F0", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("item")}</TableCell>
              <TableCell align="center" sx={{ width: "27%", borderBottom: "1px solid #CBD5E1", borderInlineEnd: "1px solid #E2E8F0", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("quantity")}</TableCell>
              <TableCell align="center" sx={{ width: "28%", borderBottom: "1px solid #CBD5E1", borderInlineEnd: "1px solid #E2E8F0", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("details")}</TableCell>
              <TableCell align="center" sx={{ width: "18%", borderBottom: "1px solid #CBD5E1", fontWeight: 700, fontSize: "13px", color: "#374151", py: 1 }}>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {block.items.map((item) => (
              <TableRow key={item.id} sx={{ height: "56px", "& td": { borderBottom: "1px solid #E2E8F0" }, "&:last-child td": { borderBottom: "none" } }}>
                <TableCell align="center" sx={{ borderInlineEnd: "1px solid #E2E8F0 !important", py: 1.5 }}>
                  <InputBase
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder={t("item_placeholder")}
                    sx={{ color: "#16A34A", fontSize: "14px", fontWeight: 500, width: "100%", "& input": { textAlign: "center", p: 0 } }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ borderInlineEnd: "1px solid #E2E8F0 !important", py: 1.5 }}>
                  <InputBase
                    type="text"
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*", min: 1 }}
                    value={item.quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^[1-9]\d*$/.test(val)) {
                        updateItem(item.id, "quantity", val);
                      }
                    }}
                    placeholder="0"
                    sx={{ color: "#374151", fontSize: "14px", fontWeight: 400, width: "100%", "& input": { textAlign: "center", p: 0 } }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ borderInlineEnd: "1px solid #E2E8F0 !important", py: 1.5 }}>
                  <InputBase
                    value={item.details}
                    onChange={(e) => updateItem(item.id, "details", e.target.value)}
                    placeholder={t("details_placeholder")}
                    sx={{ color: "#374151", fontSize: "14px", fontWeight: 400, width: "100%", "& input": { textAlign: "center", p: 0 } }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ py: 1.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => removeItem(item.id)}
                    sx={{ color: "#EF4444" }}
                  >
                    <DeleteIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
}

export default function CreateQuoteRequestView() {
  const t = useTranslations("CreateQuoteRequest");
  const toast = useToast();
  const router = useRouter();
  const [requests, setRequests] = useState<RequestBlock[]>([createBlock()]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [catalog, setCatalog] = useState<OrderCatalogItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        console.log("[Catalog] Calling getOrdersCatalog server action...");
        const res = await getOrdersCatalog();
        console.log("[Catalog] Full response:", JSON.stringify(res, null, 2));
        console.log("[Catalog] success:", res.success);
        console.log("[Catalog] data:", res.data);
        console.log("[Catalog] status:", (res as any).status);
        if (res.success && res.data) {
          const catalogData = Array.isArray(res.data) ? res.data : (res.data as any).data || [];
          console.log("[Catalog] Setting catalog items:", catalogData.length, "items");
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

  const addRequest = () => setRequests((prev) => [...prev, createBlock()]);

  const updateRequest = (updated: RequestBlock) =>
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

  const deleteRequest = (id: string) => {
    setRequests((prev) => {
      if (prev.length === 1) return [createBlock()];
      return prev.filter((r) => r.id !== id);
    });
  };

  const handleSubmit = () => {
    setShowConfirm(true);
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
    
    const res = await createOrder(payload);
    setIsSubmitting(false);
    
    if (res.success) {
      setShowSuccess(true);
    } else {
      toast.error(res.error || t("submit_error"));
    }
  };

  const handleGoToOrders = () => {
    setShowSuccess(false);
    router.push("/orders");
  };

  const handleCancel = () => {
    router.push("/orders");
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#EDF4F2",
          borderRadius: "12px",
          px: { xs: 2, md: 3 },
          py: 2.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#171717" }}>
          {t("page_title")}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 0 }}
        sx={{
          mt: 3,
          mb: 3,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
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
        {requests.map((request) => (
          <RequestFormBlock
            key={request.id}
            block={request}
            onChange={updateRequest}
            onDelete={() => deleteRequest(request.id)}
            canDelete={requests.length > 1}
            catalog={catalog}
          />
        ))}
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
            px: 8,
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
            px: 8,
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
