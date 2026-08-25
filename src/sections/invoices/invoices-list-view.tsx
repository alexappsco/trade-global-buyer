"use client";

import { useMemo, useState } from "react";
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
import SimpleTable, { HeadCell } from "src/components/SimpleTable";
import { MOCK_INVOICES, Invoice } from "./invoices-mock";

export default function InvoicesListView() {
  const t = useTranslations("Invoices");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"paid" | "unpaid" | null>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter((invoice) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        invoice.invoiceNumber.includes(q) ||
        invoice.transactionTitle.toLowerCase().includes(q) ||
        invoice.orderNumber.includes(q);

      const matchesStatus = !selectedStatus || invoice.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatus]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredInvoices.map((invoice) => invoice.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const isAllSelected =
    filteredInvoices.length > 0 && selectedRows.length === filteredInvoices.length;

  const align = isRtl ? "right" : "left";

  const headCells: HeadCell<Invoice>[] = [
    {
      id: "select",
      label: "",
      width: 48,
      renderHeader: () => (
        <Checkbox
          size="small"
          checked={isAllSelected}
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < filteredInvoices.length
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
      id: "transactionTitle",
      label: t("table.transaction_title"),
      align,
      renderCell: (row) => (
        <Box
          sx={{
            color: "#10754E",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {row.transactionTitle}
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
      id: "registeredAt",
      label: t("table.registered_at"),
      align,
      width: 170,
    },
    {
      id: "amountPaid",
      label: t("table.amount_paid"),
      align,
      width: 120,
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
            }}
            selected={selectedStatus === null}
          >
            {t("all")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedStatus("paid");
              setStatusAnchor(null);
            }}
            selected={selectedStatus === "paid"}
          >
            {t("status.paid")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setSelectedStatus("unpaid");
              setStatusAnchor(null);
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
        <SimpleTable<Invoice>
          key={`${searchQuery}-${selectedStatus}`}
          data={filteredInvoices}
          headCells={headCells}
          emptyMessage={t("no_data")}
        />
      </Box>
    </Box>
  );
}
