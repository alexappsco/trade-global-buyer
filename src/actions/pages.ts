'use server';

import { getData } from 'src/utils/crud-fetch-api';
import { endpoints } from 'src/utils/endpoints';
import type { ApiResponse } from 'src/types/crud-types';
import type { StaticPage } from 'src/types/pages';

export async function getStaticPage(slug: string): Promise<ApiResponse<StaticPage>> {
  return await getData<StaticPage>(endpoints.pages.bySlug(slug), {
    skipAuth: true,
  });
}
