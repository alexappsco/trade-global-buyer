export interface Invoice {
  id: string;
  invoiceNumber: string;
  transactionTitle: string;
  orderId: number;
  orderNumber: string;
  registeredAt: string;
  amountPaid: number;
  status: "paid" | "unpaid";
}

export function getInvoiceById(id: string): Invoice | undefined {
  return MOCK_INVOICES.find((invoice) => invoice.id === id);
}

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "2026061500014785",
    transactionTitle: "عمولة طلب رقم 1545",
    orderId: 1545,
    orderNumber: "12654",
    registeredAt: "2025-11-10 09:30",
    amountPaid: 5200,
    status: "paid",
  },
  {
    id: "inv-2",
    invoiceNumber: "2026061500014786",
    transactionTitle: "عمولة طلب رقم 1548",
    orderId: 1548,
    orderNumber: "12658",
    registeredAt: "2025-11-12 14:05",
    amountPaid: 3100,
    status: "unpaid",
  },
  {
    id: "inv-3",
    invoiceNumber: "2026061500014787",
    transactionTitle: "عمولة طلب رقم 1552",
    orderId: 1552,
    orderNumber: "12663",
    registeredAt: "2025-11-15 11:20",
    amountPaid: 7450,
    status: "paid",
  },
  {
    id: "inv-4",
    invoiceNumber: "2026061500014788",
    transactionTitle: "عمولة طلب رقم 1560",
    orderId: 1560,
    orderNumber: "12670",
    registeredAt: "2025-11-18 16:45",
    amountPaid: 1280,
    status: "paid",
  },
  {
    id: "inv-5",
    invoiceNumber: "2026061500014789",
    transactionTitle: "عمولة طلب رقم 1571",
    orderId: 1571,
    orderNumber: "12681",
    registeredAt: "2025-11-21 08:10",
    amountPaid: 9300,
    status: "unpaid",
  },
  {
    id: "inv-6",
    invoiceNumber: "2026061500014790",
    transactionTitle: "عمولة طلب رقم 1583",
    orderId: 1583,
    orderNumber: "12694",
    registeredAt: "2025-11-24 13:55",
    amountPaid: 2650,
    status: "paid",
  },
  {
    id: "inv-7",
    invoiceNumber: "2026061500014791",
    transactionTitle: "عمولة طلب رقم 1590",
    orderId: 1590,
    orderNumber: "12702",
    registeredAt: "2025-11-27 10:40",
    amountPaid: 4800,
    status: "paid",
  },
  {
    id: "inv-8",
    invoiceNumber: "2026061500014792",
    transactionTitle: "عمولة طلب رقم 1602",
    orderId: 1602,
    orderNumber: "12715",
    registeredAt: "2025-12-01 09:00",
    amountPaid: 15200,
    status: "unpaid",
  },
  {
    id: "inv-9",
    invoiceNumber: "2026061500014793",
    transactionTitle: "عمولة طلب رقم 1615",
    orderId: 1615,
    orderNumber: "12729",
    registeredAt: "2025-12-04 17:25",
    amountPaid: 3975,
    status: "paid",
  },
  {
    id: "inv-10",
    invoiceNumber: "2026061500014794",
    transactionTitle: "عمولة طلب رقم 1628",
    orderId: 1628,
    orderNumber: "12744",
    registeredAt: "2025-12-08 12:15",
    amountPaid: 6100,
    status: "paid",
  },
  {
    id: "inv-11",
    invoiceNumber: "2026061500014795",
    transactionTitle: "عمولة طلب رقم 1633",
    orderId: 1633,
    orderNumber: "12750",
    registeredAt: "2025-12-11 15:35",
    amountPaid: 2250,
    status: "unpaid",
  },
  {
    id: "inv-12",
    invoiceNumber: "2026061500014796",
    transactionTitle: "عمولة طلب رقم 1647",
    orderId: 1647,
    orderNumber: "12766",
    registeredAt: "2025-12-15 08:50",
    amountPaid: 8340,
    status: "paid",
  },
];
