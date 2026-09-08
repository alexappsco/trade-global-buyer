export type QuotationOfferStatus = "pending" | "accepted" | "declined" | "closed";

export interface QuotationOfferCounterparty {
  userId: string;
  legalCompanyName: string;
  city: string;
  companyAddress: string;
}

export interface QuotationOfferItem {
  id: string;
  orderItemId: string;
  name: string;
  quantity: number;
  details: string;
  unitPrice: number;
  itemTotal: number;
}

export interface QuotationOffer {
  id: string;
  orderId: string;
  orderNumber: number;
  orderTitle: string;
  orderStatus: "open" | "closed";
  categoryCode: string;
  categoryNameEn: string;
  categoryNameAr: string;
  classificationCode: string | null;
  classificationNameEn: string | null;
  classificationNameAr: string | null;
  deliveryDate: string;
  orderCreationTime: string;
  supplierUserId: string;
  deliveryFee: number;
  deliveryDurationDays: number;
  subtotal: number;
  tax: number;
  grandTotal: number;
  status: QuotationOfferStatus;
  submissionTime: string;
  lastModificationTime: string | null;
  counterparty: QuotationOfferCounterparty;
  items: QuotationOfferItem[];
}

export interface QuotationOfferListResponse {
  totalCount: number;
  items: QuotationOffer[];
}

export interface SubmitQuotationOfferItem {
  orderItemId: string;
  unitPrice: number;
}

export interface SubmitQuotationOfferRequest {
  deliveryFee: number;
  deliveryDurationDays: number;
  items: SubmitQuotationOfferItem[];
}
