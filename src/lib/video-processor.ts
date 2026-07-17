/**
 * Video Processing Pipeline
 *
 * Pipeline (teacher uploads → student watches):
 *   1. Teacher uploads original video → R2 (original/{lessonId}/)
 *   2. FFmpeg transcodes to H.264 480p + 720p
 *   3. FFmpeg packages to HLS (.m3u8 + .ts segments)
 *   4. AES-128 encryption of HLS segments
 *   5. Encrypted HLS uploaded to R2 (hls/{lessonId}/)
 *   6. Video status updated to READY in database
 *
 * Usage:
 *   import { processVideo } from "@/lib/video-processor";
 *   await processVideo({ lessonId, originalUrl, r2Key });
 */

import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { randomBytes } from "crypto";
import { uploadFile, R2_KEYS, getPresignedDownloadUrl } from "@/lib/r2";

const FFMPEG_PATH = process.env.FFMPEG_PATH || "ffmpeg";
const FFPROBE_PATH = process.env.FFPROBE_PATH || "ffprobe";

export interface ProcessVideoOptions {
  lessonId: string;
  originalR2Key: string; // R2 key of the original uploaded video
  generate720p?: boolean; // default true
  onProgress?: (progress: number, stage: string) => void;
}

export interface ProcessedVideoResult {
  hlsPlaylistR2Key: string;
  durationSeconds: number;
  size480pBytes: number;
  size720pBytes?: number;
  encryptionKeyHex: string;
  thumbnailR2Key: string;
}

/**
 * Run an FFmpeg command and stream progress.
 */
function runFFmpeg(args: string[], onProgress?: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_PATH, args, { stdio: ["pipe", "pipe", "pipe"] });
    let duration = 0;

    proc.stderr.on("data", (data: Buffer) => {
      const text = data.toString();
      // Parse duration
      const durMatch = text.match(/Duration:\s(\d+):(\d+):(\d+\.\d+)/);
      if (durMatch) {
        duration =
          parseInt(durMatch[1]) * 3600 +
          parseInt(durMatch[2]) * 60 +
          parseFloat(durMatch[3]);
      }
      // Parse progress
      const timeMatch = text.match(/time=(\d+):(\d+):(\d+\.\d+)/);
      if (timeMatch && duration > 0 && onProgress) {
        const current =
          parseInt(timeMatch[1]) * 3600 +
          parseInt(timeMatch[2]) * 60 +
          parseFloat(timeMatch[3]);
        onProgress(Math.min(100, (current / duration) * 100));
      }
    });

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
    proc.on("error", reject);
  });
}

/**
 * Get video duration using ffprobe.
 */
export async function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFPROBE_PATH, [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);
    let output = "";
    proc.stdout.on("data", (d) => (output += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve(parseFloat(output.trim()));
      else reject(new Error(`ffprobe exited with code ${code}`));
    });
  });
}

/**
 * Main video processing pipeline.
 *
 * Steps:
 * 1. Download original from R2 to temp dir
 * 2. Generate AES-128 encryption key
 * 3. Transcode 480p H.264 → HLS with encryption
 * 4. (Optional) Transcode 720p H.264 → HLS with encryption
 * 5. Generate thumbnail
 * 6. Upload all HLS segments + playlist + key + thumbnail to R2
 * 7. Clean up temp files
 */
