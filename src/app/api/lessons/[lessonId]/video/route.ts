/**
 * POST /api/lessons/[lessonId]/video
 * Attach an uploaded video (already in R2) to a lesson.
 */
import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db-direct";
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

    // Verify lesson ownership
    const lesson = await queryOne<{ teacher_id: string }>(
      `SELECT c.teacher_id
       FROM lessons l
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
    const { r2Key, originalUrl = null, hlsPlaylistUrl = null, duration = 0, size = 0 } = body;

    // Upsert video row (lesson_id is unique)
    // First check if exists
    const existing = await queryOne<{ id: string }>(
      "SELECT id FROM videos WHERE lesson_id = $1",
      [lessonId],
    );

    let video;
    if (existing) {
      // Update
      video = await queryOne(
        `UPDATE videos SET
          r2_key = $1, original_url = $2, hls_playlist_url = $3,
          status = $4, duration_480p = $5, duration_720p = $6,
          size_480p = $7, size_720p = $8, updated_at = NOW()
         WHERE lesson_id = $9 RETURNING *`,
        [
          r2Key, originalUrl, hlsPlaylistUrl,
          hlsPlaylistUrl ? "READY" : "UPLOADED",
          duration, duration, size, size,
          lessonId,
        ],
      );
    } else {
      // Insert
      video = await queryOne(
        `INSERT INTO videos (lesson_id, original_url, r2_key, hls_playlist_url, status, duration_480p, duration_720p, size_480p, size_720p)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          lessonId, originalUrl, r2Key, hlsPlaylistUrl,
          hlsPlaylistUrl ? "READY" : "UPLOADED",
          duration, duration, size, size,
        ],
      );
    }

    // Update lesson duration
    if (duration > 0) {
      await queryOne("UPDATE lessons SET duration = $1 WHERE id = $2 RETURNING id", [duration, lessonId]);
    }

    return NextResponse.json({ video }, { status: 201 });
  } catch (err) {
    console.error("Attach video error:", err);
    return NextResponse.json({ error: "حدث خطأ: " + (err as Error).message }, { status: 500 });
  }
}
