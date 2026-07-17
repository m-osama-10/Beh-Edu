// Drop all tables and re-apply the snake_case schema from supabase/schema.sql
import { Client } from "pg";
import fs from "fs";

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
  console.log("✓ Connected. Dropping all tables...");

  // Drop all tables in reverse dependency order, cascade
  const { rows } = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
  console.log(`Found ${rows.length} tables to drop`);

  // Drop with CASCADE
  for (const r of rows) {
    await client.query(`DROP TABLE IF EXISTS "${r.table_name}" CASCADE;`);
    console.log(`  ✓ Dropped ${r.table_name}`);
  }

  // Drop enums
  const { rows: enums } = await client.query(`
    SELECT t.typname FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    GROUP BY t.typname
  `);
  for (const e of enums) {
    await client.query(`DROP TYPE IF EXISTS "${e.typname}" CASCADE;`);
  }
  console.log(`✓ Dropped ${enums.length} enums`);

  // Drop functions
  await client.query(`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;`);

  console.log("\n🚀 Re-applying snake_case schema...");
  const sql = fs.readFileSync("./supabase/schema.sql", "utf8");
  await client.query(sql);
  console.log("✓ Schema re-applied with snake_case columns");

  // Verify
  const { rows: cols } = await client.query(`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name IN ('subjects', 'grades')
    ORDER BY table_name, ordinal_position;
  `);
  console.log("\nColumns now:");
  cols.forEach((c) => console.log(`  ${c.table_name}.${c.column_name}`));

  await client.end();
  console.log("\n✓ Done");
}
main().catch((e) => { console.error(e); process.exit(1); });
