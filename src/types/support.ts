export type SupportRequestStatus =
  | "under_review"
  | "in_progress"
  | "resolved"
  | "closed";

export interface SupportReply {
  id: string;
  adminUserId: string;
  adminName: string;
  message: string;
  createdAt: string;
}

export interface SupportRequest {
  id: string;
  requestNumber: number;
  userId: string;
  email: string;
  details: string;
  status: SupportRequestStatus;
  createdAt: string;
  lastModifiedAt: string | null;
  replies: SupportReply[];
}

export interface SupportRequestListResponse {
  totalCount: number;
  items: SupportRequest[];
}

export interface CreateSupportRequestInput {
  email: string;
  details: string;
}

export interface SupportRequestFilters {
  search: string;
  status: SupportRequestStatus | "all";
}

export type SupportPageView = "list" | "create";