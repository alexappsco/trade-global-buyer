import type { Metadata } from 'next';
import { getStaticPage } from 'src/actions/pages';
import StaticPageView from 'src/sections/static-pages/static-page-view';

const SLUG = 'terms-and-conditions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const res = await getStaticPage(SLUG);
  const isAr = locale === 'ar';
  const page = res.success ? res.data : null;
  const title = (isAr ? page?.titleAr : page?.titleEn) || (isAr ? 'الشروط والأحكام' : 'Terms and Conditions');
  const description =
    (isAr ? page?.contentAr : page?.contentEn) ||
    (isAr
      ? 'الشروط والأحكام والضوابط القانونية لاستخدام منصة كوست فريك'
      : 'Terms and conditions for using COST FRQ B2B platform');

  return {
    title: `${title} | COST FRQ`,
    description,
  };
}

export default async function TermsAndConditionsPage() {
  const res = await getStaticPage(SLUG);
  const initialData = res.success ? res.data : null;

  return <StaticPageView slug={SLUG} initialData={initialData} />;
}
