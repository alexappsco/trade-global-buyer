"use client";

import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslations } from "next-intl";

interface QuoteSuccessDialogProps {
  open: boolean;
  onGoToOrders: () => void;
}

export default function QuoteSuccessDialog({
  open,
  onGoToOrders,
}: QuoteSuccessDialogProps) {
  const t = useTranslations("CreateQuoteRequest");

  return (
    <Dialog
      open={open}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        paper: {
          elevation: 0,
          sx: {
            borderRadius: "7px",
            width: "100%",
            maxWidth: 580,
            m: 2,
          },
        },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          px: 3,
          py: 4,
          gap: 2.5,
        }}
      >
        {/* Success Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#E6F4EA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckIcon
            sx={{
              fontSize: 36,
              color: "#0F8259",
            }}
          />
        </Box>

        {/* Message */}
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "#1F2937",
            lineHeight: 1.5,
          }}
        >
          {t("send_success")}
        </Typography>

        {/* CTA Button */}
        <Button
          onClick={onGoToOrders}
          variant="contained"
          disableElevation
          fullWidth
          sx={{
            mt: 0.5,
            bgcolor: "#0F8259",
            color: "#fff",
            borderRadius: "5px",
            py: 1,
            fontSize: 15,
            fontWeight: 600,
            "&:hover": { bgcolor: "#0a6645" },
          }}
        >
          {t("go_to_orders")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
