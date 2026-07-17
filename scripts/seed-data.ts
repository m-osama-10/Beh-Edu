// Seed data only (after Prisma reset/recreate)
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
  console.log("✓ Connected. Seeding...");

  const sql = fs.readFileSync("./supabase/seed.sql", "utf8");
  await client.query(sql);
  console.log("✓ Seed data applied");

  const s = await client.query("SELECT COUNT(*) FROM subjects");
  const g = await client.query("SELECT COUNT(*) FROM grades");
  console.log(`✓ Subjects: ${s.rows[0].count}, Grades: ${g.rows[0].count}`);

  await client.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
