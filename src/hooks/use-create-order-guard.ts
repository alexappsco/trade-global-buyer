'use client';

import { useCallback } from 'react';
import { useRouter } from 'src/i18n/routing';
import { useAuth } from 'src/contexts/AuthContext';
import { useToast } from 'src/components/toast';
import { useTranslations } from 'next-intl';
import { paths } from 'src/routes/paths';

export interface CreateOrderParams {
  categoryCode?: string;
  categoryName?: string;
  categoryImg?: string;
  [key: string]: string | undefined;
}

/**
 * Centralized guard for navigating to the Create Order page.
 * If the user's profile is incomplete, shows a warning toast and directs them to the profile page instead.
 */
export function useCreateOrderGuard() {
  const router = useRouter();
  const { session } = useAuth();
  const toast = useToast();
  const tOrders = useTranslations('Orders');

  const navigateToCreateOrder = useCallback(
    (params?: CreateOrderParams) => {
      // 1. Incomplete profile check
      if (session && !session.profileCompleted) {
        toast.warning(tOrders('complete_profile_required'));
        router.push(paths.profile.view);
        return false;
      }

      // 2. Build URL if params are provided
      if (params && Object.keys(params).length > 0) {
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
        ) as Record<string, string>;
        const query = new URLSearchParams(cleanParams).toString();
        router.push(query ? `${paths.orders.create}?${query}` : paths.orders.create);
      } else {
        router.push(paths.orders.create);
      }
      return true;
    },
    [session, router, toast, tOrders]
  );

  return {
    navigateToCreateOrder,
    isProfileCompleted: session?.profileCompleted ?? false,
  };
}
