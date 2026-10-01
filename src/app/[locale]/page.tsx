import { getTranslations } from 'next-intl/server';
import HomePage from '@/sections/home/view';
import LandingView from '@/sections/landing/view';
import { getAuthSession } from 'src/actions/session';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Home() {
  const session = await getAuthSession();

  if (!session) {
    return <LandingView />;
  }

  return <HomePage />;
}