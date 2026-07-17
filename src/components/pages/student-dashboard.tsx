"use client";

import { useState } from "react";
import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore, useFavoritesStore, useEnrolledStore, useWatchProgressStore } from "@/store/app-stores";
import { useNotifications } from "@/store/notifications-store";
import { CourseCard } from "@/components/shared/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CERTIFICATES, COURSES, formatPrice, formatRelativeTime, formatDuration } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  Award,
  Bell,
  Settings,
  PlayCircle,
  Clock,
  TrendingUp,
  GraduationCap,
  Leaf,
  CheckCircle2,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "courses", label: "كورساتي", icon: BookOpen },
  { id: "favorites", label: "المفضلة", icon: Heart },
  { id: "certificates", label: "الشهادات", icon: Award },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

export function StudentDashboard() {
  const navigate = useRouterStore((s) => s.navigate);
  const { user } = useAuthStore();
  const { dataSaverMode, toggleDataSaver } = useSettingsStore();
  const favorites = useFavoritesStore((s) => s.favorites);
  const enrolled = useEnrolledStore((s) => s.enrolled);
  const progress = useWatchProgressStore((s) => s.progress);
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    navigate("login");
    return null;
  }

  const enrolledCourses = COURSES.filter((c) => enrolled.has(c.id));
  const favoriteCourses = COURSES.filter((c) => favorites.has(c.id));
  const userCertificates = CERTIFICATES.filter((c) => c.userId === "u-student-1");

  const totalWatchTime = Object.values(progress).reduce((sum, p) => sum + p.watchedSeconds ?? 0, 0);
  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const totalDataConsumed = Object.values(progress).reduce((sum, p) => sum + p.watchedMB, 0);

  // Continue watching (enrolled courses with progress < 100%)
  const continueWatching = enrolledCourses
    .map((c) => {
      const lessons = c.sections.flatMap((s) => s.lessons);
      const completed = lessons.filter((l) => progress[l.id]?.completed).length;
      const pct = lessons.length ? (completed / lessons.length) * 100 : 0;
      return { course: c, progress: pct, lastLesson: lessons.find((l) => progress[l.id] && !progress[l.id].completed) ?? lessons[0] };
    })
    .filter((item) => item.progress < 100)
    .slice(0, 4);

  const recommendedCourses = COURSES.filter((c) => !enrolled.has(c.id)).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold text-foreground">{user.name}</div>
                  <Badge variant="secondary" className="text-[10px]">طالب</Badge>
                </div>
              </div>

              <nav className="space-y-1">
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-right text-sm transition ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.id === "notifications" && notifications.filter((n) => !n.isRead).length > 0 && (
                      <Badge className="ms-auto bg-accent text-accent-foreground text-[10px]">
                        {notifications.filter((n) => !n.isRead).length}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <div>
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                أهلاً، {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-muted-foreground">واصل رحلتك التعليمية</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
              <Leaf className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium">توفير الباقة</span>
              <Switch checked={dataSaverMode} onCheckedChange={toggleDataSaver} />
            </div>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient-soft text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">{enrolledCourses.length}</div>
                    <div className="text-xs text-muted-foreground">كورسات مسجلة</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">
                      {Math.floor(totalWatchTime / 60)}
                    </div>
                    <div className="text-xs text-muted-foreground">ساعة مشاهدة</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">{completedLessons}</div>
                    <div className="text-xs text-muted-foreground">دروس مكتملة</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">{userCertificates.length}</div>
                    <div className="text-xs text-muted-foreground">شهادات</div>
                  </CardContent>
                </Card>
              </div>

              {/* Continue watching */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">استكمال المشاهدة</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("courses")}>
                    عرض الكل
                  </Button>
                </div>
                {continueWatching.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <PlayCircle className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">لا توجد كورسات قيد المشاهدة</p>
                      <Button className="mt-3 bg-brand-gradient" onClick={() => navigate("courses")}>
                        ابدأ بتعلم كورس جديد
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {continueWatching.map(({ course, progress: pct, lastLesson }) => (
                      <Card key={course.id} className="card-hover">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-lg sm:w-40">
                              { }
                              <img src={course.coverImageUrl} alt={course.title} className="h-full w-full object-cover" />
                              <button
                                onClick={() => lastLesson && navigate("watch", { courseId: course.id, lessonId: lastLesson.id })}
                                className="absolute inset-0 flex items-center justify-center bg-black/40"
                              >
                                <PlayCircle className="h-10 w-10 text-white" />
                              </button>
                            </div>
                            <div className="flex flex-1 flex-col">
                              <h3 className="line-clamp-2 text-sm font-bold text-foreground">{course.title}</h3>
                              <p className="text-xs text-muted-foreground">{course.teacher.name}</p>
                              <div className="mt-auto">
                                <div className="mb-1 flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">التقدم</span>
                                  <span className="font-bold text-primary">{Math.round(pct)}%</span>
                                </div>
                                <Progress value={pct} className="h-1.5" />
                                <Button
                                  size="sm"
                                  className="mt-2 w-full bg-brand-gradient sm:w-auto"
                                  onClick={() => lastLesson && navigate("watch", { courseId: course.id, lessonId: lastLesson.id })}
                                >
                                  متابعة المشاهدة
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">مقترحة لك</h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate("courses")}>
                    استكشف المزيد
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                  {recommendedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} variant="horizontal" />
                  ))}
                </div>
              </div>

              {/* Data consumption summary */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    ملخص استهلاك البيانات
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {totalDataConsumed.toFixed(0)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">ميجابايت مستهلك</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">
                        {dataSaverMode ? "~60%" : "0%"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">توفير</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {(totalDataConsumed * 0.6).toFixed(0)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">MB موفّرة</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* My Courses */}
          {activeTab === "courses" && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-foreground">كورساتي ({enrolledCourses.length})</h2>
              {enrolledCourses.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="لا توجد كورسات مسجلة"
                  description="ابدأ رحلتك التعليمية بتصفح الكورسات المتاحة"
                  actionLabel="تصفح الكورسات"
                  onAction={() => navigate("courses")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((course) => {
                    const lessons = course.sections.flatMap((s) => s.lessons);
                    const completed = lessons.filter((l) => progress[l.id]?.completed).length;
                    const pct = lessons.length ? (completed / lessons.length) * 100 : 0;
                    return (
                      <Card key={course.id} className="card-hover overflow-hidden">
                        <div className="relative aspect-video">
                          { }
                          <img src={course.coverImageUrl} alt={course.title} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-2 right-2 left-2">
                            <Progress value={pct} className="h-1.5" />
                            <p className="mt-1 text-[10px] text-white">{Math.round(pct)}% مكتمل</p>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="line-clamp-1 text-sm font-bold text-foreground">{course.title}</h3>
                          <p className="text-xs text-muted-foreground">{course.teacher.name}</p>
                          <Button
                            size="sm"
                            className="mt-2 w-full bg-brand-gradient"
                            onClick={() => {
                              const next = lessons.find((l) => !progress[l.id]?.completed) ?? lessons[0];
                              navigate("watch", { courseId: course.id, lessonId: next.id });
                            }}
                          >
                            <PlayCircle className="ms-1 h-4 w-4" />
                            متابعة
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Favorites */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-foreground">المفضلة ({favoriteCourses.length})</h2>
              {favoriteCourses.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="لا توجد كورسات في المفضلة"
                  description="أضف الكورسات التي تعجبك إلى المفضلة للوصول السريع إليها"
                  actionLabel="تصفح الكورسات"
                  onAction={() => navigate("courses")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Certificates */}
          {activeTab === "certificates" && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-foreground">شهاداتي ({userCertificates.length})</h2>
              {userCertificates.length === 0 ? (
                <EmptyState
                  icon={Award}
                  title="لا توجد شهادات بعد"
                  description="أكمل كورساً للحصول على شهادة معتمدة"
                  actionLabel="تصفح الكورسات"
                  onAction={() => navigate("courses")}
                />
              ) : (
                <div className="space-y-3">
                  {userCertificates.map((cert) => (
                    <Card key={cert.id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gold-gradient">
                            <Award className="h-7 w-7 text-black" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground">{cert.courseTitle}</h3>
                            <p className="text-xs text-muted-foreground">المدرس: {cert.teacherName}</p>
                            <div className="mt-1 flex flex-wrap gap-2 text-[10px]">
                              <Badge variant="secondary">
                                <Calendar className="ms-1 h-3 w-3" />
                                {new Date(cert.issuedAt).toLocaleDateString("ar-EG")}
                              </Badge>
                              <Badge variant="secondary">
                                النتيجة: {cert.finalScore}%
                              </Badge>
                              <Badge variant="secondary">
                                رقم: {cert.certificateNumber}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success("جاري تحميل الشهادة...")}
                          >
                            <Download className="ms-1 h-4 w-4" />
                            تحميل
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">الإشعارات</h2>
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  تعليم الكل كمقروء
                </Button>
              </div>
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <EmptyState
                    icon={Bell}
                    title="لا توجد إشعارات"
                    description="ستظهر إشعاراتك هنا عند توفرها"
                  />
                ) : (
                  notifications.map((notif) => (
                    <Card
                      key={notif.id}
                      className={`cursor-pointer transition hover:bg-muted/30 ${!notif.isRead ? "border-primary/50 bg-primary/5" : ""}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <CardContent className="flex items-start gap-3 p-3">
                        <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${notif.isRead ? "bg-transparent" : "bg-primary"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-foreground">{notif.title}</h3>
                            <span className="text-[10px] text-muted-foreground">
                              {formatRelativeTime(notif.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{notif.message}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">الملف الشخصي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" onClick={() => toast.info("تغيير الصورة غير متاح في النسخة التجريبية")}>
                      تغيير الصورة
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>الاسم الكامل</Label>
                      <Input defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input defaultValue={user.email} dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <Label>رقم الهاتف</Label>
                      <Input placeholder="0100 123 4567" dir="ltr" />
                    </div>
                    <div className="space-y-2">
                      <Label>المدينة</Label>
                      <Input placeholder="القاهرة" />
                    </div>
                  </div>
                  <Button className="bg-brand-gradient" onClick={() => toast.success("تم حفظ التغييرات")}>
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">إعدادات البيانات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-emerald-500" />
                      <div>
                        <div className="text-sm font-bold">وضع توفير الباقة</div>
                        <div className="text-xs text-muted-foreground">تقليل استهلاك الإنترنت بنسبة 60%</div>
                      </div>
                    </div>
                    <Switch checked={dataSaverMode} onCheckedChange={toggleDataSaver} />
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      <Leaf className="ms-1 inline h-3 w-3" />
                      عند تفعيل الوضع، سيتم إجبار جودة الفيديو على 480p لتقليل استهلاك الباقة.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">الأمان</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast.info("سيتم إرسال رابط التغيير إلى بريدك")}>
                    تغيير كلمة المرور
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
