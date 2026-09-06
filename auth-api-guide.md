# Authentication API Guide

This guide describes how the frontend should use the authentication endpoints exposed under:

```text
{API_BASE_URL}/api/v1/auth
```

Example local base URL:

```text
https://localhost:44374/api/v1/auth
```

All request and response bodies use JSON. Send these headers unless stated otherwise:

```http
Content-Type: application/json
Accept: application/json
Accept-Language: en
```

Use `Accept-Language: ar` for localized Arabic errors.

## Important values and rules

- `role` must be `Buyer` or `Supplier`.
- `type` must be `Company` or `Individual`.
- Passwords must contain at least 6 characters.
- The current development OTP is `1111`. It is accepted by the API but is never returned in an API response.
- Phone numbers are normalized by removing spaces and separators while preserving an optional leading `+`.
- Use the same phone number throughout one registration, login, or password-reset flow.
- All company/profile fields are required for both Company and Individual accounts.
- Access tokens expire after 30 minutes.
- A refresh token is single-use. Every successful refresh returns a replacement refresh token.
- Persist only the latest returned refresh token. Reusing an older rotated token revokes the user's active sessions.
- Registration and profile completion do not authenticate the user. The user must log in afterward.

## Endpoint summary

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/register` | Anonymous | Start or replace a pending registration |
| `POST` | `/complete-profile` | Anonymous | Complete and activate a pending account |
| `POST` | `/login` | Anonymous | Validate credentials and create a login OTP challenge |
| `POST` | `/verify-login-otp` | Anonymous | Verify login OTP and obtain tokens |
| `POST` | `/resend-login-otp` | Anonymous | Resend an existing login challenge |
| `POST` | `/forget-password` | Anonymous | Create a password-reset OTP challenge |
| `POST` | `/verify-forget-password-otp` | Anonymous | Verify reset OTP and obtain a reset token |
| `POST` | `/resend-forget-password-otp` | Anonymous | Resend an existing reset challenge |
| `POST` | `/change-password` | Anonymous | Change the password using a reset token |
| `POST` | `/refresh-token` | Anonymous | Rotate a refresh token and obtain a new token pair |
| `POST` | `/logout` | Refresh token body | Revoke one refresh session |
| `GET` | `/my-info` | Bearer access token | Get the current user's profile |

## 1. Registration flow

The registration flow has two calls:

```text
register -> complete-profile -> redirect to login
```

There is no registration OTP step.

### Register

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "role": "Buyer",
  "type": "Company",
  "name": "Ahmed Ali",
  "phoneNumber": "+20 100-200-3000",
  "password": "Secret123",
  "confirmPassword": "Secret123"
}
```

Response:

```json
{
  "id": "57d59a6a-9c22-4c6b-915f-027556397346",
  "phoneNumber": "+201002003000",
  "role": "Buyer",
  "type": "Company",
  "completionToken": "opaque-single-use-token",
  "completionTokenExpiresAt": "2026-09-01T18:30:00Z"
}
```

Store `completionToken` temporarily and pass it to the complete-profile endpoint. Do not treat it as an authentication token.

If the phone belongs to an incomplete registration, calling register again replaces the pending name, password, role, and account type and returns a new completion token. If the account is already complete, registration is rejected.

### Complete profile

```http
POST /api/v1/auth/complete-profile
```

Request:

```json
{
  "completionToken": "opaque-single-use-token",
  "legalCompanyName": "Trade Global LLC",
  "phoneNumber": "+201002003000",
  "email": "buyer@example.com",
  "sector": "Import and Export",
  "taxNumber": "TAX-12345",
  "commercialRecord": "CR-98765",
  "city": "Cairo",
  "companyAddress": "10 Example Street, Cairo"
}
```

The normalized phone number must match the phone used during registration.

Response:

```json
{
  "userId": "57d59a6a-9c22-4c6b-915f-027556397346",
  "phoneNumber": "+201002003000",
  "registrationCompleted": true,
  "nextStep": "Login"
}
```

