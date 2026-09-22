import { getTranslations } from 'next-intl/server';
import CounterpartyProfileView from 'src/sections/profile/counterparty-view';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
  searchParams: Promise<{
    offerId?: string;
    from?: string;
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { locale } = await params;
  const { from } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Metadata.CounterpartyProfile' });

  const isSupplier = from === 'supplier';

  return {
    title: isSupplier ? t('buyerTitle') : t('supplierTitle'),
    description: isSupplier ? t('buyerDescription') : t('supplierDescription'),
  };
}

export default async function CounterpartyProfilePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { offerId, from } = await searchParams;

  return (
    <CounterpartyProfileView
      orderId={id}
      offerId={offerId}
      from={from === 'supplier' ? 'supplier' : 'buyer'}
    />
  );
}