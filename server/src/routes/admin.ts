import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import type { Db } from "../db.js";
import type { Config } from "../config.js";
import { articleInput, jobInput } from "../validation.js";
import { safeEqual, signSession, slugify, toCsv, verifySession } from "../security.js";

interface Deps {
  db: Db;
  cfg: Config;
}

const page = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.string().max(30).optional(),
  q: z.string().trim().max(100).optional(),
});

/** Build "col = $n, ..." from a whitelist so column names never come from user input. */
function setClause(values: Record<string, unknown>, allowed: Record<string, string>, startAt = 1) {
  const cols: string[] = [];
  const params: unknown[] = [];
  for (const [key, col] of Object.entries(allowed)) {
    if (values[key] === undefined) continue;
    params.push(values[key]);
    cols.push(`${col} = $${startAt + params.length - 1}`);
  }
  return { sql: cols.join(", "), params };
}

const uuid = z.string().uuid();
const isUniqueViolation = (e: unknown) => (e as { code?: string })?.code === "23505" || /unique|duplicate/i.test(String((e as Error)?.message));

export function adminRoutes(app: FastifyInstance, { db, cfg }: Deps) {
  const notFound = (reply: FastifyReply) => reply.code(404).send({ error: "not_found", message: "Record not found." });

  app.post("/api/admin/login", { config: { rateLimit: { max: 8, timeWindow: "15 minutes" } } }, async (req, reply) => {
    if (!cfg.adminPassword) return reply.code(503).send({ error: "admin_disabled", message: "Admin access is not configured on this server." });
    const { password } = z.object({ password: z.string().max(200) }).parse(req.body);
    if (!safeEqual(password, cfg.adminPassword)) return reply.code(401).send({ error: "unauthorized", message: "Incorrect password." });
    return { token: signSession(cfg.sessionSecret, cfg.sessionHours), expiresInHours: cfg.sessionHours };
  });

  // Everything below requires a valid admin session.
  app.register(async (admin) => {
    admin.addHook("onRequest", async (req, reply) => {
      const token = (req.headers.authorization ?? "").replace(/^Bearer\s+/i, "");
      if (!verifySession(cfg.sessionSecret, token)) return reply.code(401).send({ error: "unauthorized", message: "Please sign in again." });
    });

    admin.get("/api/admin/stats", async () => {
      const q = async (sql: string) => (await db.query<{ n: number }>(sql)).rows[0].n;
      return {
        enquiriesNew: await q("select count(*)::int n from enquiries where status='new'"),
        enquiriesTotal: await q("select count(*)::int n from enquiries"),
        enquiriesWeek: await q("select count(*)::int n from enquiries where created_at > now() - interval '7 days'"),
        subscribers: await q("select count(*)::int n from subscribers where unsubscribed_at is null"),
        applicationsNew: await q("select count(*)::int n from applications where status='new'"),
        applicationsTotal: await q("select count(*)::int n from applications"),
        articlesPublished: await q("select count(*)::int n from articles where status='published'"),
        jobsOpen: await q("select count(*)::int n from jobs where active"),
      };
    });

    /* Enquiries */
    admin.get("/api/admin/enquiries", async (req) => {
      const p = page.parse(req.query);
      const params: unknown[] = [];
      const where: string[] = [];
      if (p.status) { params.push(p.status); where.push(`status = $${params.length}`); }
      if (p.q) { params.push(`%${p.q.replace(/[%_\\]/g, "\\$&")}%`); where.push(`(name ilike $${params.length} or email ilike $${params.length} or message ilike $${params.length} or company ilike $${params.length})`); }
      const w = where.length ? "where " + where.join(" and ") : "";
      const total = (await db.query<{ n: number }>(`select count(*)::int n from enquiries ${w}`, params)).rows[0].n;
      const { rows } = await db.query(`select * from enquiries ${w} order by created_at desc limit ${p.limit} offset ${p.offset}`, params);
      return { total, items: rows.map(({ ip_hash, ...r }) => r) };
    });

    admin.get("/api/admin/enquiries/export.csv", async (_req, reply) => {
      const { rows } = await db.query("select * from enquiries order by created_at desc");
      return reply.type("text/csv; charset=utf-8").header("Content-Disposition", 'attachment; filename="enquiries.csv"')
        .send(toCsv(rows, ["created_at", "status", "name", "email", "phone", "organisation", "type", "company", "contact_preference", "message", "details", "notes", "id"]));
    });

    admin.patch("/api/admin/enquiries/:id", async (req, reply) => {
      const id = uuid.parse((req.params as any).id);
      const body = z.object({ status: z.enum(["new", "in_progress", "resolved", "spam"]).optional(), notes: z.string().max(4000).optional() }).parse(req.body);
      const { sql, params } = setClause(body, { status: "status", notes: "notes" });
      if (!sql) return reply.code(400).send({ error: "empty", message: "Nothing to update." });
      const r = await db.query(`update enquiries set ${sql} where id = $${params.length + 1} returning *`, [...params, id]);
      return r.rows[0] ? r.rows[0] : notFound(reply);
    });

    admin.delete("/api/admin/enquiries/:id", async (req, reply) => {
      const r = await db.query("delete from enquiries where id=$1", [uuid.parse((req.params as any).id)]);
      return r.rowCount ? reply.code(204).send() : notFound(reply);
    });

    /* Subscribers */
    admin.get("/api/admin/subscribers", async (req) => {
      const p = page.parse(req.query);
      const params: unknown[] = [];
      let w = "";
      if (p.q) { params.push(`%${p.q.replace(/[%_\\]/g, "\\$&")}%`); w = `where email ilike $1`; }
      const total = (await db.query<{ n: number }>(`select count(*)::int n from subscribers ${w}`, params)).rows[0].n;
      const { rows } = await db.query(`select id,email,source,created_at,unsubscribed_at from subscribers ${w} order by created_at desc limit ${p.limit} offset ${p.offset}`, params);
      return { total, items: rows };
    });

    admin.get("/api/admin/subscribers/export.csv", async (_req, reply) => {
      const { rows } = await db.query("select email,source,created_at from subscribers where unsubscribed_at is null order by created_at desc");
      return reply.type("text/csv; charset=utf-8").header("Content-Disposition", 'attachment; filename="subscribers.csv"').send(toCsv(rows, ["email", "source", "created_at"]));
    });

    admin.delete("/api/admin/subscribers/:id", async (req, reply) => {
      const r = await db.query("delete from subscribers where id=$1", [uuid.parse((req.params as any).id)]);
      return r.rowCount ? reply.code(204).send() : notFound(reply);
    });

    /* Applications */
    admin.get("/api/admin/applications", async (req) => {
      const p = page.parse(req.query);
      const params: unknown[] = [];
      const where: string[] = [];
      if (p.status) { params.push(p.status); where.push(`status = $${params.length}`); }
      if (p.q) { params.push(`%${p.q.replace(/[%_\\]/g, "\\$&")}%`); where.push(`(name ilike $${params.length} or email ilike $${params.length} or job_title ilike $${params.length})`); }
      const w = where.length ? "where " + where.join(" and ") : "";
      const total = (await db.query<{ n: number }>(`select count(*)::int n from applications ${w}`, params)).rows[0].n;
      const { rows } = await db.query(`select * from applications ${w} order by created_at desc limit ${p.limit} offset ${p.offset}`, params);
      return { total, items: rows.map(({ ip_hash, ...r }) => r) };
    });

    admin.patch("/api/admin/applications/:id", async (req, reply) => {
      const id = uuid.parse((req.params as any).id);
      const body = z.object({ status: z.enum(["new", "reviewing", "shortlisted", "rejected", "hired"]).optional(), notes: z.string().max(4000).optional() }).parse(req.body);
      const { sql, params } = setClause(body, { status: "status", notes: "notes" });
      if (!sql) return reply.code(400).send({ error: "empty", message: "Nothing to update." });
      const r = await db.query(`update applications set ${sql} where id = $${params.length + 1} returning *`, [...params, id]);
      return r.rows[0] ? r.rows[0] : notFound(reply);
    });

    admin.delete("/api/admin/applications/:id", async (req, reply) => {
      const r = await db.query("delete from applications where id=$1", [uuid.parse((req.params as any).id)]);
      return r.rowCount ? reply.code(204).send() : notFound(reply);
    });

    /* Articles */
    admin.get("/api/admin/articles", async () => ({ items: (await db.query("select * from articles order by created_at desc")).rows }));

    const uniqueSlug = async (title: string, ignoreId?: string) => {
      const base = slugify(title) || "article";
      for (let i = 0; i < 20; i++) {
        const slug = i === 0 ? base : `${base}-${i + 1}`;
        const hit = await db.query("select id from articles where slug=$1 and ($2::uuid is null or id <> $2::uuid)", [slug, ignoreId ?? null]);
        if (!hit.rows.length) return slug;
      }
      return `${base}-${Date.now()}`;
    };

    admin.post("/api/admin/articles", async (req, reply) => {
      const a = articleInput.parse(req.body);
      const slug = await uniqueSlug(a.title);
      const publishedAt = a.status === "published" ? (a.publishedAt ?? new Date().toISOString()) : (a.publishedAt ?? null);
      const r = await db.query(
        `insert into articles (slug,title,category,excerpt,body,image_url,status,featured,published_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *`,
        [slug, a.title, a.category, a.excerpt, a.body, a.imageUrl, a.status, a.featured, publishedAt],
      );
      return reply.code(201).send(r.rows[0]);
    });

    admin.patch("/api/admin/articles/:id", async (req, reply) => {
      const id = uuid.parse((req.params as any).id);
      const a = articleInput.partial().parse(req.body);
      const patch: Record<string, unknown> = { ...a };
      if (a.status === "published" && a.publishedAt === undefined) {
        const cur = (await db.query("select published_at from articles where id=$1", [id])).rows[0];
        if (cur && !cur.published_at) patch.publishedAt = new Date().toISOString();
      }
      const { sql, params } = setClause(patch, { title: "title", category: "category", excerpt: "excerpt", body: "body", imageUrl: "image_url", status: "status", featured: "featured", publishedAt: "published_at" });
      if (!sql) return reply.code(400).send({ error: "empty", message: "Nothing to update." });
      const r = await db.query(`update articles set ${sql}, updated_at = now() where id = $${params.length + 1} returning *`, [...params, id]);
      return r.rows[0] ? r.rows[0] : notFound(reply);
    });

    admin.delete("/api/admin/articles/:id", async (req, reply) => {
      const r = await db.query("delete from articles where id=$1", [uuid.parse((req.params as any).id)]);
      return r.rowCount ? reply.code(204).send() : notFound(reply);
    });

    /* Jobs */
    admin.get("/api/admin/jobs", async () => ({ items: (await db.query("select * from jobs order by created_at desc")).rows }));

    admin.post("/api/admin/jobs", async (req, reply) => {
      const j = jobInput.parse(req.body);
      let slug = slugify(j.title) || "role";
      if ((await db.query("select 1 from jobs where slug=$1", [slug])).rows.length) slug += `-${Date.now().toString(36)}`;
      try {
        const r = await db.query(
          "insert into jobs (slug,title,department,location,employment_type,summary,description,active) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *",
          [slug, j.title, j.department, j.location, j.employmentType, j.summary, j.description, j.active],
        );
        return reply.code(201).send(r.rows[0]);
      } catch (e) {
        if (isUniqueViolation(e)) return reply.code(409).send({ error: "conflict", message: "A role with that title already exists." });
        throw e;
      }
    });

    admin.patch("/api/admin/jobs/:id", async (req, reply) => {
      const id = uuid.parse((req.params as any).id);
      const j = jobInput.partial().parse(req.body);
      const { sql, params } = setClause(j, { title: "title", department: "department", location: "location", employmentType: "employment_type", summary: "summary", description: "description", active: "active" });
      if (!sql) return reply.code(400).send({ error: "empty", message: "Nothing to update." });
      const r = await db.query(`update jobs set ${sql} where id = $${params.length + 1} returning *`, [...params, id]);
      return r.rows[0] ? r.rows[0] : notFound(reply);
    });

    admin.delete("/api/admin/jobs/:id", async (req, reply) => {
      const r = await db.query("delete from jobs where id=$1", [uuid.parse((req.params as any).id)]);
      return r.rowCount ? reply.code(204).send() : notFound(reply);
    });
  });
}
