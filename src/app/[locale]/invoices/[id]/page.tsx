import { getTranslations } from 'next-intl/server';
import InvoicesDetailsView from 'src/sections/invoices/invoices-details';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.InvoiceDetail' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function InvoiceDetailsPage({ params }: Props) {
  const { id } = await params;
  return <InvoicesDetailsView id={id} />;
}
