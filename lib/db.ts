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

  return new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false }
  });
}

export const db = globalThis.fsPgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.fsPgPool = db;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
) {
  return db.query<T>(text, params);
}
