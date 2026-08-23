"use client";

import { useState } from "react";
import DeleteDialog from "src/components/dialog/delete";
import { useToast } from "src/components/toast";
import { useTranslations } from "next-intl";
import type { CreateSupportRequestInput, SupportPageView, SupportRequest } from "src/types/support";
import { MOCK_SUPPORT_REQUESTS } from "./mock-support-requests";
import SupportRequestForm from "./SupportRequestForm";
import SupportRequestList from "./SupportRequestList";

const DEMO_EMAIL = "buyer@example.com";

export default function SupportView() {
  const t = useTranslations("Support");
  const { success } = useToast();
  const [view, setView] = useState<SupportPageView>("list");
  const [requests, setRequests] = useState<SupportRequest[]>(MOCK_SUPPORT_REQUESTS);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = (input: CreateSupportRequestInput) => {
    const now = new Date();
    const nextNumber = String(464256 + requests.length);

    const nextRequest: SupportRequest = {
      id: now.getTime().toString(),
      requestNumber: nextNumber,
      email: input.email,
      details: input.details,
      status: "under_review",
      createdAt: now.toISOString(),
    };

    setRequests((prev) => [nextRequest, ...prev]);
    setView("list");
    success(t("created_success"));
  };

  const handleConfirmDelete = () => {
    if (!deleteId) {
      return;
    }

    setRequests((prev) => prev.filter((request) => request.id !== deleteId));
    setDeleteId(null);
    success(t("deleted_success"));
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
      <SupportRequestList
        requests={requests}
        onCreate={() => setView("create")}
        onDelete={setDeleteId}
      />
      <DeleteDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
