'use server';

import { getData, postData, deleteData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiResponse } from 'src/types/crud-types';
import type {
  CreateSupportRequestInput,
  SupportRequest,
  SupportRequestListResponse,
} from 'src/types/support';

export async function getSupportRequests(params?: {
  search?: string;
  status?: string;
  sorting?: string;
  skipCount?: number;
  maxResultCount?: number;
}): Promise<ApiResponse<SupportRequestListResponse>> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value.toString());
      }
    });
  }
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await getData<SupportRequestListResponse>(
    `${endpoints.supportRequests.list}${queryString}`
  );
}

export async function createSupportRequest(
  input: CreateSupportRequestInput
): Promise<ApiResponse<SupportRequest>> {
  return await postData<SupportRequest, CreateSupportRequestInput>(
    endpoints.supportRequests.create,
    input
  );
}

export async function deleteSupportRequest(id: string): Promise<ApiResponse<SupportRequest>> {
  return await deleteData<SupportRequest>(endpoints.supportRequests.delete(id));
}