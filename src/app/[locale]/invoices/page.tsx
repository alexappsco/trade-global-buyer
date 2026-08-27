import { getTranslations } from 'next-intl/server';
import InvoicesListView from "src/sections/invoices/invoices-list-view";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Invoices' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function Invoices() {
  return <InvoicesListView />;
}