After success, discard the completion token and redirect the user to the login page.

## 2. Login flow

Every login requires two calls:

```text
login -> verify-login-otp -> store access and refresh tokens
```

### Login with phone and password

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "role": "Buyer",
  "phoneNumber": "+201002003000",
  "password": "Secret123"
}
```

Response:

```json
{
  "challengeId": "6e5bb1ab-e94c-419c-ae45-c9da110ab905",
  "maskedPhone": "+20*****3000",
  "expiresAt": "2026-09-01T18:20:00Z",
  "resendsRemaining": 3
}
```

No authentication tokens are returned at this stage. Phone, password, and role mismatches all return the same invalid-credentials error.

### Verify login OTP

```http
POST /api/v1/auth/verify-login-otp
```

Request:

```json
{
  "challengeId": "6e5bb1ab-e94c-419c-ae45-c9da110ab905",
  "phoneNumber": "+201002003000",
  "otp": "1111"
}
```

Response:

```json
{
  "id": "57d59a6a-9c22-4c6b-915f-027556397346",
  "name": "Ahmed Ali",
  "phoneNumber": "+201002003000",
  "email": "buyer@example.com",
  "role": "Buyer",
  "accessToken": "jwt-access-token",
  "refreshToken": "opaque-refresh-token",
  "accessTokenExpireAt": "2026-09-01T18:45:00Z",
  "refreshTokenExpireAt": "2026-09-11T18:15:00Z",
  "accountType": "Company",
  "profileCompleted": true
}
```

The challenge is consumed after successful verification and cannot be replayed.

### Resend login OTP

```http
POST /api/v1/auth/resend-login-otp
```

Request:

```json
{
  "challengeId": "6e5bb1ab-e94c-419c-ae45-c9da110ab905",
  "phoneNumber": "+201002003000"
}
```

Response uses the same OTP challenge shape:

```json
{
  "challengeId": "6e5bb1ab-e94c-419c-ae45-c9da110ab905",
  "maskedPhone": "+20*****3000",
  "expiresAt": "2026-09-01T18:25:00Z",
  "resendsRemaining": 2
}
```

Do not send the password to this endpoint.

## 3. Forgot-password flow

The full flow is:

```text
forget-password -> verify-forget-password-otp -> change-password -> login again
```

### Request password reset

```http
POST /api/v1/auth/forget-password
```

Request:

```json
{
  "phoneNumber": "+201002003000"
}
```

Response:

```json
{
  "challengeId": "cc0cbd58-9a49-4b26-9b46-fb08a954dc48",
  "maskedPhone": "+20*****3000",
  "expiresAt": "2026-09-01T18:20:00Z",
  "resendsRemaining": 3,
  "message": "If an account exists for this phone number, a verification challenge has been created."
}
```

This endpoint intentionally returns a neutral response for both known and unknown phone numbers. Always show a neutral message in the UI.

### Verify forgot-password OTP

```http
POST /api/v1/auth/verify-forget-password-otp
```

Request:

```json
{
  "challengeId": "cc0cbd58-9a49-4b26-9b46-fb08a954dc48",
  "phoneNumber": "+201002003000",
  "otp": "1111"
}
```

Response:

```json
{
  "resetToken": "opaque-single-use-reset-token",
  "expiresAt": "2026-09-01T18:30:00Z"
}
```

The reset token is not an access token and cannot call authenticated APIs.

### Resend forgot-password OTP

```http
POST /api/v1/auth/resend-forget-password-otp
```

Request:

```json
{
  "challengeId": "cc0cbd58-9a49-4b26-9b46-fb08a954dc48",
  "phoneNumber": "+201002003000"
}
```

The response has the standard OTP challenge shape with the updated expiry and resend count.

### Change password

```http
POST /api/v1/auth/change-password
```

Request:

```json
{
  "resetToken": "opaque-single-use-reset-token",
  "newPassword": "NewSecret123",
  "confirmPassword": "NewSecret123"
}
```

Successful response has no JSON body:

```http
200 OK
```

The reset token is consumed, the old password stops working, and all existing refresh sessions are revoked. Redirect the user to login. A new login OTP is required.

## 4. Refreshing a session

```http
POST /api/v1/auth/refresh-token
```

This endpoint does not require a valid access token.

Request:

```json
{
  "refreshToken": "current-opaque-refresh-token"
}
```

Response has the same shape as the verify-login-otp response and contains both a new access token and a new refresh token.

Replace the stored refresh token immediately:

```ts
const response = await fetch(`${apiBaseUrl}/api/v1/auth/refresh-token`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refreshToken: session.refreshToken }),
});

