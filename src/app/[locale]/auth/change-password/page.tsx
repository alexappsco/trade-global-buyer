import { getTranslations } from 'next-intl/server';
import ChangePasswordView from "@/sections/AuthView/ChangePasswordView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.ChangePassword' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ChangePasswordPage() {
  return <ChangePasswordView />;
}
