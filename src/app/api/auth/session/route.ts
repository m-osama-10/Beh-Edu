/**
 * GET /api/auth/session
 *
 * Returns the current authenticated user (from session cookie) or null.
 */
import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db-direct";
import { SESSION_COOKIE, parseSessionToken } from "@/lib/session-config";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, decodeURIComponent(v.join("="))];
      }),
    );
    const token = cookies[SESSION_COOKIE];

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const parsed = parseSessionToken(token);
    if (!parsed) {
      return NextResponse.json({ user: null });
    }

    // Fetch fresh user data from DB
    const user = await queryOne<{
      id: string;
      email: string;
      name: string;
      role: string;
      status: string;
      avatar_url: string | null;
      phone: string | null;
      created_at: string;
    }>(
      "SELECT id, email, name, role, status, avatar_url, phone, created_at FROM users WHERE id = $1",
      [parsed.userId],
    );

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
