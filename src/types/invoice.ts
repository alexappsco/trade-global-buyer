export type InvoiceStatus = string;

export type InvoiceListItem = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: number;
  orderTitle: string;
  issuedAt: string;
  quotationGrandTotal: number;
  commissionRate: number;
  commissionAmount: number;
  currency: string;
  status: InvoiceStatus;
};

export type InvoiceListResponse = {
  items: InvoiceListItem[];
  totalCount: number;
};

export type InvoiceCompanySnapshot = {
  userId: string;
  legalCompanyName: string;
  taxNumber: string;
  city: string;
  companyAddress: string;
};

export type InvoiceItemSnapshot = {
  id: string;
  orderItemId: string;
  name: string;
  details: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
};

export type InvoiceDetail = InvoiceListItem & {
  quotationOfferId: string;
  categoryCode: string;
  categoryNameEn: string;
  categoryNameAr: string;
  classificationCode: string;
  classificationNameEn: string;
  classificationNameAr: string;
  deliveryDate: string;
  orderCreationTime: string;
  acceptedAt: string;
  supplierMarkedDeliveredAt: string;
  buyerConfirmedDeliveredAt: string;
  deliveryFee: number;
  quotationSubtotal: number;
  quotationTax: number;
  buyer: InvoiceCompanySnapshot;
  supplier: InvoiceCompanySnapshot;
  items: InvoiceItemSnapshot[];
};