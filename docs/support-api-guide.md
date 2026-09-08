# Support Requests API Guide

This API lets authenticated Buyers and Suppliers submit and manage their own support requests. Administrators can review all active requests, add reply messages, and update statuses.

All routes require a bearer access token:

```http
Authorization: Bearer <access-token>
```

Authorization is based on the user's current Identity database role membership, compared case-insensitively. Buyer and Supplier routes do not accept Admin or legacy User accounts, and Admin routes require the `ADMIN` role.

## Status values

The API returns and accepts these values:

- `under_review`
- `in_progress`
- `resolved`
- `closed`

New requests always start as `under_review`. Adding a reply does not change the status. An Admin may move a request directly between any valid statuses.

## Buyer and Supplier endpoints

### Create a request

```http
POST /api/v1/support-requests
Content-Type: application/json

{
  "email": "contact@example.com",
  "details": "I need help completing my order."
}
```

`email` must be a valid email address no longer than 256 characters. `details` is required and cannot exceed 4,000 characters. Both values are trimmed. The email is stored as a request-time contact snapshot and does not need to equal the user's account email.

Example response:

```json
{
  "id": "c2199148-ebdf-4c5f-95a6-f48beaff5dc3",
  "requestNumber": 1000,
  "userId": "e3bbc15f-91e6-4c5e-a130-7ff383f0ac9e",
  "email": "contact@example.com",
  "details": "I need help completing my order.",
  "status": "under_review",
  "createdAt": "2026-09-06T10:30:00Z",
  "lastModifiedAt": null,
  "replies": []
}
```

`createdAt` is a UTC timestamp. Clients should format the request date and request time from this value in the user's locale and time zone.

Server-owned properties such as `userId`, `requestNumber`, `status`, `createdAt`, and `replies` are rejected if included in create input.

### List your requests

```http
GET /api/v1/support-requests?search=payment&status=in_progress&sorting=createdAt%20desc&skipCount=0&maxResultCount=10
```

The list is always restricted to the authenticated owner. `search` matches request number, email, or details. Supported sorting fields are `createdAt`, `requestNumber`, `email`, and `status`, each with optional `asc` or `desc`. The default is `createdAt desc`.

The response uses ABP's paged result format. Every item includes its complete Admin reply history in oldest-first order:

```json
{
  "totalCount": 1,
  "items": [
    {
      "id": "c2199148-ebdf-4c5f-95a6-f48beaff5dc3",
      "requestNumber": 1000,
      "userId": "e3bbc15f-91e6-4c5e-a130-7ff383f0ac9e",
      "email": "contact@example.com",
      "details": "I need help completing my order.",
      "status": "in_progress",
      "createdAt": "2026-09-06T10:30:00Z",
      "lastModifiedAt": "2026-09-06T11:00:00Z",
      "replies": [
        {
          "id": "bf87067f-d8e7-4d09-a31d-54c63f4d9ee1",
          "adminUserId": "82f46355-a025-47bb-a1f6-ebc872ba8038",
          "adminName": "Support Admin",
          "message": "We are reviewing this issue.",
          "createdAt": "2026-09-06T10:45:00Z"
        }
      ]
    }
  ]
}
```

### View one request

```http
GET /api/v1/support-requests/{id}
```

The detail response includes all Admin replies in oldest-first order. Requests belonging to another user return `404` so ownership is not disclosed.

### Delete a request

```http
DELETE /api/v1/support-requests/{id}
```

Deletion is soft: the database row and deletion audit fields are retained, but the request disappears from all normal Buyer, Supplier, and Admin endpoints. A foreign, missing, or already deleted request returns `404`.

## Admin endpoints

### List all active requests

```http
GET /api/v1/admin/support-requests?search=1000&status=under_review&sorting=requestNumber%20asc&skipCount=0&maxResultCount=10
```

Search, status, paging, and sorting behave like the owner list. Soft-deleted requests are excluded.

### View one request

```http
GET /api/v1/admin/support-requests/{id}
```

### Add a reply

```http
POST /api/v1/admin/support-requests/{id}/replies
Content-Type: application/json

{
  "message": "We are reviewing the payment issue with the operations team."
}
```

Reply messages are trimmed, required, and limited to 4,000 characters. Replies are append-only and include the Admin user ID, display name, and UTC creation timestamp in the returned detail DTO.

### Update status

```http
PUT /api/v1/admin/support-requests/{id}/status
Content-Type: application/json

{
  "status": "resolved"
}
```

## Errors

- `400 Bad Request`: invalid email, blank or overlong text, invalid status/sorting, or unknown input properties.
- `401 Unauthorized`: missing, expired, or invalid authentication.
- `403 Forbidden`: the authenticated user's database role cannot use that route.
- `404 Not Found`: the request is missing, soft-deleted, or not owned by the Buyer/Supplier requesting it.

## Database deployment

The `AddSupportRequests` migration creates `SupportRequests`, `SupportRequestReplies`, their indexes and foreign keys, and the PostgreSQL `SupportRequestNumberSequence` starting at 1000. A migration committed in source control is not applied automatically; run the repository DbMigrator against the same database configured for the API host before exercising these endpoints.

Admin replies and actual status changes create persisted notifications for the request owner. See [notifications-api-guide.md](./notifications-api-guide.md) for localization and notification lifecycle endpoints.
