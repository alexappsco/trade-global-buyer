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
