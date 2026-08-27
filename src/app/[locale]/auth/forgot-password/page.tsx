import { getTranslations } from 'next-intl/server';
import ForgotPasswordView from "@/sections/AuthView/ForgotPasswordView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.ForgotPassword' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
