"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "src/i18n/routing";
import {
  Box,
  Card,
  Button,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";

import Iconify from "src/components/iconify";
import ConfirmationDialog from "src/components/dialog/ConfirmationDialog";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import { getOrderDetails } from "src/actions/orders";
import { submitQuotationOffer } from "src/actions/quotations";
import type { Order } from "src/types/order";

interface Props {
  id: string;
}

export default function OrdersOfferCreateView({ id }: Props) {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const router = useRouter();
  const { role } = useAuth();
  const toast = useToast();
  const isRtl = locale === "ar";
  const currency = t("submit_offer.currency");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unitPrices, setUnitPrices] = useState<Record<string, string>>({});
  const [deliveryFee, setDeliveryFee] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      const res = await getOrderDetails(id);
      if (res.success && res.data) setOrder(res.data);
      setIsLoading(false);
    };
    fetchOrder();
  }, [id]);

  const isSupplier = role === "supplier";
  const canSubmit =
    order !== null &&
    order.status === "open" &&
    !order.isOwnOrder &&
    !order.hasSubmittedQuotation;

  const subtotal = useMemo(() => {
    const itemsTotal = (order?.items ?? []).reduce((sum, item) => {
      const price = Number(unitPrices[item.id]);
      const valid = Number.isFinite(price) ? price : 0;
      return sum + valid * item.quantity;
    }, 0);
    const fee = Number(deliveryFee);
    return itemsTotal + (Number.isFinite(fee) ? fee : 0);
  }, [order, unitPrices, deliveryFee]);

  const tax = Math.round(subtotal * 0.15 * 100) / 100;
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  const formatMoney = (value: number) =>
    `${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

  const handlePriceChange = (itemId: string, val: string) => {
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setUnitPrices((prev) => ({ ...prev, [itemId]: val }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }
  };

  const handleDeliveryChange = (val: string) => {
    if (/^\d*\.?\d{0,2}$/.test(val)) setDeliveryFee(val);
  };

  const handleDurationChange = (val: string) => {
    if (/^\d*$/.test(val)) {
      setDurationDays(val);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.duration;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    (order?.items ?? []).forEach((item) => {
      const price = Number(unitPrices[item.id]);
      if (!unitPrices[item.id] || !Number.isFinite(price) || price <= 0) {
        errs[item.id] = t("submit_offer.unit_price_required");
      }
    });
    const days = Number(durationDays);
    if (!durationDays || !Number.isInteger(days) || days <= 0) {
      errs.duration = t("submit_offer.duration_required");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!order) return;
    if (!validate()) {
      toast.error(t("submit_offer.unit_price_required"));
      return;
    }
    setOpenConfirm(false);
    const payload = {
      deliveryFee: Number(deliveryFee || 0),
      deliveryDurationDays: Number(durationDays),
      items: (order.items ?? []).map((item) => ({
        orderItemId: item.id,
        unitPrice: Number(unitPrices[item.id]),
      })),
    };
    const res = await submitQuotationOffer(order.id, payload);
    if (res.success && res.data) {
      setSubmittedId(res.data.id);
      setOpenSuccess(true);
      return;
    }
    if (!res.success) {
      toast.error(res.error || t("submit_offer.error_generic"));
    }
  };

  if (!isSupplier) {
    return (
      <Box
        sx={{
          bgcolor: "#EAEFEA",
          borderRadius: 2,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#161C24", fontWeight: 700 }}>
          {t("submit_offer.not_allowed")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/orders")}
          sx={{
            bgcolor: "#10754E",
            color: "white",
            fontWeight: 700,
            borderRadius: "8px",
            px: 4,
            py: 1,
            boxShadow: "none",
            "&:hover": { bgcolor: "#0c5b3c", boxShadow: "none" },
          }}
        >
          {t("submit_offer.back")}
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {t("submit_offer.loading")}
      </Typography>
    );
  }

  if (!order) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {locale === "ar" ? "لا توجد نتائج مطابقة" : "No matching results found"}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Banner */}
      <Box
        sx={{
          bgcolor: "#EAEFEA",
          borderRadius: 2,
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#161C24" }}>
          {t("submit_offer.title")}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/orders")}
          
          sx={{
            borderColor: "#10754E",
            color: "#10754E",
            borderRadius: "8px",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            gap: 1,
            textTransform: "none",
            "&:hover": { borderColor: "#0c5b3c", bgcolor: "rgba(16,117,78,0.04)" },
          }}
        >
          <Iconify icon="solar:arrow-right-bold" width={16} />
          {t("submit_offer.back")}
        </Button>
      </Box>

      {/* Order Info */}
      <Card
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)",
          border: "1px solid #F4F6F8",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
            gap: 3,
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("details.info.order_id")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36" }}>
              {order.orderNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("details.info.order_title")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36", fontSize: "0.95rem" }}>
              {order.title}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("details.info.category")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36", fontSize: "0.95rem" }}>
              {locale === "ar" ? order.categoryNameAr : order.categoryNameEn}
            </Typography>
          </Box>
        </Box>
      </Card>

      {!canSubmit ? (
        <Box
          sx={{
            bgcolor: "#FFF9E6",
            border: "1px solid #FFE699",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#7A4100" }}>
            {t("submit_offer.not_open")}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Items Table */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)",
              border: "1px solid #F4F6F8",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "#F9FAFB" }}>
                  <TableRow>
                    <TableCell align={isRtl ? "right" : "left"} sx={{ fontWeight: 700, color: "#637381" }}>
                      {t("submit_offer.item")}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: "#637381" }}>
                      {t("submit_offer.quantity")}
                    </TableCell>
                    <TableCell align={isRtl ? "right" : "left"} sx={{ fontWeight: 700, color: "#637381" }}>
                      {t("submit_offer.details")}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: "#637381" }}>
                      {t("submit_offer.unit_price")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell align={isRtl ? "right" : "left"} sx={{ fontWeight: 600, color: "#006838" }}>
                        {item.name}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {item.quantity}
                      </TableCell>
                      <TableCell align={isRtl ? "right" : "left"} sx={{ color: "text.secondary" }}>
                        {item.details}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          size="small"
                          error={Boolean(errors[item.id])}
                          helperText={errors[item.id]}
                          placeholder={t("submit_offer.delivery_fee_placeholder")}
                          value={unitPrices[item.id] || ""}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          slotProps={{
                            htmlInput: { style: { textAlign: "center" } },
                          }}
                          sx={{
                            width: 140,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              bgcolor: "#fff",
                              "& fieldset": { borderColor: "#EAEFEA" },
                              "&:hover fieldset": { borderColor: "#DFE3E8" },
                              "&.Mui-focused fieldset": { borderColor: "#10754E" },
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Delivery + Calculations */}
          <Card
            sx={{
              borderRadius: 3,
              p: 3,
              boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)",
              border: "1px solid #F4F6F8",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" },
                gap: 2.5,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
                  {t("submit_offer.delivery_fee")}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder={t("submit_offer.delivery_fee_placeholder")}
                  value={deliveryFee}
                  onChange={(e) => handleDeliveryChange(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#EAEFEA" },
                      "&:hover fieldset": { borderColor: "#DFE3E8" },
                      "&.Mui-focused fieldset": { borderColor: "#10754E" },
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
                  {t("submit_offer.duration")}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  error={Boolean(errors.duration)}
                  helperText={errors.duration}
                  placeholder={t("submit_offer.duration_placeholder")}
                  value={durationDays}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#EAEFEA" },
                      "&:hover fieldset": { borderColor: "#DFE3E8" },
                      "&.Mui-focused fieldset": { borderColor: "#10754E" },
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
                  {t("submit_offer.subtotal")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
                  {formatMoney(subtotal)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
                  {t("submit_offer.tax")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
                  {formatMoney(tax)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
                  {t("submit_offer.grand_total")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#006838" }}>
                  {formatMoney(grandTotal)}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => setOpenConfirm(true)}
              sx={{
                bgcolor: "#10754E",
                color: "white",
                fontWeight: 700,
                borderRadius: "8px",
                px: 6,
                py: 1.5,
                minWidth: 180,
                boxShadow: "none",
                "&:hover": { bgcolor: "#0c5b3c", boxShadow: "none" },
              }}
            >
              {t("submit_offer.submit")}
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push("/orders")}
              sx={{
                bgcolor: "#FF3B30",
                color: "white",
                fontWeight: 700,
                borderRadius: "8px",
                px: 6,
                py: 1.5,
                minWidth: 180,
                boxShadow: "none",
                "&:hover": { bgcolor: "#d32f2f", boxShadow: "none" },
              }}
            >
              {t("submit_offer.cancel")}
            </Button>
          </Box>
        </>
      )}

      {/* Confirm Dialog */}
      <ConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        variant="warning"
        title={t("submit_offer.confirm_title")}
        confirmLabel={t("submit_offer.confirm_submit")}
        cancelLabel={t("submit_offer.cancel")}
        cancelVariant="gray"
        onConfirm={handleSubmit}
      />

      {/* Success Dialog */}
      <ConfirmationDialog
        open={openSuccess}
        onClose={() => router.push("/orders")}
        variant="success"
        title={t("submit_offer.success_title")}
        confirmLabel={t("submit_offer.view_offer")}
        cancelLabel={t("submit_offer.go_to_orders")}
        cancelVariant="gray"
        onConfirm={() => {
          router.push(`/orders/${order.id}/${submittedId}?role=supplier`);
        }}
      />
    </Box>
  );
}