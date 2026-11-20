import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import type { Config } from "./config.js";
import type { Db } from "./db.js";
import { createMailer, type Mailer } from "./mail.js";
import { fieldErrors } from "./validation.js";
import { publicRoutes } from "./routes/public.js";
import { adminRoutes } from "./routes/admin.js";

export async function buildApp(db: Db, cfg: Config, opts: { logger?: boolean; mailer?: Mailer } = {}) {
  const app = Fastify({
    logger: opts.logger === false ? false : { level: cfg.isProd ? "info" : "debug", redact: ["req.headers.authorization"] },
    trustProxy: true, // Railway terminates TLS in front of us; needed for real client IPs / rate limits
    bodyLimit: 100 * 1024,
  });

  await app.register(helmet, { crossOriginResourcePolicy: { policy: "cross-origin" } });
  await app.register(cors, {
    origin: (origin, cb) => cb(null, !origin || cfg.allowedOrigins.includes(origin.replace(/\/$/, ""))),
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86_400,
  });
  if (cfg.rateLimit) await app.register(rateLimit, { global: true, max: 240, timeWindow: "1 minute" });

  const mail = opts.mailer ?? createMailer(cfg, app.log);

  app.setErrorHandler((err: any, req, reply) => {
    if (err instanceof ZodError) {
      return reply.code(422).send({ error: "validation", message: "Please check the highlighted fields.", fields: fieldErrors(err) });
    }
    if (err.statusCode === 429) return reply.code(429).send({ error: "rate_limited", message: "Too many requests. Please wait a few minutes and try again." });
    if (err.statusCode && err.statusCode < 500) return reply.code(err.statusCode).send({ error: "bad_request", message: err.message });
    req.log.error({ err }, "unhandled error");
    return reply.code(500).send({ error: "server_error", message: "Something went wrong on our side. Please try again shortly." });
  });
  app.setNotFoundHandler((_req, reply) => reply.code(404).send({ error: "not_found", message: "Not found." }));

  publicRoutes(app, { db, cfg, mail });
  adminRoutes(app, { db, cfg });
  return app;
}
