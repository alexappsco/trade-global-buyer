# Quotation Offers API Guide

Quotation offers connect the existing Orders and Quotation Requests screens. All routes require a valid Buyer or Supplier access token. See [auth-api-guide.md](./auth-api-guide.md) for authentication and [orders-api-guide.md](./orders-api-guide.md) for order contracts.

## Lifecycle and access rules

- Only a Supplier can submit an offer.
- A Supplier can submit at most one immutable offer per order and cannot quote an order they own.
- The order must be `open`, and every order item must have exactly one positive unit price.
- The order owner (Buyer or Supplier) can list received offers and accept or decline a pending offer.
- The submitting Supplier and the order owner can view an offer. All other users receive `404` so the record is not disclosed.
- Declining is final and leaves the order open.
- Accepting closes the order, accepts the selected offer, and declines all competing pending offers atomically.
- Manually closing an order changes all pending offers to `closed`.
- Offers cannot be edited, withdrawn, or resubmitted.

Statuses are `pending`, `accepted`, `declined`, and `closed`.

## Routes

| Method | Route | Access |
| --- | --- | --- |
| `POST` | `/api/v1/orders/{orderId}/quotation-offers` | Supplier only |
| `GET` | `/api/v1/quotation-offers` | Supplier's submitted offers |
| `GET` | `/api/v1/orders/{orderId}/quotation-offers` | Order owner |
| `GET` | `/api/v1/quotation-offers/{id}` | Submitting Supplier or order owner |
| `POST` | `/api/v1/quotation-offers/{id}/accept` | Order owner |
| `POST` | `/api/v1/quotation-offers/{id}/decline` | Order owner |

## Submit an offer

```http
POST /api/v1/orders/7e0a721a-13bd-48c4-a719-183ea72bc03a/quotation-offers
Authorization: Bearer {supplierAccessToken}
Content-Type: application/json
```

```json
{
  "deliveryFee": 50.00,
  "deliveryDurationDays": 7,
  "items": [
    {
      "orderItemId": "b82257ea-fe50-40ac-b59b-ad741cfe11aa",
      "unitPrice": 125.50
    },
    {
      "orderItemId": "43acdd09-196b-41b2-a952-b12868c83de2",
      "unitPrice": 80.00
    }
  ]
}
```

Do not send quantities, Supplier IDs, statuses, tax, subtotal, grand total, or audit fields. Unknown properties are rejected with `400 Bad Request`.

Money is SAR with at most two decimal places. Unit prices must be greater than zero, the delivery fee must be non-negative, and `deliveryDurationDays` must be a positive integer.

The server calculates:

```text
itemTotal = order item quantity * unitPrice
subtotal = sum(itemTotal) + deliveryFee
tax = round(subtotal * 15%, 2)
grandTotal = subtotal + tax
```

Tax midpoint rounding is away from zero. The delivery fee is taxable.

Successful response:

```json
{
  "id": "f760952e-ce0f-4ae6-a09c-e27831029527",
  "orderId": "7e0a721a-13bd-48c4-a719-183ea72bc03a",
  "orderNumber": 1000,
  "orderTitle": "Office monitors",
  "orderStatus": "open",
  "categoryCode": "computers-laptops",
  "categoryNameEn": "Computers & Laptops",
  "categoryNameAr": "أجهزة كمبيوتر ولاب توب",
  "classificationCode": "screens",
  "classificationNameEn": "Screens",
  "classificationNameAr": "شاشات",
  "deliveryDate": "2026-10-15",
  "orderCreationTime": "2026-09-03T07:30:00Z",
  "supplierUserId": "37ac606a-cd4c-4304-b897-d988f4be06fb",
  "deliveryFee": 50.00,
  "deliveryDurationDays": 7,
  "subtotal": 1385.00,
  "tax": 207.75,
  "grandTotal": 1592.75,
  "status": "pending",
  "submissionTime": "2026-09-03T08:00:00Z",
  "lastModificationTime": null,
  "counterparty": {
    "userId": "19583f30-adb6-463f-b839-84121e6c1742",
    "legalCompanyName": "Buyer Company LLC",
    "city": "Riyadh",
    "companyAddress": "King Fahd Road"
  },
  "items": [
    {
      "id": "aaec3659-53f2-49a8-98b9-d566b57279b1",
      "orderItemId": "b82257ea-fe50-40ac-b59b-ad741cfe11aa",
      "name": "27-inch monitor",
      "quantity": 10,
      "details": "4K IPS display",
      "unitPrice": 125.50,
      "itemTotal": 1255.00
    }
  ]
}
```

`counterparty` is the order owner's current company profile when viewed by the submitting Supplier, and the Supplier's current company profile when viewed by the owner. It is not a historical snapshot.

## List submitted or received offers

Supplier submissions:

```http
GET /api/v1/quotation-offers?status=pending&search=monitor&sorting=creationTime%20desc&skipCount=0&maxResultCount=10
```

Owner's received offers:

```http
GET /api/v1/orders/{orderId}/quotation-offers?sorting=grandTotal%20asc&skipCount=0&maxResultCount=10
```

Both return the ABP shape `{ "totalCount": number, "items": QuotationOffer[] }`. Submitted-list filters are `search` (order title or number), `status`, and `orderId`. Received lists are always constrained to the route order. Allowed sorting fields are `creationTime`, `grandTotal`, and `status`, with `asc` or `desc`.

## View and decide

```http
GET /api/v1/quotation-offers/{offerId}
POST /api/v1/quotation-offers/{offerId}/accept
POST /api/v1/quotation-offers/{offerId}/decline
```

Decision routes have no request body. They only accept `pending` offers. Repeating a decision or deciding an offer after another was accepted produces a business conflict; it does not rewrite history.

## Error behavior

| Status | Meaning |
| --- | --- |
| `400` | Invalid item coverage, money, duration, filter, sorting, or unknown request property |
| `401` | Missing, invalid, or expired access token |
| `403` | Authenticated role cannot perform the operation (for example, a Buyer submits) |
| `404` | Missing resource or inaccessible/non-owned offer decision |
| Business conflict | Duplicate/self/closed-order submission or invalid lifecycle transition |

The database also has a unique `(OrderId, SupplierUserId)` index, so concurrent requests cannot create two offers for the same Supplier and order.
