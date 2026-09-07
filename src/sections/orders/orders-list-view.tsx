"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "src/i18n/routing";
import {
  Box,
  Card,
  Table,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";

import Iconify from "src/components/iconify";
import ConfirmationDialog from "src/components/dialog/ConfirmationDialog";
import { useToast } from "src/components/toast";
import { useAuth } from "src/contexts/AuthContext";
import { getOrders, getOrdersCatalog, closeOrder } from "src/actions/orders";
import type { Order, OrderCatalogItem } from "src/types/order";

export default function OrdersListView() {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const router = useRouter();
  const { role } = useAuth();
  const toast = useToast();
  const isRtl = locale === "ar";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<
    string | null
  >(null);
  const [selectedClassificationCode, setSelectedClassificationCode] = useState<
    string | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [catalog, setCatalog] = useState<OrderCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown Anchors
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [classificationAnchor, setClassificationAnchor] =
    useState<null | HTMLElement>(null);
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
        SkipCount: (page - 1) * rowsPerPage,
        MaxResultCount: rowsPerPage,
      });
      setIsLoading(false);
      if (res.success && res.data) {
        setOrders(res.data.items);
        setTotalCount(res.data.totalCount);
      }
    };
    fetchOrders();
  }, [
    debouncedSearch,
    selectedCategoryCode,
    selectedClassificationCode,
    selectedStatus,
    selectedDate,
    page,
    rowsPerPage,
  ]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const classifications = useMemo(() => {
    if (!selectedCategoryCode) return [];
    const cat = catalog.find((c) => c.code === selectedCategoryCode);
    return cat ? cat.classifications : [];
  }, [selectedCategoryCode, catalog]);

  // Checkbox Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(orders.map((o) => o.id));
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
    orders.length > 0 && selectedRows.length === orders.length;

  // Close Order Handler
  const handleCloseOrder = async () => {
    if (!closeTarget) return;
    const res = await closeOrder(closeTarget.id);
    setCloseTarget(null);
    if (res.success) {
      toast.success(t("dialog.success_close_order"));
      setOrders((prev) =>
        prev.map((o) =>
          o.id === closeTarget.id ? { ...o, status: "closed" } : o,
        ),
      );
    } else {
      toast.error(res.error || t("dialog.confirm_close_order"));
    }
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

      {/* Main Content Card (Filters + Table + Pagination) */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
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
              setPage(1);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      width={20}
                      sx={{ color: "text.disabled" }}
                    />
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
              startIcon={
                <Iconify icon="solar:filter-bold-duotone" width={16} />
              }
              endIcon={
                <Iconify icon="eva:arrow-ios-downward-fill" width={14} />
              }
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
                  setPage(1);
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
                    setPage(1);
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
              startIcon={
                <Iconify icon="solar:filter-bold-duotone" width={16} />
              }
              endIcon={
                <Iconify icon="eva:arrow-ios-downward-fill" width={14} />
              }
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
                  ? classifications.find(
                      (c) => c.code === selectedClassificationCode,
                    )?.nameAr
                  : classifications.find(
                      (c) => c.code === selectedClassificationCode,
                    )?.nameEn
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
                  setPage(1);
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
                    setPage(1);
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
              startIcon={
                <Iconify icon="solar:calendar-minimum-outline" width={16} />
              }
              endIcon={
                <Iconify icon="eva:arrow-ios-downward-fill" width={14} />
              }
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
                  setPage(1);
                }}
                selected={selectedDate === null}
              >
                {locale === "ar" ? "الكل" : "All"}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDate("2025-11-10");
                  setDateAnchor(null);
                  setPage(1);
                }}
                selected={selectedDate === "2025-11-10"}
              >
                2025-11-10
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedDate("2026-04-10");
                  setDateAnchor(null);
                  setPage(1);
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
              startIcon={
                <Iconify icon="solar:filter-bold-duotone" width={16} />
              }
              endIcon={
                <Iconify icon="eva:arrow-ios-downward-fill" width={14} />
              }
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
                  setPage(1);
                }}
                selected={selectedStatus === null}
              >
                {locale === "ar" ? "الكل" : "All"}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus("open");
                  setStatusAnchor(null);
                  setPage(1);
                }}
                selected={selectedStatus === "open"}
              >
                {t("status.open")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSelectedStatus("closed");
                  setStatusAnchor(null);
                  setPage(1);
                }}
                selected={selectedStatus === "closed"}
              >
                {t("status.closed")}
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Table Container */}
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: "#F9FAFB" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={isAllSelected}
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < orders.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{
                      color: "#C4CDD5",
                      "&.Mui-checked": { color: "#006838" },
                    }}
                  />
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{ fontWeight: 600, color: "#637381" }}
                >
                  {t("table.order_id")}
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{ fontWeight: 600, color: "#637381" }}
                >
                  {t("table.order_title")}
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{ fontWeight: 600, color: "#637381" }}
                >
                  {t("table.category")}
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{ fontWeight: 600, color: "#637381" }}
                >
                  {t("table.classification")}
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{ fontWeight: 600, color: "#637381" }}
                >
                  {t("table.delivery_date")}
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{ fontWeight: 600, color: "#637381" }}
                >
                  {t("table.creation_date")}
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{ fontWeight: 600, color: "#637381" }}
                >
                  {t("table.status")}
                </TableCell>
                <TableCell
                  align={isRtl ? "right" : "left"}
                  sx={{
                    fontWeight: 600,
                    color: "#637381",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {t("table.actions")}
                    <Tooltip title="Help info" arrow placement="top">
                      <span>
                        <Iconify
                          icon="solar:help-outline"
                          width={16}
                          sx={{ color: "text.disabled", cursor: "pointer" }}
                        />
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((row) => {
                const isSelected = selectedRows.includes(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isSelected}
                    sx={{
                      "&:hover": { bgcolor: "#F9FAFB" },
                      "&.Mui-selected": { bgcolor: "rgba(0, 104, 56, 0.04)" },
                      "&.Mui-selected:hover": {
                        bgcolor: "rgba(0, 104, 56, 0.08)",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={(e) =>
                          handleSelectRow(row.id, e.target.checked)
                        }
                        sx={{
                          color: "#C4CDD5",
                          "&.Mui-checked": { color: "#006838" },
                        }}
                      />
                    </TableCell>

                    <TableCell align={isRtl ? "right" : "left"}>
                      {row.orderNumber}
                    </TableCell>

                    <TableCell
                      align={isRtl ? "right" : "left"}
                      sx={{ fontWeight: 500 }}
                    >
                      {row.title}
                    </TableCell>

                    <TableCell align={isRtl ? "right" : "left"}>
                      {locale === "ar"
                        ? row.categoryNameAr
                        : row.categoryNameEn}
                    </TableCell>

                    <TableCell align={isRtl ? "right" : "left"}>
                      {locale === "ar"
                        ? row.classificationNameAr
                        : row.classificationNameEn}
                    </TableCell>

                    <TableCell align={isRtl ? "right" : "left"}>
                      {new Date(row.deliveryDate).toLocaleDateString(locale)}
                    </TableCell>

                    <TableCell align={isRtl ? "right" : "left"}>
                      {new Date(row.creationTime).toLocaleDateString(locale)}
                    </TableCell>

                    <TableCell align={isRtl ? "right" : "left"}>
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
                        {row.status === "open"
                          ? t("status.open")
                          : t("status.closed")}
                      </Box>
                    </TableCell>

                    <TableCell align={isRtl ? "right" : "left"}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          // gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => router.push(`/orders/${row.id}`)}
                          sx={{
                            border: "0 solid",
                            borderColor: "#DFE3E8",
                            color: "#637381",
                            borderRadius: "16px",
                            fontWeight: 600,
                            // px: 1.5,
                            // py: 0.5,
                            // gap: 1,
                            textTransform: "none",
                            "&:hover": {
                              borderColor: "#919EAB",
                              bgcolor: "#F4F6F8",
                            },
                          }}
                        >
                          <Iconify icon="solar:eye-bold" width={16} />
                          {/* {t("table.action_view")} */}
                        </Button>

                        {row.status === "open" && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setCloseTarget(row)}
                            sx={{
                              border: "0 solid",
                              borderColor: "rgba(255, 59, 48, 0.35)",
                              color: "#FF3B30",
                              borderRadius: "16px",
                              fontWeight: 600,
                              // px: 1.5,
                              // py: 0.5,
                              // gap: 1,
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "#FF3B30",
                                bgcolor: "rgba(255, 59, 48, 0.08)",
                              },
                            }}
                          >
                            <Iconify
                              icon="solar:lock-bold"
                              width={16}
                            />
                            {/* {t("table.action_close")} */}
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {orders.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {locale === "ar"
                        ? "لا توجد نتائج مطابقة"
                        : "No matching results found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Custom Pagination Row */}
        {totalCount > 0 && (
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isRtl ? "row-reverse" : "row",
              flexWrap: "wrap",
              gap: 2,
              borderTop: "1px solid #F4F6F8",
            }}
          >
            {/* Page buttons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #DFE3E8",
              }}
            >
              {/* Prev Button (points right in RTL, points left in LTR) */}
              <IconButton
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                sx={{
                  borderRadius: 0,
                  borderRight: isRtl ? "none" : "1px solid #DFE3E8",
                  borderLeft: isRtl ? "1px solid #DFE3E8" : "none",
                  p: 1,
                }}
              >
                <Iconify
                  icon={
                    isRtl
                      ? "eva:arrow-ios-forward-fill"
                      : "eva:arrow-ios-back-fill"
                  }
                  width={18}
                />
              </IconButton>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === page;
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    sx={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: 0,
                      color: isActive ? "#006838" : "#212B36",
                      fontWeight: isActive ? 700 : 500,
                      bgcolor: isActive
                        ? "rgba(0, 104, 56, 0.08)"
                        : "transparent",
                      borderRight: isRtl
                        ? index === totalPages - 1
                          ? "none"
                          : "1px solid #DFE3E8"
                        : "none",
                      borderLeft: isRtl
                        ? "none"
                        : index === totalPages - 1
                          ? "none"
                          : "1px solid #DFE3E8",
                      "&:hover": {
                        bgcolor: isActive
                          ? "rgba(0, 104, 56, 0.12)"
                          : "#F4F6F8",
                      },
                    }}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* Next Button (points left in RTL, points right in LTR) */}
              <IconButton
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                sx={{
                  borderRadius: 0,
                  p: 1,
                }}
              >
                <Iconify
                  icon={
                    isRtl
                      ? "eva:arrow-ios-back-fill"
                      : "eva:arrow-ios-forward-fill"
                  }
                  width={18}
                />
              </IconButton>
            </Box>

            {/* Showing Range */}
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {t("pagination.showing", {
                from: (page - 1) * rowsPerPage + 1,
                to: Math.min(page * rowsPerPage, totalCount),
                count: totalCount, // Matching the design count of 1000, or we can use filteredOrders.length
              })}
            </Typography>
          </Box>
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
