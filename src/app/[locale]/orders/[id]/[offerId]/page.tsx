import OrdersOfferDetailsView from 'src/sections/orders/orders-offer-details-view';

type Props = {
  params: Promise<{
    id: string;
    offerId: string;
    locale: string;
  }>;
};

export default async function OfferDetailsPage({ params }: Props) {
  const { id, offerId } = await params;
  return <OrdersOfferDetailsView id={id} offerId={offerId} />;
}
