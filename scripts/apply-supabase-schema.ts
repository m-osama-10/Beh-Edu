// Apply Supabase SQL schema to the remote database via the connection pooler (IPv4)
import { Client } from "pg";
import fs from "fs";

const PASSWORD = encodeURIComponent("@M7mad1995105");
// Supabase connection pooler (IPv4, port 5432 for direct, 6543 for pooled)
const connectionString =
  `postgresql://postgres.towfnhenuhjflkkgbagi:${PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`;

async function main() {
  console.log("🔌 Connecting to Supabase via pooler...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });

  try {
    await client.connect();
    console.log("✓ Connected to Supabase PostgreSQL");

    const sql = fs.readFileSync("./supabase/schema.sql", "utf8");
    console.log(`📄 Loaded schema (${sql.length} bytes)`);

    console.log("🚀 Executing SQL...");
    await client.query(sql);
    console.log("✓ Schema applied successfully!");

    // Verify tables
    const { rows } = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log(`\n📊 Tables created: ${rows.length}`);
    rows.forEach((r, i) => console.log(`  ${i + 1}. ${r.table_name}`));

    // Count subjects and grades
    const sCount = await client.query("SELECT COUNT(*) FROM subjects");
    const gCount = await client.query("SELECT COUNT(*) FROM grades");
    console.log(`\n✓ Seed data: ${sCount.rows[0].count} subjects, ${gCount.rows[0].count} grades`);
  } catch (err) {
    console.error("✗ Error:", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Connection closed.");
  }
}

main();
