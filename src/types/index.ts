// Centralized TypeScript types for بكالوريا بيه platform
// Mirrors Prisma schema for client-side use

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";
export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type VideoStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
export type JobType = "TRANSCODE_480P" | "TRANSCODE_720P" | "HLS_PACKAGE" | "ENCRYPT" | "THUMBNAIL";
export type JobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
export type PaymentMethod = "VODAFONE_CASH" | "ETISALAT_CASH" | "ORANGE_CASH" | "FAWRY" | "CARD" | "INSTAPAY";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT";
export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "ANNOUNCEMENT" | "LESSON" | "PAYMENT" | "CERTIFICATE";
export type SubscriptionPlan = "MONTHLY" | "QUARTERLY" | "SEMESTER" | "YEARLY";
export type VideoQuality = "AUTO" | "480P" | "720P" | "LOW_DATA";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  status: UserStatus;
  createdAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  title?: string; // أ. / د. / م.
  bio: string;
  specialization: string;
  yearsExperience: number;
  education: string;
  verified: boolean;
  approved: boolean;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  gradeId?: string;
  schoolName?: string;
  targetYear?: string;
  totalSpent: number;
  totalCourses: number;
  completedCourses: number;
  dataSaverMode: boolean;
}

export interface Subject {
  id: string;
  name: string;
  nameEn?: string;
  icon: string; // lucide icon name
  color: string; // hex
  sortOrder: number;
  coursesCount: number;
}

export interface Grade {
  id: string;
  name: string;
  nameEn?: string;
  level: number;
  sortOrder: number;
}

export interface Course {
  id: string;
  teacherId: string;
  teacher: Teacher;
  subjectId: string;
  subject: Subject;
  gradeId?: string;
  grade?: Grade;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  previewVideoUrl?: string;
  price: number;
  discountPrice?: number;
  discountUntil?: string;
  level: CourseLevel;
  academicYear: string;
  language: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  rating: number;
  ratingCount: number;
  studentCount: number;
  totalLessons: number;
  totalDuration: number; // seconds
  sections: Section[];
  createdAt: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description?: string;
  sortOrder: number;
  duration: number; // seconds
  isPreview: boolean;
  isPublished: boolean;
  video?: Video;
  attachments: LessonAttachment[];
  quizzes: Quiz[];
}

export interface Video {
  id: string;
  lessonId: string;
  originalUrl?: string;
  r2Key?: string;
  hlsPlaylistUrl: string;
  status: VideoStatus;
  duration480p?: number;
  duration720p?: number;
  size480p?: number; // bytes
  size720p?: number;
  encryptionKey?: string;
  thumbnailUrl?: string;
}

export interface VideoProcessingJob {
  id: string;
  videoId: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface LessonAttachment {
  id: string;
  lessonId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isDownloadable: boolean;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  course: Course;
  pricePaid: number;
  progress: number;
  completedLessons: number;
  lastWatchedLessonId?: string;
  enrolledAt: string;
  completedAt?: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  enrollmentId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  providerRef?: string;
  teacherShare?: number;
  platformFee?: number;
  createdAt: string;
}

export interface WatchProgress {
  id: string;
  userId: string;
  lessonId: string;
  position: number;
  duration: number;
  watchedSeconds: number;
  dataConsumedMB: number;
  quality: string;
  completed: boolean;
  lastWatchedAt: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  points: number;
  explanation?: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
}

export interface Review {
  id: string;
  userId: string;
  user: { name: string; avatarUrl?: string };
  courseId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  teacherName: string;
  certificateNumber: string;
  finalScore: number;
  issuedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  teacherId?: string;
  courseId?: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

// SPA Router state
export type RouteName =
  | "home"
  | "courses"
  | "course-detail"
  | "watch"
  | "student-dashboard"
  | "teacher-dashboard"
  | "admin-dashboard"
  | "login"
  | "register"
  | "forgot-password"
  | "teacher-onboarding"
  | "favorites"
  | "notifications"
  | "certificates"
  | "search"
  | "about"
  | "privacy"
  | "terms";

export interface RouteState {
  name: RouteName;
  params?: Record<string, string>;
}
