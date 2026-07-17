# Deployment Guide

Step-by-step guide to deploy بكالوريا بيه to production.

## 📋 Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (free tier works)
- [Supabase](https://supabase.com) project (free tier works)
- [Cloudflare](https://cloudflare.com) account with R2 enabled

---

## 1. Database (Supabase)

### 1.1 Create Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Fill in:
   - **Name**: `bakaloriaa-bey`
   - **Database Password**: (generate a strong one — save it!)
   - **Region**: `US East (N. Virginia)` — closest to Vercel
3. Wait for provisioning (~2 minutes)

### 1.2 Apply Schema

**Option A: Via SQL Editor (recommended)**

1. In Supabase Dashboard → SQL Editor → New Query
2. Open `supabase/schema.sql` from this repo
3. Copy all content → paste in SQL Editor → Run
4. Verify: 24 tables created, 8 subjects + 3 grades seeded

**Option B: Via Script**

```bash
# In your local terminal
bun run scripts/apply-supabase-schema.ts
bun run scripts/seed-data.ts
```

### 1.3 Get Connection Strings

In Supabase Dashboard → Project Settings → Database:

- **Connection pooling** (use for `DATABASE_URL`):
  ```
  postgresql://postgres.towfnhenuhjflkkgbagi:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```
- **Direct connection** (use for `DIRECT_URL`):
  ```
  postgresql://postgres.towfnhenuhjflkkgbagi:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
  ```

> **Important**: URL-encode the password if it contains special characters (e.g., `@` → `%40`).

### 1.4 Get API Keys

In Supabase Dashboard → Project Settings → API:

- `Project URL`: `https://towfnhenuhjflkkgbagi.supabase.co`
- `Publishable key`: `sb_publishable_...`
- `Service role key`: `sb_secret_...` (keep secret!)

### 1.5 Enable Auth Providers

In Supabase Dashboard → Authentication → Providers:

- **Email**: Enable (for email/password auth)
- **Google**: (optional) Configure OAuth credentials

---

## 2. Storage (Cloudflare R2)

### 2.1 Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → R2
2. Create bucket:
   - **Name**: `bakaloriaa-bey`
   - **Location**: Auto (or closest to users)
3. Note the **S3 API endpoint**: `https://[account-id].r2.cloudflarestorage.com`

### 2.2 Create API Tokens

In R2 → Manage R2 API Tokens → Create API Token:

- **Token name**: `bakaloriaa-bey-app`
- **Permissions**: Object Read & Write
- **Specify bucket**: `bakaloriaa-bey`
- **TTL**: Forever (or rotate as needed)

Save:
- **Access Key ID**: `d56e05eb...`
- **Secret Access Key**: `327996e2...`
- **Endpoint**: `https://[account-id].r2.cloudflarestorage.com`

### 2.3 (Optional) Enable Public Access

For cover images and thumbnails to be served publicly:

1. R2 → bucket → Settings → Public Access
2. Connect a domain (e.g., `cdn.bakaloriaa-bey.com`)
3. Or use the default `pub-xxx.r2.dev` subdomain
4. Set `R2_PUBLIC_URL` in env: `https://pub-xxx.r2.dev`

> **Note**: Videos should NOT be public — they're served via signed URLs only.

---

## 3. Code Deployment (Vercel)

### 3.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: بكالوريا بيه platform"
git branch -M main
git remote add origin https://github.com/m-osama-10/Beh-Edu.git
git push -u origin main
```

### 3.2 Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `Beh-Edu` repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `bun run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `bun install` (auto-detected)

### 3.3 Set Environment Variables

In Vercel → Project → Settings → Environment Variables, add ALL of these:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://postgres.towfnhenuhjflkkgbagi:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres` |
| `DIRECT_URL` | `postgresql://postgres.towfnhenuhjflkkgbagi:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://towfnhenuhjflkkgbagi.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` |
| `NEXTAUTH_SECRET` | (run `openssl rand -hex 32` locally) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (your Vercel URL) |
| `R2_ACCOUNT_ID` | `b1b92e783ca5a2d6291ec3ce23d3090a` |
| `R2_BUCKET` | `bakaloriaa-bey` |
| `R2_ACCESS_KEY_ID` | `d56e05eb...` |
| `R2_SECRET_ACCESS_KEY` | `327996e2...` |
| `R2_ENDPOINT` | `https://b1b92e783ca5a2d6291ec3ce23d3090a.r2.cloudflarestorage.com` |
| `R2_PUBLIC_URL` | `https://pub-xxx.r2.dev` (if public access enabled) |
| `FFMPEG_PATH` | `/usr/bin/ffmpeg` |
| `FFPROBE_PATH` | `/usr/bin/ffprobe` |
| `VIDEO_ENCRYPTION_KEY` | (32-byte hex string) |

> **Tip**: Set all variables for **Production**, **Preview**, AND **Development** environments.

### 3.4 Deploy

Click **Deploy**. Vercel will:
1. Install dependencies (`bun install`)
2. Build the project (`bun run build`)
3. Deploy to global edge network
4. Provide a URL like `https://beh-edu.vercel.app`

### 3.5 Run Migrations (if needed)

If you make schema changes, run migrations locally:

```bash
# Locally (uses DIRECT_URL)
bunx prisma db push

# Or create a proper migration
bunx prisma migrate dev --name your_migration_name
```

### 3.6 Custom Domain (Optional)

In Vercel → Project → Settings → Domains:

1. Add your domain (e.g., `bakaloriaa-bey.com`)
2. Add DNS records as instructed
3. Update `NEXTAUTH_URL` to match

---

## 4. Post-Deployment Checklist

- [ ] Visit the deployed URL — landing page loads
- [ ] Login with demo accounts works
- [ ] Student dashboard shows enrolled courses
- [ ] Teacher dashboard shows analytics
- [ ] Admin dashboard shows platform stats
- [ ] Course detail page loads
- [ ] Video player loads (for enrolled courses)
- [ ] Watermark shows student name on video
- [ ] Data consumption tracker updates during playback
- [ ] Dark mode toggle works
- [ ] Mobile responsive (test on phone)
- [ ] R2 bucket accessible (test via teacher upload)

---

## 5. Monitoring & Maintenance

### 5.1 Vercel Analytics

Enable in Vercel → Project → Analytics (free tier available):
- Web Vitals (LCP, FID, CLS)
- Page views
- Top pages

### 5.2 Supabase Logs

In Supabase Dashboard → Logs:
- **API logs**: Auth + REST API calls
- **Database logs**: Query performance, errors
- **Storage logs**: File uploads/downloads

### 5.3 Cloudflare R2 Metrics

In Cloudflare Dashboard → R2 → bucket → Metrics:
- Storage used
- Operations (read/write)
- Egress bandwidth

### 5.4 Database Backups

Supabase free tier: Daily backups (7-day retention).
Pro tier: Point-in-time recovery (PITR), 30-day retention.

---

## 6. Scaling Considerations

### 6.1 Database

- **Connection pooling**: Already using Supabase Pooler (port 6543) — handles up to 200 concurrent connections per serverless function
- **Indexes**: All foreign keys + frequently-queried columns are indexed (see `supabase/schema.sql`)
- **Read replicas**: Add via Supabase Pro when read traffic exceeds single-instance capacity

### 6.2 Video Storage

- **R2 egress**: Free for first 10GB/month, then $0.36/GB
- **CDN**: Use Cloudflare CDN in front of R2 for global caching
- **Adaptive bitrate**: HLS supports adaptive streaming — add more quality levels if needed

### 6.3 Video Processing

- **Current**: Synchronous FFmpeg processing (blocks API route)
- **Recommended**: Move to background job queue:
  - [Inngest](https://inngest.com) (Vercel-native)
  - [QStash](https://upstash.com/qstash) (serverless)
  - [Cloudflare Workers](https://workers.cloudflare.com) + Queues

### 6.4 Authentication

- **Current**: Mock auth for demo
- **Production**: Use Supabase Auth (email/password, Google OAuth, etc.)
- **Session storage**: HTTP-only cookies (NextAuth default)

---

## 7. Troubleshooting

### Common Issues

#### "Database connection failed"
- Verify `DATABASE_URL` uses port `6543` (pooler) and `DIRECT_URL` uses port `5432`
- URL-encode special characters in password (`@` → `%40`)
- Check Supabase project is not paused (free tier pauses after 7 days inactivity)

#### "R2 upload failed"
- Verify `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` are correct
- Check bucket name matches `R2_BUCKET`
- Ensure token has "Object Read & Write" permission
- Check if R2 endpoint is `https://[account-id].r2.cloudflarestorage.com` (not the S3 endpoint)

#### "Video not playing"
- Check `video.status === 'READY'` in database
- Verify student is enrolled in the course
- Check browser console for hls.js errors
- Verify `/api/video/key/[lessonId]` returns 200 (not 401/403)
- Check CORS settings on R2 bucket (allow `*` for HLS)

#### "Build failed on Vercel"
- Run `bun run lint` locally — fix all errors
- Check TypeScript: `bunx tsc --noEmit`
- Ensure all env vars are set in Vercel dashboard
- Check Vercel build logs for specific error

#### "Fonts not loading"
- IBM Plex Sans Arabic is loaded via `next/font/google` — no extra config needed
- If behind a corporate proxy, set `NEXT_FONT_GOOGLE_MIRROR_URL`

---

## 8. Cost Estimates

### Free Tier Limits

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth, 100GB-hrs build | $20/mo (Pro) |
| **Supabase** | 500MB DB, 1GB storage, 50K MAU | $25/mo (Pro) |
| **Cloudflare R2** | 10GB storage, 1M ops/mo, 10GB egress | $5/mo (storage) + $0.36/GB egress |
| **Domain** | — | ~$10-15/year |

### Estimated Monthly Cost

- **Small** (< 1K users): $0 (all free tiers)
- **Medium** (1K-10K users): $25-50/mo
- **Large** (10K-100K users): $100-500/mo
- **Enterprise** (100K+ users): Custom

---

## 9. Security Checklist

- [ ] All secrets in environment variables (never committed)
- [ ] `.env` in `.gitignore`
- [ ] RLS enabled on all tables
- [ ] HLS encryption enabled for all videos
- [ ] Signed URLs with short expiry (1 hour)
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] CSRF protection (NextAuth default)
- [ ] Rate limiting on auth endpoints (add via Vercel middleware)
- [ ] Regular database backups
- [ ] Security headers (add `next.config.ts` headers)
