/**
 * Direct PostgreSQL client for server-side DB operations.
 *
 * WHY: We use this instead of Supabase service_role because:
 * 1. The service_role key requires Supabase Dashboard access to retrieve
 * 2. Direct pg connection bypasses RLS, giving us full admin access
 * 3. Works in any environment (Vercel, local, etc.) with just the DB URL
 *
 * SECURITY: This module is server-only. Never import in client components.
 * All routes that use this must verify authentication via session cookie
 * BEFORE calling these functions.
 */
import { Client } from "pg";
import type { QueryResult, QueryResultRow } from "pg";
import { lookup as dnsLookup } from "dns/promises";

const DATABASE_URL = process.env.DATABASE_URL || process.env.DIRECT_URL!;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Parse the connection string once
const dbUrl = new URL(DATABASE_URL);
const DB_HOST = dbUrl.hostname;
const DB_PORT = parseInt(dbUrl.port) || 5432;
const DB_USER = dbUrl.username;
const DB_PASSWORD = decodeURIComponent(dbUrl.password);
const DB_NAME = dbUrl.pathname.slice(1) || "postgres";

// Cache the resolved IPv4 address to avoid repeated DNS lookups
let _resolvedHost: string | null = null;

async function resolveHost(): Promise<string> {
  if (_resolvedHost) return _resolvedHost;
  try {
    // Use dns.promises.lookup with family:4 to force IPv4
    const result = await dnsLookup(DB_HOST, { family: 4 });
    _resolvedHost = result.address;
    return _resolvedHost;
  } catch {
    // Fallback to the original hostname (let pg handle it)
    return DB_HOST;
  }
}

// Connection pool — single shared client
let _client: Client | null = null;
let _connecting: Promise<Client> | null = null;

async function getClient(): Promise<Client> {
  if (_client) {
    // Verify connection is still alive
    try {
      await _client.query("SELECT 1");
      return _client;
    } catch {
      _client = null;
    }
  }

  // Avoid duplicate connection attempts
  if (_connecting) return _connecting;

  _connecting = (async () => {
    // Resolve host to IPv4 to avoid IPv6 connection issues
    const host = await resolveHost();

    const client = new Client({
      host,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 30000,
      query_timeout: 30000,
    });

    await client.connect();
    _client = client;
    _connecting = null;
    return client;
  })();

  return _connecting;
}

/**
 * Execute a parameterized query.
 * Returns the full pg QueryResult.
 *
 * Example:
 *   const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  const client = await getClient();
  return client.query<T>(text, params);
}

/**
 * Execute a query and return only the rows.
 *
 * Example:
 *   const users = await queryMany<UserRow>("SELECT * FROM users");
 */
export async function queryMany<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

/**
 * Execute a query and return the first row, or null.
 *
 * Example:
 *   const user = await queryOne<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
 */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await queryMany<T>(text, params);
  return rows[0] ?? null;
}

/**
 * Insert a row into a table and return the inserted row.
 *
 * Example:
 *   const course = await insertOne("courses", {
 *     teacher_id: "...",
 *     title: "...",
 *     ...
 *   });
 */
export async function insertOne<T extends QueryResultRow = QueryResultRow>(
  table: string,
  data: Record<string, unknown>,
): Promise<T> {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`;
  const result = await query<T>(sql, values);
  return result.rows[0];
}

/**
 * Update rows in a table matching a condition, return updated rows.
 *
 * Example:
 *   const updated = await updateOne("courses", { title: "new" }, "id = $1", [courseId]);
 */
export async function updateOne<T extends QueryResultRow = QueryResultRow>(
  table: string,
  data: Record<string, unknown>,
  where: string,
  whereParams: unknown[] = [],
): Promise<T | null> {
  const setClause = Object.keys(data)
    .map((k, i) => `${k} = $${i + 1}`)
    .join(", ");
  const values = [...Object.values(data), ...whereParams];
  const sql = `UPDATE ${table} SET ${setClause}, updated_at = NOW() WHERE ${where} RETURNING *`;
  const result = await query<T>(sql, values);
  return result.rows[0] ?? null;
}

/**
 * Delete rows matching a condition.
 */
export async function deleteRows(
  table: string,
  where: string,
  params: unknown[] = [],
): Promise<number> {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  const result = await query(sql, params);
  return result.rowCount ?? 0;
}

/**
 * Generate a UUID v4 using PostgreSQL.
 */
export async function generateUuid(): Promise<string> {
  const row = await queryOne<{ uuid: string }>("SELECT gen_random_uuid() as uuid");
  return row?.uuid ?? crypto.randomUUID();
}
