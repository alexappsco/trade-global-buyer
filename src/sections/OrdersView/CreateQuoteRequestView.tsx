"use client";

import { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import { useToast } from "src/components/toast";

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
  category: string;
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
  category: "",
  title: "",
  deliveryDate: "",
  items: [],
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
        borderRadius: "8px",
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

function InfoField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#6B7280" }}>
        {label}
      </Typography>
      <TextField
        size="small"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        sx={{
          bgcolor: "#fff",
          "& .MuiOutlinedInput-root": { borderRadius: "8px" },
        }}
      />
    </Stack>
  );
}

function RequestFormBlock({
  block,
  onChange,
  onDelete,
  canDelete,
}: {
  block: RequestBlock;
  onChange: (block: RequestBlock) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const t = useTranslations("CreateQuoteRequest");

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
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#fff",
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          px: 2,
          py: 2.5,
          mb: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        <InfoField
          label={t("category")}
          value={block.category}
          onChange={(v) => updateField("category", v)}
          placeholder={t("category_placeholder")}
        />
        <InfoField
          label={t("request_title")}
          value={block.title}
          onChange={(v) => updateField("title", v)}
          placeholder={t("title_placeholder")}
        />
        <InfoField
          label={t("delivery_date")}
          type="date"
          value={block.deliveryDate}
          onChange={(v) => updateField("deliveryDate", v)}
        />
      </Box>

      <TableContainer
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#F3F4F6" }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#374151",
                  "&:not(:last-child)": { borderInlineEnd: "1px solid #E5E7EB" },
                }}
              >
                {t("item")}
              </TableCell>
              <TableCell
                sx={{
                  width: 160,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#374151",
                  "&:not(:last-child)": { borderInlineEnd: "1px solid #E5E7EB" },
                }}
              >
                {t("quantity")}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#374151",
                  "&:not(:last-child)": { borderInlineEnd: "1px solid #E5E7EB" },
                }}
              >
                {t("details")}
              </TableCell>
              <TableCell
                sx={{
                  width: 72,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                {t("actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {block.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell
                  sx={{
                    py: 0.75,
                    "&:not(:last-child)": { borderInlineEnd: "1px solid #EEEEEE" },
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    value={item.name}
                    placeholder={t("item_placeholder")}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    py: 0.75,
                    "&:not(:last-child)": { borderInlineEnd: "1px solid #EEEEEE" },
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={item.quantity}
                    placeholder={t("quantity_placeholder")}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    py: 0.75,
                    "&:not(:last-child)": { borderInlineEnd: "1px solid #EEEEEE" },
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    value={item.details}
                    placeholder={t("details_placeholder")}
                    onChange={(e) => updateItem(item.id, "details", e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ py: 0.75 }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
        <GreenButton onClick={addItem}>{t("add")}</GreenButton>
        <Button
          onClick={onDelete}
          disabled={!canDelete}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: RED,
            color: "#fff",
            borderRadius: "8px",
            gap: 1,
            px: 3,
            "&:hover": { bgcolor: RED_HOVER },
            "&.Mui-disabled": { bgcolor: RED, opacity: 0.5, color: "#fff" },
          }}
        >
          <DeleteIcon />
          {t("delete")}
        </Button>
      </Stack>
    </Paper>
  );
}

export default function CreateQuoteRequestView() {
  const t = useTranslations("CreateQuoteRequest");
  const toast = useToast();
  const [requests, setRequests] = useState<RequestBlock[]>([createBlock()]);

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
    console.log("quote_requests", requests);
    toast.success(t("send_success"));
  };

  const handleCancel = () => {
    setRequests([createBlock()]);
    toast.info(t("cancel_success"));
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
          />
        ))}
      </Stack>

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={2}
        sx={{ mt: 4, alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        <Button
          onClick={handleCancel}
          variant="contained"
          size="medium"
          disableElevation
          sx={{
            bgcolor: RED,
            color: "#fff",
            borderRadius: "8px",
            px: 4,
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
          sx={{
            bgcolor: GREEN,
            color: "#fff",
            borderRadius: "8px",
            px: 4,
            "&:hover": { bgcolor: GREEN_HOVER },
          }}
        >
          {t("send")}
        </Button>
      </Stack>
    </Box>
  );
}
