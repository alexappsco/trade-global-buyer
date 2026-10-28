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

export type LandingPartnerItem = {
  id: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  displayOrder: number;
};

export type LandingPartnersResponse = {
  items: LandingPartnerItem[];
  isActive: boolean;
};
