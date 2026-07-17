/**
 * GET /api/courses/[id]
 * PATCH /api/courses/[id]
 * DELETE /api/courses/[id]
 *
 * Get / update / delete a single course (with sections + lessons).
 * PATCH/DELETE require teacher ownership or admin.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const admin = getAdminSupabase();

    const { data: course, error } = await admin
      .from("courses")
      .select(`
        *,
        subjects:subject_id(*),
        grades:grade_id(*),
        teachers:teacher_id(*)
      `)
      .eq("id", id)
      .single();

    if (error || !course) {
      return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });
    }

    // Fetch teacher user info
    let teacherUser = null;
    if (course.teachers?.user_id) {
      const { data: tu } = await admin
        .from("users")
        .select("id, name, avatar_url")
        .eq("id", course.teachers.user_id)
        .single();
      teacherUser = tu;
    }

    // Fetch sections + lessons
    const { data: sections } = await admin
      .from("sections")
      .select("*")
      .eq("course_id", id)
      .order("sort_order", { ascending: true });

    const sectionsWithLessons = await Promise.all(
      (sections ?? []).map(async (section) => {
        const { data: lessons } = await admin
          .from("lessons")
          .select(`
            *,
            videos:videos(*),
            attachments:lesson_attachments(*),
            quizzes:quizzes(
              *,
              questions:questions(
                *,
                answers:answers(*)
              )
            )
          `)
          .eq("section_id", section.id)
          .order("sort_order", { ascending: true });
        return { ...section, lessons: lessons ?? [] };
      }),
    );

    return NextResponse.json({
      course: {
        ...course,
        teacher: teacherUser
          ? { ...course.teachers, name: teacherUser.name, avatarUrl: teacherUser.avatar_url }
          : course.teachers,
        subject: course.subjects,
        grade: course.grades,
        sections: sectionsWithLessons,
      },
    });
  } catch (err) {
    console.error("Get course error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const admin = getAdminSupabase();

    // Verify ownership
    const { data: course } = await admin
      .from("courses")
      .select("teacher_id")
      .eq("id", id)
      .single();
    if (!course) {
      return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });
    }
    if (user.role !== "ADMIN") {
      const teacher = await getTeacherForUser(user.id);
      if (!teacher || teacher.id !== course.teacher_id) {
        return NextResponse.json({ error: "غير مصرح لتعديل هذا الكورس" }, { status: 403 });
      }
    }

    const body = await request.json();
    const updateFields: Record<string, unknown> = {};
    const allowed = [
      "title", "description", "cover_image_url", "price", "discount_price",
      "discount_until", "level", "academic_year", "language", "is_published",
      "is_featured", "grade_id", "subject_id",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) updateFields[key] = body[key];
    }
    if (updateFields.price !== undefined) updateFields.price = parseFloat(updateFields.price);
    if (updateFields.discount_price !== undefined && updateFields.discount_price !== null) {
      updateFields.discount_price = parseFloat(updateFields.discount_price);
    }

    const { data: updated, error } = await admin
      .from("courses")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ course: updated });
  } catch (err) {
    console.error("Update course error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const admin = getAdminSupabase();
    const { data: course } = await admin
      .from("courses")
      .select("teacher_id")
      .eq("id", id)
      .single();
    if (!course) {
      return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });
    }
    if (user.role !== "ADMIN") {
      const teacher = await getTeacherForUser(user.id);
      if (!teacher || teacher.id !== course.teacher_id) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    const { error } = await admin.from("courses").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete course error:", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
