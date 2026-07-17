/**
 * POST /api/video/process
 *
 * Triggers the video processing pipeline for an uploaded video.
 * In production, enqueue as a background job (Inngest, QStash, or worker).
 */
import { NextRequest, NextResponse } from "next/server";
import { processVideo } from "@/lib/video-processor";

export async function POST(request: NextRequest) {
  try {
    const { lessonId, originalR2Key, generate720p } = await request.json();

    if (!lessonId || !originalR2Key) {
      return NextResponse.json(
        { error: "lessonId and originalR2Key are required" },
        { status: 400 },
      );
    }

    // Kick off processing asynchronously
    processVideo({
      lessonId,
      originalR2Key,
      generate720p: generate720p ?? true,
    })
      .then((result) => {
        console.log(`✓ Video processing complete for lesson ${lessonId}`, result);
      })
      .catch((err) => {
        console.error(`✗ Video processing failed for lesson ${lessonId}:`, err);
      });

    return NextResponse.json({
      jobId: `job_${lessonId}_${Date.now()}`,
      status: "processing",
      message: "Video processing started.",
    });
  } catch (error) {
    console.error("Process video error:", error);
    return NextResponse.json(
      { error: "Failed to start video processing" },
      { status: 500 },
    );
  }
}
