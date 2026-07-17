/**
 * GET /api/teacher/courses
 * List all courses owned by the authenticated teacher.
 */
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db-direct";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "ممنوع" }, { status: 403 });
    }

    const teacher = await getTeacherForUser(user.id);
    if (!teacher) {
      return NextResponse.json({ courses: [] });
    }

    const result = await query(`
      SELECT
        c.*,
        s.id AS subject_id, s.name AS subject_name, s.name_en AS subject_name_en,
        s.icon AS subject_icon, s.color AS subject_color,
        g.id AS grade_id, g.name AS grade_name, g.name_en AS grade_name_en, g.level AS grade_level
      FROM courses c
      LEFT JOIN subjects s ON s.id = c.subject_id
      LEFT JOIN grades g ON g.id = c.grade_id
      WHERE c.teacher_id = $1
      ORDER BY c.created_at DESC
    `, [teacher.id]);

    // Reshape to nested objects
    const courses = result.rows.map((row: any) => ({
      ...row,
      subjects: row.subject_id ? {
        id: row.subject_id,
        name: row.subject_name,
        name_en: row.subject_name_en,
        icon: row.subject_icon,
        color: row.subject_color,
      } : null,
      grades: row.grade_id ? {
        id: row.grade_id,
        name: row.grade_name,
        name_en: row.grade_name_en,
        level: row.grade_level,
      } : null,
      // Strip redundant flat fields
      subject_id: undefined,
      subject_name: undefined,
      subject_name_en: undefined,
      subject_icon: undefined,
      subject_color: undefined,
      grade_id: undefined,
      grade_name: undefined,
      grade_name_en: undefined,
      grade_level: undefined,
    }));

    return NextResponse.json({ courses });
  } catch (err) {
    console.error("List teacher courses error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
