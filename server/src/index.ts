import { assertProductionReady, loadConfig } from "./config.js";
import { openDb } from "./db.js";
import { seed } from "./seed.js";
import { buildApp } from "./app.js";

const cfg = loadConfig();
assertProductionReady(cfg);

const db = await openDb(cfg);
await seed(db);
const app = await buildApp(db, cfg);

if (!cfg.adminPassword) app.log.warn("ADMIN_PASSWORD is not set — the admin dashboard is disabled");
if (!cfg.resendKey) app.log.warn("RESEND_API_KEY is not set — notification emails are logged, not sent");

await app.listen({ port: cfg.port, host: "0.0.0.0" });
app.log.info(`VINK API ready (database: ${db.kind})`);

for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.on(sig, async () => {
    await app.close();
    await db.close();
    process.exit(0);
  });
}
