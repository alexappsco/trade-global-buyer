"use client";

import { Box, Button, Dialog, DialogContent, Typography, Stack } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface QuoteConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function QuoteConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: QuoteConfirmDialogProps) {

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        paper: {
          elevation: 0,
          sx: {
            borderRadius: "14px",
            width: "100%",
            maxWidth: 480,
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
        {/* Warning Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#FEF3C7", // Light yellow background
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <WarningAmberIcon
            sx={{
              fontSize: 36,
              color: "#D97706", // Dark amber/yellow
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
          أنت على وشك ارسال طلبات العروض
        </Typography>

        {/* Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 0.5, width: "100%" }}>
          <Button
            onClick={onCancel}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#E5E7EB",
              color: "#374151",
              borderRadius: "8px",
              py: 1,
              fontSize: 15,
              fontWeight: 600,
              "&:hover": { 
                borderColor: "#D1D5DB",
                bgcolor: "#F9FAFB" 
              },
            }}
          >
            إلغاء
          </Button>
          
          <Button
            onClick={onConfirm}
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              bgcolor: "#0F8259",
              color: "#fff",
              borderRadius: "8px",
              py: 1,
              fontSize: 15,
              fontWeight: 600,
              "&:hover": { bgcolor: "#0a6645" },
            }}
          >
            تأكيد
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
