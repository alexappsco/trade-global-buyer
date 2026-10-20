import type { NotificationType } from "src/types/notification";

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType | "default",
  { icon: string; bg: string; color: string }
> = {
  quotation_offer_received:      { icon: "solar:inbox-archive-bold-duotone",               bg: "#E3F2FD", color: "#1565C0" },
  quotation_offer_accepted:      { icon: "solar:check-circle-bold-duotone",                bg: "#E8F5E9", color: "#2E7D32" },
  quotation_offer_declined:      { icon: "solar:close-circle-bold-duotone",                bg: "#FFEBEE", color: "#C62828" },
  quotation_offer_auto_declined: { icon: "solar:clock-circle-bold-duotone",                bg: "#FFF3E0", color: "#E65100" },
  quotation_offer_closed:        { icon: "solar:lock-bold-duotone",                        bg: "#F3E5F5", color: "#6A1B9A" },
  support_status_changed:        { icon: "solar:headphones-round-sound-bold-duotone",      bg: "#E8EAF6", color: "#3949AB" },
  support_reply_added:           { icon: "solar:chat-round-dots-bold-duotone",             bg: "#E0F7FA", color: "#00695C" },
  default:                       { icon: "solar:bell-bold-duotone",                        bg: "#F5F5F5", color: "#616161" },
};

export function getNotificationTypeConfig(type: string) {
  return (
    NOTIFICATION_TYPE_CONFIG[type as NotificationType] ??
    NOTIFICATION_TYPE_CONFIG.default
  );
}

export function notificationTimeAgo(iso: string, locale: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return locale === "ar" ? "الآن" : "Just now";
  if (mins < 60) return locale === "ar" ? `منذ ${mins} د` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return locale === "ar" ? `منذ ${hrs} س` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return locale === "ar" ? `منذ ${days} أيام` : `${days}d ago`;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(
    new Date(iso)
  );
}
