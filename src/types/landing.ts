export type LandingHeroLocale = {
  title: string;
  description: string;
  verifiedSuppliersTitle: string;
  verifiedSuppliersDescription: string;
  successfulTradesValue: string;
  successfulTradesLabel: string;
};

export type LandingHeroResponse = {
  ar: LandingHeroLocale;
  en: LandingHeroLocale;
  lastModificationTime: string | null;
};
