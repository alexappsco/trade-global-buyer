This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local HTTPS API and realtime notifications

Start the API, then run `npm run setup:local-https` from this directory. This
exports only the public certificate from the localhost API configured in
`NEXT_PUBLIC_HOST_API` into the ignored `.certs/api-localhost.pem` file.
Add `NODE_EXTRA_CA_CERTS=.certs/api-localhost.pem` to `.env.local`, then restart
the frontend with `npm run dev`. The development launcher loads this setting
before starting Node, so REST server actions and the SignalR fallback proxy
trust the local certificate. Repeat the export if the API certificate changes.
TLS verification stays enabled. Production must use a properly trusted HTTPS
certificate; do not deploy the local certificate file.

The browser must also trust the local API certificate for direct WebSockets.
Open the configured API URL once to check the browser's certificate trust.
The API CORS allowlist must include the frontend's exact origin, such as
`http://localhost:3000`.

After signing in, the notification provider loads REST data immediately and
connects to `/hubs/notifications`. It refreshes the list and unread count on
`NotificationsChanged`, reconnect, and foreground return. To verify delivery,
sign in as a Buyer and Supplier in separate browser profiles and submit a
quotation to the Buyer's order: the Buyer's badge and list should update without
reloading. Read/dismiss changes should also update another tab of the same user.

Refresh coordination is process-local; a deployment with multiple Next.js
workers needs shared session/rotation coordination across those workers.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
