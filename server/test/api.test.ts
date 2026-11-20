import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { openDb, type Db } from "../src/db.js";
import { seed } from "../src/seed.js";
import { buildApp } from "../src/app.js";
import type { Mail } from "../src/mail.js";

const ADMIN_PW = "correct-horse-battery-staple";
let db: Db;
let app: Awaited<ReturnType<typeof buildApp>>;
const sent: Mail[] = [];
let token = "";

const validEnquiry = {
  name: "Thandi Nkosi", email: "Thandi@Example.com", phone: "+27 82 123 4567", organisation: "Nkosi Holdings",
  type: "General enquiry", contactPreference: "Email", company: "VINK Group",
  message: "We would like to explore a partnership with VINK.", consent: true,
};
const post = (url: string, payload: unknown, headers: Record<string, string> = {}) =>
  app.inject({ method: "POST", url, payload: payload as any, headers });
const auth = () => ({ authorization: `Bearer ${token}` });

before(async () => {
  // Set TEST_DATABASE_URL (to an empty database) to run this same suite against a real PostgreSQL server.
  const url = process.env.TEST_DATABASE_URL;
  const cfg = loadConfig({ adminPassword: ADMIN_PW, rateLimit: false, sessionSecret: "x".repeat(40), allowedOrigins: ["https://vinkgroup.com"], databaseUrl: url });
  db = await openDb(cfg, !url);
  await seed(db);
  app = await buildApp(db, cfg, { logger: false, mailer: async (m) => void sent.push(m) });
  const res = await post("/api/admin/login", { password: ADMIN_PW });
  token = res.json().token;
});
after(async () => { await app.close(); await db.close(); });

describe("health & seed", () => {
  it("reports healthy and database kind", async () => {
    const r = await app.inject("/api/health");
    assert.equal(r.statusCode, 200);
    assert.equal(r.json().ok, true);
  });
  it("seeds jobs and published articles", async () => {
    assert.equal((await app.inject("/api/jobs")).json().items.length, 5);
    assert.equal((await app.inject("/api/articles")).json().items.length, 6);
  });
});

describe("enquiries", () => {
  it("stores a valid enquiry, normalises email, and notifies + confirms", async () => {
    sent.length = 0;
    const r = await post("/api/enquiries", validEnquiry);
    assert.equal(r.statusCode, 201);
    const row = (await db.query("select * from enquiries where id=$1", [r.json().reference])).rows[0];
    assert.equal(row.email, "thandi@example.com");
    assert.equal(row.status, "new");
    await new Promise((res) => setTimeout(res, 20));
    assert.equal(sent.length, 2);
    assert.equal(sent[0].to, "hello@vinkgroup.com");
    assert.equal(sent[1].to, "thandi@example.com");
  });
  it("routes partnership enquiries to the partnerships inbox", async () => {
    sent.length = 0;
    await post("/api/enquiries", { ...validEnquiry, type: "Partnership" });
    await new Promise((res) => setTimeout(res, 20));
    assert.equal(sent[0].to, "partners@vinkgroup.com");
  });
  it("escapes HTML in notification emails", async () => {
    sent.length = 0;
    await post("/api/enquiries", { ...validEnquiry, message: "<script>alert(1)</script> hello there" });
    await new Promise((res) => setTimeout(res, 20));
    assert.ok(!sent[0].html.includes("<script>"));
    assert.ok(sent[0].html.includes("&lt;script&gt;"));
  });
  it("returns field-level errors for invalid input", async () => {
    const r = await post("/api/enquiries", { ...validEnquiry, email: "nope", phone: "abc", message: "short", consent: false });
    assert.equal(r.statusCode, 422);
    const f = r.json().fields;
    assert.ok(f.email && f.phone && f.message && f.consent);
  });
  it("requires cover type for insurance and destination/service for immigration", async () => {
    const a = await post("/api/enquiries", { ...validEnquiry, company: "VINK Insurance" });
    assert.ok(a.json().fields.coverage);
    const b = await post("/api/enquiries", { ...validEnquiry, company: "VINK Immigration Consultancy" });
    assert.ok(b.json().fields.destination && b.json().fields.service);
    const ok = await post("/api/enquiries", { ...validEnquiry, company: "VINK Insurance", details: { coverage: "Life cover" } });
    assert.equal(ok.statusCode, 201);
  });
  it("silently discards honeypot submissions", async () => {
    const before = (await db.query("select count(*)::int n from enquiries")).rows[0].n;
    const r = await post("/api/enquiries", { ...validEnquiry, website: "http://spam.example" });
    assert.equal(r.statusCode, 201);
    assert.equal((await db.query("select count(*)::int n from enquiries")).rows[0].n, before);
  });
  it("rejects unknown companies and oversized bodies", async () => {
    assert.equal((await post("/api/enquiries", { ...validEnquiry, company: "Evil Corp" })).statusCode, 422);
    assert.equal((await post("/api/enquiries", { ...validEnquiry, message: "x".repeat(200_000) })).statusCode, 413);
  });
});

