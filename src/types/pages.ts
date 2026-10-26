export type StaticPageSlug =
  | 'about-us'
  | 'terms-and-conditions'
  | 'privacy-policy'
  | 'platform-policy';

export type StaticPage = {
  slug: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  lastModificationTime: string;
};
