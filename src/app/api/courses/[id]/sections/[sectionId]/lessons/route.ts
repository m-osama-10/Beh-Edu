/**
 * POST /api/courses/[id]/sections/[sectionId]/lessons
 * Create a new lesson in a section.
 */
import { NextRequest, NextResponse } from "next/server";
import { queryOne, insertOne } from "@/lib/db-direct";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> },
) {
  try {
    const { id: courseId, sectionId } = await params;
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "ممنوع" }, { status: 403 });
    }

    // Verify section belongs to course owned by this teacher
    const section = await queryOne<{ course_id: string; teacher_id: string }>(
      `SELECT s.course_id, c.teacher_id
       FROM sections s
       JOIN courses c ON c.id = s.course_id
       WHERE s.id = $1`,
      [sectionId],
    );
    if (!section || section.course_id !== courseId) {
      return NextResponse.json({ error: "القسم غير موجود" }, { status: 404 });
    }
    if (user.role !== "ADMIN") {
      const teacher = await getTeacherForUser(user.id);
      if (!teacher || teacher.id !== section.teacher_id) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    const body = await request.json();
    const { title, description = null, isPreview = false } = body;
    if (!title) {
      return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
    }

    // Get next sort_order
    const maxOrder = await queryOne<{ max_sort: number | null }>(
      "SELECT MAX(sort_order) AS max_sort FROM lessons WHERE section_id = $1",
      [sectionId],
    );
    const nextSort = (maxOrder?.max_sort ?? 0) + 1;

    const lesson = await insertOne("lessons", {
      section_id: sectionId,
      title,
      description,
      sort_order: nextSort,
      duration: 0,
      is_preview: isPreview,
      is_published: true,
    });

    // Update course total_lessons
    await queryOne(
      `UPDATE courses SET total_lessons = (
        SELECT COUNT(*) FROM lessons l
        JOIN sections s ON s.id = l.section_id
        WHERE s.course_id = courses.id
       ) WHERE id = $1 RETURNING id`,
      [courseId],
    );

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (err) {
    console.error("Create lesson error:", err);
    return NextResponse.json({ error: "حدث خطأ: " + (err as Error).message }, { status: 500 });
  }
}
