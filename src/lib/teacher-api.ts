/**
 * Client-side API helpers for teacher operations.
 * All functions call the Next.js API routes which use the admin Supabase client
 * (server-side only, with service-role key for RLS bypass).
 */

export interface CourseInput {
  title: string;
  description: string;
  subjectId: string;
  gradeId?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  academicYear?: string;
  language?: string;
  price: number;
  discountPrice?: number | null;
  coverImageUrl?: string | null;
  isPublished?: boolean;
}

export interface SectionInput {
  title: string;
  description?: string;
}

export interface LessonInput {
  title: string;
  description?: string;
  isPreview?: boolean;
}

export interface QuizInput {
  title: string;
  description?: string;
  passingScore?: number;
  timeLimit?: number | null;
  questions: Array<{
    text: string;
    type?: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT";
    points?: number;
    explanation?: string;
    answers: Array<{ text: string; isCorrect?: boolean }>;
  }>;
}

async function apiCall<T = unknown>(
  url: string,
  method: string = "GET",
  body?: unknown,
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error ?? `HTTP ${res.status}`, status: res.status };
    }
    return { data: data as T, status: res.status };
  } catch (err) {
    return { error: "فشل الاتصال بالخادم", status: 0 };
  }
}

// ============ COURSES ============

export async function listTeacherCourses() {
  return apiCall<{ courses: any[] }>("/api/teacher/courses");
}

export async function listPublicCourses(params?: {
  subjectId?: string;
  gradeId?: string;
  level?: string;
  q?: string;
  sort?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.subjectId) qs.set("subjectId", params.subjectId);
  if (params?.gradeId) qs.set("gradeId", params.gradeId);
  if (params?.level) qs.set("level", params.level);
  if (params?.q) qs.set("q", params.q);
  if (params?.sort) qs.set("sort", params.sort);
  return apiCall<{ courses: any[] }>(`/api/courses/list?${qs.toString()}`);
}

export async function getCourse(id: string) {
  return apiCall<{ course: any }>(`/api/courses/${id}`);
}

export async function createCourse(input: CourseInput) {
  return apiCall<{ course: any }>("/api/courses/create", "POST", input);
}

export async function updateCourse(id: string, input: Partial<CourseInput>) {
  return apiCall<{ course: any }>(`/api/courses/${id}`, "PATCH", input);
}

export async function deleteCourse(id: string) {
  return apiCall<{ success: boolean }>(`/api/courses/${id}`, "DELETE");
}

// ============ SECTIONS ============

export async function listSections(courseId: string) {
  return apiCall<{ sections: any[] }>(`/api/courses/${courseId}/sections`);
}

export async function createSection(courseId: string, input: SectionInput) {
  return apiCall<{ section: any }>(
    `/api/courses/${courseId}/sections`,
    "POST",
    input,
  );
}

export async function updateSection(sectionId: string, input: Partial<SectionInput>) {
  return apiCall<{ section: any }>(`/api/sections/${sectionId}`, "PATCH", input);
}

export async function deleteSection(sectionId: string) {
  return apiCall<{ success: boolean }>(`/api/sections/${sectionId}`, "DELETE");
}

// ============ LESSONS ============

export async function createLesson(
  courseId: string,
  sectionId: string,
  input: LessonInput,
) {
  return apiCall<{ lesson: any }>(
    `/api/courses/${courseId}/sections/${sectionId}/lessons`,
    "POST",
    input,
  );
}

export async function updateLesson(lessonId: string, input: Partial<LessonInput>) {
  return apiCall<{ lesson: any }>(`/api/lessons/${lessonId}`, "PATCH", input);
}

export async function deleteLesson(lessonId: string) {
  return apiCall<{ success: boolean }>(`/api/lessons/${lessonId}`, "DELETE");
}

// ============ VIDEO ============

export async function getVideoUploadUrl(
  filename: string,
  contentType: string,
  lessonId?: string,
) {
  return apiCall<{ uploadUrl: string; r2Key: string; expiresIn: number }>(
    "/api/upload/video",
    "POST",
    { filename, contentType, lessonId },
  );
}

