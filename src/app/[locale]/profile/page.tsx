import { getTranslations } from 'next-intl/server';
import ProfileView from "@/sections/profile/view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Profile' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Profile() {
  return <ProfileView/>
}
