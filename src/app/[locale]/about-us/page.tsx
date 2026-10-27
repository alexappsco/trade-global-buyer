import type { Metadata } from 'next';
import { getStaticPage } from 'src/actions/pages';
import StaticPageView from 'src/sections/static-pages/static-page-view';

const SLUG = 'about-us';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const res = await getStaticPage(SLUG);
  const isAr = locale === 'ar';
  const page = res.success ? res.data : null;
  const title = (isAr ? page?.titleAr : page?.titleEn) || (isAr ? 'من نحن' : 'About Us');
  const description =
    (isAr ? page?.contentAr : page?.contentEn) ||
    (isAr
      ? 'تعرف على منصة كوست فريك الرائدة في سلاسل الإمداد والتوريد التجاري بالمملكة'
      : 'Learn about COST FRQ, the leading B2B procurement platform in Saudi Arabia');

  return {
    title: `${title} | COST FRQ`,
    description,
  };
}

export default async function AboutUsPage() {
  const res = await getStaticPage(SLUG);
  const initialData = res.success ? res.data : null;

  return <StaticPageView slug={SLUG} initialData={initialData} />;
}
