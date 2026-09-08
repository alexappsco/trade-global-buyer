import { getTranslations } from 'next-intl/server';
import OrdersOfferDetailsView from 'src/sections/orders/orders-offer-details-view';
import OrdersOfferSupplierView from 'src/sections/orders/orders-offer-supplier-view';

type Props = {
  params: Promise<{
    id: string;
    offerId: string;
    locale: string;
  }>;
  searchParams: Promise<{
    role?: string;
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

export default async function OfferDetailsPage({ params, searchParams }: Props) {
  const { id, offerId } = await params;
  const { role } = await searchParams;

  if (role === 'supplier') {
    return <OrdersOfferSupplierView id={id} offerId={offerId} />;
  }

  return <OrdersOfferDetailsView id={id} offerId={offerId} />;
}