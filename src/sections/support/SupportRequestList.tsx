"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useTranslations } from "next-intl";
import EmptyContent from "src/components/empty-content";
import type { SupportRequest, SupportRequestFilters, SupportRequestStatus } from "src/types/support";
import SupportRequestCard from "./SupportRequestCard";

const STATUS_OPTIONS: Array<SupportRequestFilters["status"]> = [
  "all",
  "under_review",
  "in_progress",
  "resolved",
  "closed",
];

type SupportRequestListProps = {
  requests: SupportRequest[];
  onCreate: () => void;
  onDelete: (id: string) => void;
};

export default function SupportRequestList({
  requests,
  onCreate,
  onDelete,
}: SupportRequestListProps) {
  const t = useTranslations("Support");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SupportRequestFilters["status"]>("all");
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus = status === "all" || request.status === status;
      const matchesSearch =
        !query ||
        request.requestNumber.toLowerCase().includes(query) ||
        request.details.toLowerCase().includes(query) ||
        request.email.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [requests, search, status]);

  const handleSelectStatus = (value: SupportRequestFilters["status"]) => {
    setStatus(value);
    setFilterAnchor(null);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ alignItems: { md: "center" }, justifyContent: "space-between", mb: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t("requests_title")}
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", md: "auto" } }}>
          <TextField
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("search")}
            sx={{ minWidth: { sm: 260 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListRoundedIcon />}
            onClick={(event) => setFilterAnchor(event.currentTarget)}
            sx={{ fontWeight: 700 ,gap: 1}}
          >
            {t("filter")}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={onCreate}
            sx={{ fontWeight: 700,gap: 1 }}
          >
            {t("create_request")}
          </Button>
        </Stack>
      </Stack>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            selected={status === option}
            onClick={() => handleSelectStatus(option)}
          >
            {option === "all" ? t("all_statuses") : t(`status.${option as SupportRequestStatus}`)}
          </MenuItem>
        ))}
      </Menu>

      <Stack spacing={2.5}>
        {filteredRequests.length === 0 ? (
          <EmptyContent title={t("empty")} sx={{ py: 8 }} />
        ) : (
          filteredRequests.map((request) => (
            <SupportRequestCard key={request.id} request={request} onDelete={onDelete} />
          ))
        )}
      </Stack>
    </Box>
  );
}
