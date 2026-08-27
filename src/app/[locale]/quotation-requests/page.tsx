import { getTranslations } from 'next-intl/server';
import QuotationsListView from 'src/sections/quotations/quotations-list-view';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.QuotationRequests' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function QuotationRequestsPage() {
  return <QuotationsListView />;
}
