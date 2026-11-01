import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomePage from '@/sections/home/view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });

  return {
    title: `${t('title')} | Dashboard`,
    description: t('description'),
  };
}

export default function DashboardPage() {
  return <HomePage />;
}

