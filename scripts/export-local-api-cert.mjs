import { createRequire } from "node:module";
import { X509Certificate } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import tls from "node:tls";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd(), true);
const url = new URL(process.env.NEXT_PUBLIC_HOST_API);
if (url.protocol !== "https:" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
  throw new Error("This development setup supports only a local HTTPS API.");
}

// Retrieve only the public certificate from the local development API.
// No credentials are sent. This never changes the machine's trust store.
const certificate = await new Promise((resolve, reject) => {
  const socket = tls.connect({
    host: url.hostname.replace(/^\[|\]$/g, ""), port: Number(url.port || 443),
    rejectUnauthorized: false,
  }, () => {
    try {
      const cert = new X509Certificate(socket.getPeerCertificate().raw);
      const hostname = url.hostname.replace(/^\[|\]$/g, "");
      const matches = hostname === "localhost" ? cert.checkHost(hostname) : cert.checkIP(hostname);
      if (!matches || Date.now() < Date.parse(cert.validFrom) || Date.now() > Date.parse(cert.validTo)) {
        throw new Error("The local API certificate has an invalid hostname or validity period.");
      }
      resolve(cert);
    } catch (error) { reject(error); }
    finally { socket.end(); }
  });
  socket.setTimeout(10_000, () => socket.destroy(new Error("Local API TLS connection timed out")));
  socket.on("error", reject);
});
await mkdir(".certs", { recursive: true });
await writeFile(".certs/api-localhost.pem", certificate.toString());
console.log(`Saved local API public certificate. SHA-256: ${certificate.fingerprint256}`);
console.log("Set NODE_EXTRA_CA_CERTS=.certs/api-localhost.pem in .env.local, then restart npm run dev.");
