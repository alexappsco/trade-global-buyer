export interface OrderItem {
  name: string;
  qty: number;
}

export interface OfferItem {
  id: string;
  supplier: string;
  address: string;
  total: number;
  totalWithTax: number;
  date: string;
  delivery: string;
  status: 'accepted' | 'rejected' | 'closed';
}

export interface Order {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  classification: string;
  deliveryDate: string;
  creationDate: string;
  status: 'open' | 'closed';
  items?: OrderItem[];
  offers?: OfferItem[];
}

export const DEFAULT_ITEMS: OrderItem[] = [
  { name: 'لابتوب', qty: 5 },
  { name: 'ماوس', qty: 7 },
  { name: 'كيبورد', qty: 4 },
];

export const DEFAULT_OFFERS: OfferItem[] = [
  {
    id: '1',
    supplier: 'مورد ١',
    address: 'الرياض',
    total: 5000,
    totalWithTax: 5200,
    date: '2025-11-10 09:30',
    delivery: 'مجاني',
    status: 'accepted',
  },
  {
    id: '2',
    supplier: 'مورد ٢',
    address: 'الرياض',
    total: 5000,
    totalWithTax: 5200,
    date: '2025-11-10 09:30',
    delivery: '50',
    status: 'rejected',
  },
  {
    id: '3',
    supplier: 'مورد ٣',
    address: 'الرياض',
    total: 5000,
    totalWithTax: 5200,
    date: '2025-11-10 09:30',
    delivery: 'مجاني',
    status: 'closed',
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '2654',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '2',
    orderNumber: '2',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'closed',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '3',
    orderNumber: '3',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '4',
    orderNumber: '4',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'closed',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '5',
    orderNumber: '5',
    title: 'طابعة ليزر ملونة',
    category: 'أجهزة كمبيوتر',
    classification: 'طابعات',
    deliveryDate: '2026-05-15',
    creationDate: '2025-11-12 10:15',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '6',
    orderNumber: '6',
    title: 'لوحة مفاتيح لاسلكية',
    category: 'ملحقات',
    classification: 'إكسسوارات',
    deliveryDate: '2026-04-20',
    creationDate: '2025-11-13 14:00',
    status: 'closed',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '7',
    orderNumber: '7',
    title: 'هاتف ذكي برو',
    category: 'هواتف وأجهزة لوحية',
    classification: 'هواتف ذكية',
    deliveryDate: '2026-06-01',
    creationDate: '2025-11-15 11:30',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '8',
    orderNumber: '8',
    title: 'سماعات بلوتوث',
    category: 'ملحقات',
    classification: 'صوتيات',
    deliveryDate: '2026-04-18',
    creationDate: '2025-11-16 16:45',
    status: 'closed',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '9',
    orderNumber: '9',
    title: 'ذاكرة تخزين خارجية 2 تيرابايت',
    category: 'أجهزة كمبيوتر',
    classification: 'وحدات تخزين',
    deliveryDate: '2026-04-30',
    creationDate: '2025-11-17 08:00',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '10',
    orderNumber: '10',
    title: 'شاحن سريع 65 واط',
    category: 'ملحقات',
    classification: 'شواحن',
    deliveryDate: '2026-04-12',
    creationDate: '2025-11-18 12:20',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '11',
    orderNumber: '11',
    title: 'جهاز لوحي للرسم',
    category: 'هواتف وأجهزة لوحية',
    classification: 'أجهزة لوحية',
    deliveryDate: '2026-05-10',
    creationDate: '2025-11-20 09:00',
    status: 'closed',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
  {
    id: '12',
    orderNumber: '12',
    title: 'فأرة ألعاب لاسلكية',
    category: 'ملحقات',
    classification: 'إكسسوارات',
    deliveryDate: '2026-04-25',
    creationDate: '2025-11-22 15:30',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  },
];

export const getOrderById = (id: string): Order => {
  const found = MOCK_ORDERS.find((o) => o.id === id);
  if (found) {
    return found;
  }
  // Fallback for custom testing IDs like 5432
  return {
    id: id,
    orderNumber: '2654',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    deliveryDate: '2026-04-10',
    creationDate: '2026-04-10',
    status: 'open',
    items: DEFAULT_ITEMS,
    offers: DEFAULT_OFFERS,
  };
};
