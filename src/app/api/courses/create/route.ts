/**
 * POST /api/courses/create
 *
 * Create a new course. Only authenticated teachers/admins can call this.
 * Uses direct PostgreSQL (bypasses RLS).
 */
import { NextRequest, NextResponse } from "next/server";
import { queryOne, insertOne } from "@/lib/db-direct";
import { getSessionUser, getTeacherForUser } from "@/lib/session";

function slugify(text: string): string {
  return (
    text
      .toString()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0600-\u06FF\w-]/g, "")
      .toLowerCase() +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "غير مصرح — سجل الدخول أولاً" }, { status: 401 });
    }
    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "يجب أن تكون مدرساً لإنشاء كورس" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      subjectId,
      gradeId,
      level = "BEGINNER",
      academicYear = "2025/2026",
      language = "العربية",
      price = 0,
      discountPrice = null,
      coverImageUrl = null,
      isPublished = false,
    } = body;

    if (!title || !description || !subjectId) {
      return NextResponse.json(
        { error: "العنوان، الوصف، والمادة مطلوبون" },
        { status: 400 },
      );
    }

    // Get teacher row
    const teacher = await getTeacherForUser(user.id);
    if (!teacher) {
      return NextResponse.json(
        { error: "ملف المدرس غير موجود" },
        { status: 404 },
      );
    }

    // Create course
    const course = await insertOne("courses", {
      teacher_id: teacher.id,
      subject_id: subjectId,
      grade_id: gradeId ?? null,
      title,
      slug: slugify(title),
      description,
      cover_image_url: coverImageUrl,
      price: parseFloat(price),
      discount_price: discountPrice ? parseFloat(discountPrice) : null,
      level,
      academic_year: academicYear,
      language,
      is_published: isPublished,
      is_featured: false,
      views: 0,
      rating: 0,
      rating_count: 0,
      student_count: 0,
      total_lessons: 0,
      total_duration: 0,
    });

    // Update teacher's total_courses count
    await queryOne(
      "UPDATE teachers SET total_courses = $1 WHERE id = $2 RETURNING id",
      [(teacher.total_courses ?? 0) + 1, teacher.id],
    );

    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error("Create course error:", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع: " + (err as Error).message },
      { status: 500 },
    );
  }
}
