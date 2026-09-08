"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import DeleteDialog from "src/components/dialog/delete";
import { useToast } from "src/components/toast";
import { useTranslations } from "next-intl";
import type { CreateSupportRequestInput, SupportPageView, SupportRequest } from "src/types/support";
import {
  getSupportRequests,
  createSupportRequest,
  deleteSupportRequest,
} from "src/actions/support";
import SupportRequestForm from "./SupportRequestForm";
import SupportRequestList from "./SupportRequestList";

const DEMO_EMAIL = "buyer@example.com";

export default function SupportView() {
  const t = useTranslations("Support");
  const toast = useToast();
  const [view, setView] = useState<SupportPageView>("list");
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      const res = await getSupportRequests({
        sorting: "createdAt desc",
        skipCount: 0,
        maxResultCount: 1000,
      });
      if (!res.success) {
        toast.error(res.error);
        setIsLoading(false);
        return;
      }
      setRequests(res.data.items || []);
      setIsLoading(false);
    };
    fetchRequests();
  }, []);

  const handleCreate = async (input: CreateSupportRequestInput) => {
    const res = await createSupportRequest(input);
    if (!res.success) {
      toast.error(res.error || t("submit_error"));
      return;
    }
    setRequests((prev) => [res.data, ...prev]);
    setView("list");
    toast.success(t("created_success"));
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) {
      return;
    }
    setIsDeleting(true);
    const res = await deleteSupportRequest(deleteId);
    setIsDeleting(false);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    setRequests((prev) => prev.filter((request) => request.id !== deleteId));
    setDeleteId(null);
    toast.success(t("deleted_success"));
  };

  if (view === "create") {
    return (
      <SupportRequestForm
        defaultEmail={DEMO_EMAIL}
        onCancel={() => setView("list")}
        onSubmit={handleCreate}
      />
    );
  }

  return (
    <>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("loading")}
          </Typography>
        </Box>
      ) : (
        <SupportRequestList
          requests={requests}
          onCreate={() => setView("create")}
          onDelete={setDeleteId}
        />
      )}
      <DeleteDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </>
  );
}