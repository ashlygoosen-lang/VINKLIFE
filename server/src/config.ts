import { randomBytes } from "node:crypto";

const env = process.env;
const isProd = env.NODE_ENV === "production";

function list(value: string | undefined, fallback: string): string[] {
  return (value ?? fallback)
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export interface Config {
  isProd: boolean;
  port: number;
  databaseUrl?: string;
  pgSsl: boolean;
  pgliteDir: string;
  allowedOrigins: string[];
  publicApiUrl: string;
  siteUrl: string;
  adminPassword?: string;
  sessionSecret: string;
  sessionHours: number;
  resendKey?: string;
  mailFrom: string;
  notifyEmail: string;
  partnersEmail: string;
  investEmail: string;
  careersEmail: string;
  rateLimit: boolean;
}

export function loadConfig(overrides: Partial<Config> = {}): Config {
  const cfg: Config = {
    isProd,
    port: Number(env.PORT ?? 8787),
    databaseUrl: env.DATABASE_URL,
    pgSsl: env.PGSSL === "require",
    pgliteDir: env.PGLITE_DIR ?? "./.data",
    allowedOrigins: list(env.ALLOWED_ORIGINS, "http://localhost:5173,http://localhost:8443"),
    publicApiUrl: (env.PUBLIC_API_URL ?? `http://localhost:${env.PORT ?? 8787}`).replace(/\/$/, ""),
    siteUrl: (env.SITE_URL ?? "http://localhost:8443").replace(/\/$/, ""),
    adminPassword: env.ADMIN_PASSWORD,
    sessionSecret: env.SESSION_SECRET ?? randomBytes(32).toString("hex"),
    sessionHours: Number(env.SESSION_HOURS ?? 12),
    resendKey: env.RESEND_API_KEY,
    mailFrom: env.MAIL_FROM ?? "VINK Group <noreply@vinkgroup.com>",
    notifyEmail: env.NOTIFY_EMAIL ?? "hello@vinkgroup.com",
    partnersEmail: env.PARTNERS_EMAIL ?? "partners@vinkgroup.com",
    investEmail: env.INVEST_EMAIL ?? "invest@vinkgroup.com",
    careersEmail: env.CAREERS_EMAIL ?? env.NOTIFY_EMAIL ?? "hello@vinkgroup.com",
    rateLimit: true,
    ...overrides,
  };
  return cfg;
}

/** Fail fast in production if the service would run unsafely. */
export function assertProductionReady(cfg: Config) {
  if (!cfg.isProd) return;
  const problems: string[] = [];
  if (!cfg.databaseUrl) problems.push("DATABASE_URL is required in production");
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32)
    problems.push("SESSION_SECRET must be set (32+ characters)");
  if (cfg.adminPassword && cfg.adminPassword.length < 12)
    problems.push("ADMIN_PASSWORD must be at least 12 characters");
  if (problems.length) {
    console.error("Refusing to start:\n - " + problems.join("\n - "));
    process.exit(1);
  }
}
