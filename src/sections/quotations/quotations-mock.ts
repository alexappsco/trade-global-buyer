export interface QuotationRequest {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  classification: string;
  quantity: number;
  deliveryDate: string;
  creationDate: string;
  status: 'open' | 'closed';
  actionType: 'submit' | 'cannot_submit' | 'view_submitted';
}

export const MOCK_QUOTATION_REQUESTS: QuotationRequest[] = [
  {
    id: '1',
    orderNumber: '1',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'open',
    actionType: 'submit',
  },
  {
    id: '2',
    orderNumber: '2',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'closed',
    actionType: 'cannot_submit',
  },
  {
    id: '3',
    orderNumber: '3',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'open',
    actionType: 'view_submitted',
  },
  {
    id: '4',
    orderNumber: '4',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'closed',
    actionType: 'view_submitted',
  },
  {
    id: '5',
    orderNumber: '5',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'open',
    actionType: 'submit',
  },
  {
    id: '6',
    orderNumber: '6',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'open',
    actionType: 'view_submitted',
  },
  {
    id: '7',
    orderNumber: '7',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'closed',
    actionType: 'cannot_submit',
  },
];
