/**
 * POST /api/lessons/[lessonId]/attachments
 * Add a file attachment (PDF, etc.) to a lesson.
 */
import { NextRequest, NextResponse } from "next/server";
import { queryOne, insertOne } from "@/lib/db-direct";
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
    const { fileName, fileUrl, fileType, fileSize, isDownloadable = true } = body;
    if (!fileName || !fileUrl || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "fileName, fileUrl, fileType, fileSize مطلوبة" },
        { status: 400 },
      );
    }

    const attachment = await insertOne("lesson_attachments", {
      lesson_id: lessonId,
      file_name: fileName,
      file_url: fileUrl,
      file_type: fileType,
      file_size: parseInt(fileSize),
      is_downloadable: isDownloadable,
    });

    return NextResponse.json({ attachment }, { status: 201 });
  } catch (err) {
    console.error("Add attachment error:", err);
    return NextResponse.json({ error: "حدث خطأ: " + (err as Error).message }, { status: 500 });
  }
}
