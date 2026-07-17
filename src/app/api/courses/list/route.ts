/**
 * GET /api/courses/list
 *
 * Public: list published courses with filters.
 * Query params: subjectId, gradeId, level, q (search), sort, limit, offset
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subjectId");
    const gradeId = searchParams.get("gradeId");
    const level = searchParams.get("level");
    const q = searchParams.get("q");
    const sort = searchParams.get("sort") ?? "newest";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const admin = getAdminSupabase();
    let query = admin
      .from("courses")
      .select(`
        *,
        subjects:subject_id(id, name, name_en, icon, color),
        grades:grade_id(id, name, name_en, level),
        teachers:teacher_id(id, title, bio, specialization, rating, total_students, user_id)
      `)
      .eq("is_published", true);

    if (subjectId) query = query.eq("subject_id", subjectId);
    if (gradeId) query = query.eq("grade_id", gradeId);
    if (level) query = query.eq("level", level);
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);

    switch (sort) {
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      case "price-low":
        query = query.order("price", { ascending: true });
        break;
      case "popular":
        query = query.order("student_count", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data: courses, error } = await query;

    if (error) {
      console.error("List courses error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch teacher user info (name, avatar) for each course
    const teacherUserIds = (courses ?? [])
      .map((c) => c.teachers?.user_id)
      .filter(Boolean);
    let teacherUsers: Record<string, { name: string; avatar_url: string | null }> = {};
    if (teacherUserIds.length > 0) {
      const { data: users } = await admin
        .from("users")
        .select("id, name, avatar_url")
        .in("id", teacherUserIds);
      teacherUsers = Object.fromEntries(
        (users ?? []).map((u) => [u.id, u]),
      );
    }

    const enriched = (courses ?? []).map((c) => ({
      ...c,
      teacher: c.teachers
        ? {
            ...c.teachers,
            name: teacherUsers[c.teachers.user_id]?.name ?? "مدرس",
            avatarUrl: teacherUsers[c.teachers.user_id]?.avatar_url ?? null,
          }
        : null,
      subject: c.subjects,
      grade: c.grades,
    }));

    return NextResponse.json({ courses: enriched });
  } catch (err) {
    console.error("List courses error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
