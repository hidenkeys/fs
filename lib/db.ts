import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool, type QueryResultRow } from "pg";

declare global {
  var fsPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database-backed content.");
  }

  const url = new URL(connectionString);
  url.searchParams.delete("sslmode");

  const poolMax = Number(process.env.PG_POOL_MAX ?? (process.env.VERCEL ? "1" : "5"));

  return new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: Number.isFinite(poolMax) && poolMax > 0 ? poolMax : 1,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 5_000,
    maxUses: 100
  });
}

export const db = globalThis.fsPgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.fsPgPool = db;
}

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  schemaReady ??= readFile(path.join(process.cwd(), "db/schema.sql"), "utf8").then((schema) =>
    db.query(schema).then(() => undefined)
  );

  return schemaReady;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  await ensureSchema();
  return db.query<T>(text, params);
}
