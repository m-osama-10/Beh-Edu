/**
 * POST /api/auth/register
 *
 * Register a new user with email + password.
 * Creates: users row + profiles row + teachers/students row.
 *
 * Body: { name, email, password, role: "TEACHER" | "STUDENT", phone?, gradeId? }
 * Returns: { user, redirectTo }
 *
 * Uses direct PostgreSQL connection (bypasses RLS).
 */
import { NextRequest, NextResponse } from "next/server";
import { queryOne, insertOne } from "@/lib/db-direct";
import { hashSync, genSaltSync } from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone, gradeId } = body;

    // Validate
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "الاسم، البريد، كلمة المرور، والدور مطلوبة" },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 },
      );
    }
    if (!["TEACHER", "STUDENT"].includes(role)) {
      return NextResponse.json(
        { error: "الدور يجب أن يكون TEACHER أو STUDENT" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existing = await queryOne<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()],
    );
    if (existing) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مسجل بالفعل" },
        { status: 409 },
      );
    }

    // Hash password (bcrypt)
    const salt = genSaltSync(10);
    const passwordHash = hashSync(password, salt);

    // Generate avatar
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1A5F7A`;

    // Insert user row (PENDING for teachers, ACTIVE for students)
    const userRow = await insertOne<{
      id: string;
      email: string;
      name: string;
      role: string;
      status: string;
      avatar_url: string | null;
      created_at: string;
    }>("users", {
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name,
      phone: phone ?? null,
      role,
      avatar_url: avatarUrl,
      status: role === "TEACHER" ? "PENDING" : "ACTIVE",
      email_verified: new Date().toISOString(),
    });

    const userId = userRow.id;

    // Insert profile row
    await insertOne("profiles", {
      user_id: userId,
      country: "مصر",
    });

    // Insert role-specific row
    if (role === "TEACHER") {
      await insertOne("teachers", {
        user_id: userId,
        title: "أ.",
        bio: "",
        specialization: "",
        years_experience: 0,
        education: "",
        verified: false,
        approved: false,
        rating: 0,
        total_students: 0,
        total_courses: 0,
        total_revenue: 0,
      });
    } else {
      // Student
      await insertOne("students", {
        user_id: userId,
        grade_id: gradeId ?? null,
        data_saver_mode: true,
        total_spent: 0,
        total_courses: 0,
        completed_courses: 0,
      });
    }

    // Return user (without password_hash) + redirect target
    const redirectTo =
      role === "TEACHER" ? "teacher-dashboard" : "student-dashboard";

    return NextResponse.json({
      user: {
        id: userId,
        email: userRow.email,
        name: userRow.name,
        role: userRow.role,
        status: userRow.status,
        avatarUrl: userRow.avatar_url,
        createdAt: userRow.created_at,
      },
      redirectTo,
      message:
        role === "TEACHER"
          ? "تم إنشاء حسابك بنجاح! يمكنك البدء في إنشاء كورساتك الآن."
          : "تم إنشاء حسابك بنجاح! أهلاً بك في بكالوريا بيه.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء إنشاء الحساب: " + (err as Error).message },
      { status: 500 },
    );
  }
}
