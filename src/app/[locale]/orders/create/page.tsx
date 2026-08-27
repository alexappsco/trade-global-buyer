import { getTranslations } from 'next-intl/server';
import CreateQuoteRequestView from "@/sections/OrdersView/CreateQuoteRequestView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.CreateOrder' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CreateQuoteRequest() {
  return <CreateQuoteRequestView />;
}
