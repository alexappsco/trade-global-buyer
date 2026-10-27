import type { Metadata } from 'next';
import { getStaticPage } from 'src/actions/pages';
import StaticPageView from 'src/sections/static-pages/static-page-view';

const SLUG = 'platform-policy';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const res = await getStaticPage(SLUG);
  const isAr = locale === 'ar';
  const page = res.success ? res.data : null;
  const title = (isAr ? page?.titleAr : page?.titleEn) || (isAr ? 'سياسات المنصة' : 'Platform Policy');
  const description =
    (isAr ? page?.contentAr : page?.contentEn) ||
    (isAr
      ? 'سياسات وقواعد السلوك والنزاهة التنافسية في منصة كوست فريك'
      : 'Operational policies and competitive integrity code for COST FRQ');

  return {
    title: `${title} | COST FRQ`,
    description,
  };
}

export default async function PlatformPolicyPage() {
  const res = await getStaticPage(SLUG);
  const initialData = res.success ? res.data : null;

  return <StaticPageView slug={SLUG} initialData={initialData} />;
}
