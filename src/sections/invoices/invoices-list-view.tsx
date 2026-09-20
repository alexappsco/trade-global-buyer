"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "src/i18n/routing";
import {
  Box,
  Button,
  Checkbox,
  Menu,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import Iconify from "src/components/iconify";
import { useToast } from "src/components/toast";
import SimpleTable, { HeadCell } from "src/components/SimpleTable";
import { getInvoices } from "src/actions/invoices";
import type { InvoiceListItem } from "src/types/invoice";

const PAGE_SIZE = 10;

export default function InvoicesListView() {
  const t = useTranslations("Invoices");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const isRtl = locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<"unpaid" | null>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0);
    }, 400);
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const res = await getInvoices({
        search: debouncedSearch || undefined,
        status: selectedStatus || undefined,
        sorting: "issuedAt desc",
        skipCount: page * rowsPerPage,
        maxResultCount: rowsPerPage,
      });
      setLoading(false);
      if (res.success) {
        setInvoices(res.data?.items ?? []);
        setTotalCount(res.data?.totalCount ?? 0);
        setSelectedRows([]);
      } else {
        toast.error(res.error || t("table.load_error"));
      }
    };
    fetchInvoices();
  }, [debouncedSearch, selectedStatus, page, rowsPerPage, toast, t]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? invoices.map((invoice) => invoice.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((rowId) => rowId !== id)
    );
  };

  const isAllSelected =
    invoices.length > 0 && selectedRows.length === invoices.length;

  const align = isRtl ? "right" : "left";

  const formatDate = (value: string) =>
    value ? new Date(value).toLocaleDateString(locale) : "—";
  const formatAmount = (value?: number, currency?: string) =>
    `${(value ?? 0).toLocaleString(locale, { maximumFractionDigits: 2 })} ${currency || ""}`.trim();

  const headCells: HeadCell<InvoiceListItem>[] = [
    {
      id: "select",
      label: "",
      width: 48,
      renderHeader: () => (
        <Checkbox
          size="small"
          checked={isAllSelected}
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < invoices.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
          sx={{ color: "#C4CDD5", "&.Mui-checked": { color: "#006838" } }}
        />
      ),
      renderCell: (row) => (
        <Checkbox
          size="small"
          checked={selectedRows.includes(row.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleSelectRow(row.id, e.target.checked)}
          sx={{ color: "#C4CDD5", "&.Mui-checked": { color: "#006838" } }}
        />
      ),
    },
    {
      id: "invoiceNumber",
      label: t("table.invoice_number"),
      align,
      width: 190,
    },
    {
      id: "orderTitle",
      label: t("table.order_title"),
      align,
      renderCell: (row) => (
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
    },
    {
      id: "orderNumber",
      label: t("table.order_number"),
      align,
      width: 110,
    },
    {
      id: "issuedAt",
      label: t("table.issued_at"),
      align,
      width: 170,
      renderCell: (row) => formatDate(row.issuedAt),
    },
    {
      id: "commissionAmount",
      label: t("table.commission_amount"),
      align,
      width: 150,
      renderCell: (row) => formatAmount(row.commissionAmount, row.currency),
    },
    {
      id: "rowActions",
      label: t("table.actions"),
      align,
      width: 130,
      renderCell: (row) => (
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
    },
  ];

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
              setPage(0);
            }}
            selected={selectedStatus === null}
          >
            {t("all")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedStatus("unpaid");
              setStatusAnchor(null);
              setPage(0);
            }}
            selected={selectedStatus === "unpaid"}
          >
            {t("status.unpaid")}
          </MenuItem>
        </Menu>
      </Box>

      {/* Table */}
      <Box
        sx={{
          border: "1px solid #DFE3E8",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <SimpleTable<InvoiceListItem>
          key={`${debouncedSearch}-${selectedStatus}`}
          data={invoices}
          headCells={headCells}
          emptyMessage={t("no_data")}
          loading={loading}
          serverPagination={{
            count: totalCount,
            page,
            rowsPerPage,
            onPageChange: (_event, newPage) => setPage(newPage),
            onRowsPerPageChange: (event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            },
          }}
        />
      </Box>
    </Box>
  );
}