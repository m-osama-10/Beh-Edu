/**
 * PATCH /api/lessons/[lessonId]
 * DELETE /api/lessons/[lessonId]
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

async function verifyLessonOwnership(
  admin: ReturnType<typeof getAdminSupabase>,
  lessonId: string,
  userId: string,
  userRole: string,
) {
  const { data: lesson } = await admin
    .from("lessons")
    .select(`
      id,
      section_id,
      sections!inner(
        course_id,
        courses!inner(teacher_id)
      )
    `)
    .eq("id", lessonId)
    .single();
  if (!lesson) return { ok: false, status: 404, msg: "الدرس غير موجود" };
  if (userRole === "ADMIN") return { ok: true, lesson };
  const teacher = await getTeacherForUser(userId);
  const courseTeacherId = (lesson.sections as unknown as { courses: { teacher_id: string } }).courses.teacher_id;
  if (!teacher || teacher.id !== courseTeacherId) {
    return { ok: false, status: 403, msg: "غير مصرح" };
  }
  return { ok: true, lesson };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    const { lessonId } = await params;
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const admin = getAdminSupabase();
    const check = await verifyLessonOwnership(admin, lessonId, user.id, user.role);
    if (!check.ok) return NextResponse.json({ error: check.msg }, { status: check.status! });

    const body = await request.json();
    const allowed = ["title", "description", "duration", "is_preview", "is_published", "sort_order"];
    const update: Record<string, unknown> = {};
    for (const k of allowed) {
      if (body[k] !== undefined) update[k] = body[k];
    }

    const { data, error } = await admin
      .from("lessons")
      .update(update)
      .eq("id", lessonId)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lesson: data });
  } catch (err) {
    console.error("Update lesson error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    const { lessonId } = await params;
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const admin = getAdminSupabase();
    const check = await verifyLessonOwnership(admin, lessonId, user.id, user.role);
    if (!check.ok) return NextResponse.json({ error: check.msg }, { status: check.status! });

    const { error } = await admin.from("lessons").delete().eq("id", lessonId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete lesson error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
