"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "src/i18n/routing";
import {
  Box,
  Card,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuList,
} from "@mui/material";

import Iconify from "src/components/iconify";
import ConfirmationDialog from "src/components/dialog/ConfirmationDialog";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import { useQuery } from "src/components/use-query";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import SharedTable from "src/components/SharedTable/SharedTable";
import { cellAlignment } from "src/components/SharedTable/types";
import { getOrders, getOrdersCatalog, closeOrder } from "src/actions/orders";
import type { Order, OrderCatalogItem } from "src/types/order";

function OrdersRowActions({
  row,
  role,
  onCloseOrder,
}: {
  row: Order;
  role: string | null;
  onCloseOrder: (row: Order) => void;
}) {
  const t = useTranslations("Orders");
  const router = useRouter();
  const popover = usePopover();

  if (role === "supplier") {
    const canSubmit =
      row.status === "open" && !row.isOwnOrder && !row.hasSubmittedQuotation;
    if (!canSubmit) return null;
    return (
      <Button
        variant="contained"
        size="small"
        onClick={() => router.push(`/orders/${row.id}/offer`)}
        sx={{
          bgcolor: "#10754E",
          color: "white",
          fontWeight: 700,
          borderRadius: "16px",
          fontSize: "0.75rem",
          px: 1.5,
          py: 0.5,
          gap: 1,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "#0c5b3c", boxShadow: "none" },
        }}
      >
        <Iconify icon="mingcute:add-line" width={14} />
        {t("table.action_submit_quote")}
      </Button>
    );
  }

  return (
    <>
      <IconButton
        color={popover.open ? "inherit" : "default"}
        onClick={popover.onOpen}
        size="small"
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ minWidth: 140, "& .MuiMenuItem-root svg": { mr: 0 } }}
      >
        <MenuList sx={{ p: 0.5 }}>
          <MenuItem
            onClick={() => {
              router.push(`/orders/${row.id}`);
              popover.onClose();
            }}
            sx={{
              gap: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: 1,
              fontSize: "0.9rem",
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="solar:eye-bold" width={18} />
            </ListItemIcon>
            <ListItemText sx={{ m: 0 }}>{t("table.action_view")}</ListItemText>
          </MenuItem>

          {row.status === "open" && (
            <MenuItem
              onClick={() => {
                onCloseOrder(row);
                popover.onClose();
              }}
              sx={{
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderRadius: 1,
                fontSize: "0.9rem",
                color: "#FF3B30",
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, alignItems: "center", justifyContent: "center" }}>
                <Iconify icon="solar:lock-bold" width={18} />
              </ListItemIcon>
              <ListItemText sx={{ m: 0 }}>{t("table.action_close")}</ListItemText>
            </MenuItem>
          )}
        </MenuList>
      </CustomPopover>
    </>
  );
}

