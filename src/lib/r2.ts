/**
 * Cloudflare R2 Storage Client
 *
 * S3-compatible client for uploading and serving:
 * - HLS video segments (.m3u8 + .ts files)
 * - Original video uploads
 * - PDF attachments
 * - Course cover images
 *
 * All uploads use presigned URLs for secure, direct browser-to-R2 uploads.
 * Videos are served via signed URLs with expiration to prevent unauthorized access.
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_BUCKET = process.env.R2_BUCKET || "bakaloriaa-bey";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_ENDPOINT =
  process.env.R2_ENDPOINT ||
  `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.warn(
    "⚠️ R2 environment variables not set. Video storage will not work.",
  );
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Create the R2 bucket if it doesn't exist (run once on setup).
 */
export async function ensureR2Bucket() {
  try {
    await r2Client.send(
      new CreateBucketCommand({ Bucket: R2_BUCKET }),
    );
    console.log(`✓ Created R2 bucket: ${R2_BUCKET}`);
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    if (error.name === "BucketAlreadyOwnedByYou") {
      console.log(`✓ R2 bucket already exists: ${R2_BUCKET}`);
    } else {
      console.error("✗ Error creating R2 bucket:", error.message);
    }
  }
}

/**
 * Generate a presigned upload URL (browser → R2 direct upload).
 * Valid for 5 minutes.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Generate a presigned download/stream URL.
 * Default expiration: 1 hour (for video playback sessions).
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });
  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Upload a file directly from server (used by video processing pipeline).
 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<void> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

/**
 * Delete a file from R2.
 */
export async function deleteFile(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }),
  );
}

/**
 * Check if a file exists in R2.
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    await r2Client.send(
      new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * List files with a given prefix (e.g., all HLS segments for a video).
 */
export async function listFiles(prefix: string): Promise<string[]> {
  const response = await r2Client.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
    }),
  );
  return (response.Contents ?? []).map((obj) => obj.Key!).filter(Boolean);
}

/**
 * Get the public CDN URL for a file (if public access is enabled).
 */
export function getPublicUrl(key: string): string {
  if (!R2_PUBLIC_URL) {
    throw new Error("R2_PUBLIC_URL is not set. Use getPresignedDownloadUrl instead.");
  }
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Build the R2 key for different asset types.
 */
export const R2_KEYS = {
  // Original uploaded video: videos/original/{lessonId}/{filename}.mp4
  originalVideo: (lessonId: string, filename: string) =>
    `videos/original/${lessonId}/${filename}`,
  // HLS playlist: videos/hls/{lessonId}/playlist.m3u8
  hlsPlaylist: (lessonId: string) => `videos/hls/${lessonId}/playlist.m3u8`,
  // HLS segment: videos/hls/{lessonId}/segment-{n}.ts
  hlsSegment: (lessonId: string, segmentName: string) =>
    `videos/hls/${lessonId}/${segmentName}`,
  // Video thumbnail: videos/thumbnails/{lessonId}.jpg
  thumbnail: (lessonId: string) => `videos/thumbnails/${lessonId}.jpg`,
  // PDF attachment: attachments/{lessonId}/{filename}.pdf
  attachment: (lessonId: string, filename: string) =>
    `attachments/${lessonId}/${filename}`,
  // Course cover image: covers/{courseId}/{filename}
  coverImage: (courseId: string, filename: string) =>
    `covers/${courseId}/${filename}`,
  // User avatar: avatars/{userId}/{filename}
  avatar: (userId: string, filename: string) =>
    `avatars/${userId}/${filename}`,
};
