/**
 * POST /api/video/upload-url
 *
 * Returns a presigned URL for direct browser → R2 video upload.
 * Only authenticated teachers can call this.
 *
 * Request body: { filename: string, contentType: string, lessonId: string }
 * Response: { uploadUrl: string, r2Key: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl, R2_KEYS } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, lessonId } = await request.json();

    if (!filename || !contentType || !lessonId) {
      return NextResponse.json(
        { error: "filename, contentType, and lessonId are required" },
        { status: 400 },
      );
    }

    // TODO: Verify user is authenticated AND is the teacher of this lesson's course
    const r2Key = R2_KEYS.originalVideo(lessonId, filename);
    const uploadUrl = await getPresignedUploadUrl(r2Key, contentType, 600);

    return NextResponse.json({ uploadUrl, r2Key, expiresIn: 600 });
  } catch (error) {
    console.error("Upload URL error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
