'use server';

import { getData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiSingleResponse } from 'src/types/crud-types';
import type { LandingHeroResponse } from 'src/types/landing';

export async function getLandingHero(): Promise<ApiSingleResponse<LandingHeroResponse>> {
  try {
    const res = await getData<LandingHeroResponse>(endpoints.landing.hero, { skipAuth: true });
    if (res.success) {
      return { success: true, data: res.data };
    }
    return { success: false, error: 'error' in res ? (res as { error: string }).error : 'Failed to load hero data' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to load hero data' };
  }
}