export async function processVideo(
  options: ProcessVideoOptions,
): Promise<ProcessedVideoResult> {
  const { lessonId, originalR2Key, generate720p = true, onProgress } = options;

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `bb-${lessonId}-`));
  try {
    onProgress?.(5, "downloading");

    // 1. Download original video
    const originalPath = path.join(tmpDir, "original.mp4");
    const originalUrl = await getPresignedDownloadUrl(originalR2Key);
    const response = await fetch(originalUrl);
    if (!response.ok) throw new Error(`Failed to download original: ${response.status}`);
    await fs.writeFile(originalPath, Buffer.from(await response.arrayBuffer()));

    const duration = await getVideoDuration(originalPath);

    // 2. Generate AES-128 encryption key
    const encryptionKey = randomBytes(16);
    const encryptionKeyHex = encryptionKey.toString("hex");
    const keyPath = path.join(tmpDir, "enc.key");
    await fs.writeFile(keyPath, encryptionKey);

    // Generate key info file (FFmpeg reads this for HLS encryption)
    const keyInfoPath = path.join(tmpDir, "enc.keyinfo");
    // For R2, the key URI will be a presigned URL generated on demand
    // For now, use a placeholder that the playback API will replace
    await fs.writeFile(
      keyInfoPath,
      `https://api.bakaloriaa-bey.com/api/video/key/${lessonId}\n${keyPath}\n`,
    );

    onProgress?.(15, "transcoding-480p");

    // 3. Transcode 480p H.264 → HLS with AES-128 encryption
    const hls480pDir = path.join(tmpDir, "480p");
    await fs.mkdir(hls480pDir, { recursive: true });

    await runFFmpeg(
      [
        "-i", originalPath,
        // H.264 video codec, 480p (854x480), optimized bitrate
        "-c:v", "libx264",
        "-preset", "medium", // balance speed/quality
        "-crf", "28", // constant quality (lower = better)
        "-vf", "scale='min(854,iw)':-2", // 480p width, keep aspect ratio
        "-profile:v", "high",
        "-level", "3.1",
        "-maxrate", "800k",
        "-bufsize", "1600k",
        // Audio: AAC, optimized for speech
        "-c:a", "aac",
        "-b:a", "96k",
        "-ac", "2",
        "-ar", "44100",
        // HLS packaging
        "-f", "hls",
        "-hls_time", "6", // 6-second segments
        "-hls_list_size", "0", // keep all segments
        "-hls_segment_filename", path.join(hls480pDir, "segment-%04d.ts"),
        "-hls_key_info_file", keyInfoPath,
        "-hls_playlist_type", "vod",
        path.join(hls480pDir, "playlist.m3u8"),
      ],
      (pct) => onProgress?.(15 + pct * 0.4, "transcoding-480p"), // 15% → 55%
    );

    let size480p = 0;
    const files480p = await fs.readdir(hls480pDir);
    for (const f of files480p) {
      const stat = await fs.stat(path.join(hls480pDir, f));
      size480p += stat.size;
    }

    let size720p: number | undefined;
    if (generate720p) {
      onProgress?.(55, "transcoding-720p");
      const hls720pDir = path.join(tmpDir, "720p");
      await fs.mkdir(hls720pDir, { recursive: true });

      await runFFmpeg(
        [
          "-i", originalPath,
          "-c:v", "libx264",
          "-preset", "medium",
          "-crf", "23",
          "-vf", "scale='min(1280,iw)':-2", // 720p
          "-profile:v", "high",
          "-level", "4.0",
          "-maxrate", "2000k",
          "-bufsize", "4000k",
          "-c:a", "aac",
          "-b:a", "128k",
          "-ac", "2",
          "-ar", "44100",
          "-f", "hls",
          "-hls_time", "6",
          "-hls_list_size", "0",
          "-hls_segment_filename", path.join(hls720pDir, "segment-%04d.ts"),
          "-hls_key_info_file", keyInfoPath,
          "-hls_playlist_type", "vod",
          path.join(hls720pDir, "playlist.m3u8"),
        ],
        (pct) => onProgress?.(55 + pct * 0.35, "transcoding-720p"), // 55% → 90%
      );

      const files720p = await fs.readdir(hls720pDir);
      for (const f of files720p) {
        const stat = await fs.stat(path.join(hls720pDir, f));
        size720p = (size720p ?? 0) + stat.size;
      }

      // Upload 720p segments
      for (const f of files720p) {
        const buf = await fs.readFile(path.join(hls720pDir, f));
        const contentType = f.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp2t";
        await uploadFile(R2_KEYS.hlsSegment(`${lessonId}-720p`, f), buf, contentType);
      }
    }

    onProgress?.(90, "generating-thumbnail");

    // 5. Generate thumbnail (at 10% of duration)
    const thumbnailPath = path.join(tmpDir, "thumbnail.jpg");
    await runFFmpeg([
      "-i", originalPath,
      "-ss", String(duration * 0.1),
      "-vframes", "1",
      "-vf", "scale=854:-2",
      "-q:v", "3",
      thumbnailPath,
    ]);
    const thumbnailBuf = await fs.readFile(thumbnailPath);
    await uploadFile(R2_KEYS.thumbnail(lessonId), thumbnailBuf, "image/jpeg");

    onProgress?.(95, "uploading-hls");

    // 6. Upload 480p HLS segments + playlist + encryption key
    for (const f of files480p) {
      const buf = await fs.readFile(path.join(hls480pDir, f));
      const contentType = f.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/mp2t";
      await uploadFile(R2_KEYS.hlsSegment(lessonId, f), buf, contentType);
    }

    // Upload encryption key to a protected path
    await uploadFile(`videos/hls/${lessonId}/enc.key`, encryptionKey, "application/octet-stream");

    onProgress?.(100, "complete");

    return {
      hlsPlaylistR2Key: R2_KEYS.hlsPlaylist(lessonId),
      durationSeconds: duration,
      size480pBytes: size480p,
      size720pBytes: size720p,
      encryptionKeyHex,
      thumbnailR2Key: R2_KEYS.thumbnail(lessonId),
    };
  } finally {
    // 7. Clean up temp files
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

/**
 * Get the HLS playlist URL for playback.
 * This should be called from an authenticated API route that verifies
 * the user is enrolled in the course before returning the signed URL.
 */
export async function getSignedHlsPlaylistUrl(lessonId: string): Promise<string> {
  return getPresignedDownloadUrl(R2_KEYS.hlsPlaylist(lessonId), 3600); // 1 hour
}

/**
 * Get the HLS encryption key URL.
 * The key endpoint must verify enrollment before returning the key.
 */
export async function getEncryptionKey(lessonId: string): Promise<Buffer> {
  // In production, fetch from R2 or a secure secret store
  const { getSignedDownloadUrl } = await import("@/lib/r2");
  const url = await getSignedDownloadUrl(`videos/hls/${lessonId}/enc.key`);
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}