if (!response.ok) {
  // Clear the local session and redirect to login.
  throw new Error("Session refresh failed");
}

const nextSession = await response.json();

// This must replace both old tokens atomically.
session.accessToken = nextSession.accessToken;
session.refreshToken = nextSession.refreshToken;
```

Never retry a successful refresh request with the old refresh token. Reuse is treated as a possible token theft event and revokes active sessions.

## 5. Current profile

```http
GET /api/v1/auth/my-info
Authorization: Bearer {accessToken}
```

Example:

```bash
curl "https://localhost:44374/api/v1/auth/my-info" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept-Language: en"
```

Response:

```json
{
  "name": "Ahmed Ali",
  "email": "buyer@example.com",
  "phoneNumber": "+201002003000",
  "role": "Buyer",
  "accountType": "Company",
  "legalCompanyName": "Trade Global LLC",
  "sector": "Import and Export",
  "taxNumber": "TAX-12345",
  "commercialRecord": "CR-98765",
  "city": "Cairo",
  "companyAddress": "10 Example Street, Cairo",
  "profileCompletedAt": "2026-09-01T18:00:00Z"
}
```

An absent, invalid, or expired access token returns `401 Unauthorized`.

## 6. Logout

```http
POST /api/v1/auth/logout
```

Request:

```json
{
  "refreshToken": "current-opaque-refresh-token"
}
```

Successful response has no JSON body:

```http
200 OK
```

After the request, delete the local access and refresh tokens even if the refresh token was already expired or revoked.

## Error responses

Business errors return HTTP `400`:

```json
{
  "message": "The OTP challenge is invalid or expired.",
  "code": "400",
  "details": null
}
```

Validation errors also return HTTP `400`:

```json
{
  "code": 400,
  "message": "Validation failed.",
  "status": 400,
  "title": "One or more validation errors occurred.",
  "details": "Validation failed...",
  "errors": {
    "Phone": [
      "Phone number is required."
    ]
  }
}
```

Do not rely on the English `message` when implementing application logic. Use the HTTP status and the current flow state, and display the server message to the user.

## Recommended frontend session behavior

1. Keep the access token in short-lived application state when possible.
2. Store refresh tokens only in a protected storage mechanism appropriate for the client platform.
3. Attach `Authorization: Bearer {accessToken}` only to authenticated requests.
4. On an expired access token, perform one synchronized refresh request so concurrent API calls do not reuse the same refresh token.
5. Replace both tokens with the refresh response before retrying the original request.
6. If refresh fails, clear the session and redirect to login.
7. Never log completion, reset, access, refresh, or OTP values.

## Minimal TypeScript helper

```ts
export async function authRequest<T>(
  path: string,
  body?: unknown,
  accessToken?: string,
): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": "en",
      ...(accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? `Request failed (${response.status})`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
```

Usage:

```ts
const challenge = await authRequest<{
  challengeId: string;
  maskedPhone: string;
  expiresAt: string;
  resendsRemaining: number;
}>("/api/v1/auth/login", {
  role: "Buyer",
  phoneNumber: "+201002003000",
  password: "Secret123",
});
```
