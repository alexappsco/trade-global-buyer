'use server';

import { getData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiSingleResponse } from 'src/types/crud-types';
import type { DashboardMetrics } from 'src/types/dashboard';

function isNEXT_REDIRECT(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'digest' in error &&
    String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
  );
}

export async function getDashboardMetrics(): Promise<ApiSingleResponse<DashboardMetrics>> {
  try {
    const res = await getData<DashboardMetrics>(endpoints.dashboard.metrics);

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return {
      success: false,
      error: 'error' in res ? res.error : 'Failed to load dashboard metrics',
    };
  } catch (error) {
    if (isNEXT_REDIRECT(error)) throw error;
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load dashboard metrics',
    };
  }
}