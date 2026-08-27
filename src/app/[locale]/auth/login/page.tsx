import { getTranslations } from 'next-intl/server';
import SignInView from "@/sections/AuthView/SignInView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Login' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function LoginPage() {
  return <SignInView />;
}
