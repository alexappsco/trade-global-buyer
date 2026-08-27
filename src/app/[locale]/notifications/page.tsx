import { getTranslations } from 'next-intl/server';
import NotificationsView from "src/sections/notifications/NotificationsView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Notifications' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Notifications() {
  return <NotificationsView />;
}
