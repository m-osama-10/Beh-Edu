/**
 * Server-side helper: extract current user from session cookie.
 * Use in API routes to gate access.
 *
 * Returns null if not authenticated.
 */
import { queryOne } from "@/lib/db-direct";
import { SESSION_COOKIE, parseSessionToken } from "@/lib/session-config";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  status: string;
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
}

export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, decodeURIComponent(v.join("="))];
      }),
    );
    const token = cookies[SESSION_COOKIE];
    if (!token) return null;

    const parsed = parseSessionToken(token);
    if (!parsed) return null;

    const user = await queryOne<{
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "TEACHER" | "STUDENT";
      status: string;
      avatar_url: string | null;
      phone: string | null;
      created_at: string;
    }>(
      "SELECT id, email, name, role, status, avatar_url, phone, created_at FROM users WHERE id = $1",
      [parsed.userId],
    );

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatar_url,
      phone: user.phone,
      createdAt: user.created_at,
    };
  } catch {
    return null;
  }
}

/** Get the teacher row for a user (or null if not a teacher). */
export async function getTeacherForUser(userId: string) {
  return queryOne<{
    id: string;
    user_id: string;
    title: string | null;
    bio: string | null;
    specialization: string | null;
    years_experience: number | null;
    education: string | null;
    verified: boolean;
    approved: boolean;
    rating: number;
    total_students: number;
    total_courses: number;
    total_revenue: number;
  }>("SELECT * FROM teachers WHERE user_id = $1", [userId]);
}

/** Get the student row for a user (or null if not a student). */
export async function getStudentForUser(userId: string) {
  return queryOne<{
    id: string;
    user_id: string;
    grade_id: string | null;
    school_name: string | null;
    target_year: string | null;
    total_spent: number;
    total_courses: number;
    completed_courses: number;
    data_saver_mode: boolean;
  }>("SELECT * FROM students WHERE user_id = $1", [userId]);
}
