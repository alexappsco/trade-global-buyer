"use client";

import { useState, useEffect } from "react";
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
  Typography,
} from "@mui/material";

import Iconify from "src/components/iconify";
import { getQuotationOfferDetails } from "src/actions/quotations";
import type { QuotationOffer, QuotationOfferStatus } from "src/types/quotation";

interface Props {
  id: string;
  offerId: string;
}

const STATUS_LABELS: Record<QuotationOfferStatus, { ar: string; en: string; bg: string; color: string }> = {
  pending: { ar: "قيد الانتظار", en: "Pending", bg: "rgba(255, 171, 0, 0.08)", color: "#B76E00" },
  accepted: { ar: "مقبول", en: "Accepted", bg: "rgba(0, 104, 56, 0.08)", color: "#006838" },
  declined: { ar: "مرفوض", en: "Declined", bg: "rgba(255, 59, 48, 0.08)", color: "#FF3B30" },
  closed: { ar: "مغلق", en: "Closed", bg: "rgba(99, 115, 129, 0.08)", color: "#637381" },
};

function StatusBadge({ status, locale }: { status: QuotationOfferStatus; locale: string }) {
  const config = STATUS_LABELS[status];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.5,
        py: 0.5,
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: 700,
        bgcolor: config.bg,
        color: config.color,
      }}
    >
      {locale === "ar" ? config.ar : config.en}
    </Box>
  );
}

export default function OrdersOfferSupplierView({ id, offerId }: Props) {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ar";
  const currency = t("submit_offer.currency");

  const [offer, setOffer] = useState<QuotationOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      setIsLoading(true);
      const res = await getQuotationOfferDetails(offerId);
      if (res.success && res.data) setOffer(res.data);
      setIsLoading(false);
    };
    fetchOffer();
  }, [offerId]);

  const formatDate = (value: string) =>
    value ? new Date(value).toLocaleDateString(locale) : "—";

  const formatMoney = (value: number) =>
    `${value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

  if (isLoading) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {t("submit_offer.loading")}
      </Typography>
    );
  }

  if (!offer) {
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
          {locale === "ar" ? "العرض غير متاح" : "Offer not available"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/quotation-requests")}
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
          {t("submit_offer.back_to_requests")}
        </Button>
      </Box>
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
          {t("submit_offer.view_title")}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.push("/quotation-requests")}
          startIcon={<Iconify icon="solar:arrow-left-bold" width={16} />}
          sx={{
            borderColor: "#10754E",
            color: "#10754E",
            borderRadius: "8px",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            textTransform: "none",
            "&:hover": { borderColor: "#0c5b3c", bgcolor: "rgba(16,117,78,0.04)" },
          }}
        >
          {t("submit_offer.back_to_requests")}
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
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" },
            gap: 3,
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("details.info.order_id")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36" }}>
              #{offer.orderNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("details.info.order_title")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36", fontSize: "0.95rem" }}>
              {offer.orderTitle}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("details.info.category")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36", fontSize: "0.95rem" }}>
              {locale === "ar" ? offer.categoryNameAr : offer.categoryNameEn}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("details.info.delivery_date")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36", fontSize: "0.95rem" }}>
              {formatDate(offer.deliveryDate)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.offer_date")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#212B36", fontSize: "0.95rem" }}>
              {formatDate(offer.submissionTime)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.offer_status")}
            </Typography>
            <StatusBadge status={offer.status} locale={locale} />
          </Box>
        </Box>
      </Card>

      {/* Buyer Details */}
      <Card
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)",
          border: "1px solid #F4F6F8",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#161C24", mb: 2 }}>
          {t("submit_offer.buyer_details")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.company")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#212B36" }}>
              {offer.counterparty?.legalCompanyName || "—"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.city")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#212B36" }}>
              {offer.counterparty?.city || "—"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.company_address")}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#212B36" }}>
              {offer.counterparty?.companyAddress || "—"}
            </Typography>
          </Box>
        </Box>
      </Card>

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
                <TableCell align="center" sx={{ fontWeight: 700, color: "#637381" }}>
                  {t("submit_offer.item_total")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offer.items.map((item) => (
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
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {formatMoney(item.unitPrice)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {formatMoney(item.itemTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Summary */}
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
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(5, 1fr)" },
            gap: 2.5,
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.delivery_fee")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
              {formatMoney(offer.deliveryFee)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.duration")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
              {offer.deliveryDurationDays}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.subtotal")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
              {formatMoney(offer.subtotal)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.tax")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
              {formatMoney(offer.tax)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#637381", mb: 1 }}>
              {t("submit_offer.grand_total")}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#006838" }}>
              {formatMoney(offer.grandTotal)}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}