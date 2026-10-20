# Real-time Notifications: Frontend Guide

Use SignalR to know **when notifications change**, then fetch the notification list and unread count through the existing REST API.

## 1. Install the client

```bash
npm install @microsoft/signalr
```

## 2. Connect after login

Connect to the **API base URL** followed by `/hubs/notifications`. Do not add `/api/v1` before the hub path. Only authenticated Buyer and Supplier accounts can connect.

```ts
import { HubConnectionBuilder } from "@microsoft/signalr";

// Supply these callbacks from your application's auth and notification code.
export async function startNotifications(
  apiBaseUrl: string,
  getValidAccessToken: () => Promise<string>,
  refreshNotifications: () => Promise<void>,
  onError: (error: unknown) => void,
) {
  const connection = new HubConnectionBuilder()
    .withUrl(`${apiBaseUrl.replace(/\/$/, "")}/hubs/notifications`, {
      accessTokenFactory: getValidAccessToken,
    })
    .withAutomaticReconnect()
    .build();

  const refresh = () => {
    void refreshNotifications().catch(onError);
  };

  // Register listeners BEFORE starting the connection.
  connection.on("NotificationsChanged", refresh);
  connection.onreconnected(refresh);
  connection.onclose(onError);

  await connection.start();
  refresh(); // Load the initial list and unread count after connecting.

  return connection;
}
```

`getValidAccessToken()` must return the latest access token, refreshing it through your existing auth flow when needed. SignalR handles sending the token; do not manually build a token query string.

`refreshNotifications()` must reload **both** endpoints below and update the UI/cache. Coalesce concurrent refreshes and schedule another refresh if an event arrives during a fetch, so an older response cannot overwrite newer data.

## 3. Load the notification data

Send `Authorization: Bearer <access-token>` and `Accept-Language: en` or `ar` with REST requests.

| Purpose | Endpoint | Response |
| --- | --- | --- |
| Notification list | `GET /api/v1/notifications?skipCount=0&maxResultCount=10` | `{ "totalCount": 10, "items": [...] }` |
| Unread badge | `GET /api/v1/notifications/unread-count` | `{ "unreadCount": 3 }` |

Render each item's `message` from REST. The live event contains only a change signal:

```json
{
  "change": "created",
  "notificationId": "b7f49620-c20a-4d28-b174-b35158976d22"
}
```

Possible `change` values are `created`, `read`, `read_all`, and `deleted`. For `read_all`, `notificationId` is `null`. Refresh the list and count for every change; do not calculate the badge by incrementing/decrementing events.

## 4. Keep existing notification actions

| Action | Endpoint |
| --- | --- |
| Mark one as read | `POST /api/v1/notifications/{id}/read` |
| Mark all as read | `POST /api/v1/notifications/read-all` |
| Dismiss | `DELETE /api/v1/notifications/{id}` |

These actions have no request body. Refresh after your own successful action too; other connected tabs/devices receive the live change automatically.

## 5. Handle the connection lifecycle

- Keep one connection per signed-in browser tab, usually in an app-level provider. In Next.js, create it in client-side code after login.
- On logout, account change, or provider cleanup, call `await connection.stop()` and clear that user's notification state.
- Connections close when their access token expires. Refresh the token before reconnecting. Stop reconnecting if the user is logged out or refresh fails.
- Automatic reconnection does not retry a failed initial `connection.start()`. Handle that rejection and retry while the user remains signed in. If automatic retries are exhausted, restart the connection through the app's retry flow.
- Missed events are not replayed. Reload through REST after reconnecting and when the app returns to the foreground. Treat repeated or unordered signals as a request to refresh.
- The frontend origin must be allowed by the API's CORS configuration. The deployed API/proxy must support SignalR connections.

See [the full notifications API guide](notifications-api-guide.md) for notification fields, event types, and error responses.
