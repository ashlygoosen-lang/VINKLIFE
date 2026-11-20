import { useEffect, useState } from "react";

const BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      ...rest,
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(0, "We couldn’t reach the server. Please check your connection and try again.");
  }
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message ?? "Something went wrong. Please try again.", data.fields);
  return data as T;
}

const json = (method: string, body?: unknown, token?: string): RequestInit & { token?: string } => ({
  method,
  token,
  body: body === undefined ? undefined : JSON.stringify(body),
});

/* ───────── Types ───────── */
export interface ArticleCard {
  slug: string;
  title: string;
  category: "Group news" | "Impact" | "Perspective";
  excerpt: string;
  imageUrl: string;
  featured: boolean;
  publishedAt: string | null;
}
export interface Article extends ArticleCard {
  body: string;
}
export interface Job {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  summary: string;
  description: string;
}

/* ───────── Public API ───────── */
export const api = {
  sendEnquiry: (data: unknown) => request<{ ok: true; reference?: string }>("/api/enquiries", json("POST", data)),
  subscribe: (email: string, website = "") =>
    request<{ ok: true }>("/api/newsletter/subscribe", json("POST", { email, website })),
  jobs: () => request<{ items: Job[] }>("/api/jobs").then((r) => r.items),
  apply: (slug: string, data: unknown) =>
    request<{ ok: true; reference?: string }>(`/api/jobs/${encodeURIComponent(slug)}/apply`, json("POST", data)),
  articles: (limit?: number) =>
    request<{ items: ArticleCard[] }>(`/api/articles${limit ? `?limit=${limit}` : ""}`).then((r) => r.items),
  article: (slug: string) => request<Article>(`/api/articles/${encodeURIComponent(slug)}`),
};

/* ───────── Admin API ───────── */
export const admin = {
  login: (password: string) => request<{ token: string }>("/api/admin/login", json("POST", { password })),
  stats: (t: string) => request<Record<string, number>>("/api/admin/stats", { token: t }),
  list: <T = any>(t: string, resource: string, query = "") =>
    request<{ items: T[]; total?: number }>(`/api/admin/${resource}${query}`, { token: t }),
  create: (t: string, resource: string, body: unknown) => request<any>(`/api/admin/${resource}`, json("POST", body, t)),
  update: (t: string, resource: string, id: string, body: unknown) =>
    request<any>(`/api/admin/${resource}/${id}`, json("PATCH", body, t)),
  remove: (t: string, resource: string, id: string) => request<void>(`/api/admin/${resource}/${id}`, json("DELETE", undefined, t)),
  async download(t: string, path: string, filename: string) {
    const res = await fetch(BASE + `/api/admin/${path}`, { headers: { Authorization: `Bearer ${t}` } });
    if (!res.ok) throw new ApiError(res.status, "Could not export the file.");
    const url = URL.createObjectURL(await res.blob());
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    a.click();
    URL.revokeObjectURL(url);
  },
};

/* ───────── Hook ───────── */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{ data?: T; error?: ApiError; loading: boolean }>({ loading: true });
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    fn()
      .then((data) => live && setState({ data, loading: false }))
      .catch((error) => live && setState({ error, loading: false }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

export const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }) : "";