describe("newsletter", () => {
  it("subscribes idempotently and supports unsubscribe + resubscribe", async () => {
    assert.equal((await post("/api/newsletter/subscribe", { email: "Reader@Example.com" })).statusCode, 200);
    assert.equal((await post("/api/newsletter/subscribe", { email: "reader@example.com" })).statusCode, 200);
    assert.equal((await db.query("select count(*)::int n from subscribers")).rows[0].n, 1);
    const tok = (await db.query("select unsubscribe_token t from subscribers")).rows[0].t;
    const u = await app.inject(`/api/newsletter/unsubscribe?token=${tok}`);
    assert.match(u.body, /unsubscribed/i);
    assert.ok((await db.query("select unsubscribed_at from subscribers")).rows[0].unsubscribed_at);
    await post("/api/newsletter/subscribe", { email: "reader@example.com" });
    assert.equal((await db.query("select unsubscribed_at from subscribers")).rows[0].unsubscribed_at, null);
  });
  it("rejects invalid emails", async () => {
    assert.equal((await post("/api/newsletter/subscribe", { email: "bad" })).statusCode, 422);
  });
});

describe("careers", () => {
  const app1 = { name: "Sipho Dlamini", email: "sipho@example.com", phone: "0821234567", coverNote: "I am excited to apply for this role and bring relevant experience.", consent: true };
  it("accepts an application", async () => {
    const r = await post("/api/jobs/product-designer/apply", { ...app1, linkedinUrl: "https://linkedin.com/in/sipho" });
    assert.equal(r.statusCode, 201);
    assert.equal((await db.query("select job_title from applications")).rows[0].job_title, "Product Designer");
  });
  it("404s for unknown roles and rejects non-https links", async () => {
    assert.equal((await post("/api/jobs/nope/apply", app1)).statusCode, 404);
    assert.equal((await post("/api/jobs/product-designer/apply", { ...app1, cvUrl: "javascript:alert(1)" })).statusCode, 422);
    assert.equal((await post("/api/jobs/product-designer/apply", { ...app1, cvUrl: "http://insecure.example/cv.pdf" })).statusCode, 422);
  });
});

describe("articles (public)", () => {
  it("returns a published article with body, 404 for unknown", async () => {
    const list = (await app.inject("/api/articles")).json().items;
    assert.equal(list[0].featured, true);
    const one = await app.inject(`/api/articles/${list[0].slug}`);
    assert.ok(one.json().body.length > 50);
    assert.equal((await app.inject("/api/articles/does-not-exist")).statusCode, 404);
  });
  it("filters by category", async () => {
    const items = (await app.inject("/api/articles?category=Impact")).json().items;
    assert.ok(items.length > 0 && items.every((a: any) => a.category === "Impact"));
  });
});

describe("admin security", () => {
  it("rejects wrong password and missing/forged tokens", async () => {
    assert.equal((await post("/api/admin/login", { password: "wrong" })).statusCode, 401);
    assert.equal((await app.inject("/api/admin/stats")).statusCode, 401);
    assert.equal((await app.inject({ url: "/api/admin/stats", headers: { authorization: "Bearer abc.def" } })).statusCode, 401);
    const [payload] = token.split(".");
    assert.equal((await app.inject({ url: "/api/admin/stats", headers: { authorization: `Bearer ${payload}.forged` } })).statusCode, 401);
  });
  it("rejects expired tokens", async () => {
    const { signSession } = await import("../src/security.js");
    const expired = signSession("x".repeat(40), -1);
    assert.equal((await app.inject({ url: "/api/admin/stats", headers: { authorization: `Bearer ${expired}` } })).statusCode, 401);
  });
  it("is disabled when no ADMIN_PASSWORD is configured", async () => {
    const cfg = loadConfig({ adminPassword: undefined, rateLimit: false });
    const a = await buildApp(db, cfg, { logger: false });
    const r = await a.inject({ method: "POST", url: "/api/admin/login", payload: { password: "anything" } });
    assert.equal(r.statusCode, 503);
    await a.close();
  });
});

