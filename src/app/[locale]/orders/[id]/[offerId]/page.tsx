import { getTranslations } from 'next-intl/server';
import OrdersOfferDetailsView from 'src/sections/orders/orders-offer-details-view';

type Props = {
  params: Promise<{
    id: string;
    offerId: string;
    locale: string;
  }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.OrderOffer' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function OfferDetailsPage({ params }: Props) {
  const { id, offerId } = await params;
  return <OrdersOfferDetailsView id={id} offerId={offerId} />;
}
