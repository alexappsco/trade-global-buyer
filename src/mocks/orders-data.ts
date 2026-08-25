export type OrderStatus = 'open' | 'closed';

export type Order = {
  id: string;
  title: string;
  category: string;
  classification: string;
  deliveryDate: string;
  createdAt: string;
  status: OrderStatus;
};

export const ordersMock: Order[] = [
  { id: '1001', title: 'شاشات كمبيوتر', category: 'أجهزة كمبيوتر', classification: 'شاشات', deliveryDate: '2026-04-10', createdAt: '2025-11-10 09:30', status: 'open' },
  { id: '1002', title: 'شاشات كمبيوتر', category: 'أجهزة كمبيوتر', classification: 'شاشات', deliveryDate: '2026-04-10', createdAt: '2025-11-10 09:30', status: 'closed' },
  { id: '1003', title: 'شاشات كمبيوتر', category: 'أجهزة كمبيوتر', classification: 'شاشات', deliveryDate: '2026-04-10', createdAt: '2025-11-10 09:30', status: 'open' },
  { id: '1004', title: 'شاشات كمبيوتر', category: 'أجهزة كمبيوتر', classification: 'شاشات', deliveryDate: '2026-04-10', createdAt: '2025-11-10 09:30', status: 'closed' },
  { id: '1005', title: 'لوحة مفاتيح لاسلكية', category: 'أجهزة كمبيوتر', classification: 'ملحقات', deliveryDate: '2026-05-01', createdAt: '2025-12-01 14:00', status: 'open' },
  { id: '1006', title: 'طابعة ليزر', category: 'طابعات', classification: 'طابعات أحبار', deliveryDate: '2026-05-15', createdAt: '2025-12-05 11:20', status: 'open' },
  { id: '1007', title: 'سيرفر تخزين', category: 'شبكات', classification: 'سيرفرات', deliveryDate: '2026-06-01', createdAt: '2026-01-10 08:45', status: 'closed' },
  { id: '1008', title: 'جهاز عرض', category: 'أجهزة كمبيوتر', classification: 'شاشات', deliveryDate: '2026-06-10', createdAt: '2026-01-15 16:00', status: 'open' },
];
