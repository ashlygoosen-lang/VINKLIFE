import type { FastifyInstance } from "fastify";
import type { Db } from "../db.js";
import type { Config } from "../config.js";
import type { Mailer } from "../mail.js";
import { layout, rowsTable } from "../mail.js";
import { applicationSchema, enquirySchema, subscribeSchema } from "../validation.js";
import { escapeHtml, hashIp, randomToken } from "../security.js";

interface Deps {
  db: Db;
  cfg: Config;
  mail: Mailer;
}

// When rate limiting is off (tests) the plugin isn't registered, so this config is simply ignored.
const strict = (_cfg: Config, max: number, window = "10 minutes") => ({ rateLimit: { max, timeWindow: window } });

const articleCard = (r: any) => ({
  slug: r.slug,
  title: r.title,
  category: r.category,
  excerpt: r.excerpt,
  imageUrl: r.image_url,
  featured: r.featured,
  publishedAt: r.published_at,
});

export function publicRoutes(app: FastifyInstance, { db, cfg, mail }: Deps) {
  app.get("/api/health", async () => {
    await db.query("select 1");
    return { ok: true, db: db.kind, time: new Date().toISOString() };
  });

  /* ───────── Enquiries ───────── */
  app.post("/api/enquiries", { config: strict(cfg, 6) }, async (req, reply) => {
    const body = enquirySchema.parse(req.body);
    if (body.website) return reply.code(201).send({ ok: true }); // honeypot: pretend success, store nothing

    const { rows } = await db.query<{ id: string }>(
      `insert into enquiries (name,email,phone,organisation,type,contact_preference,company,message,details,consent_at,ip_hash)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,now(),$10) returning id`,
      [body.name, body.email, body.phone, body.organisation, body.type, body.contactPreference, body.company, body.message, JSON.stringify(body.details), hashIp(req.ip, cfg.sessionSecret)],
    );

    const inbox = body.type === "Partnership" ? cfg.partnersEmail : body.type === "Investor relations" ? cfg.investEmail : cfg.notifyEmail;
    const detailRows = Object.entries(body.details).filter(([, v]) => v).map(([k, v]) => [k, String(v)] as [string, string]);
    void mail({
      to: inbox,
      replyTo: body.email,
      subject: `[VINK] ${body.type} · ${body.company} · ${body.name}`,
      html: layout("New website enquiry", rowsTable([
        ["Name", body.name], ["Email", body.email], ["Phone", body.phone], ["Organisation", body.organisation],
        ["Type", body.type], ["Company", body.company], ["Preferred response", body.contactPreference],
        ...detailRows, ["Message", body.message], ["Reference", rows[0].id],
      ])),
    });
    void mail({
      to: body.email,
      subject: "We’ve received your enquiry — VINK Group",
      html: layout(`Thank you, ${body.name.split(" ")[0]}`, `<p style="line-height:1.6">We’ve received your message and a member of our team will respond within two business days by ${escapeHtml(body.contactPreference.toLowerCase())}.</p><p style="color:#6b5e5b;font-size:13px">Reference: ${rows[0].id}</p>`),
    });
    return reply.code(201).send({ ok: true, reference: rows[0].id });
  });

  /* ───────── Newsletter ───────── */
  app.post("/api/newsletter/subscribe", { config: strict(cfg, 8) }, async (req, reply) => {
    const body = subscribeSchema.parse(req.body);
    if (body.website) return reply.send({ ok: true });
    const token = randomToken();
    const { rows } = await db.query<{ unsubscribe_token: string }>(
      `insert into subscribers (email, source, unsubscribe_token) values ($1,$2,$3)
       on conflict ((lower(email))) do update set unsubscribed_at = null
         where subscribers.unsubscribed_at is not null
       returning unsubscribe_token`,
      [body.email, body.source, token],
    );
    // Always answer the same way so the endpoint can't be used to discover who is subscribed.
    if (rows[0]) {
      const link = `${cfg.publicApiUrl}/api/newsletter/unsubscribe?token=${rows[0].unsubscribe_token}`;
      void mail({
        to: body.email,
        subject: "You’re on the list — The VINK Brief",
        html: layout("Welcome to The VINK Brief", `<p style="line-height:1.6">Thank you for subscribing. You’ll receive group news, useful ideas and impact stories, thoughtfully delivered.</p><p style="font-size:12px;color:#8a7b77">Changed your mind? <a href="${link}">Unsubscribe</a> at any time.</p>`),
      });
    }
    return reply.send({ ok: true });
  });

  app.get("/api/newsletter/unsubscribe", { config: strict(cfg, 30) }, async (req, reply) => {
    const token = String((req.query as any)?.token ?? "");
    const r = token ? await db.query("update subscribers set unsubscribed_at = now() where unsubscribe_token = $1 and unsubscribed_at is null", [token]) : { rowCount: 0 };
    const msg = r.rowCount ? "You have been unsubscribed." : "This link has already been used or is not valid.";
    return reply.type("text/html").send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The VINK Brief</title><body style="font-family:Arial,sans-serif;background:#f4ede1;display:grid;place-items:center;min-height:100vh;margin:0"><div style="background:#fff;padding:40px;border-radius:16px;max-width:420px;text-align:center;border-top:4px solid #d3a323"><h2 style="color:#5a0a10;margin-top:0">${msg}</h2><a style="color:#a30d18" href="${cfg.siteUrl}">Return to vinkgroup</a></div></body>`);
  });

  /* ───────── Careers ───────── */
  app.get("/api/jobs", async () => {
    const { rows } = await db.query("select * from jobs where active order by created_at desc");
    return { items: rows.map((r) => ({ slug: r.slug, title: r.title, department: r.department, location: r.location, employmentType: r.employment_type, summary: r.summary, description: r.description })) };
  });

  app.post("/api/jobs/:slug/apply", { config: strict(cfg, 5, "1 hour") }, async (req, reply) => {
    const body = applicationSchema.parse(req.body);
    const { slug } = req.params as { slug: string };
    const job = (await db.query("select id,title from jobs where slug=$1 and active", [slug])).rows[0];
    if (!job) return reply.code(404).send({ error: "not_found", message: "This role is no longer open." });
    if (body.website) return reply.code(201).send({ ok: true });

    const { rows } = await db.query<{ id: string }>(
      `insert into applications (job_id,job_title,name,email,phone,linkedin_url,cv_url,cover_note,consent_at,ip_hash)
       values ($1,$2,$3,$4,$5,$6,$7,$8,now(),$9) returning id`,
      [job.id, job.title, body.name, body.email, body.phone, body.linkedinUrl, body.cvUrl, body.coverNote, hashIp(req.ip, cfg.sessionSecret)],
    );
    void mail({
      to: cfg.careersEmail,
      replyTo: body.email,
      subject: `[VINK Careers] ${job.title} · ${body.name}`,
      html: layout("New job application", rowsTable([["Role", job.title], ["Name", body.name], ["Email", body.email], ["Phone", body.phone], ["LinkedIn", body.linkedinUrl], ["CV link", body.cvUrl], ["Cover note", body.coverNote], ["Reference", rows[0].id]])),
    });
    void mail({
      to: body.email,
      subject: `Application received — ${job.title}`,
      html: layout(`Thank you, ${body.name.split(" ")[0]}`, `<p style="line-height:1.6">We’ve received your application for <b>${escapeHtml(job.title)}</b>. Our team reviews every application and will be in touch if there is a fit.</p>`),
    });
    return reply.code(201).send({ ok: true, reference: rows[0].id });
  });

  /* ───────── News & insights ───────── */
  app.get("/api/articles", async (req) => {
    const q = req.query as { category?: string; limit?: string };
    const limit = Math.min(Math.max(Number(q.limit) || 24, 1), 60);
    const params: unknown[] = [limit];
    let where = "status = 'published' and published_at <= now()";
    if (q.category) {
      params.push(q.category);
      where += ` and category = $${params.length}`;
    }
    const { rows } = await db.query(`select * from articles where ${where} order by featured desc, published_at desc limit $1`, params);
    return { items: rows.map(articleCard) };
  });

  app.get("/api/articles/:slug", async (req, reply) => {
    const { slug } = req.params as { slug: string };
    const { rows } = await db.query("select * from articles where slug=$1 and status='published' and published_at <= now()", [slug]);
    if (!rows[0]) return reply.code(404).send({ error: "not_found", message: "Article not found." });
    return { ...articleCard(rows[0]), body: rows[0].body };
  });
}
