"use client";

import { useState } from "react";
import QuoteSuccessDialog from "./QuoteSuccessDialog";
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
    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#171717" }}>
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
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
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
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 4 }}
        sx={{ mb: 3, border: "1px solid #E0E0E0",
        borderRadius: "12px",
        p: { xs: 2, md: 3 }, }}
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
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 64, fontWeight: 700, fontSize: 13 }}>
                {t("actions")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>
                {t("details")}
              </TableCell>
              <TableCell sx={{ width: 140, fontWeight: 700, fontSize: 13 }}>
                {t("quantity")}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>{t("item")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {block.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.details}
                    placeholder={t("details_placeholder")}
                    onChange={(e) => updateItem(item.id, "details", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={item.quantity}
                    placeholder="0"
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.name}
                    placeholder={t("item_placeholder")}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={2}
        sx={{
          mt: 3,
          pt: 3,
          borderTop: "1px solid #EEEEEE",
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onDelete}
          disabled={!canDelete}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: RED,
            color: "#fff",
            borderRadius: "4px",
            gap: 1,
            px: 3,
            "&:hover": { bgcolor: RED_HOVER },
            "&.Mui-disabled": { bgcolor: RED, opacity: 0.5, color: "#fff" },
          }}
        >
          <DeleteIcon />
          {t("delete")}
        </Button>
        <GreenButton onClick={addItem}>{t("add")}</GreenButton>
      </Stack>
    </Paper>
  );
}

export default function CreateQuoteRequestView() {
  const t = useTranslations("CreateQuoteRequest");
  const toast = useToast();
  const router = useRouter();
  const [requests, setRequests] = useState<RequestBlock[]>([createBlock()]);
  const [showSuccess, setShowSuccess] = useState(false);

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
    setShowSuccess(true);
  };

  const handleGoToOrders = () => {
    setShowSuccess(false);
    router.push("/orders");
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
          sx={{
            bgcolor: GREEN,
            color: "#fff",
            borderRadius: "4px",
            px: 8,
            "&:hover": { bgcolor: GREEN_HOVER },
          }}
        >
          {t("send")}
        </Button>
      </Stack>

      <QuoteSuccessDialog
        open={showSuccess}
        onGoToOrders={handleGoToOrders}
      />
    </Box>
  );
}
