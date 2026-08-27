"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useTranslations } from "next-intl";
import type { CreateSupportRequestInput } from "src/types/support";

type SupportRequestFormProps = {
  defaultEmail: string;
  onCancel: () => void;
  onSubmit: (input: CreateSupportRequestInput) => void;
};

export default function SupportRequestForm({
  defaultEmail,
  onCancel,
  onSubmit,
}: SupportRequestFormProps) {
  const t = useTranslations("Support");
  const [showHint, setShowHint] = useState(true);
  const [email, setEmail] = useState(defaultEmail);
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<{ email?: string; details?: string }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: { email?: string; details?: string } = {};
    if (!email.trim()) {
      nextErrors.email = t("email_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = t("email_invalid");
    }

    if (!details.trim()) {
      nextErrors.details = t("details_required");
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({ email: email.trim(), details: details.trim() });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 2.5 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t("form_title")}
        </Typography>
        <Button
          type="button"
          variant="contained"
          color="primary"
          startIcon={<VisibilityOutlinedIcon  sx={{ fontSize: 20 }} />}
          onClick={onCancel}
          sx={{ fontWeight: 700, gap: 1, alignSelf: { xs: "flex-start", sm: "center" } }}
        >
          {t("view_requests")}
        </Button>
      </Stack>

      {showHint && (
        <Alert severity="warning" onClose={() => setShowHint(false)} sx={{ mb: 3 }}>
          {t("form_hint")}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          p: { xs: 2.5, md: 3 },
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label={t("email_label")}
            placeholder={t("email_placeholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            multiline
            minRows={6}
            label={t("details_label")}
            placeholder={t("details_placeholder")}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            error={Boolean(errors.details)}
            helperText={errors.details}
          />

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-start" }}>
            <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 120, fontWeight: 700 }}>
              {t("send")}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={onCancel}
              sx={{ minWidth: 120, fontWeight: 700 }}
            >
              {t("cancel")}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
