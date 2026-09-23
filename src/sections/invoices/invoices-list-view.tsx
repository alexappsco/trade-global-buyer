"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "src/i18n/routing";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import Iconify from "src/components/iconify";
import { Loader } from "src/components/Loader/Loader";
import { useToast } from "src/components/toast";
import SharedTable from "src/components/SharedTable/SharedTable";
import { cellAlignment } from "src/components/SharedTable/types";
import { useQuery } from "src/components/use-query";
import { getInvoices } from "src/actions/invoices";
import type { InvoiceListItem } from "src/types/invoice";

export default function InvoicesListView() {
  const t = useTranslations("Invoices");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { set } = useQuery(["page", "limit"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<"unpaid" | null>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);

  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      set({ page: null });
      setLoading(true);
    }, 400);
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const res = await getInvoices({
        search: debouncedSearch || undefined,
        status: selectedStatus || undefined,
        sorting: "issuedAt desc",
        skipCount: 0,
        maxResultCount: 1000,
      });
      if (!res.success) {
        setLoading(false);
        toast.error(res.error || t("table.load_error"));
        return;
      }
      setInvoices(res.data?.items ?? []);
      setTotalCount(res.data?.totalCount ?? 0);
      setLoading(false);
    };
    fetchInvoices();
  }, [debouncedSearch, selectedStatus, toast, t]);

  const formatDate = (value: string) =>
    value ? new Date(value).toLocaleDateString(locale) : "—";
  const formatAmount = (value?: number, currency?: string) =>
    `${(value ?? 0).toLocaleString(locale, { maximumFractionDigits: 2 })} ${currency || ""}`.trim();

  const tableHead = [
    { id: "invoiceNumber", label: t("table.invoice_number"), align: cellAlignment.center },
    { id: "orderTitle", label: t("table.order_title"), align: cellAlignment.left },
    { id: "orderNumber", label: t("table.order_number"), align: cellAlignment.center },
    { id: "issuedAt", label: t("table.issued_at"), align: cellAlignment.center },
    { id: "commissionAmount", label: t("table.commission_amount"), align: cellAlignment.left },
    { id: "actions", label: t("table.actions"), align: cellAlignment.center },
  ];

  const customRender = {
    orderTitle: (row: InvoiceListItem) => (
      <Box
        onClick={() => router.push(`/invoices/${row.id}`)}
        sx={{
          color: "#10754E",
          fontWeight: 600,
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {row.orderTitle}
      </Box>
    ),
    orderNumber: (row: InvoiceListItem) => `#${row.orderNumber}`,
    issuedAt: (row: InvoiceListItem) => formatDate(row.issuedAt),
    commissionAmount: (row: InvoiceListItem) =>
      formatAmount(row.commissionAmount, row.currency),
    actions: (row: InvoiceListItem) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => router.push(`/invoices/${row.id}`)}
        sx={{
          bgcolor: "#fff",
          borderColor: "#DFE3E8",
          color: "#637381",
          borderRadius: "16px",
          fontWeight: 600,
          px: 1.5,
          py: 0.5,
          gap: 1,
          textTransform: "none",
          "&:hover": { borderColor: "#919EAB", bgcolor: "#F4F6F8" },
        }}
      >
        <Iconify icon="solar:eye-bold" width={16} />
        {t("table.view")}
      </Button>
    ),
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Banner Header */}
      <Box
        sx={{
          bgcolor: "#E6EFEA",
          borderRadius: 2,
          p: 2.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#006838" }}>
          {t("title")}
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          size="small"
          placeholder={t("search")}
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
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: "#F9FAFB",
              "& fieldset": { borderColor: "#EAEFEA" },
              "&:hover fieldset": { borderColor: "#DFE3E8" },
            },
          }}
        />

        <Button
          variant="outlined"
          onClick={(e) => setStatusAnchor(e.currentTarget)}
          sx={{
            borderRadius: "24px",
            borderColor: "#DFE3E8",
            color: "#212B36",
            fontWeight: 500,
            fontSize: "0.875rem",
            px: 2,
            py: 0.75,
            gap: 1,
            textTransform: "none",
            "&:hover": { borderColor: "#C4CDD5", bgcolor: "#F4F6F8" },
          }}
        >
          <Iconify icon="solar:filter-bold-duotone" width={16} />
          {selectedStatus ? t(`status.${selectedStatus}`) : t("status_filter")}
          <Iconify icon="eva:arrow-ios-downward-fill" width={14} />
        </Button>
        <Menu
          anchorEl={statusAnchor}
          open={Boolean(statusAnchor)}
          onClose={() => setStatusAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setSelectedStatus(null);
              setStatusAnchor(null);
              set({ page: null });
              setLoading(true);
            }}
            selected={selectedStatus === null}
          >
            {t("all")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedStatus("unpaid");
              setStatusAnchor(null);
              set({ page: null });
              setLoading(true);
            }}
            selected={selectedStatus === "unpaid"}
          >
            {t("status.unpaid")}
          </MenuItem>
        </Menu>
      </Box>

      {/* Loading */}
      {loading && <Loader variant="section" minHeight={240} />}

      {/* Table */}
      {!loading && (
        <SharedTable
          data={invoices}
          tableHead={tableHead}
          customRender={customRender}
          count={totalCount}
        />
      )}
    </Box>
  );
}