/**
 * GET /api/courses/[id]/sections
 * POST /api/courses/[id]/sections — create a new section
 */
import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, insertOne } from "@/lib/db-direct";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: courseId } = await params;

    const sectionsResult = await query(`
      SELECT * FROM sections WHERE course_id = $1 ORDER BY sort_order ASC
    `, [courseId]);

    const sections = await Promise.all(
      sectionsResult.rows.map(async (section: any) => {
        const lessonsResult = await query(`
          SELECT
            l.*,
            COALESCE(
              (SELECT json_agg(row_to_json(v)) FROM videos v WHERE v.lesson_id = l.id),
              '[]'::json
            ) AS videos,
            COALESCE(
              (SELECT json_agg(row_to_json(a)) FROM lesson_attachments a WHERE a.lesson_id = l.id),
              '[]'::json
            ) AS attachments,
            COALESCE(
              (SELECT json_agg(row_to_json(q_) FROM (
                SELECT q.*, COALESCE(
                  (SELECT json_agg(row_to_json(qs_) FROM (
                    SELECT qs.*, COALESCE(
                      (SELECT json_agg(row_to_json(an)) FROM answers an WHERE an.question_id = qs.id),
                      '[]'::json
                    ) AS answers
                    FROM questions qs WHERE qs.quiz_id = q.id ORDER BY qs.sort_order
                  )) FROM questions qs WHERE qs.quiz_id = q.id
                ), '[]'::json) AS questions
                FROM quizzes q WHERE q.lesson_id = l.id
              )),
              '[]'::json
            ) AS quizzes
          FROM lessons l
          WHERE l.section_id = $1
          ORDER BY l.sort_order ASC
        `, [section.id]);

        return { ...section, lessons: lessonsResult.rows };
      }),
    );

    return NextResponse.json({ sections });
  } catch (err) {
    console.error("List sections error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: courseId } = await params;
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "ممنوع" }, { status: 403 });
    }

    // Verify ownership
    const course = await queryOne<{ teacher_id: string }>(
      "SELECT teacher_id FROM courses WHERE id = $1",
      [courseId],
    );
    if (!course) return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });

    if (user.role !== "ADMIN") {
      const teacher = await getTeacherForUser(user.id);
      if (!teacher || teacher.id !== course.teacher_id) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    const body = await request.json();
    const { title, description = null } = body;
    if (!title) {
      return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
    }

    // Get next sort_order
    const maxOrder = await queryOne<{ max_sort: number | null }>(
      "SELECT MAX(sort_order) AS max_sort FROM sections WHERE course_id = $1",
      [courseId],
    );
    const nextSort = (maxOrder?.max_sort ?? 0) + 1;

    const section = await insertOne("sections", {
      course_id: courseId,
      title,
      description,
      sort_order: nextSort,
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (err) {
    console.error("Create section error:", err);
    return NextResponse.json({ error: "حدث خطأ: " + (err as Error).message }, { status: 500 });
  }
}
