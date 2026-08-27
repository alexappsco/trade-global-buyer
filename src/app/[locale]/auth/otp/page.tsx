import { getTranslations } from 'next-intl/server';
import OtpView from "@/sections/AuthView/OtpView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Otp' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function OtpPage() {
  return <OtpView />;
}
