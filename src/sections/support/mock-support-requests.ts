import type { SupportRequest } from "src/types/support";

export const MOCK_SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: "1",
    requestNumber: "464253",
    email: "buyer@example.com",
    details:
      "لم أستطع إتمام عملية الدفع على طلب رقم 8821، تظهر رسالة خطأ بعد اختيار طريقة التحويل البنكي.",
    status: "under_review",
    createdAt: "2026-02-28T09:30:00.000Z",
  },
  {
    id: "2",
    requestNumber: "464254",
    email: "buyer@example.com",
    details: "أحتاج تحديث بيانات الشحن للمستودع الجديد في جدة قبل اعتماد الطلب القادم.",
    status: "in_progress",
    createdAt: "2026-03-02T14:15:00.000Z",
  },
  {
    id: "3",
    requestNumber: "464255",
    email: "ops.buyer@example.com",
    details: "تم استلام الشحنة ناقصة قطعة واحدة مقارنة بالفاتورة المرفقة.",
    status: "resolved",
    createdAt: "2026-03-10T11:05:00.000Z",
  },
];
