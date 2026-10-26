import type { Metadata } from 'next';
import { getStaticPage } from 'src/actions/pages';
import StaticPageView from 'src/sections/static-pages/static-page-view';

const SLUG = 'privacy-policy';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const res = await getStaticPage(SLUG);
  const isAr = locale === 'ar';
  const page = res.success ? res.data : null;
  const title = (isAr ? page?.titleAr : page?.titleEn) || (isAr ? 'سياسة الخصوصية' : 'Privacy Policy');
  const description =
    (isAr ? page?.contentAr : page?.contentEn) ||
    (isAr
      ? 'سياسة الخصوصية وحماية البيانات الشخصية والتجارية في منصة كوست فريك'
      : 'Privacy policy and data protection on COST FRQ platform');

  return {
    title: `${title} | COST FRQ`,
    description,
  };
}

export default async function PrivacyPolicyPage() {
  const res = await getStaticPage(SLUG);
  const initialData = res.success ? res.data : null;

  return <StaticPageView slug={SLUG} initialData={initialData} />;
}
