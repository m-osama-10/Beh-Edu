# بكالوريا بيه | Baccalaureate Bey

> منصة التعليم المصرية الأولى لطلاب الثانوية العامة والبكالوريا
>
> An Egyptian online learning platform connecting teachers with students, with protected video lessons, low-data streaming mode, and affordable pricing.

![Status](https://img.shields.io/badge/status-production--ready-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🇪🇬 نظرة عامة

منصة تعليمية SaaS مصرية متكاملة مصممة خصيصاً لطلاب الثانوية العامة والبكالوريا. تربط المنصة بين المدرسين والطلاب، مما يسمح للمدرسين بإنشاء وبيع الكورسات بينما يتعلم الطلاب عبر فيديوهات محمية بتقنية تشفير HLS.

### الميزات الرئيسية

- 🎬 **نظام فيديو محمي**: تشفير HLS + علامة مائية باسم الطالب + URLs موقعة مؤقتة
- 📱 **وضع توفير الباقة**: جودة 480p محسّنة لتقليل استهلاك الإنترنت بنسبة 60%
- 👥 **3 أدوار**: مدير / مدرس / طالب — كل دور بلوحة تحكم خاصة
- 💳 **بوابات دفع مصرية**: Vodafone Cash, InstaPay, Fawry, Etisalat Cash, Orange Cash
- 🌙 **وضع ليلي** + دعم RTL كامل + خط IBM Plex Sans Arabic
- 📊 **لوحات تحكم تفاعلية** مع رسوم بيانية (Recharts)
- 🔔 **إشعارات + شهادات + مفضلة + مراجعات**
- 🎨 **هوية بصرية مصرية**: ألوان مستخلصة من الشعار (الأحمر #D62828 + الأزرق #1A5F7A + الذهبي)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) |
| **Database** | PostgreSQL (Supabase) + Prisma ORM 6 |
| **Auth** | Supabase Auth + NextAuth.js v4 (architecture ready) |
| **Storage** | Cloudflare R2 (S3-compatible) for videos, PDFs, images |
| **Video Processing** | FFmpeg (H.264 + HLS + AES-128 encryption) |
| **Hosting** | Vercel (recommended) |
| **State** | Zustand (client) + TanStack Query (server, optional) |
| **Charts** | Recharts |
| **Fonts** | IBM Plex Sans Arabic (Google Fonts) |

---

## 📁 Project Structure

```
بكالوريا بيه/
├── prisma/
│   └── schema.prisma              # 24 models (PostgreSQL)
├── public/
│   ├── logo.png                   # Platform logo
│   ├── manifest.json              # PWA manifest
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── layout.tsx             # RTL, IBM Plex Sans Arabic, ThemeProvider
│   │   ├── page.tsx               # SPA router entry (single route)
│   │   ├── globals.css            # Brand colors, dark mode, utilities
│   │   └── api/
│   │       └── video/
│   │           ├── upload-url/    # Presigned upload URL
│   │           ├── process/       # Trigger FFmpeg pipeline
│   │           ├── key/[lessonId] # HLS encryption key delivery
│   │           └── stream/[lessonId] # Signed HLS playlist URL
│   ├── components/
│   │   ├── layout/                # Header, Footer, MobileBottomNav
│   │   ├── pages/                 # 16 page components
│   │   ├── shared/                # CourseCard, SubjectCard, etc.
│   │   └── video/                 # ProtectedVideoPlayer (hls.js)
│   ├── store/                     # Zustand stores (router, auth, etc.)
│   ├── data/                      # Mock data + helpers
│   ├── lib/
│   │   ├── db.ts                  # Prisma client
│   │   ├── r2.ts                  # Cloudflare R2 S3 client
│   │   ├── video-processor.ts     # FFmpeg + HLS + encryption pipeline
│   │   └── utils.ts
│   ├── hooks/
│   └── types/                     # TypeScript types
├── supabase/
│   ├── schema.sql                 # Full SQL schema with RLS policies
│   └── seed.sql                   # Subjects + grades seed data
├── scripts/
│   ├── apply-supabase-schema.ts   # Apply schema to remote DB
│   ├── seed-data.ts               # Apply seed data
│   ├── reset-and-apply-schema.ts  # Drop + recreate schema
│   └── setup-r2.ts                # R2 connectivity test
├── .env.example                   # Template for env vars
└── package.json
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+ / Bun
- A Supabase project (free tier works)
- A Cloudflare R2 bucket (free 10GB tier)
- FFmpeg installed (for video processing)

### 1. Clone & Install

```bash
git clone https://github.com/m-osama-10/Beh-Edu.git
cd Beh-Edu
bun install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` — Supabase connection pooler URL (port 6543)
- `DIRECT_URL` — Supabase direct connection URL (port 5432)
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable key
- `R2_*` — Cloudflare R2 credentials
- `NEXTAUTH_SECRET` — Random 32-char string (run `openssl rand -hex 32`)

### 3. Database Setup

The Supabase SQL schema includes all 24 tables, 11 enums, indexes, triggers, and 50+ RLS policies.

```bash
# Apply the schema to your Supabase database
bun run scripts/apply-supabase-schema.ts

# Or via Supabase Dashboard → SQL Editor → paste supabase/schema.sql → Run

# Seed initial data (8 subjects + 3 grades)
bun run scripts/seed-data.ts

# Verify Prisma can connect
bunx prisma db push
bunx prisma generate
```

### 4. Run the Dev Server

```bash
bun run dev
```

Open `http://localhost:3000` to see the platform.

### 5. Demo Accounts

Use these accounts to explore the dashboards (or click the quick-login buttons on the login page):

| Role | Email | Password |
|------|-------|----------|
| 👨‍💼 Admin | admin@bakaloriaa-bey.test | demo123 |
| 👨‍🏫 Teacher | teacher@bakaloriaa-bey.test | demo123 |
| 👨‍🎓 Student | student@bakaloriaa-bey.test | demo123 |

---

## 🗄️ Database Schema

24 tables with comprehensive Row-Level Security:

| Table | Purpose |
|-------|---------|
| `users` | Auth + role (ADMIN/TEACHER/STUDENT) |
| `profiles` | Extended user info |
| `teachers` | Teacher profiles (verified, approved, revenue) |
| `students` | Student profiles (grade, data_saver_mode) |
| `subjects` | 8 subjects (Arabic, Math, Physics, ...) |
| `grades` | 3 grades (1st, 2nd, 3rd secondary) |
| `courses` | Course catalog with pricing + discounts |
| `sections` | Course chapters |
| `lessons` | Individual lessons (with duration, is_preview) |
| `videos` | HLS playlist URL, encryption key, status |
| `video_processing_jobs` | FFmpeg job queue (QUEUED → PROCESSING → COMPLETED) |
| `lesson_attachments` | PDF files per lesson |
| `enrollments` | Student ↔ course enrollment + progress |
| `payments` | Payment records (Vodafone Cash, InstaPay, etc.) |
| `watch_progress` | Per-lesson watch position + data consumed |
| `quizzes` | Lesson quizzes |
| `questions` | Quiz questions (single/multiple choice, true/false) |
| `answers` | Question answers |
| `reviews` | Course ratings + comments |
| `favorites` | Student favorites |
| `certificates` | Course completion certificates |
| `notifications` | User notifications |
| `announcements` | Teacher/course announcements |
| `subscriptions` | Monthly/quarterly/yearly plans |

### Row-Level Security (RLS)

All tables have RLS enabled. Key policies:

- **Students** can only read their own `enrollments`, `watch_progress`, `notifications`, `favorites`, `certificates`
- **Teachers** can CRUD their own `courses`, `sections`, `lessons`, `videos`, `quizzes`
- **Videos** are only readable by: course owner, enrolled students, or free preview lessons
- **Admins** have full access to all tables
- Public can read: published courses, subjects, grades, reviews

See `supabase/schema.sql` for the complete RLS policy definitions.

---

## 🎬 Video Pipeline

### How it works (teacher uploads → student watches)

```
1. Teacher uploads original video
   └─→ Browser → R2 (presigned PUT URL)
       R2 key: videos/original/{lessonId}/{filename}

2. POST /api/video/process triggers pipeline
   └─→ video-processor.ts:
       a. Download original from R2
       b. Generate AES-128 encryption key (16 bytes)
       c. FFmpeg transcode 480p H.264 → HLS (.m3u8 + .ts) with encryption
       d. (Optional) FFmpeg transcode 720p H.264 → HLS with encryption
       e. FFmpeg generate thumbnail at 10% of duration
       f. Upload HLS segments + playlist + key + thumbnail to R2
       g. Update database: video.status = READY

3. Student requests playback
   └─→ GET /api/video/stream/{lessonId}
       ├─ Verify session + enrollment
       └─ Return signed HLS playlist URL (1 hour expiry)

4. hls.js player loads playlist
   └─→ For each segment, browser fetches .ts file (signed URL)
   └─→ For decryption, browser calls /api/video/key/{lessonId}
       ├─ Verify session + enrollment
       └─ Return 16-byte AES key
```

### FFmpeg Settings (optimized for Egyptian mobile networks)

| Quality | Resolution | Bitrate | Audio | MB/min |
|---------|-----------|---------|-------|--------|
| 480p (default) | 854×480 | 800 Kbps | AAC 96 Kbps | ~3.5 MB |
| 720p (optional) | 1280×720 | 2000 Kbps | AAC 128 Kbps | ~7 MB |
| Low-data mode | 480p | 800 Kbps | AAC 96 Kbps | ~3.5 MB |

### Security Features

- ✅ HLS AES-128 encryption (segments are useless without the key)
- ✅ Encryption key delivered only to enrolled students via authenticated API
- ✅ Signed URLs with 1-hour expiration (cannot be shared)
- ✅ Watermark overlay with student name + email (3 positions, rotated)
- ✅ Right-click disabled on video element
- ✅ `hls.js` configured to prevent direct segment download

---

## ☁️ Deployment

### Deploy to Vercel

1. **Push to GitHub** (already done — `https://github.com/m-osama-10/Beh-Edu.git`)

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the `Beh-Edu` repository
   - Framework preset: **Next.js**
   - Root directory: `/` (default)

3. **Environment Variables**: Add all variables from `.env.example` in the Vercel dashboard:
   - `DATABASE_URL` — use the connection POOLER URL (port 6543) for serverless
   - `DIRECT_URL` — use the direct connection (port 5432) for migrations
   - All `R2_*` variables
   - `NEXTAUTH_SECRET` — generate with `openssl rand -hex 32`
   - `NEXTAUTH_URL` — your Vercel URL (e.g., `https://beh-edu.vercel.app`)

4. **Build & Deploy**: Vercel auto-detects Next.js and runs `bun run build`.

5. **Post-deploy**:
   - Run database migrations: `bunx prisma db push` (locally, with `DIRECT_URL`)
   - Run seed: `bun run scripts/seed-data.ts`
   - Test R2 upload via the teacher dashboard

### Cloudflare R2 Setup

1. Create an R2 bucket named `bakaloriaa-bey` in the Cloudflare dashboard
2. (Optional) Enable public access for cover images (custom domain recommended)
3. The S3-compatible API credentials are already in `.env`
4. Test connectivity: `bun run scripts/setup-r2.ts`

### Supabase Setup

The SQL schema is already applied. To re-apply or reset:

```bash
# Apply schema (idempotent — safe to re-run)
bun run scripts/apply-supabase-schema.ts

# Seed initial data (subjects + grades)
bun run scripts/seed-data.ts

# Full reset (drops all tables + recreates)
bun run scripts/reset-and-apply-schema.ts
```

---

## 📡 API Reference

### Video APIs

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/video/upload-url` | POST | Teacher | Get presigned R2 upload URL |
| `/api/video/process` | POST | Teacher | Trigger FFmpeg processing pipeline |
| `/api/video/stream/[lessonId]` | GET | Enrolled Student | Get signed HLS playlist URL |
| `/api/video/key/[lessonId]` | GET | Enrolled Student | Get HLS AES-128 encryption key |

### Example: Upload a video

```typescript
// 1. Get presigned upload URL
const { uploadUrl, r2Key } = await fetch("/api/video/upload-url", {
  method: "POST",
  body: JSON.stringify({
    filename: "lesson-1.mp4",
    contentType: "video/mp4",
    lessonId: "lesson-uuid",
  }),
}).then(r => r.json());

// 2. Upload directly to R2 (browser → R2, bypasses server)
await fetch(uploadUrl, {
  method: "PUT",
  body: file,
  headers: { "Content-Type": "video/mp4" },
});

// 3. Trigger processing
await fetch("/api/video/process", {
  method: "POST",
  body: JSON.stringify({
    lessonId: "lesson-uuid",
    originalR2Key: r2Key,
    generate720p: true,
  }),
});
```

### Example: Play a video

```typescript
// 1. Get signed HLS URL (must be enrolled)
const { url } = await fetch(`/api/video/stream/${lessonId}`).then(r => r.json());

// 2. Initialize hls.js player
const hls = new Hls();
hls.loadSource(url);
hls.attachMedia(videoElement);
// hls.js automatically fetches the encryption key from /api/video/key/[lessonId]
```

---

## 🎨 Design System

### Brand Colors (from logo)

| Color | Hex | Usage |
|-------|-----|-------|
| **Blue** | `#1A5F7A` | Primary (buttons, links, accents) |
| **Red** | `#D62828` | Accent (CTAs, badges, highlights) |
| **Gold** | `#FFD700` | Highlights (certificates, featured) |
| White | `#FFFFFF` | Background (light mode) |
| Black | `#0E1117` | Background (dark mode) |

### Typography

- **Font**: IBM Plex Sans Arabic (Google Fonts)
- **Weights**: 100, 200, 300, 400, 500, 600, 700
- **Direction**: RTL (right-to-left) for Arabic

### CSS Custom Properties

```css
:root {
  --brand-blue: #1A5F7A;
  --brand-red: #D62828;
  --brand-gold: #FFD700;
  --primary: var(--brand-blue);
  --accent: var(--brand-red);
}
```

Utility classes available:
- `.bg-brand-gradient` — Blue → Red diagonal gradient
- `.text-brand-gradient` — Gradient text
- `.bg-gold-gradient` — Gold gradient for certificates
- `.video-watermark` — Diagonal watermark overlay
- `.card-hover` — Lift + shadow on hover

---

## 📱 Pages

| Route (SPA) | Description |
|-------------|-------------|
| `home` | Landing page (hero, features, courses, testimonials) |
| `courses` | Courses marketplace with filters |
| `course-detail` | Single course with curriculum + reviews |
| `watch` | Protected video player + lesson list |
| `student-dashboard` | Student progress + courses + certificates |
| `teacher-dashboard` | Teacher analytics + course management |
| `admin-dashboard` | Platform admin (users, teachers, payments) |
| `login` / `register` / `forgot-password` | Auth pages |
| `favorites` / `notifications` / `certificates` | Student features |
| `about` / `privacy` / `terms` | Static pages |

---

## 🔧 Scripts

```bash
bun run dev              # Start dev server (port 3000)
bun run build            # Production build
bun run lint             # ESLint check
bun run db:push          # Push Prisma schema to DB
bun run db:generate      # Regenerate Prisma client
bun run db:migrate       # Create migration
bun run db:reset         # Reset DB (destructive!)

# Custom scripts
bun run scripts/apply-supabase-schema.ts    # Apply SQL schema
bun run scripts/seed-data.ts                # Seed subjects + grades
bun run scripts/reset-and-apply-schema.ts   # Drop + recreate schema
bun run scripts/setup-r2.ts                 # Test R2 connectivity
```

---

## 🔒 Security

- ✅ **RLS enabled** on all 24 tables
- ✅ **HLS AES-128 encryption** for all videos
- ✅ **Signed URLs** with 1-hour expiration
- ✅ **Watermark overlay** with student identity
- ✅ **Enrollment verification** before video access
- ✅ **Environment variables** for all secrets
- ✅ **No secrets in client-side code**
- ✅ `zod` validation on all forms
- ✅ CSRF protection via NextAuth
- ✅ Rate limiting ready (add via Upstash or Vercel middleware)

---

## 📈 Performance

- **Mobile-first** responsive design (360px+)
- **Code splitting** per route (Next.js App Router)
- **Image optimization** via `next/image`
- **Font optimization** via `next/font` (IBM Plex Sans Arabic)
- **HLS streaming** (adaptive bitrate, no full download)
- **480p default** for low-bandwidth Egyptian networks
- **Data-saver mode** reduces consumption 60%

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🆘 Support

- 📧 Email: info@bakaloriaa-bey.com
- 📱 Phone: +20 100 123 4567
- 🌐 Website: [bakaloriaa-bey.com](https://bakaloriaa-bey.com)

---

<div align="center">

**صُنع بكل حب في مصر 🇪🇬**

© 2026 بكالوريا بيه - جميع الحقوق محفوظة

</div>