export async function attachVideoToLesson(
  lessonId: string,
  data: {
    r2Key: string;
    originalUrl?: string;
    hlsPlaylistUrl?: string;
    duration?: number;
    size?: number;
  },
) {
  return apiCall<{ video: any }>(
    `/api/lessons/${lessonId}/video`,
    "POST",
    data,
  );
}

// ============ PDF ATTACHMENTS ============

export async function getPdfUploadUrl(filename: string, lessonId?: string) {
  return apiCall<{ uploadUrl: string; r2Key: string; expiresIn: number }>(
    "/api/upload/pdf",
    "POST",
    { filename, lessonId },
  );
}

export async function attachPdfToLesson(
  lessonId: string,
  data: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    isDownloadable?: boolean;
  },
) {
  return apiCall<{ attachment: any }>(
    `/api/lessons/${lessonId}/attachments`,
    "POST",
    data,
  );
}

// ============ COVER IMAGE ============

export async function getCoverUploadUrl(
  filename: string,
  contentType: string,
  courseId?: string,
) {
  return apiCall<{ uploadUrl: string; r2Key: string; expiresIn: number }>(
    "/api/upload/cover",
    "POST",
    { filename, contentType, courseId },
  );
}

// ============ QUIZZES ============

export async function createQuiz(lessonId: string, input: QuizInput) {
  return apiCall<{ quiz: any }>(
    `/api/lessons/${lessonId}/quiz`,
    "POST",
    input,
  );
}

// ============ UPLOAD HELPERS ============

/**
 * Upload a file directly to R2 using a presigned URL.
 * Returns the r2Key on success.
 */
export async function uploadFileToR2(
  file: File,
  uploadUrl: string,
  contentType: string,
): Promise<boolean> {
  try {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": contentType },
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Full flow: get presigned URL → upload to R2 → attach to lesson (video).
 */
export async function uploadAndAttachVideo(
  file: File,
  lessonId: string,
  onProgress?: (stage: string) => void,
): Promise<{ success: boolean; r2Key?: string; error?: string }> {
  onProgress?.("جاري الحصول على رابط الرفع...");
  const urlRes = await getVideoUploadUrl(file.name, file.type, lessonId);
  if (urlRes.error || !urlRes.data) {
    return { success: false, error: urlRes.error };
  }

  onProgress?.("جاري رفع الفيديو إلى التخزين...");
  const uploaded = await uploadFileToR2(file, urlRes.data.uploadUrl, file.type);
  if (!uploaded) {
    return { success: false, error: "فشل رفع الفيديو" };
  }

  onProgress?.("جاري ربط الفيديو بالدرس...");
  const attachRes = await attachVideoToLesson(lessonId, {
    r2Key: urlRes.data.r2Key,
    originalUrl: urlRes.data.r2Key,
    duration: 0,
    size: file.size,
  });
  if (attachRes.error) {
    return { success: false, error: attachRes.error };
  }

  return { success: true, r2Key: urlRes.data.r2Key };
}

/**
 * Full flow: get presigned URL → upload to R2 → attach to lesson (PDF).
 */
export async function uploadAndAttachPdf(
  file: File,
  lessonId: string,
): Promise<{ success: boolean; error?: string }> {
  const urlRes = await getPdfUploadUrl(file.name, lessonId);
  if (urlRes.error || !urlRes.data) {
    return { success: false, error: urlRes.error };
  }

  const uploaded = await uploadFileToR2(file, urlRes.data.uploadUrl, "application/pdf");
  if (!uploaded) {
    return { success: false, error: "فشل رفع الملف" };
  }

  const attachRes = await attachPdfToLesson(lessonId, {
    fileName: file.name,
    fileUrl: urlRes.data.r2Key,
    fileType: "pdf",
    fileSize: file.size,
  });
  if (attachRes.error) {
    return { success: false, error: attachRes.error };
  }

  return { success: true };
}
