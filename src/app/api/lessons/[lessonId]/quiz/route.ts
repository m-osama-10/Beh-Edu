/**
 * POST /api/lessons/[lessonId]/quiz
 * Create a quiz with questions + answers for a lesson.
 * Atomic: deletes existing quiz for the lesson, then creates new one.
 */
import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, insertOne, deleteRows } from "@/lib/db-direct";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    const { lessonId } = await params;
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "ممنوع" }, { status: 403 });
    }

    const lesson = await queryOne<{ teacher_id: string }>(
      `SELECT c.teacher_id FROM lessons l
       JOIN sections s ON s.id = l.section_id
       JOIN courses c ON c.id = s.course_id
       WHERE l.id = $1`,
      [lessonId],
    );
    if (!lesson) return NextResponse.json({ error: "الدرس غير موجود" }, { status: 404 });

    if (user.role !== "ADMIN") {
      const teacher = await getTeacherForUser(user.id);
      if (!teacher || teacher.id !== lesson.teacher_id) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    const body = await request.json();
    const { title, description = null, passingScore = 60, timeLimit = null, questions = [] } = body;

    if (!title) {
      return NextResponse.json({ error: "عنوان الاختبار مطلوب" }, { status: 400 });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "يجب إضافة سؤال واحد على الأقل" },
        { status: 400 },
      );
    }

    // Delete existing quizzes for this lesson (cascade deletes questions + answers)
    await deleteRows("quizzes", "lesson_id = $1", [lessonId]);

    // Create quiz
    const quiz = await insertOne("quizzes", {
      lesson_id: lessonId,
      title,
      description,
      passing_score: passingScore,
      time_limit: timeLimit,
      attempts: 0,
    });

    // Create questions + answers
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const question = await insertOne("questions", {
        quiz_id: quiz.id,
        text: q.text,
        type: q.type ?? "SINGLE_CHOICE",
        points: q.points ?? 1,
        explanation: q.explanation ?? null,
        sort_order: i + 1,
      });

      // Insert answers
      if (Array.isArray(q.answers)) {
        for (let j = 0; j < q.answers.length; j++) {
          const a = q.answers[j];
          await insertOne("answers", {
            question_id: question.id,
            text: a.text,
            is_correct: !!a.isCorrect,
            sort_order: j + 1,
          });
        }
      }
    }

    // Fetch the complete quiz with questions + answers
    const fullQuiz = await queryOne(`
      SELECT
        q.*,
        COALESCE(
          (SELECT json_agg(row_to_json(qs_) FROM (
            SELECT qs.*, COALESCE(
              (SELECT json_agg(row_to_json(an)) FROM answers an WHERE an.question_id = qs.id),
              '[]'::json
            ) AS answers
            FROM questions qs WHERE qs.quiz_id = q.id ORDER BY qs.sort_order
          )) FROM questions qs WHERE qs.quiz_id = q.id),
          '[]'::json
        ) AS questions
      FROM quizzes q WHERE q.id = $1
    `, [quiz.id]);

    return NextResponse.json({ quiz: fullQuiz }, { status: 201 });
  } catch (err) {
    console.error("Create quiz error:", err);
    return NextResponse.json({ error: "حدث خطأ: " + (err as Error).message }, { status: 500 });
  }
}
