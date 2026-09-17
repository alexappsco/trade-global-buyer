'use server';

import { getData, postData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiResponse } from 'src/types/crud-types';
import type { Order, OrderListResponse, OrderCatalogItem, CreateOrderRequest, CreateOrderResponse } from 'src/types/order';

export async function getOrdersCatalog(): Promise<ApiResponse<OrderCatalogItem[]>> {
  return await getData<OrderCatalogItem[]>(endpoints.orders.catalog);
}

export async function createOrder(
  payload: CreateOrderRequest
): Promise<ApiResponse<CreateOrderResponse>> {
  return await postData<CreateOrderResponse, CreateOrderRequest>(endpoints.orders.create, payload);
}

export async function getOrders(params?: {
  Search?: string;
  CategoryCode?: string;
  ClassificationCode?: string;
  Status?: string;
  Date?: string;
  Sorting?: string;
  SkipCount?: number;
  MaxResultCount?: number;
}): Promise<ApiResponse<OrderListResponse>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    });
  }
  
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await getData<OrderListResponse>(`${endpoints.orders.list}${queryString}`);
}

export async function getOrderDetails(id: string): Promise<ApiResponse<Order>> {
  return await getData<Order>(endpoints.orders.details(id));
}

export async function closeOrder(id: string): Promise<ApiResponse<Order>> {
  return await postData<Order, undefined>(endpoints.orders.close(id), undefined);
}

export async function confirmDelivery(id: string): Promise<ApiResponse<Order>> {
  return await postData<Order, undefined>(endpoints.orders.confirmDelivery(id), undefined);
}

export async function markDelivered(id: string): Promise<ApiResponse<Order>> {
  return await postData<Order, undefined>(endpoints.orders.markDelivered(id), undefined);
}

export async function downloadQuotationOffersPdf(
  orderId: string
): Promise<ApiResponse<{ base64: string }>> {
  const res = await getData<Blob>(endpoints.orders.quotationOffersPdf(orderId), {
    headers: { Accept: 'application/pdf' },
  });
  if (!res.success) {
    return res;
  }
  const buffer = Buffer.from(await res.data.arrayBuffer());
  return { success: true, data: { base64: buffer.toString('base64') }, message: 'Success', status: 200 };
}
