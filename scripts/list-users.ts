// List all users in the Supabase database
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
  console.log("✓ Connected. Fetching users...\n");

  const { rows } = await client.query(`
    SELECT id, email, name, role, status, created_at
    FROM users
    ORDER BY created_at;
  `);

  if (rows.length === 0) {
    console.log("⚠️  No users found in the database.");
    console.log("    The seed SQL created an admin user but it may have been dropped during Prisma reset.");
    console.log("    Run: bun run scripts/seed-admin.ts");
  } else {
    console.log(`📊 Found ${rows.length} user(s):\n`);
    console.log("ID".padEnd(40) + "EMAIL".padEnd(45) + "NAME".padEnd(25) + "ROLE".padEnd(10) + "STATUS");
    console.log("-".repeat(140));
    rows.forEach((u) => {
      console.log(
        u.id.padEnd(40) +
        u.email.padEnd(45) +
        (u.name ?? "").padEnd(25) +
        u.role.padEnd(10) +
        u.status
      );
    });
  }

  // Also check demo accounts in auth-store
  console.log("\n📋 Demo accounts configured in the app (mock auth):");
  console.log("  1. admin@bakaloriaa-bey.test / demo123 (ADMIN)");
  console.log("  2. teacher@bakaloriaa-bey.test / demo123 (TEACHER)");
  console.log("  3. student@bakaloriaa-bey.test / demo123 (STUDENT)");
  console.log("\nNote: These are mock demo accounts stored in src/store/auth-store.ts");
  console.log("      They are NOT in the database yet. To add them to Supabase, run scripts/seed-users.ts");

  await client.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
