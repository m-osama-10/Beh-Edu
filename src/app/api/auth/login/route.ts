/**
 * POST /api/auth/login
 *
 * Login with email + password (bcrypt-verified against users table).
 * Returns user profile + redirect target based on role.
 *
 * Body: { email, password }
 * Returns: { user, redirectTo }
 *
 * Uses direct PostgreSQL connection (bypasses RLS) for password verification.
 */
import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db-direct";
import { compareSync } from "bcryptjs";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/session-config";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد وكلمة المرور مطلوبان" },
        { status: 400 },
      );
    }

    // Fetch user by email (direct pg, bypasses RLS)
    const user = await queryOne<{
      id: string;
      email: string;
      password_hash: string | null;
      name: string;
      role: string;
      status: string;
      avatar_url: string | null;
      phone: string | null;
      created_at: string;
    }>(
      "SELECT id, email, password_hash, name, role, status, avatar_url, phone, created_at FROM users WHERE email = $1",
      [email.toLowerCase()],
    );

    if (!user) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير مسجل" },
        { status: 404 },
      );
    }

    // Check status
    if (user.status === "BANNED" || user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "هذا الحساب موقوف. تواصل مع الإدارة." },
        { status: 403 },
      );
    }

    // Verify password
    if (!user.password_hash || !compareSync(password, user.password_hash)) {
      return NextResponse.json(
        { error: "كلمة المرور غير صحيحة" },
        { status: 401 },
      );
    }

    // Create session token
    const token = createSessionToken(user.id, user.email, user.role);

    const redirectTo =
      user.role === "ADMIN"
        ? "admin-dashboard"
        : user.role === "TEACHER"
          ? "teacher-dashboard"
          : "student-dashboard";

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatar_url,
        phone: user.phone,
        createdAt: user.created_at,
      },
      redirectTo,
    });

    // Set HTTP-only session cookie (7 days)
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع أثناء تسجيل الدخول" },
      { status: 500 },
    );
  }
}
