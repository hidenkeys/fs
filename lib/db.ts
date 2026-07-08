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

  const poolMax = Number(process.env.PG_POOL_MAX ?? "1");

  return new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: Number.isFinite(poolMax) && poolMax > 0 ? poolMax : 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
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

  try {
    await schemaReady;
  } catch (error) {
    schemaReady = null;
    throw error;
  }
}

function isTransientDatabaseError(error: unknown) {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();

  return (
    message.includes("connection terminated") ||
    message.includes("connection timeout") ||
    message.includes("timeout exceeded") ||
    message.includes("too many clients")
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await ensureSchema();
      return await db.query<T>(text, params);
    } catch (error) {
      lastError = error;

      if (!isTransientDatabaseError(error) || attempt === 2) {
        throw error;
      }

      await wait(250 * (attempt + 1));
    }
  }

  throw lastError;
}
