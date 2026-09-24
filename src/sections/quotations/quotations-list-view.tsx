"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "src/i18n/routing";
import {
  Box,
  Card,
  Menu,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";

import Iconify from "src/components/iconify";
import SharedTable from "src/components/SharedTable/SharedTable";
import PageHeader from "src/components/PageHeader/PageHeader";
import { Loader } from "src/components/Loader/Loader";
import { cellAlignment } from "src/components/SharedTable/types";
import { useQuery } from "src/components/use-query";
import { getQuotationOffers } from "src/actions/quotations";
import type { QuotationOffer } from "src/types/quotation";

export default function QuotationsListView() {
  const t = useTranslations("Quotations");
  const tOrders = useTranslations("Orders");
  const locale = useLocale();
  const router = useRouter();
  const { set } = useQuery(["page", "limit"]);

  // Data state
  const [offers, setOffers] = useState<QuotationOffer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Dropdown Anchors
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);

  // Debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      set({ page: null });
      setIsLoading(true);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // Fetch data
  useEffect(() => {
    let cancelled = false;
    const fetchOffers = async () => {
      const res = await getQuotationOffers({
        search: debouncedSearch || undefined,
        status: selectedStatus || undefined,
        skipCount: 0,
        maxResultCount: 1000,
        sorting: "creationTime desc",
      });
      if (cancelled) return;
      if (res.success && res.data) {
        const data = res.data as any;
        if (Array.isArray(data)) {
          setOffers(data);
          setTotalCount(data.length);
        } else {
          setOffers(data.items || []);
          setTotalCount(data.totalCount || 0);
        }
      } else {
        setOffers([]);
        setTotalCount(0);
      }
      setIsLoading(false);
    };
    fetchOffers();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedStatus]);

  // Status options
  const statusOptions = [
    { value: null, label: tOrders("filter_status") },
    { value: "pending", label: locale === "ar" ? "قيد الانتظار" : "Pending" },
    { value: "accepted", label: locale === "ar" ? "مقبول" : "Accepted" },
    { value: "declined", label: locale === "ar" ? "مرفوض" : "Declined" },
    { value: "closed", label: locale === "ar" ? "مغلق" : "Closed" },
  ];

  const getStatusLabel = (status: string) => {
    const opt = statusOptions.find((o) => o.value === status);
    return opt ? opt.label : status;
  };

  const getStatusColor = (status: QuotationOffer["status"]) => {
    switch (status) {
      case "accepted": return { bg: "rgba(0, 104, 56, 0.08)", color: "#006838" };
      case "declined": return { bg: "rgba(255, 59, 48, 0.08)", color: "#FF3B30" };
      case "closed":   return { bg: "rgba(99, 115, 129, 0.08)", color: "#637381" };
      default:         return { bg: "rgba(255, 171, 0, 0.08)", color: "#B76E00" };
    }
  };

  const tableHead = [
    { id: "orderNumber", label: tOrders("table.order_id"), align: cellAlignment.center },
    { id: "orderTitle", label: tOrders("table.order_title"), align: cellAlignment.left },
    { id: "category", label: tOrders("table.category"), align: cellAlignment.left },
    { id: "deliveryDate", label: tOrders("table.delivery_date"), align: cellAlignment.left },
    { id: "submissionTime", label: tOrders("table.creation_date"), align: cellAlignment.left },
    { id: "grandTotal", label: t("table.grand_total"), align: cellAlignment.center },
    { id: "deliveryStatus", label: tOrders("details.info.delivery_status"), align: cellAlignment.center },
    { id: "status", label: tOrders("table.status"), align: cellAlignment.left },
    { id: "actions_cell", label: t("table.actions"), align: cellAlignment.center },
  ];

  // Custom renders
  const customRender = {
    orderNumber: (row: QuotationOffer) => `#${row.orderNumber}`,
    orderTitle: (row: QuotationOffer) => row.orderTitle,
    category: (row: QuotationOffer) =>
      locale === "ar" ? row.categoryNameAr : row.categoryNameEn,
    deliveryDate: (row: QuotationOffer) =>
      new Date(row.deliveryDate).toLocaleDateString(locale),
    submissionTime: (row: QuotationOffer) =>
      new Date(row.submissionTime).toLocaleDateString(locale),
    grandTotal: (row: QuotationOffer) =>
      `${row.grandTotal.toLocaleString(locale, { minimumFractionDigits: 2 })} ${locale === "ar" ? "ر.س" : "SAR"}`,
    status: (row: QuotationOffer) => {
      const { bg, color } = getStatusColor(row.status);
      return (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.5,
            py: 0.5,
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 700,
            bgcolor: bg,
            color,
          }}
        >
          {getStatusLabel(row.status)}
        </Box>
      );
    },
    deliveryStatus: (row: QuotationOffer) => (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.5,
          py: 0.5,
          borderRadius: "12px",
          fontSize: "0.75rem",
          fontWeight: 700,
          ...(row.deliveryStatus === "delivered"
            ? { bgcolor: "rgba(0, 104, 56, 0.08)", color: "#006838" }
            : row.deliveryStatus === "pending"
            ? { bgcolor: "rgba(255, 171, 0, 0.08)", color: "#B76E00" }
            : { bgcolor: "rgba(99, 115, 129, 0.08)", color: "#637381" }),
        }}
      >
        <Iconify icon="solar:delivery-bold" width={14} />
        {row.deliveryStatus === "delivered"
          ? tOrders("details.delivery.delivered")
          : row.deliveryStatus === "pending"
          ? tOrders("details.delivery.pending")
          : tOrders("details.delivery.not_delivered")}
      </Box>
    ),
    actions_cell: (row: QuotationOffer) => (
      <Button
        variant="contained"
        size="small"
        onClick={() => router.push(`/orders/${row.orderId}/${row.id}?role=supplier`)}
        sx={{
          bgcolor: "#10754E",
          color: "white",
          fontWeight: 700,
          borderRadius: "12px",
          fontSize: "0.75rem",
          px: 2,
          py: 0.75,
          boxShadow: "none",
          "&:hover": { bgcolor: "#094730", boxShadow: "none" },
        }}
      >
        {t("table.view_quote")}
      </Button>
    ),
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Banner */}
      <PageHeader title={t("title")} back={null} />

      {/* Filter and Table Card */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
          border: "1px solid #F4F6F8",
        }}
      >
        {/* Filter Toolbar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap-reverse",
            gap: 2,
            mb: 3,
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder={tOrders("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" width={20} sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: "100%", sm: 260 },
              "& .MuiOutlinedInput-root": { borderRadius: "8px", borderColor: "#EAEFEA" },
            }}
          />

          {/* Filters */}
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
<Button
              variant="outlined"
              onClick={(e) => setStatusAnchor(e.currentTarget)}
              sx={{
                borderColor: "#EAEFEA",
                color: "#637381",
                borderRadius: "8px",
                px: 2.5,
                py: 1,
                fontWeight: 600,
                gap: 1,
                "&:hover": { borderColor: "#B7CBB7", bgcolor: "transparent" },
              }}
            >
              <Iconify icon="eva:chevron-down-fill" width={16} />
              {selectedStatus ? getStatusLabel(selectedStatus) : tOrders("filter_status")}
            </Button>
            <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
              {statusOptions.map((opt) => (
                <MenuItem
                  key={opt.value ?? "all"}
                  onClick={() => {
                    setSelectedStatus(opt.value);
                    set({ page: null });
                    setIsLoading(true);
                    setStatusAnchor(null);
                  }}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        {/* Table */}
        <SharedTable
          loading={isLoading}
          data={offers}
          tableHead={tableHead}
          count={totalCount}
          customRender={customRender}
        />
      </Card>
    </Box>
  );
}
