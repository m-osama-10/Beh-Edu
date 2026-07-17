/**
 * PATCH /api/sections/[sectionId]
 * DELETE /api/sections/[sectionId]
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

async function verifyOwnership(
  admin: ReturnType<typeof getAdminSupabase>,
  sectionId: string,
  userId: string,
  userRole: string,
) {
  const { data: section } = await admin
    .from("sections")
    .select("course_id, courses!inner(teacher_id)")
    .eq("id", sectionId)
    .single();
  if (!section) return { ok: false, status: 404, msg: "القسم غير موجود" };
  if (userRole === "ADMIN") return { ok: true };
  const teacher = await getTeacherForUser(userId);
  if (!teacher || teacher.id !== (section.courses as unknown as { teacher_id: string }).teacher_id) {
    return { ok: false, status: 403, msg: "غير مصرح" };
  }
  return { ok: true };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> },
) {
  try {
    const { sectionId } = await params;
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const admin = getAdminSupabase();
    const check = await verifyOwnership(admin, sectionId, user.id, user.role);
    if (!check.ok) return NextResponse.json({ error: check.msg }, { status: check.status! });

    const body = await request.json();
    const { title, description, sort_order } = body;
    const update: Record<string, unknown> = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (sort_order !== undefined) update.sort_order = sort_order;

    const { data, error } = await admin
      .from("sections")
      .update(update)
      .eq("id", sectionId)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ section: data });
  } catch (err) {
    console.error("Update section error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sectionId: string }> },
) {
  try {
    const { sectionId } = await params;
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const admin = getAdminSupabase();
    const check = await verifyOwnership(admin, sectionId, user.id, user.role);
    if (!check.ok) return NextResponse.json({ error: check.msg }, { status: check.status! });

    const { error } = await admin.from("sections").delete().eq("id", sectionId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete section error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
