"use client";

import { useRouterStore } from "@/store/router-store";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { LandingPage } from "@/components/pages/landing-page";
import { CoursesPage } from "@/components/pages/courses-page";
import { CourseDetailPage } from "@/components/pages/course-detail-page";
import { WatchPage } from "@/components/pages/watch-page";
import { StudentDashboard } from "@/components/pages/student-dashboard";
import { TeacherDashboard } from "@/components/pages/teacher-dashboard";
import { AdminDashboard } from "@/components/pages/admin-dashboard";
import { LoginPage } from "@/components/pages/login-page";
import { RegisterPage } from "@/components/pages/register-page";
import { ForgotPasswordPage } from "@/components/pages/forgot-password-page";
import { FavoritesPage } from "@/components/pages/favorites-page";
import { NotificationsPage } from "@/components/pages/notifications-page";
import { CertificatesPage } from "@/components/pages/certificates-page";
import { AboutPage } from "@/components/pages/about-page";
import { LegalPage } from "@/components/pages/legal-page";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const route = useRouterStore((s) => s.route);

  const renderPage = () => {
    switch (route.name) {
      case "home":
        return <LandingPage />;
      case "courses":
        return <CoursesPage />;
      case "course-detail":
        return <CourseDetailPage />;
      case "watch":
        return <WatchPage />;
      case "student-dashboard":
        return <StudentDashboard />;
      case "teacher-dashboard":
        return <TeacherDashboard />;
      case "admin-dashboard":
        return <AdminDashboard />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "forgot-password":
        return <ForgotPasswordPage />;
      case "favorites":
        return <FavoritesPage />;
      case "notifications":
        return <NotificationsPage />;
      case "certificates":
        return <CertificatesPage />;
      case "about":
        return <AboutPage />;
      case "privacy":
        return <LegalPage type="privacy" />;
      case "terms":
        return <LegalPage type="terms" />;
      default:
        return <LandingPage />;
    }
  };

  // Auth & dashboard pages: minimal chrome (no full footer)
  const isDashboardRoute = ["student-dashboard", "teacher-dashboard", "admin-dashboard"].includes(route.name);
  const isAuthRoute = ["login", "register", "forgot-password"].includes(route.name);
  const isWatchRoute = route.name === "watch";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className={`flex-1 ${isWatchRoute ? "pb-4" : "pb-20 md:pb-0"}`}>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="min-h-[calc(100vh-4rem)]">
            {renderPage()}
          </div>
        </ScrollArea>
      </main>
      {!isAuthRoute && !isWatchRoute && <Footer />}
      {!isAuthRoute && !isDashboardRoute && <MobileBottomNav />}
    </div>
  );
}
