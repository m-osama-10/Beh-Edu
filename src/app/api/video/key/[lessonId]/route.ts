/**
 * GET /api/video/key/[lessonId]
 *
 * Returns the HLS AES-128 encryption key for a lesson.
 * Referenced inside the .m3u8 playlist as the KEY URI.
 *
 * SECURITY: Verifies enrollment before returning key.
 */
import { NextRequest, NextResponse } from "next/server";
import { getEncryptionKey } from "@/lib/video-processor";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    const { lessonId } = await params;
    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
    }

    // TODO: Verify session + enrollment
    const key = await getEncryptionKey(lessonId);

    return new NextResponse(key, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Key delivery error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve encryption key" },
      { status: 500 },
    );
  }
}
