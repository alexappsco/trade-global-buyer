import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStaticPage } from 'src/actions/pages';
import StaticPageView from 'src/sections/static-pages/static-page-view';

const VALID_SLUGS = [
  'about-us',
  'terms-and-conditions',
  'privacy-policy',
  'platform-policy',
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const res = await getStaticPage(slug);
  const isAr = locale === 'ar';
  const page = res.success ? res.data : null;
  const title = (isAr ? page?.titleAr : page?.titleEn) || slug;
  const description = (isAr ? page?.contentAr : page?.contentEn) || `${title} - COST FRQ`;

  return {
    title: `${title} | COST FRQ`,
    description,
  };
}

export default async function GenericStaticPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const res = await getStaticPage(slug);
  const initialData = res.success ? res.data : null;

  return <StaticPageView slug={slug} initialData={initialData} />;
}
