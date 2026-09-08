export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  details: string;
};

export type Order = {
  id: string;
  orderNumber: number;
  categoryCode: string;
  categoryNameEn: string;
  categoryNameAr: string;
  classificationCode: string;
  classificationNameEn: string;
  classificationNameAr: string;
  title: string;
  deliveryDate: string; // datetime string
  status: string;
  creationTime: string; // datetime string
  lastModificationTime: string; // datetime string
  offerCount: number;
  myQuotationId: string | null;
  myQuotationStatus: string | null;
  quotationActionState: string | null;
  canSubmitQuotation: boolean;
  hasSubmittedQuotation: boolean;
  isOwnOrder: boolean;
  isOrderClosed: boolean;
  items: OrderItem[];
};

export type OrderListResponse = {
  items: Order[];
  totalCount: number;
};

export type OrderClassification = {
  code: string;
  nameEn: string;
  nameAr: string;
};

export type OrderCatalogItem = {
  code: string;
  nameEn: string;
  nameAr: string;
  classifications: OrderClassification[];
};

export type CreateOrderItemRequest = {
  name: string;
  quantity: number;
  details: string;
};

export type CreateOrderRequestItem = {
  categoryCode: string;
  classificationCode: string;
  title: string;
  deliveryDate: string; // "YYYY-MM-DD"
  items: CreateOrderItemRequest[];
};

export type CreateOrderRequest = {
  orders: CreateOrderRequestItem[];
};

export type CreateOrderResponse = {
  orders: Order[];
};
