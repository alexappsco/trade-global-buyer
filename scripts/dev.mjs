import { createRequire } from "node:module";
import { spawn } from "node:child_process";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");

// NODE_EXTRA_CA_CERTS is read at Node startup. Load the local environment before
// starting Next so both server actions and hub rewrites trust the configured CA.
loadEnvConfig(process.cwd(), true);
const child = spawn(process.execPath, [
  require.resolve("next/dist/bin/next"), "dev", ...process.argv.slice(2),
], { stdio: "inherit", env: process.env });
child.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
child.on("exit", (code) => { process.exitCode = code ?? 1; });
