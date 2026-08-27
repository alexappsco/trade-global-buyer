import { getTranslations } from 'next-intl/server';
import OrdersListView from 'src/sections/orders/orders-list-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Orders' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Orders() {
  return <OrdersListView />;
}
