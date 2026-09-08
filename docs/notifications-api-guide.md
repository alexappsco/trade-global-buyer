# Notifications API Guide

This API provides persisted, non-real-time in-app notifications for authenticated Buyer and Supplier accounts. Notifications are created by quotation-offer and support-request workflows and are scoped to the receiving user.

All routes require:

```http
Authorization: Bearer <access-token>
Accept-Language: en
```

Use `Accept-Language: ar` to receive Arabic message text. Event facts are stored independently from the rendered text, so changing the request language changes `message` without creating another notification. Unsupported cultures fall back to English.

## Notification events

| Type | Recipient | Trigger |
| --- | --- | --- |
| `quotation_offer_received` | Buyer order owner | A Supplier submits an offer |
| `quotation_offer_accepted` | Selected Supplier | The Buyer order owner accepts the offer |
| `quotation_offer_declined` | Supplier | The Buyer order owner explicitly declines the offer |
| `quotation_offer_auto_declined` | Competing Suppliers | Another offer is accepted |
| `quotation_offer_closed` | Suppliers with pending offers | The Buyer order owner manually closes the order |
| `support_status_changed` | Support-request owner | An Admin changes the request status |
| `support_reply_added` | Support-request owner | An Admin adds a reply |

Failed operations, repeated order closure, and support updates that keep the same status do not create notifications. When a workflow changes multiple offers, each affected Supplier receives their own notification. Creation is committed or rolled back with the triggering workflow.

## List notifications

```http
GET /api/v1/notifications?skipCount=0&maxResultCount=10
```

Notifications are returned newest first in ABP's paged result format:

```json
{
  "totalCount": 1,
  "items": [
    {
      "id": "b7f49620-c20a-4d28-b174-b35158976d22",
      "type": "quotation_offer_received",
      "message": "A new quotation offer was submitted for order #1001 'Office laptops'.",
      "createdAt": "2026-09-07T09:00:00Z",
      "isRead": false,
      "readAt": null,
      "actorUserId": "aa019137-f7c7-4b8f-8a6e-7d2020ca5c99",
      "orderId": "bb019137-f7c7-4b8f-8a6e-7d2020ca5c99",
      "quotationOfferId": "cc019137-f7c7-4b8f-8a6e-7d2020ca5c99",
      "supportRequestId": null
    }
  ]
}
```

The API intentionally does not return an `avatarUrl` field.

## Unread count

```http
GET /api/v1/notifications/unread-count
```

```json
{
  "unreadCount": 3
}
```

Dismissed notifications are excluded from the count.

## Mark notifications as read

Mark one notification:

```http
POST /api/v1/notifications/{id}/read
```

Mark all current-user notifications:

```http
POST /api/v1/notifications/read-all
```

Both operations have no request body and are idempotent.

## Dismiss a notification

```http
DELETE /api/v1/notifications/{id}
```

Dismissal soft-deletes the notification. It no longer appears in the list or unread count, and there is no restore endpoint.

## Authorization and errors

- Buyer and Supplier access is determined from authoritative Identity database membership, case-insensitively.
- A user can list, read, or dismiss only their own notifications.
- A notification owned by another user is returned as `404 Not Found`.
- Admin-only and legacy-only accounts receive `403 Forbidden` on these user notification routes.
- Missing, expired, or invalid authentication receives `401 Unauthorized`.

## Database deployment

The `AddUserNotifications` migration creates the `UserNotifications` table, user foreign keys, and lookup indexes. A migration in source control is not deployed automatically. Apply it with the repository DbMigrator against the exact database used by the API host, then restart the host before exercising these routes.

The later `20260907101414_RestrictOrdersToBuyers` data migration permanently removes Supplier-owned orders and notifications tied to those orders or their quotation offers. Review this destructive cleanup before applying it to a shared or production database.
