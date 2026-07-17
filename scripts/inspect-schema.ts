// Inspect actual columns in subjects and grades tables
import { Client } from "pg";

const PASSWORD = encodeURIComponent("@M7mad1995105");
const connectionString =
  `postgresql://postgres.towfnhenuhjflkkgbagi:${PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });
  await client.connect();

  const { rows } = await client.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('subjects', 'grades')
    ORDER BY table_name, ordinal_position;
  `);
  console.log("Columns:");
  rows.forEach((r) => console.log(`  ${r.table_name}.${r.column_name} (${r.data_type})`));
  await client.end();
}
main().catch(console.error);
