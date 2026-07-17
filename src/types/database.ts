/**
 * Supabase Database type definitions.
 *
 * In a real project, generate these with:
 *   bunx supabase gen types types --project-id towfnhenuhjflkkgbagi > src/types/database.ts
 *
 * For now we use a minimal typed interface that covers the tables we use.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";
export type UserStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type VideoStatus = "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
export type PaymentMethod =
  | "VODAFONE_CASH"
  | "ETISALAT_CASH"
  | "ORANGE_CASH"
  | "FAWRY"
  | "CARD"
  | "INSTAPAY";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT";
export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "ANNOUNCEMENT"
  | "LESSON"
  | "PAYMENT"
  | "CERTIFICATE";
export type SubscriptionPlan = "MONTHLY" | "QUARTERLY" | "SEMESTER" | "YEARLY";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string | null;
          name: string;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          email_verified: string | null;
          status: UserStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash?: string | null;
          name: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          email_verified?: string | null;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      teachers: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          bio: string | null;
          specialization: string | null;
          years_experience: number | null;
          education: string | null;
          verified: boolean;
          approved: boolean;
          rating: number;
          total_students: number;
          total_courses: number;
          total_revenue: number;
          paypal_account: string | null;
          bank_account: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["teachers"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["teachers"]["Insert"]>;
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          grade_id: string | null;
          school_name: string | null;
          target_year: string | null;
          total_spent: number;
          total_courses: number;
          completed_courses: number;
          data_saver_mode: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["students"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["students"]["Insert"]>;
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subjects"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["subjects"]["Insert"]>;
      };
      grades: {
        Row: {
          id: string;
          name: string;
          name_en: string | null;
          level: number;
          sort_order: number;
          is_active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["grades"]["Row"]> & {
          name: string;
          level: number;
        };
        Update: Partial<Database["public"]["Tables"]["grades"]["Insert"]>;
      };
      courses: {
        Row: {
          id: string;
          teacher_id: string;
          subject_id: string;
          grade_id: string | null;
          title: string;
          slug: string;
          description: string;
          cover_image_url: string | null;
          preview_video_url: string | null;
          price: number;
          discount_price: number | null;
          discount_until: string | null;
          level: CourseLevel;
          academic_year: string | null;
          language: string;
          is_published: boolean;
          is_featured: boolean;
          views: number;
          rating: number;
          rating_count: number;
          student_count: number;
          total_lessons: number;
          total_duration: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["courses"]["Row"]> & {
          teacher_id: string;
          subject_id: string;
          title: string;
          slug: string;
          description: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      sections: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sections"]["Row"]> & {
          course_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["sections"]["Insert"]>;
      };
      lessons: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          duration: number;
          is_preview: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lessons"]["Row"]> & {
          section_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      videos: {
        Row: {
          id: string;
          lesson_id: string;
          original_url: string | null;
          r2_key: string | null;
          hls_playlist_url: string | null;
          status: VideoStatus;
          duration_480p: number | null;
          duration_720p: number | null;
          size_480p: number | null;
          size_720p: number | null;
          encryption_key: string | null;
          thumbnail_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["videos"]["Row"]> & {
          lesson_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
      };
      lesson_attachments: {
        Row: {
          id: string;
          lesson_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          is_downloadable: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lesson_attachments"]["Row"]> & {
          lesson_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
        };
        Update: Partial<Database["public"]["Tables"]["lesson_attachments"]["Insert"]>;
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          description: string | null;
          passing_score: number;
          time_limit: number | null;
          attempts: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["quizzes"]["Row"]> & {
          lesson_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
      };
      questions: {
        Row: {
          id: string;
          quiz_id: string;
          text: string;
          type: QuestionType;
          points: number;
          explanation: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["questions"]["Row"]> & {
          quiz_id: string;
          text: string;
        };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          text: string;
          is_correct: boolean;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["answers"]["Row"]> & {
          question_id: string;
          text: string;
        };
        Update: Partial<Database["public"]["Tables"]["answers"]["Insert"]>;
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          user_id: string;
          payment_id: string | null;
          price_paid: number;
          progress: number;
          completed_lessons: number;
          last_watched_lesson_id: string | null;
          enrolled_at: string;
          completed_at: string | null;
          is_active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["enrollments"]["Row"]> & {
          student_id: string;
          course_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          user_id: string;
          course_id: string;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          student_id: string;
          course_id: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["favorites"]["Row"]> & {
          user_id: string;
          student_id: string;
          course_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          student_id: string;
          course_id: string;
          certificate_number: string;
          final_score: number;
          issued_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["certificates"]["Row"]> & {
          user_id: string;
          student_id: string;
          course_id: string;
          certificate_number: string;
          final_score: number;
        };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: NotificationType;
          is_read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          user_id: string;
          title: string;
          message: string;
          type: NotificationType;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      announcements: {
        Row: {
          id: string;
          teacher_id: string | null;
          course_id: string | null;
          title: string;
          content: string;
          is_pinned: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["announcements"]["Row"]> & {
          title: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          enrollment_id: string | null;
          amount: number;
          currency: string;
          method: PaymentMethod;
          status: PaymentStatus;
          provider_ref: string | null;
          teacher_share: number | null;
          platform_fee: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & {
          user_id: string;
          amount: number;
          method: PaymentMethod;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      watch_progress: {
        Row: {
          id: string;
          user_id: string;
          student_id: string;
          lesson_id: string;
          position: number;
          duration: number;
          watched_seconds: number;
          data_consumed_mb: number;
          quality: string;
          completed: boolean;
          last_watched_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["watch_progress"]["Row"]> & {
          user_id: string;
          student_id: string;
          lesson_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["watch_progress"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          city: string | null;
          country: string;
          facebook: string | null;
          whatsapp: string | null;
          birth_date: string | null;
          gender: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: SubscriptionPlan;
          status: string;
          start_date: string;
          end_date: string;
          amount: number;
          auto_renew: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          user_id: string;
          plan: SubscriptionPlan;
          end_date: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      video_processing_jobs: {
        Row: {
          id: string;
          video_id: string;
          type: string;
          status: string;
          progress: number;
          error: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["video_processing_jobs"]["Row"]> & {
          video_id: string;
          type: string;
        };
        Update: Partial<Database["public"]["Tables"]["video_processing_jobs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      course_level: CourseLevel;
      video_status: VideoStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      question_type: QuestionType;
      notification_type: NotificationType;
      subscription_plan: SubscriptionPlan;
    };
  };
}
