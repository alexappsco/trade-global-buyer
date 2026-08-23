import type { AppNotification } from "src/types/notification";

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    message:
      "تم استلام عرض سعر جديد : أرسل أحد الموردين عرض سعر جديد على طلبك 'أجهزة لابتوب للشركة'.",
    createdAt: "2023-03-01T10:00:00.000Z",
    avatarUrl: null,
    isRead: false,
  },
  {
    id: "2",
    message: "تم تحديث حالة طلبك رقم 8821 إلى قيد التنفيذ.",
    createdAt: "2023-03-02T08:30:00.000Z",
    avatarUrl: null,
    isRead: false,
  },
  {
    id: "3",
    message: "تم قبول عرض السعر الخاص بطلب 'مستلزمات مكتبية' ويمكنك متابعة إجراءات الشحن.",
    createdAt: "2023-03-05T14:20:00.000Z",
    avatarUrl: null,
    isRead: true,
  },
  {
    id: "4",
    message: "رسالة جديدة من الدعم الفني بخصوص طلبك رقم 464253.",
    createdAt: "2023-03-08T11:45:00.000Z",
    avatarUrl: null,
    isRead: false,
  },
];
