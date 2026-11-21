import type { Config } from "./config.js";
import { escapeHtml } from "./security.js";

export interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export type Mailer = (mail: Mail) => Promise<void>;

/** Sends through Resend's HTTP API. Never throws: a mail problem must not lose a stored enquiry. */
export function createMailer(cfg: Config, log: { info: (o: unknown, m?: string) => void; error: (o: unknown, m?: string) => void }): Mailer {
  return async (mail) => {
    if (!cfg.resendKey) {
      log.info({ to: mail.to, subject: mail.subject }, "mail skipped (RESEND_API_KEY not set)");
      return;
    }
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${cfg.resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: cfg.mailFrom, to: mail.to, subject: mail.subject, html: mail.html, reply_to: mail.replyTo }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) log.error({ status: res.status, body: await res.text() }, "mail provider rejected message");
    } catch (err) {
      log.error({ err }, "mail send failed");
    }
  };
}

const wrap = (title: string, inner: string) => `<!doctype html><html><body style="margin:0;background:#f4ede1;font-family:Arial,sans-serif;color:#1a0c0e">
<div style="max-width:600px;margin:0 auto;padding:32px 20px">
<div style="background:#5a0a10;padding:22px 28px;border-radius:14px 14px 0 0;border-bottom:3px solid #d3a323"><span style="color:#f0d58a;font-size:20px;font-weight:700;letter-spacing:.5px">VINK Group</span></div>
<div style="background:#fff;padding:28px;border-radius:0 0 14px 14px"><h2 style="margin:0 0 18px;color:#5a0a10;font-size:20px">${escapeHtml(title)}</h2>${inner}</div>
<p style="color:#8a7b77;font-size:12px;text-align:center;margin-top:18px">VINK Group of Companies · Cape Town</p></div></body></html>`;

export function rowsTable(rows: [string, string][]): string {
  return `<table style="width:100%;border-collapse:collapse;font-size:14px">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#6b5e5b;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;
}

export const layout = wrap;
