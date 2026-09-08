import { getTranslations } from 'next-intl/server';
import OrdersOfferCreateView from 'src/sections/orders/orders-offer-create-view';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.SubmitOffer' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function OrderOfferCreatePage({ params }: Props) {
  const { id } = await params;
  return <OrdersOfferCreateView id={id} />;
}