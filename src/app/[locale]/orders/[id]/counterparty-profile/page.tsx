import { getTranslations } from 'next-intl/server';
import CounterpartyProfileView from 'src/sections/profile/counterparty-view';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
  searchParams: Promise<{
    offerId?: string;
  }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.CounterpartyProfile' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CounterpartyProfilePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { offerId } = await searchParams;

  return <CounterpartyProfileView orderId={id} offerId={offerId} />;
}