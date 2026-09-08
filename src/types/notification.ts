export type NotificationType =
  | 'quotation_offer_received'
  | 'quotation_offer_accepted'
  | 'quotation_offer_declined'
  | 'quotation_offer_auto_declined'
  | 'quotation_offer_closed'
  | 'support_status_changed'
  | 'support_reply_added';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
  actorUserId: string;
  orderId: string | null;
  quotationOfferId: string | null;
  supportRequestId: string | null;
}

export interface NotificationListResponse {
  totalCount: number;
  items: AppNotification[];
}

export interface NotificationUnreadCount {
  unreadCount: number;
}