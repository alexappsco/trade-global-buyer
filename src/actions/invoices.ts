'use server';

import { getData, postData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiResponse } from 'src/types/crud-types';
import type { InvoiceDetail, InvoiceListResponse } from 'src/types/invoice';

export async function getInvoices(params?: {
  search?: string;
  status?: string;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}): Promise<ApiResponse<InvoiceListResponse>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value.toString());
      }
    });
  }
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await getData<InvoiceListResponse>(`${endpoints.invoices.list}${queryString}`);
}

export async function getInvoiceDetails(id: string): Promise<ApiResponse<InvoiceDetail>> {
  return await getData<InvoiceDetail>(endpoints.invoices.details(id));
}

export async function downloadInvoicePdf(id: string): Promise<ApiResponse<{ base64: string }>> {
  const res = await getData<Blob>(endpoints.invoices.pdf(id), {
    headers: { Accept: 'application/pdf' },
  });
  if (!res.success) {
    return res;
  }
  const buffer = Buffer.from(await res.data.arrayBuffer());
  return { success: true, data: { base64: buffer.toString('base64') }, message: 'Success', status: 200 };
}

export async function uploadInvoicePaymentProof(
  id: string,
  file: File
): Promise<ApiResponse<InvoiceDetail>> {
  const formData = new FormData();
  formData.append('PaymentProof', file);
  return await postData<InvoiceDetail, FormData>(endpoints.invoices.paymentProof(id), formData);
}

export async function downloadInvoicePaymentProof(
  id: string
): Promise<ApiResponse<{ base64: string; contentType: string }>> {
  const res = await getData<Blob>(endpoints.invoices.paymentProof(id), {
    headers: { Accept: 'image/jpeg' },
  });
  if (!res.success) {
    return res;
  }
  const buffer = Buffer.from(await res.data.arrayBuffer());
  return {
    success: true,
    data: { base64: buffer.toString('base64'), contentType: res.data.type || 'image/png' },
    message: 'Success',
    status: 200,
  };
}