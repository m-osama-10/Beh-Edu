// Seed demo users into Supabase database
// Creates: admin, teacher, student accounts with bcrypt-hashed passwords
import { Client } from "pg";
import { hashSync, genSaltSync } from "bcryptjs";

const PASSWORD = encodeURIComponent("@M7mad1995105");
const connectionString =
  `postgresql://postgres.towfnhenuhjflkkgbagi:${PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`;

const DEMO_PASSWORD = "demo123";

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });
  await client.connect();
  console.log("✓ Connected to Supabase\n");

  const salt = genSaltSync(10);
  const passwordHash = hashSync(DEMO_PASSWORD, salt);

  const users = [
    {
      email: "admin@bakaloriaa-bey.test",
      name: "مدير المنصة",
      role: "ADMIN",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=1A5F7A",
    },
    {
      email: "teacher@bakaloriaa-bey.test",
      name: "أ. محمد عبد الله",
      role: "TEACHER",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mo&backgroundColor=D62828",
    },
    {
      email: "student@bakaloriaa-bey.test",
      name: "أحمد محمود",
      role: "STUDENT",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ah&backgroundColor=FFD700",
    },
  ];

  console.log("🔐 Seeding demo users (password: demo123)...\n");

  for (const u of users) {
    const result = await client.query(
      `INSERT INTO users (email, password_hash, name, role, status, avatar_url, email_verified)
       VALUES ($1, $2, $3, $4, 'ACTIVE', $5, NOW())
       ON CONFLICT (email) DO UPDATE
         SET password_hash = $2, name = $3, role = $4, avatar_url = $5, status = 'ACTIVE'
       RETURNING id, email, role`,
      [u.email, passwordHash, u.name, u.role, u.avatar],
    );
    const row = result.rows[0];
    console.log(`✓ ${u.role.padEnd(8)} ${u.email.padEnd(35)} → ${row.id}`);

    // If teacher, create teacher profile
    if (u.role === "TEACHER") {
      await client.query(
        `INSERT INTO teachers (user_id, title, bio, specialization, years_experience, education, verified, approved, rating, total_students, total_courses, total_revenue)
         VALUES ($1, 'أ.', 'مدرس رياضيات بخبرة 15 عاماً في تدريس الثانوية العامة. خريج كلية التربية - جامعة عين شمس. أسلوب مبسط مع أمثلة واقعية تساعد الطلاب على الاستيعاب السريع والثبات في الامتحانات.', 'الرياضيات - الصف الثالث الثانوي', 15, 'بكالوريوس تربية رياضيات - جامعة عين شمس', true, true, 4.9, 3420, 4, 285000)
         ON CONFLICT (user_id) DO NOTHING`,
        [row.id],
      );
      console.log(`  ✓ Created teacher profile`);
    }

    // If student, create student profile
    if (u.role === "STUDENT") {
      const grade = await client.query(`SELECT id FROM grades WHERE level = 3 LIMIT 1`);
      if (grade.rows.length > 0) {
        await client.query(
          `INSERT INTO students (user_id, grade_id, school_name, target_year, data_saver_mode)
           VALUES ($1, $2, 'مدرسة الثانوية العامة', '2025/2026', true)
           ON CONFLICT (user_id) DO NOTHING`,
          [row.id, grade.rows[0].id],
        );
        console.log(`  ✓ Created student profile (Grade 3)`);
      }
    }

    // Create profile for all users
    await client.query(
      `INSERT INTO profiles (user_id, bio, city, country)
       VALUES ($1, $2, 'القاهرة', 'مصر')
       ON CONFLICT (user_id) DO NOTHING`,
      [row.id, `حساب ${u.role === "ADMIN" ? "إداري" : u.role === "TEACHER" ? "مدرس" : "طالب"} تجريبي لمنصة بكالوريا بيه`],
    );
  }

  // Verify
  const { rows } = await client.query("SELECT email, name, role, status FROM users ORDER BY role, email");
  console.log(`\n📊 Total users in database: ${rows.length}`);
  rows.forEach((u) => console.log(`  ${u.role.padEnd(8)} ${u.email.padEnd(35)} ${u.name}`));

  await client.end();
  console.log("\n✅ Done! All demo accounts are now in the database.");
  console.log("\nLogin credentials:");
  console.log("  Email: admin@bakaloriaa-bey.test / teacher@bakaloriaa-bey.test / student@bakaloriaa-bey.test");
  console.log("  Password: demo123 (for all three)");
}
main().catch((e) => { console.error(e); process.exit(1); });
