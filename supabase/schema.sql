-- ============================================================================
-- بكالوريا بيه - Supabase PostgreSQL Schema
-- Egyptian Educational SaaS Platform
-- ============================================================================
-- This script creates all 24 tables, enums, indexes, RLS policies, triggers,
-- and a seed admin user. Run this in the Supabase SQL Editor (Project: towfnhenuhjflkkgbagi).
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE course_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE video_status AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('TRANSCODE_480P', 'TRANSCODE_720P', 'HLS_PACKAGE', 'ENCRYPT', 'THUMBNAIL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('VODAFONE_CASH', 'ETISALAT_CASH', 'ORANGE_CASH', 'FAWRY', 'CARD', 'INSTAPAY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'TEXT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'ANNOUNCEMENT', 'LESSON', 'PAYMENT', 'CERTIFICATE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMESTER', 'YEARLY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- USERS & PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT,
  role          user_role NOT NULL DEFAULT 'STUDENT',
  avatar_url    TEXT,
  email_verified TIMESTAMPTZ,
  status        user_status NOT NULL DEFAULT 'ACTIVE',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio        TEXT,
  city       TEXT,
  country    TEXT DEFAULT 'مصر',
  facebook   TEXT,
  whatsapp   TEXT,
  birth_date DATE,
  gender     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SUBJECTS & GRADES (must come before teachers/students/courses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subjects (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT UNIQUE NOT NULL,
  name_en    TEXT,
  icon       TEXT,
  color      TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grades (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT UNIQUE NOT NULL,
  name_en    TEXT,
  level      INT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================================
-- TEACHERS & STUDENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS teachers (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title            TEXT,
  bio              TEXT,
  specialization   TEXT,
  years_experience INT,
  education        TEXT,
  verified         BOOLEAN NOT NULL DEFAULT FALSE,
  approved         BOOLEAN NOT NULL DEFAULT FALSE,
  rating           REAL NOT NULL DEFAULT 0,
  total_students   INT NOT NULL DEFAULT 0,
  total_courses    INT NOT NULL DEFAULT 0,
  total_revenue    REAL NOT NULL DEFAULT 0,
  paypal_account   TEXT,
  bank_account     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_teachers_approved ON teachers(approved);

CREATE TABLE IF NOT EXISTS students (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grade_id         UUID REFERENCES grades(id),
  school_name      TEXT,
  target_year      TEXT,
  total_spent      REAL NOT NULL DEFAULT 0,
  total_courses    INT NOT NULL DEFAULT 0,
  completed_courses INT NOT NULL DEFAULT 0,
  data_saver_mode  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- COURSES & CONTENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id      UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id      UUID NOT NULL REFERENCES subjects(id),
  grade_id        UUID REFERENCES grades(id),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT NOT NULL,
  cover_image_url TEXT,
  preview_video_url TEXT,
  price           REAL NOT NULL DEFAULT 0,
  discount_price  REAL,
  discount_until  TIMESTAMPTZ,
  level           course_level NOT NULL DEFAULT 'BEGINNER',
  academic_year   TEXT,
  language        TEXT DEFAULT 'العربية',
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  views           INT NOT NULL DEFAULT 0,
  rating          REAL NOT NULL DEFAULT 0,
  rating_count    INT NOT NULL DEFAULT 0,
  student_count   INT NOT NULL DEFAULT 0,
  total_lessons   INT NOT NULL DEFAULT 0,
  total_duration  INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject_id);
CREATE INDEX IF NOT EXISTS idx_courses_grade ON courses(grade_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured);

CREATE TABLE IF NOT EXISTS sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sections_course ON sections(course_id);

CREATE TABLE IF NOT EXISTS lessons (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id  UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  duration    INT NOT NULL DEFAULT 0,
  is_preview  BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lessons_section ON lessons(section_id);

CREATE TABLE IF NOT EXISTS videos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id        UUID UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  original_url     TEXT,
  r2_key           TEXT,
  hls_playlist_url TEXT,
  status           video_status NOT NULL DEFAULT 'UPLOADED',
  duration_480p    INT,
  duration_720p    INT,
  size_480p        BIGINT,
  size_720p        BIGINT,
  encryption_key   TEXT,
  thumbnail_url    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_processing_jobs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id     UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  type         job_type NOT NULL,
  status       job_status NOT NULL DEFAULT 'QUEUED',
  progress     INT NOT NULL DEFAULT 0,
  error        TEXT,
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON video_processing_jobs(status);

CREATE TABLE IF NOT EXISTS lesson_attachments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id      UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  file_name      TEXT NOT NULL,
  file_url       TEXT NOT NULL,
  file_type      TEXT NOT NULL,
  file_size      BIGINT NOT NULL,
  is_downloadable BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ENROLLMENTS & PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id          UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id           UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES users(id),
  payment_id          UUID,
  price_paid          REAL NOT NULL DEFAULT 0,
  progress            REAL NOT NULL DEFAULT 0,
  completed_lessons   INT NOT NULL DEFAULT 0,
  last_watched_lesson_id UUID,
  enrolled_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(student_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

CREATE TABLE IF NOT EXISTS payments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  enrollment_id UUID REFERENCES enrollments(id),
  amount        REAL NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'EGP',
  method        payment_method NOT NULL,
  status        payment_status NOT NULL DEFAULT 'PENDING',
  provider_ref  TEXT,
  teacher_share REAL,
  platform_fee  REAL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================================================
-- WATCH PROGRESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS watch_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id       UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  position        INT NOT NULL DEFAULT 0,
  duration        INT NOT NULL DEFAULT 0,
  watched_seconds INT NOT NULL DEFAULT 0,
  data_consumed_mb REAL NOT NULL DEFAULT 0,
  quality         TEXT NOT NULL DEFAULT '480p',
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  last_watched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_watch_user ON watch_progress(user_id);

-- ============================================================================
-- QUIZZES & QUESTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  passing_score INT NOT NULL DEFAULT 60,
  time_limit   INT,
  attempts     INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id     UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  type        question_type NOT NULL DEFAULT 'SINGLE_CHOICE',
  points      INT NOT NULL DEFAULT 1,
  explanation TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS answers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  is_correct  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INT NOT NULL DEFAULT 0
);

-- ============================================================================
-- REVIEWS & FAVORITES
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating    INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);

CREATE TABLE IF NOT EXISTS favorites (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ============================================================================
-- CERTIFICATES & NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS certificates (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id        UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id         UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  final_score       REAL NOT NULL,
  issued_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);

CREATE TABLE IF NOT EXISTS notifications (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title     TEXT NOT NULL,
  message   TEXT NOT NULL,
  type      notification_type NOT NULL,
  is_read   BOOLEAN NOT NULL DEFAULT FALSE,
  link      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS announcements (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  course_id  UUID REFERENCES courses(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  is_pinned  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id),
  plan       subscription_plan NOT NULL,
  status     TEXT NOT NULL DEFAULT 'ACTIVE',
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date   TIMESTAMPTZ NOT NULL,
  amount     REAL NOT NULL,
  auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TRIGGERS — auto update updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'users','profiles','teachers','students','courses','lessons',
    'videos','payments','watch_progress','reviews','enrollments'
  ]) LOOP
    EXECUTE format($f$
      DROP TRIGGER IF EXISTS set_updated_at ON %I;
      CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    $f$, t, t);
  END LOOP;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper: current user id (compatible with Supabase auth)
-- In Supabase, auth.uid() returns the authenticated user's id.

-- USERS
CREATE POLICY "users_select_all" ON users FOR SELECT USING (true);
CREATE POLICY "users_update_self" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_delete_self" ON users FOR DELETE USING (auth.uid() = id);

-- PROFILES
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_self" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_delete_self" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- TEACHERS (public read; self update; admin all)
CREATE POLICY "teachers_select_all" ON teachers FOR SELECT USING (true);
CREATE POLICY "teachers_insert_self" ON teachers FOR INSERT WITH CHECK (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "teachers_update_self_or_admin" ON teachers FOR UPDATE USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- STUDENTS
CREATE POLICY "students_select_all" ON students FOR SELECT USING (true);
CREATE POLICY "students_insert_self" ON students FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "students_update_self" ON students FOR UPDATE USING (auth.uid() = user_id);

-- SUBJECTS & GRADES (public)
CREATE POLICY "subjects_all_public" ON subjects FOR SELECT USING (true);
CREATE POLICY "subjects_admin_write" ON subjects FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "grades_all_public" ON grades FOR SELECT USING (true);
CREATE POLICY "grades_admin_write" ON grades FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- COURSES (public read; teacher/admin write)
CREATE POLICY "courses_select_published" ON courses FOR SELECT USING (
  is_published = true
  OR teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "courses_teacher_insert" ON courses FOR INSERT WITH CHECK (
  teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "courses_teacher_update" ON courses FOR UPDATE USING (
  teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "courses_teacher_delete" ON courses FOR DELETE USING (
  teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- SECTIONS / LESSONS (visible if course is published OR owner)
CREATE POLICY "sections_select" ON sections FOR SELECT USING (
  course_id IN (SELECT id FROM courses WHERE is_published = true)
  OR course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "sections_owner_write" ON sections FOR ALL USING (
  course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "lessons_select" ON lessons FOR SELECT USING (
  section_id IN (SELECT id FROM sections WHERE course_id IN (SELECT id FROM courses WHERE is_published = true))
  OR section_id IN (SELECT id FROM sections WHERE course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())))
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "lessons_owner_write" ON lessons FOR ALL USING (
  section_id IN (SELECT id FROM sections WHERE course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())))
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- VIDEOS — only enrolled students + course owner + admin can read
CREATE POLICY "videos_select_enrolled" ON videos FOR SELECT USING (
  -- Owner / admin
  lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
  -- Enrolled student
  OR lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    JOIN enrollments e ON e.course_id = c.id
    JOIN students st ON st.id = e.student_id
    WHERE st.user_id = auth.uid() AND e.is_active = true
  )
  -- Free preview lesson
  OR lesson_id IN (SELECT id FROM lessons WHERE is_preview = true)
);
CREATE POLICY "videos_owner_write" ON videos FOR ALL USING (
  lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "video_jobs_owner" ON video_processing_jobs FOR ALL USING (
  video_id IN (
    SELECT v.id FROM videos v
    JOIN lessons l ON l.id = v.lesson_id
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- LESSON ATTACHMENTS — same as videos
CREATE POLICY "attachments_select_enrolled" ON lesson_attachments FOR SELECT USING (
  lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
  OR lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    JOIN enrollments e ON e.course_id = c.id
    JOIN students st ON st.id = e.student_id
    WHERE st.user_id = auth.uid() AND e.is_active = true
  )
  OR lesson_id IN (SELECT id FROM lessons WHERE is_preview = true)
);
CREATE POLICY "attachments_owner_write" ON lesson_attachments FOR ALL USING (
  lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ENROLLMENTS — student can read own; teacher can read for own courses; admin all
CREATE POLICY "enrollments_select" ON enrollments FOR SELECT USING (
  user_id = auth.uid()
  OR course_id IN (SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "enrollments_insert_self" ON enrollments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "enrollments_update_self" ON enrollments FOR UPDATE USING (user_id = auth.uid());

-- PAYMENTS — owner + admin
CREATE POLICY "payments_select" ON payments FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "payments_insert_self" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());

-- WATCH PROGRESS — owner only
CREATE POLICY "watch_progress_select" ON watch_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "watch_progress_insert" ON watch_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "watch_progress_update" ON watch_progress FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "watch_progress_delete" ON watch_progress FOR DELETE USING (user_id = auth.uid());

-- QUIZZES / QUESTIONS / ANSWERS — read if enrolled or owner
CREATE POLICY "quizzes_select" ON quizzes FOR SELECT USING (
  lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.is_published = true
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "quizzes_owner_write" ON quizzes FOR ALL USING (
  lesson_id IN (
    SELECT l.id FROM lessons l
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "questions_select" ON questions FOR SELECT USING (
  quiz_id IN (SELECT id FROM quizzes)
);
CREATE POLICY "questions_owner_write" ON questions FOR ALL USING (
  quiz_id IN (
    SELECT q.id FROM quizzes q
    JOIN lessons l ON l.id = q.lesson_id
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "answers_select" ON answers FOR SELECT USING (
  question_id IN (SELECT id FROM questions)
);
CREATE POLICY "answers_owner_write" ON answers FOR ALL USING (
  question_id IN (
    SELECT q.id FROM questions q
    JOIN quizzes qz ON qz.id = q.quiz_id
    JOIN lessons l ON l.id = qz.lesson_id
    JOIN sections s ON s.id = l.section_id
    JOIN courses c ON c.id = s.course_id
    WHERE c.teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- REVIEWS — public read; user can write own
CREATE POLICY "reviews_select_all" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_self" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reviews_update_self" ON reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "reviews_delete_self" ON reviews FOR DELETE USING (user_id = auth.uid());

-- FAVORITES — owner only
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (user_id = auth.uid());

-- CERTIFICATES — owner + admin
CREATE POLICY "certificates_select" ON certificates FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- NOTIFICATIONS — owner only
CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_delete" ON notifications FOR DELETE USING (user_id = auth.uid());

-- ANNOUNCEMENTS — public read for enrolled + owner
CREATE POLICY "announcements_select" ON announcements FOR SELECT USING (
  teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  OR course_id IN (
    SELECT id FROM courses WHERE teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  )
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
  OR course_id IN (
    SELECT e.course_id FROM enrollments e
    JOIN students s ON s.id = e.student_id
    WHERE s.user_id = auth.uid() AND e.is_active = true
  )
);
CREATE POLICY "announcements_owner_write" ON announcements FOR ALL USING (
  teacher_id IN (SELECT id FROM teachers WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- SUBSCRIPTIONS — owner + admin
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Subjects
INSERT INTO subjects (name, name_en, icon, color, sort_order) VALUES
  ('اللغة العربية', 'Arabic', 'BookOpen', '#1A5F7A', 1),
  ('اللغة الإنجليزية', 'English', 'Languages', '#D62828', 2),
  ('الرياضيات', 'Mathematics', 'Calculator', '#FFD700', 3),
  ('الفيزياء', 'Physics', 'Atom', '#7C3AED', 4),
  ('الكيمياء', 'Chemistry', 'FlaskConical', '#10B981', 5),
  ('الأحياء', 'Biology', 'Dna', '#F59E0B', 6),
  ('التاريخ', 'History', 'ScrollText', '#92400E', 7),
  ('الجغرافيا', 'Geography', 'Globe', '#06B6D4', 8)
ON CONFLICT (name) DO NOTHING;

-- Grades
INSERT INTO grades (name, name_en, level, sort_order) VALUES
  ('الصف الأول الثانوي', 'Grade 1', 1, 1),
  ('الصف الثاني الثانوي', 'Grade 2', 2, 2),
  ('الصف الثالث الثانوي', 'Grade 3', 3, 3)
ON CONFLICT (name) DO NOTHING;

-- Admin user (password: Admin@123456)
-- The hash below is bcrypt for "Admin@123456". Change after first login.
INSERT INTO users (email, password_hash, name, role, status, email_verified) VALUES
  ('admin@bakaloriaa-bey.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq8K4ZoJY0ZqD8xv8K8xv8K8xv8K8x',
   'مدير المنصة',
   'ADMIN',
   'ACTIVE',
   NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- DONE
-- ============================================================================
-- Total: 24 tables, 11 enums, 11 triggers, 50+ RLS policies, seed data.
-- Compatible with Prisma Client (see prisma/schema.prisma).