export default function OrdersListView() {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const router = useRouter();
  const { role } = useAuth();
  const toast = useToast();
  const { set } = useQuery(["page", "limit"]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [selectedClassificationCode, setSelectedClassificationCode] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [catalog, setCatalog] = useState<OrderCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown Anchors
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [classificationAnchor, setClassificationAnchor] = useState<null | HTMLElement>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  // Close Order Dialog
  const [closeTarget, setCloseTarget] = useState<Order | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset table page on any filter change
  useEffect(() => {
    set({ page: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategoryCode, selectedClassificationCode, selectedStatus, selectedDate]);

  // Fetch Catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      const res = await getOrdersCatalog();
      if (res.success && res.data) {
        setCatalog(res.data);
      }
    };
    fetchCatalog();
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const res = await getOrders({
        Search: debouncedSearch || undefined,
        CategoryCode: selectedCategoryCode || undefined,
        ClassificationCode: selectedClassificationCode || undefined,
        Status: selectedStatus || undefined,
        Date: selectedDate || undefined,
        SkipCount: 0,
        MaxResultCount: 1000,
      });
      setIsLoading(false);
      if (res.success && res.data) {
        setOrders(res.data.items);
        setTotalCount(res.data.totalCount);
      }
    };
    fetchOrders();
  }, [debouncedSearch, selectedCategoryCode, selectedClassificationCode, selectedStatus, selectedDate]);

  const classifications = useMemo(() => {
    if (!selectedCategoryCode) return [];
    const cat = catalog.find((c) => c.code === selectedCategoryCode);
    return cat ? cat.classifications : [];
  }, [selectedCategoryCode, catalog]);

  // Close Order Handler
  const handleCloseOrder = async () => {
    if (!closeTarget) return;
    const res = await closeOrder(closeTarget.id);
    setCloseTarget(null);
    if (res.success) {
      toast.success(t("dialog.success_close_order"));
      setOrders((prev) => prev.map((o) => (o.id === closeTarget.id ? { ...o, status: "closed" } : o)));
    } else {
      toast.error(res.error || t("dialog.confirm_close_order"));
    }
  };

  const tableHead = [
    { id: "orderNumber", label: t("table.order_id"), align: cellAlignment.left },
    { id: "title", label: t("table.order_title"), align: cellAlignment.left },
    { id: "categoryNameEn", label: t("table.category"), align: cellAlignment.left },
    { id: "classificationNameEn", label: t("table.classification"), align: cellAlignment.left },
    { id: "deliveryDate", label: t("table.delivery_date"), align: cellAlignment.left },
    { id: "creationTime", label: t("table.creation_date"), align: cellAlignment.left },
    { id: "status", label: t("table.status"), align: cellAlignment.center },
    { id: "actions", label: t("table.actions"), align: cellAlignment.center },
  ];

  const customRender = {
    categoryNameEn: (row: Order) => (locale === "ar" ? row.categoryNameAr : row.categoryNameEn),
    classificationNameEn: (row: Order) =>
      locale === "ar" ? row.classificationNameAr : row.classificationNameEn,
    deliveryDate: (row: Order) => new Date(row.deliveryDate).toLocaleDateString(locale),
    creationTime: (row: Order) => new Date(row.creationTime).toLocaleDateString(locale),
    actions: (row: Order) => (
      <OrdersRowActions row={row} role={role} onCloseOrder={(r) => setCloseTarget(r)} />
    ),
    status: (row: Order) => (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "8px",
          px: 1.5,
          py: 0.5,
          fontSize: "0.75rem",
          fontWeight: 700,
          ...(row.status === "open"
            ? { bgcolor: "#E2ECE9", color: "#006838" }
            : { bgcolor: "#FFE9D5", color: "#B71D18" }),
        }}
      >
        {row.status === "open" ? t("status.open") : t("status.closed")}
      </Box>
    ),
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Banner / Header */}
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#006838",
          }}
        >
          {t("title")}
        </Typography>

        {role === "buyer" && (
          <Button
            variant="contained"
            onClick={() => router.push("/orders/create")}
            sx={{
              bgcolor: "#10754E",
              color: "white",
              fontWeight: 600,
              borderRadius: "8px",
              px: 2.5,
              py: 1,
              gap: 1,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0c5b3c",
                boxShadow: "none",
              },
            }}
          >
            <Iconify icon="mingcute:add-line" width={18} />
            {t("add_new")}
          </Button>
        )}
      </Box>

      {/* Main Content Card (Filters + Table) */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
          border: "1px solid #F4F6F8",
          overflow: "visible",
        }}
      >
        {/* Filters and Search Row */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Search Input */}
          <TextField
            size="small"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
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

          {/* Filters List */}
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {/* Category Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setCategoryAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:filter-bold-duotone" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
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
              {selectedCategoryCode
                ? locale === "ar"
                  ? catalog.find((c) => c.code === selectedCategoryCode)?.nameAr
                  : catalog.find((c) => c.code === selectedCategoryCode)?.nameEn
                : t("filter_category")}
            </Button>
            <Menu
              anchorEl={categoryAnchor}
              open={Boolean(categoryAnchor)}
              onClose={() => setCategoryAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedCategoryCode(null);
                  setSelectedClassificationCode(null);
                  setCategoryAnchor(null);
                }}
                selected={selectedCategoryCode === null}
              >
                {locale === "ar" ? "الكل" : "All"}
              </MenuItem>
              {catalog.map((cat) => (
                <MenuItem
                  key={cat.code}
                  onClick={() => {
                    setSelectedCategoryCode(cat.code);
                    setSelectedClassificationCode(null);
                    setCategoryAnchor(null);
                  }}
                  selected={selectedCategoryCode === cat.code}
                >
                  {locale === "ar" ? cat.nameAr : cat.nameEn}
                </MenuItem>
              ))}
            </Menu>

            {/* Classification Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setClassificationAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:filter-bold-duotone" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
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
              {selectedClassificationCode
                ? locale === "ar"
                  ? classifications.find((c) => c.code === selectedClassificationCode)?.nameAr
                  : classifications.find((c) => c.code === selectedClassificationCode)?.nameEn
                : t("filter_classification")}
            </Button>
            <Menu
              anchorEl={classificationAnchor}
              open={Boolean(classificationAnchor)}
              onClose={() => setClassificationAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedClassificationCode(null);
                  setClassificationAnchor(null);
                }}
                selected={selectedClassificationCode === null}
              >
                {locale === "ar" ? "الكل" : "All"}
              </MenuItem>
              {classifications.map((cls) => (
                <MenuItem
                  key={cls.code}
                  onClick={() => {
                    setSelectedClassificationCode(cls.code);
                    setClassificationAnchor(null);
                  }}
                  selected={selectedClassificationCode === cls.code}
                >
                  {locale === "ar" ? cls.nameAr : cls.nameEn}
                </MenuItem>
              ))}
            </Menu>

            {/* Date Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setDateAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:calendar-minimum-outline" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
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
              {selectedDate ? selectedDate : t("filter_date")}
            </Button>
            <Menu
              anchorEl={dateAnchor}
              open={Boolean(dateAnchor)}
              onClose={() => setDateAnchor(null)}
            >
              <MenuItem
                onClick={() => {
                  setSelectedDate(null);
                  setDateAnchor(null);
                }}
                selected={selectedDate === null}
              >
                {locale === "ar" ? "الكل" : "All"}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDate("2025-11-10");
                  setDateAnchor(null);
                }}
                selected={selectedDate === "2025-11-10"}
              >
                2025-11-10
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDate("2026-04-10");
                  setDateAnchor(null);
                }}
                selected={selectedDate === "2026-04-10"}
              >
                2026-04-10
              </MenuItem>
            </Menu>

            {/* Status Filter */}
            <Button
              variant="outlined"
              onClick={(e) => setStatusAnchor(e.currentTarget)}
              startIcon={<Iconify icon="solar:filter-bold-duotone" width={16} />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={14} />}
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
              {selectedStatus
                ? selectedStatus === "open"
                  ? t("status.open")
                  : t("status.closed")
                : t("filter_status")}
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
                {locale === "ar" ? "الكل" : "All"}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus("open");
                  setStatusAnchor(null);
                }}
                selected={selectedStatus === "open"}
              >
                {t("status.open")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus("closed");
                  setStatusAnchor(null);
                }}
                selected={selectedStatus === "closed"}
              >
                {t("status.closed")}
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Loading */}
        {isLoading && (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {locale === "ar" ? "جاري التحميل..." : "Loading..."}
            </Typography>
          </Box>
        )}

        {/* Table */}
        {!isLoading && (
          <SharedTable
            data={orders}
            tableHead={tableHead}
            customRender={customRender}
            count={totalCount}
            maxHeight={520}
          />
        )}
      </Card>

      {/* Close Order Confirmation Dialog */}
      <ConfirmationDialog
        open={Boolean(closeTarget)}
        onClose={() => setCloseTarget(null)}
        variant="warning"
        title={t("dialog.confirm_close_order")}
        confirmLabel={t("dialog.confirm")}
        cancelLabel={t("dialog.cancel")}
        cancelVariant="gray"
        onConfirm={handleCloseOrder}
      />
    </Box>
  );
}