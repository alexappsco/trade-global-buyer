import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'src/i18n/routing';
import { getPublicSession } from 'src/actions/session';
import CreateQuoteRequestView from "@/sections/OrdersView/CreateQuoteRequestView";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.CreateOrder' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CreateQuoteRequest({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ categoryCode?: string; categoryName?: string; categoryImg?: string }>;
}) {
  const { locale } = await params;

  // ── Server-side guard: profile must be completed ──
  const session = await getPublicSession();
  if (session && !session.profileCompleted) {
    redirect({ href: '/profile', locale });
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  return (
    <Suspense fallback={null}>
      <CreateQuoteRequestView
        initialCategoryCode={resolvedSearchParams?.categoryCode}
        initialCategoryName={resolvedSearchParams?.categoryName}
        initialCategoryImg={resolvedSearchParams?.categoryImg}
      />
    </Suspense>
  );
}
