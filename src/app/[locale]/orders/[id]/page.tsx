import ConfirmOrderStatus from 'src/sections/orders/orders-details-view';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export const metadata = {
  title: 'تأكيد حالة الطلب',
};

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  return <ConfirmOrderStatus id={id} />;
}
