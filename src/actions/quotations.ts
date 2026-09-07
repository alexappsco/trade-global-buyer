"use server";

import { getData, postData } from "src/utils/crud-fetch-api";
import { endpoints } from "src/utils/endpoints";
import type { ApiResponse } from "src/types/crud-types";
import type {
  QuotationOffer,
  QuotationOfferListResponse,
  SubmitQuotationOfferRequest,
} from "src/types/quotation";

export async function getQuotationOffers(params?: {
  search?: string;
  status?: string;
  orderId?: string;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}): Promise<ApiResponse<QuotationOfferListResponse>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value.toString());
      }
    });
  }
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return await getData<QuotationOfferListResponse>(
    `${endpoints.quotationOffers.list}${queryString}`
  );
}

export async function getOrderQuotationOffers(
  orderId: string,
  params?: {
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
  }
): Promise<ApiResponse<QuotationOfferListResponse>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value.toString());
      }
    });
  }
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return await getData<QuotationOfferListResponse>(
    `${endpoints.orders.quotationOffers(orderId)}${queryString}`
  );
}

export async function getQuotationOfferDetails(
  id: string
): Promise<ApiResponse<QuotationOffer>> {
  return await getData<QuotationOffer>(endpoints.quotationOffers.details(id));
}

export async function acceptQuotationOffer(
  id: string
): Promise<ApiResponse<QuotationOffer>> {
  return await postData<QuotationOffer, undefined>(
    endpoints.quotationOffers.accept(id),
    undefined
  );
}

export async function declineQuotationOffer(
  id: string
): Promise<ApiResponse<QuotationOffer>> {
  return await postData<QuotationOffer, undefined>(
    endpoints.quotationOffers.decline(id),
    undefined
  );
}

export async function submitQuotationOffer(
  orderId: string,
  payload: SubmitQuotationOfferRequest
): Promise<ApiResponse<QuotationOffer>> {
  return await postData<QuotationOffer, SubmitQuotationOfferRequest>(
    endpoints.quotationOffers.submit(orderId),
    payload
  );
}
