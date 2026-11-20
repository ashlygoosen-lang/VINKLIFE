import { useCallback, useEffect, useState, type FormEvent } from "react";
import { admin, ApiError, fmtDate } from "./api";
import { Emblem, Icon, Link } from "./ui";

type Tab = "enquiries" | "applications" | "subscribers" | "articles" | "jobs";
const TOKEN_KEY = "vink_admin_token";

const ENQUIRY_STATUS = ["new", "in_progress", "resolved", "spam"];
const APPLICATION_STATUS = ["new", "reviewing", "shortlisted", "rejected", "hired"];
const label = (s: string) => s.replace("_", " ").replace(/^./, (c) => c.toUpperCase());
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-ZA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? "");
  useEffect(() => {
    const meta = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex,nofollow" });
    document.head.appendChild(meta);
    return () => void meta.remove();
  }, []);
  const signOut = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
  }, []);
  return token ? (
    <Dashboard token={token} onSignOut={signOut} />
  ) : (
    <Login
      onToken={(t) => {
        sessionStorage.setItem(TOKEN_KEY, t);
        setToken(t);
      }}
    />
  );
}

function Login({ onToken }: { onToken: (t: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onToken((await admin.login(pw)).token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="admin-login">
      <form onSubmit={submit} className="admin-login-card">
        <Emblem />
        <h1>Admin sign in</h1>
        <p>VINK Group website management</p>
        <label>
          Password
          <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        </label>
        {error && <p className="form-alert" role="alert">{error}</p>}
        <button className="button button-gold" disabled={busy || !pw}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link to="home" className="text-link">Back to website</Link>
      </form>
    </div>
  );
}

function Dashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("enquiries");
  const [stats, setStats] = useState<Record<string, number>>({});
  const [bump, setBump] = useState(0);
  const refresh = () => setBump((n) => n + 1);

  useEffect(() => {
    admin.stats(token).then(setStats).catch((e) => e instanceof ApiError && e.status === 401 && onSignOut());
  }, [token, bump, onSignOut]);

  const tabs: [Tab, string, number | undefined][] = [
    ["enquiries", "Enquiries", stats.enquiriesNew],
    ["applications", "Applications", stats.applicationsNew],
    ["subscribers", "Subscribers", undefined],
    ["articles", "Articles", undefined],
    ["jobs", "Jobs", undefined],
  ];
  const cards: [string, number | undefined][] = [
    ["New enquiries", stats.enquiriesNew],
    ["Enquiries this week", stats.enquiriesWeek],
    ["Subscribers", stats.subscribers],
    ["New applications", stats.applicationsNew],
  ];

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-brand">
          <Emblem />
          <strong>VINK Admin</strong>
        </div>
        <div className="admin-top-actions">
          <Link to="home" className="text-link">View site</Link>
          <button className="button button-small button-outline" onClick={onSignOut}>Sign out</button>
        </div>
      </header>
      <div className="admin-body">
        <div className="admin-stats">
          {cards.map(([l, n]) => (
            <div key={l}>
              <strong>{n ?? "–"}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <nav className="admin-tabs" aria-label="Admin sections">
          {tabs.map(([id, text, badge]) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
              {text}
              {!!badge && <b>{badge}</b>}
            </button>
          ))}
        </nav>
        {tab === "enquiries" && <Inbox token={token} resource="enquiries" statuses={ENQUIRY_STATUS} onChange={refresh} onSignOut={onSignOut} />}
        {tab === "applications" && <Inbox token={token} resource="applications" statuses={APPLICATION_STATUS} onChange={refresh} onSignOut={onSignOut} />}
        {tab === "subscribers" && <Subscribers token={token} onChange={refresh} />}
        {tab === "articles" && <Articles token={token} onChange={refresh} />}
        {tab === "jobs" && <Jobs token={token} onChange={refresh} />}
      </div>
    </div>
  );
}

/* ───────── Enquiries & applications ───────── */
function Inbox({ token, resource, statuses, onChange, onSignOut }: { token: string; resource: "enquiries" | "applications"; statuses: string[]; onChange: () => void; onSignOut: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const isEnq = resource === "enquiries";

  useEffect(() => {
    const qs = new URLSearchParams({ limit: "100", ...(status && { status }), ...(q && { q }) });
    const h = setTimeout(() => {
      admin.list(token, resource, `?${qs}`)
        .then((r) => { setRows(r.items); setTotal(r.total ?? r.items.length); setError(""); })
        .catch((e) => (e.status === 401 ? onSignOut() : setError(e.message)));
    }, q ? 250 : 0);
    return () => clearTimeout(h);
  }, [token, resource, status, q, tick, onSignOut]);

  const save = async (id: string, body: object) => {
    await admin.update(token, resource, id, body);
    setTick((n) => n + 1);
    onChange();
  };
  const del = async (id: string) => {
    if (!confirm("Permanently delete this record? This cannot be undone.")) return;
    await admin.remove(token, resource, id);
    setOpen(null);
    setTick((n) => n + 1);
    onChange();
  };

  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <input placeholder={isEnq ? "Search name, email, message…" : "Search name, email, role…"} value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        {isEnq && <button className="button button-small button-outline" onClick={() => admin.download(token, "enquiries/export.csv", "enquiries.csv")}>Export CSV</button>}
        <span className="admin-count">{total} total</span>
      </div>
      {error && <p className="form-alert">{error}</p>}
      <div className="admin-list">
        {rows.map((r) => (
          <article key={r.id} className={`admin-row ${open === r.id ? "open" : ""}`}>
            <button className="admin-row-head" onClick={() => setOpen(open === r.id ? null : r.id)} aria-expanded={open === r.id}>
              <span className={`pill s-${r.status}`}>{label(r.status)}</span>
              <strong>{r.name}</strong>
              <span className="muted">{isEnq ? `${r.company} · ${r.type}` : r.job_title}</span>
              <time>{when(r.created_at)}</time>
            </button>
            {open === r.id && (
              <div className="admin-row-body">
                <dl>
                  <dt>Email</dt><dd><a href={`mailto:${r.email}`}>{r.email}</a></dd>
                  <dt>Phone</dt><dd><a href={`tel:${r.phone}`}>{r.phone}</a></dd>
                  {isEnq && <><dt>Organisation</dt><dd>{r.organisation || "—"}</dd><dt>Preferred</dt><dd>{r.contact_preference}</dd></>}
                  {isEnq && Object.entries(r.details ?? {}).filter(([, v]) => v).map(([k, v]) => <div key={k} className="dl-pair"><dt>{k}</dt><dd>{String(v)}</dd></div>)}
                  {!isEnq && r.linkedin_url && <><dt>LinkedIn</dt><dd><a href={r.linkedin_url} target="_blank" rel="noopener noreferrer">{r.linkedin_url}</a></dd></>}
                  {!isEnq && r.cv_url && <><dt>CV</dt><dd><a href={r.cv_url} target="_blank" rel="noopener noreferrer">{r.cv_url}</a></dd></>}
                </dl>
                <p className="admin-message">{isEnq ? r.message : r.cover_note}</p>
                <div className="admin-row-actions">
                  <label>Status
                    <select value={r.status} onChange={(e) => save(r.id, { status: e.target.value })}>
                      {statuses.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                    </select>
                  </label>
                  <label className="grow">Internal notes
                    <textarea defaultValue={r.notes} rows={2} onBlur={(e) => e.target.value !== r.notes && save(r.id, { notes: e.target.value })} />
                  </label>
                  <button className="button button-small button-outline danger" onClick={() => del(r.id)}>Delete</button>
                </div>
              </div>
            )}
          </article>
        ))}
        {!rows.length && !error && <div className="empty">Nothing here yet.</div>}
      </div>
    </section>
  );
}

/* ───────── Subscribers ───────── */
function Subscribers({ token, onChange }: { token: string; onChange: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    admin.list(token, "subscribers", "?limit=200").then((r) => { setRows(r.items); setTotal(r.total ?? r.items.length); });
  }, [token, tick]);
  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <button className="button button-small button-outline" onClick={() => admin.download(token, "subscribers/export.csv", "subscribers.csv")}>Export active (CSV)</button>
        <span className="admin-count">{total} total</span>
      </div>
      <div className="admin-list">
        {rows.map((r) => (
          <article key={r.id} className="admin-row simple">
            <span className={`pill ${r.unsubscribed_at ? "s-spam" : "s-resolved"}`}>{r.unsubscribed_at ? "Unsubscribed" : "Active"}</span>
            <strong>{r.email}</strong>
            <span className="muted">{r.source}</span>
            <time>{fmtDate(r.created_at)}</time>
            <button className="link-danger" onClick={async () => { if (confirm(`Delete ${r.email}?`)) { await admin.remove(token, "subscribers", r.id); setTick((n) => n + 1); onChange(); } }}>Delete</button>
          </article>
        ))}
        {!rows.length && <div className="empty">No subscribers yet.</div>}
      </div>
    </section>
  );
}

/* ───────── Articles ───────── */
const blankArticle = { title: "", category: "Group news", excerpt: "", body: "", imageUrl: "", status: "draft", featured: false };

function Articles({ token, onChange }: { token: string; onChange: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [tick, setTick] = useState(0);
  const [edit, setEdit] = useState<any | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { admin.list(token, "articles").then((r) => setRows(r.items)); }, [token, tick]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const body = { title: edit.title, category: edit.category, excerpt: edit.excerpt, body: edit.body, imageUrl: edit.imageUrl ?? edit.image_url ?? "", status: edit.status, featured: edit.featured };
    try {
      if (edit.id) await admin.update(token, "articles", edit.id, body);
      else await admin.create(token, "articles", body);
      setEdit(null);
      setTick((n) => n + 1);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? Object.values(err.fields ?? {})[0] ?? err.message : "Could not save.");
    }
  };

  if (edit)
    return (
      <section className="admin-panel">
        <form className="admin-form" onSubmit={save}>
          <h2>{edit.id ? "Edit article" : "New article"}</h2>
          <label>Title<input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} required /></label>
          <div className="form-row">
            <label>Category
              <select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>
                {["Group news", "Impact", "Perspective"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Status
              <select value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                <option value="draft">Draft (private)</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
          <label>Summary<textarea rows={2} value={edit.excerpt} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} /></label>
          <label>Image link (https://…)<input value={edit.imageUrl ?? edit.image_url ?? ""} onChange={(e) => setEdit({ ...edit, imageUrl: e.target.value, image_url: e.target.value })} /></label>
          <label>Article text <small>(leave a blank line between paragraphs)</small><textarea rows={14} value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /></label>
          <label className="consent-field"><input type="checkbox" checked={edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /><span>Feature this article at the top of the News page</span></label>
          {error && <p className="form-alert">{error}</p>}
          <div className="form-submit">
            <button className="button button-small" type="submit">Save article</button>
            <button type="button" className="button button-small button-outline" onClick={() => setEdit(null)}>Cancel</button>
          </div>
        </form>
      </section>
    );

  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <button className="button button-small" onClick={() => setEdit({ ...blankArticle })}><Icon name="plus" size={16} /> New article</button>
        <span className="admin-count">{rows.length} total</span>
      </div>
      <div className="admin-list">
        {rows.map((r) => (
          <article key={r.id} className="admin-row simple">
            <span className={`pill ${r.status === "published" ? "s-resolved" : "s-new"}`}>{label(r.status)}</span>
            <strong>{r.title}{r.featured && " ★"}</strong>
            <span className="muted">{r.category}</span>
            <time>{fmtDate(r.published_at ?? r.created_at)}</time>
            <button className="link-action" onClick={() => setEdit(r)}>Edit</button>
            <button className="link-danger" onClick={async () => { if (confirm("Delete this article?")) { await admin.remove(token, "articles", r.id); setTick((n) => n + 1); onChange(); } }}>Delete</button>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ───────── Jobs ───────── */
function Jobs({ token, onChange }: { token: string; onChange: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState({ title: "", department: "", location: "", summary: "", description: "" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { admin.list(token, "jobs").then((r) => setRows(r.items)); }, [token, tick]);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await admin.create(token, "jobs", form);
      setForm({ title: "", department: "", location: "", summary: "", description: "" });
      setAdding(false);
      setTick((n) => n + 1);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? Object.values(err.fields ?? {})[0] ?? err.message : "Could not save.");
    }
  };

  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <button className="button button-small" onClick={() => setAdding(!adding)}><Icon name="plus" size={16} /> {adding ? "Close" : "New role"}</button>
        <span className="admin-count">{rows.filter((r) => r.active).length} open</span>
      </div>
      {adding && (
        <form className="admin-form" onSubmit={add}>
          <div className="form-row">
            <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
            <label>Department<input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required /></label>
          </div>
          <label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></label>
          <label>One-line summary<input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label>
          <label>Description<textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          {error && <p className="form-alert">{error}</p>}
          <div className="form-submit"><button className="button button-small" type="submit">Publish role</button></div>
        </form>
      )}
      <div className="admin-list">
        {rows.map((r) => (
          <article key={r.id} className="admin-row simple">
            <span className={`pill ${r.active ? "s-resolved" : "s-spam"}`}>{r.active ? "Open" : "Closed"}</span>
            <strong>{r.title}</strong>
            <span className="muted">{r.department} · {r.location}</span>
            <time>{fmtDate(r.created_at)}</time>
            <button className="link-action" onClick={async () => { await admin.update(token, "jobs", r.id, { active: !r.active }); setTick((n) => n + 1); onChange(); }}>{r.active ? "Close" : "Reopen"}</button>
            <button className="link-danger" onClick={async () => { if (confirm("Delete this role?")) { await admin.remove(token, "jobs", r.id); setTick((n) => n + 1); onChange(); } }}>Delete</button>
          </article>
        ))}
      </div>
    </section>
  );
}
