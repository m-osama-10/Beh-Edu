# API Documentation

Complete API reference for بكالوريا بيه platform.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication

All authenticated endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

> **Note**: Authentication is implemented via NextAuth.js v4 (architecture ready) + Supabase Auth. The current demo uses mock auth — see `src/store/auth-store.ts`.

---

## 📺 Video APIs

### POST `/api/video/upload-url`

Get a presigned URL for direct browser → R2 video upload. Only authenticated teachers can call this.

**Request**:
```json
{
  "filename": "lesson-1.mp4",
  "contentType": "video/mp4",
  "lessonId": "uuid-of-lesson"
}
```

**Response** (200):
```json
{
  "uploadUrl": "https://...r2.cloudflarestorage.com/bakaloriaa-bey/videos/original/uuid/lesson-1.mp4?X-Amz-...",
  "r2Key": "videos/original/uuid/lesson-1.mp4",
  "expiresIn": 600
}
```

**Usage**:
```typescript
// 1. Get upload URL
const { uploadUrl, r2Key } = await fetch("/api/video/upload-url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    filename: "lesson-1.mp4",
    contentType: "video/mp4",
    lessonId: "lesson-uuid",
  }),
}).then(r => r.json());

// 2. Upload directly to R2 (bypasses server for large files)
await fetch(uploadUrl, {
  method: "PUT",
  body: file,
  headers: { "Content-Type": "video/mp4" },
});
```

---

### POST `/api/video/process`

Trigger the FFmpeg video processing pipeline. Async — returns immediately with a job ID.

**Request**:
```json
{
  "lessonId": "uuid-of-lesson",
  "originalR2Key": "videos/original/uuid/lesson-1.mp4",
  "generate720p": true
}
```

**Response** (200):
```json
{
  "jobId": "job_uuid_1234567890",
  "status": "processing",
  "message": "Video processing started."
}
```

**Pipeline**: download → AES key gen → 480p HLS → 720p HLS → thumbnail → R2 upload → DB update.

---

### GET `/api/video/stream/[lessonId]`

Get a signed HLS playlist URL for playback (1-hour expiry).

**Auth**: Requires enrolled student.

**Response** (200):
```json
{
  "url": "https://...r2.cloudflarestorage.com/.../playlist.m3u8?X-Amz-...",
  "expiresIn": 3600
}
```

**Errors**: 401 (unauthorized), 403 (not enrolled), 409 (video not ready).

---

### GET `/api/video/key/[lessonId]`

Get the HLS AES-128 encryption key (16 binary bytes). Referenced inside `.m3u8` as `KEYURI`.

**Auth**: Requires enrolled student.

**Response** (200):
- Content-Type: `application/octet-stream`
- Body: 16 raw bytes

**Security**: `Cache-Control: no-store`, only delivered to enrolled students.

---

## 🔐 Row-Level Security (RLS) Summary

All 24 tables have RLS enabled. Key policies:

- **Public read**: `subjects`, `grades`, published `courses`, `reviews`
- **Owner-only**: `watch_progress`, `notifications`, `favorites`, `payments`, `enrollments`
- **Enrollment-based**: `videos`, `lesson_attachments` (enrolled OR preview OR owner)
- **Teacher-only**: `courses`, `sections`, `lessons`, `announcements` (own content)
- **Admin**: Full access via `role = 'ADMIN'` check

See `supabase/schema.sql` for complete policy definitions.

---

## 💳 Payment APIs (Future)

Architecture ready, providers to be integrated:

| Provider | Status | Notes |
|----------|--------|-------|
| Vodafone Cash | Planned | Vodafone Cash Business API |
| InstaPay | Planned | InstaPay API |
| Fawry | Planned | Fawry Merchant API |
| Etisalat Cash | Planned | Etisalat Cash API |
| Orange Cash | Planned | Orange Cash API |
| Cards | Planned | Paymob / Stripe |

**Revenue share**: 85% teacher / 15% platform (configurable).

Planned endpoints:
```
POST /api/payments/checkout     # Create checkout session
POST /api/payments/webhook      # Provider webhook handler
GET  /api/payments/history      # User payment history
POST /api/payments/refund       # Refund (admin only)
```