describe("admin management", () => {
  it("shows stats", async () => {
    const s = (await app.inject({ url: "/api/admin/stats", headers: auth() })).json();
    assert.ok(s.enquiriesTotal >= 4 && s.subscribers === 1 && s.articlesPublished === 6);
  });
  it("lists, searches, updates and deletes enquiries", async () => {
    const list = (await app.inject({ url: "/api/admin/enquiries?q=thandi", headers: auth() })).json();
    assert.ok(list.total >= 1);
    assert.equal(list.items[0].ip_hash, undefined, "ip hash must not leak");
    const id = list.items[0].id;
    const p = await app.inject({ method: "PATCH", url: `/api/admin/enquiries/${id}`, headers: auth(), payload: { status: "resolved", notes: "Called back" } });
    assert.equal(p.json().status, "resolved");
    assert.equal((await app.inject({ method: "PATCH", url: `/api/admin/enquiries/${id}`, headers: auth(), payload: { status: "bogus" } })).statusCode, 422);
    assert.equal((await app.inject({ method: "DELETE", url: `/api/admin/enquiries/${id}`, headers: auth() })).statusCode, 204);
    assert.equal((await app.inject({ method: "DELETE", url: `/api/admin/enquiries/${id}`, headers: auth() })).statusCode, 404);
  });
  it("is safe against SQL injection in search", async () => {
    const r = await app.inject({ url: `/api/admin/enquiries?q=${encodeURIComponent("' or 1=1; drop table enquiries; --")}`, headers: auth() });
    assert.equal(r.statusCode, 200);
    assert.equal(r.json().total, 0);
    assert.ok((await db.query("select count(*) from enquiries")).rows.length);
  });
  it("exports CSV and neutralises formula injection", async () => {
    await post("/api/enquiries", { ...validEnquiry, name: "=HYPERLINK(\"http://evil\")", message: "A message long enough to pass." });
    const r = await app.inject({ url: "/api/admin/enquiries/export.csv", headers: auth() });
    assert.match(r.headers["content-type"] as string, /text\/csv/);
    assert.ok(r.body.includes(`"'=HYPERLINK`), "formula cell must be prefixed with a quote");
  });
  it("manages applications", async () => {
    const a = (await app.inject({ url: "/api/admin/applications", headers: auth() })).json().items[0];
    const p = await app.inject({ method: "PATCH", url: `/api/admin/applications/${a.id}`, headers: auth(), payload: { status: "shortlisted" } });
    assert.equal(p.json().status, "shortlisted");
  });
  it("exports active subscribers", async () => {
    const r = await app.inject({ url: "/api/admin/subscribers/export.csv", headers: auth() });
    assert.ok(r.body.includes("reader@example.com"));
  });
  it("creates, publishes, edits and deletes articles", async () => {
    const draft = await app.inject({ method: "POST", url: "/api/admin/articles", headers: auth(), payload: { title: "Draft Story", category: "Impact", body: "Hello world body text." } });
    assert.equal(draft.statusCode, 201);
    const { id, slug } = draft.json();
    assert.equal((await app.inject(`/api/articles/${slug}`)).statusCode, 404, "drafts stay private");
    const pub = await app.inject({ method: "PATCH", url: `/api/admin/articles/${id}`, headers: auth(), payload: { status: "published" } });
    assert.ok(pub.json().published_at);
    assert.equal((await app.inject(`/api/articles/${slug}`)).statusCode, 200);
    const dup = await app.inject({ method: "POST", url: "/api/admin/articles", headers: auth(), payload: { title: "Draft Story", category: "Impact" } });
    assert.equal(dup.json().slug, "draft-story-2");
    assert.equal((await app.inject({ method: "DELETE", url: `/api/admin/articles/${id}`, headers: auth() })).statusCode, 204);
  });
  it("creates and closes jobs", async () => {
    const j = await app.inject({ method: "POST", url: "/api/admin/jobs", headers: auth(), payload: { title: "Data Engineer", department: "Technology", location: "Remote" } });
    assert.equal(j.statusCode, 201);
    assert.equal((await app.inject("/api/jobs")).json().items.length, 6);
    await app.inject({ method: "PATCH", url: `/api/admin/jobs/${j.json().id}`, headers: auth(), payload: { active: false } });
    assert.equal((await app.inject("/api/jobs")).json().items.length, 5);
  });
});

describe("CORS and rate limiting", () => {
  it("only allows configured origins", async () => {
    const ok = await app.inject({ url: "/api/health", headers: { origin: "https://vinkgroup.com" } });
    assert.equal(ok.headers["access-control-allow-origin"], "https://vinkgroup.com");
    const bad = await app.inject({ url: "/api/health", headers: { origin: "https://evil.example" } });
    assert.equal(bad.headers["access-control-allow-origin"], undefined);
  });
  it("throttles repeated form submissions", async () => {
    const cfg = loadConfig({ rateLimit: true, adminPassword: ADMIN_PW });
    const a = await buildApp(db, cfg, { logger: false, mailer: async () => {} });
    const codes: number[] = [];
    for (let i = 0; i < 8; i++) codes.push((await a.inject({ method: "POST", url: "/api/enquiries", payload: validEnquiry })).statusCode);
    assert.deepEqual(codes.slice(0, 6), [201, 201, 201, 201, 201, 201]);
    assert.equal(codes[6], 429);
    await a.close();
  });
  it("sets security headers", async () => {
    const r = await app.inject("/api/health");
    assert.equal(r.headers["x-content-type-options"], "nosniff");
  });
});
