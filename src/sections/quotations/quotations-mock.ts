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
  offerStatus?: 'accepted' | 'rejected' | 'closed' | 'pending';
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
    offerStatus: 'pending',
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
    offerStatus: 'pending', // Closed order - no offer submitted
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
    offerStatus: 'pending', // Open order - offer submitted (awaiting response)
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
    offerStatus: 'closed', // Closed order - offer submitted
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
    offerStatus: 'pending',
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
    offerStatus: 'accepted', // Accepted offer
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
    offerStatus: 'pending',
  },
  {
    id: '8',
    orderNumber: '8',
    title: 'شاشات كمبيوتر',
    category: 'أجهزة كمبيوتر',
    classification: 'شاشات',
    quantity: 10,
    deliveryDate: '2026-04-10',
    creationDate: '2025-11-10 09:30',
    status: 'closed',
    actionType: 'view_submitted',
    offerStatus: 'rejected', // Rejected offer
  },
];
