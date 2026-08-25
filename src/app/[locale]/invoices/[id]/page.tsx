import InvoicesDetailsView from 'src/sections/invoices/invoices-details';

type Props = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
};

export default async function InvoiceDetailsPage({ params }: Props) {
  const { id } = await params;
  return <InvoicesDetailsView id={id} />;
}
