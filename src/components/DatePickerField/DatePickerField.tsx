"use client";

import React, { useMemo } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parseISO } from "date-fns";

// ----------------------------------------------------------------------

const ISO_FORMAT = "yyyy-MM-dd";
const DISPLAY_FORMAT = "dd/MM/yyyy";

export interface DatePickerFieldProps {
  /** ISO date string (`yyyy-MM-dd`) or empty string. */
  value: string;
  /** Returns the selected date as an ISO string (`yyyy-MM-dd`), or `""` when cleared. */
  onChange: (value: string) => void;
  error?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  sx?: SxProps<Theme>;
}

function DatePickerFieldComponent({
  value,
  onChange,
  error = false,
  fullWidth = true,
  size = "small",
  disabled,
  minDate,
  maxDate,
  sx,
}: DatePickerFieldProps) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;

  const parsedDate = useMemo(() => {
    if (!value) return null;
    try {
      const d = parseISO(value);
      return Number.isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  }, [value]);

  return (
    <DatePicker
      value={parsedDate}
      onChange={(date) =>
        onChange(date && !Number.isNaN(date.getTime()) ? format(date, ISO_FORMAT) : "")
      }
      format={DISPLAY_FORMAT}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      sx={sx}
      slotProps={{
        textField: {
          fullWidth,
          size,
          error,
          sx: {
            "& .MuiPickersOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: "background.paper",
              fontSize: "14px",
              color: "#111827",
            },
            "& .MuiPickersOutlinedInput-notchedOutline": {
              borderColor: "#CBD5E1",
              transition: "border-color 0.15s ease",
            },
            "& .MuiPickersOutlinedInput-root:hover .MuiPickersOutlinedInput-notchedOutline": {
              borderColor: "#94A3B8",
            },
            "& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
              borderColor: accent,
              borderWidth: "1.5px",
            },
            "& .MuiPickersInputBase-sectionsContainer": {
              py: "8px",
              color: value ? "#111827" : "#9CA3AF",
              fontWeight: value ? 500 : 400,
            },
            "& .MuiPickersSectionList-root": {
              color: value ? "#111827" : "#9CA3AF",
            },
          },
        },
        popper: {
          sx: {
            "& .MuiPickerPopper-paper": {
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.16)",
              overflow: "hidden",
            },
            "& .MuiPickersCalendarHeader-root": {
              px: 2,
              pt: 1.5,
              mb: 0.5,
              "& .MuiPickersCalendarHeader-label": {
                fontWeight: 700,
                color: "text.primary",
                fontSize: "15px",
              },
            },
            "& .MuiPickersArrowSwitcher-button": {
              color: accent,
              borderRadius: "8px",
              "&:hover": { bgcolor: alpha(accent, 0.08) },
            },
            "& .MuiDayCalendar-weekDayLabel": {
              color: "text.disabled",
              fontWeight: 600,
              fontSize: "12px",
            },
            "& .MuiPickerDay-root": {
              fontSize: "13.5px",
              fontWeight: 500,
              borderRadius: "10px",
              color: "text.secondary",
              "&:hover": { bgcolor: alpha(accent, 0.08) },
              "&.Mui-selected": {
                bgcolor: accent,
                color: theme.palette.primary.contrastText,
                fontWeight: 700,
                "&:hover, &:focus": { bgcolor: theme.palette.primary.dark },
              },
              "&.MuiPickerDay-today": {
                border: `1.5px solid ${accent}`,
                color: accent,
                fontWeight: 700,
                "&.Mui-selected": {
                  border: "none",
                  color: theme.palette.primary.contrastText,
                },
              },
            },
          },
        },
      }}
    />
  );
}

const DatePickerField = React.memo(DatePickerFieldComponent);
export default DatePickerField;
