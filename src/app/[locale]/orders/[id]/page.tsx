import { getTranslations } from 'next-intl/server';
import ConfirmOrderStatus from 'src/sections/orders/orders-details-view';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.OrderDetail' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  return <ConfirmOrderStatus id={id} />;
}
