'use client';

import { useLocale } from 'next-intl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ar, enUS } from 'date-fns/locale';

// ----------------------------------------------------------------------

export default function AppLocalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={locale === 'ar' ? ar : enUS}
    >
      {children}
    </LocalizationProvider>
  );
}
