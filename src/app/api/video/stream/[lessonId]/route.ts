/**
 * GET /api/video/stream/[lessonId]
 *
 * Returns a signed HLS playlist URL for the requested lesson.
 * Short-lived (1 hour), only for enrolled students.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSignedHlsPlaylistUrl } from "@/lib/video-processor";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    const { lessonId } = await params;
    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
    }

    // TODO: Verify session + enrollment + video.status === READY
    const playlistUrl = await getSignedHlsPlaylistUrl(lessonId);

    return NextResponse.json({ url: playlistUrl, expiresIn: 3600 });
  } catch (error) {
    console.error("Stream URL error:", error);
    return NextResponse.json(
      { error: "Failed to generate stream URL" },
      { status: 500 },
    );
  }
}
