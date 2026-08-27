import { getTranslations } from 'next-intl/server';
import CompleteProfileView from "@/sections/AuthView/CompleteProfileView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.CompleteProfile' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CompleteProfilePage() {
  return <CompleteProfileView />;
}
