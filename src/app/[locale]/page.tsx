import { getTranslations } from 'next-intl/server';
import LandingView from '@/sections/landing/view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Home() {
  return <LandingView />;
}
