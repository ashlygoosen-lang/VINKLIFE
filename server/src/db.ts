import pg from "pg";
import { PGlite } from "@electric-sql/pglite";
import type { Config } from "./config.js";
import { schemaSql } from "./schema.js";

export interface Db {
  query<T = any>(text: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>;
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
  kind: "postgres" | "pglite";
}

/**
 * Production uses a real PostgreSQL server (DATABASE_URL, e.g. Railway Postgres).
 * Without DATABASE_URL we fall back to PGlite — real Postgres compiled to WASM, stored on disk —
 * so local development and tests need no database install and run identical SQL.
 */
export async function openDb(cfg: Config, memory = false): Promise<Db> {
  let db: Db;
  if (cfg.databaseUrl && !memory) {
    const pool = new pg.Pool({
      connectionString: cfg.databaseUrl,
      max: 10,
      ssl: cfg.pgSsl ? { rejectUnauthorized: false } : undefined,
    });
    db = {
      kind: "postgres",
      query: async (text, params) => {
        const r = await pool.query(text, params as any[]);
        return { rows: r.rows, rowCount: r.rowCount ?? r.rows.length };
      },
      exec: async (sql) => void (await pool.query(sql)),
      close: () => pool.end(),
    };
  } else {
    const lite = await PGlite.create(memory ? "memory://" : cfg.pgliteDir);
    db = {
      kind: "pglite",
      query: async (text, params) => {
        const r = await lite.query<any>(text, params as any[]);
        return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length };
      },
      exec: async (sql) => void (await lite.exec(sql)),
      close: () => lite.close(),
    };
  }
  await db.exec(schemaSql);
  return db;
}
