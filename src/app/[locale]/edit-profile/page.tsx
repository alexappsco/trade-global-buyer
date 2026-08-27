import { getTranslations } from 'next-intl/server';
import EditProfile from '@/sections/profile/edit-profile';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.EditProfile' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function EditProfilePage() {
  return <EditProfile />;
}
