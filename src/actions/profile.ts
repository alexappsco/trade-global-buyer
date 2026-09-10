'use server';

import { getData, editData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiSingleResponse } from 'src/types/crud-types';
import type { MyInfo, UpdateMyInfoPayload } from 'src/types/auth';

function isNEXT_REDIRECT(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'digest' in error &&
    String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
  );
}

export async function getMyInfo(): Promise<ApiSingleResponse<MyInfo>> {
  try {
    const res = await getData<MyInfo>(endpoints.auth.myInfo);

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return {
      success: false,
      error: 'error' in res ? res.error : 'Failed to load profile',
    };
  } catch (error) {
    if (isNEXT_REDIRECT(error)) throw error;
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load profile',
    };
  }
}

export async function updateMyInfo(
  payload: UpdateMyInfoPayload
): Promise<ApiSingleResponse<MyInfo>> {
  try {
    const formData = new FormData();

    formData.append('Name', payload.name);
    formData.append('LegalCompanyName', payload.legalCompanyName);
    formData.append('PhoneNumber', payload.phoneNumber);
    formData.append('Email', payload.email);
    formData.append('Sector', payload.sector);
    formData.append('TaxNumber', payload.taxNumber);
    formData.append('CommercialRecord', payload.commercialRecord);
    formData.append('City', payload.city);
    formData.append('CompanyAddress', payload.companyAddress);

    if (payload.profileImage) {
      formData.append('ProfileImage', payload.profileImage);
    }

    if (payload.coverImage) {
      formData.append('CoverImage', payload.coverImage);
    }

    const res = await editData<MyInfo, FormData>(endpoints.auth.myInfo, 'PATCH', formData);

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return {
      success: false,
      error: 'error' in res ? res.error : 'Failed to update profile',
    };
  } catch (error) {
    if (isNEXT_REDIRECT(error)) throw error;
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}