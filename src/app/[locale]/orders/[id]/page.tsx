import OrdersDetailsView from 'src/sections/orders/orders-details-view';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  return <OrdersDetailsView id={id} />;
}
