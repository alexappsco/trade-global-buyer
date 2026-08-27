import { getTranslations } from 'next-intl/server';
import SupportView from "src/sections/support/SupportView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Support' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Support() {
  return <SupportView />;
}
