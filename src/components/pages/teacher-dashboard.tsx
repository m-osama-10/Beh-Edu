"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import {
  listTeacherCourses,
  createCourse,
  createSection,
  createLesson,
  uploadAndAttachVideo,
  uploadAndAttachPdf,
  createQuiz,
  type CourseInput,
  type SectionInput,
  type LessonInput,
  type QuizInput,
} from "@/lib/teacher-api";
import { SUBJECTS, GRADES, formatPrice, formatNumber, formatRelativeTime } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  Megaphone,
  Settings,
  Plus,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Trash2,
  Upload,
  Video,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const NAV = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "courses", label: "كورساتي", icon: BookOpen },
  { id: "students", label: "الطلاب", icon: Users },
  { id: "revenue", label: "الإيرادات", icon: DollarSign },
  { id: "announcements", label: "الإعلانات", icon: Megaphone },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

const REVENUE_DATA = [
  { month: "يناير", revenue: 145000, students: 320 },
  { month: "فبراير", revenue: 168000, students: 380 },
  { month: "مارس", revenue: 192000, students: 425 },
  { month: "أبريل", revenue: 215000, students: 470 },
  { month: "مايو", revenue: 198000, students: 442 },
  { month: "يونيو", revenue: 234000, students: 510 },
  { month: "يوليو", revenue: 268000, students: 580 },
  { month: "أغسطس", revenue: 312000, students: 670 },
  { month: "سبتمبر", revenue: 425000, students: 920 },
  { month: "أكتوبر", revenue: 387000, students: 850 },
  { month: "نوفمبر", revenue: 342000, students: 765 },
  { month: "ديسمبر", revenue: 295000, students: 645 },
];

interface RealCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number | null;
  is_published: boolean;
  is_featured: boolean;
  rating: number;
  student_count: number;
  total_lessons: number;
  created_at: string;
  subjects?: { id: string; name: string; color: string };
  sections?: any[];
}

export function TeacherDashboard() {
  const navigate = useRouterStore((s) => s.navigate);
  const { user, isHydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courses, setCourses] = useState<RealCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Wait for auth hydration
  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      navigate("login");
      return;
    }
    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      navigate("student-dashboard");
      return;
    }
  }, [isHydrated, user, navigate]);

  const loadCourses = useCallback(async () => {
    setLoadingCourses(true);
    setLoadError(null);
    const res = await listTeacherCourses();
    if (res.error) {
      setLoadError(res.error);
    } else if (res.data) {
      setCourses(res.data.courses as RealCourse[]);
    }
    setLoadingCourses(false);
  }, []);

  useEffect(() => {
    if (user && (user.role === "TEACHER" || user.role === "ADMIN")) {
      loadCourses();
    }
  }, [user, loadCourses]);

  if (!isHydrated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    return null;
  }

  const totalStudents = courses.reduce((s, c) => s + (c.student_count ?? 0), 0);
  const totalCourses = courses.length;
  const totalRevenue = courses.length * 28500; // mock estimate

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
                  <Badge variant="secondary" className="text-[10px]">مدرس</Badge>
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
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                أهلاً، {user.name} 👋
              </h1>
              <p className="text-sm text-muted-foreground">إدارة كورساتك ومحتواك التعليمي</p>
            </div>
            <Button className="bg-brand-gradient" onClick={() => setCourseModalOpen(true)}>
              <Plus className="ms-1 h-4 w-4" />
              إنشاء كورس جديد
            </Button>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Users, label: "إجمالي الطلاب", value: formatNumber(totalStudents), change: "+12%", up: true },
                  { icon: BookOpen, label: "الكورسات", value: totalCourses, change: `+${totalCourses}`, up: true },
                  { icon: DollarSign, label: "الإيرادات الشهرية", value: formatPrice(totalRevenue), change: "+18%", up: true },
                  { icon: Star, label: "متوسط التقييم", value: "4.9", change: "+0.1", up: true },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient-soft text-primary">
                          <stat.icon className="h-5 w-5" />
                        </div>
                        <span className={`flex items-center gap-0.5 text-xs font-bold ${stat.up ? "text-emerald-600" : "text-red-600"}`}>
                          {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-xl font-extrabold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    الإيرادات الشهرية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={REVENUE_DATA}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1A5F7A" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#1A5F7A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "IBM Plex Sans Arabic" }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                      <Tooltip
                        contentStyle={{ fontFamily: "IBM Plex Sans Arabic", borderRadius: 8, border: "1px solid #E5E7EB" }}
                        formatter={(value: number) => [formatPrice(value), "الإيرادات"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#1A5F7A" strokeWidth={2} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course list quick view */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">كورساتي الأخيرة</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadError && (
                    <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      <AlertCircle className="ms-1 inline h-4 w-4" />
                      {loadError}
                    </div>
                  )}
                  {loadingCourses ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="py-6 text-center">
                      <BookOpen className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">لم تنشئ أي كورس بعد</p>
                      <Button className="mt-3 bg-brand-gradient" onClick={() => setCourseModalOpen(true)}>
                        <Plus className="ms-1 h-4 w-4" />
                        إنشاء أول كورس
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {courses.slice(0, 5).map((c) => (
                        <div key={c.id} className="flex items-center gap-3 rounded-lg border p-3">
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm font-bold">{c.title}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{c.subjects?.name ?? "—"}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Users className="h-3 w-3" />
                                {formatNumber(c.student_count ?? 0)}
                              </span>
                            </div>
                          </div>
                          <Badge variant={c.is_published ? "default" : "secondary"}>
                            {c.is_published ? "منشور" : "مسودة"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* My Courses */}
          {activeTab === "courses" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">كورساتي ({courses.length})</h2>
                <Button className="bg-brand-gradient" onClick={() => setCourseModalOpen(true)}>
                  <Plus className="ms-1 h-4 w-4" />
                  كورس جديد
                </Button>
              </div>
              {loadError && (
                <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                  <AlertCircle className="ms-1 inline h-4 w-4" />
                  {loadError}
                </div>
              )}
              {loadingCourses ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : courses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 font-bold">لا توجد كورسات بعد</h3>
                    <p className="mb-4 text-sm text-muted-foreground">ابدأ بإنشاء أول كورس تعليمي لك</p>
                    <Button className="bg-brand-gradient" onClick={() => setCourseModalOpen(true)}>
                      <Plus className="ms-1 h-4 w-4" />
                      إنشاء كورس جديد
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {courses.map((c) => (
                    <CourseManagementCard
                      key={c.id}
                      course={c}
                      onUpdated={loadCourses}
                      onDeleted={loadCourses}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Students */}
          {activeTab === "students" && (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-bold">قائمة الطلاب</h3>
                <p className="text-sm text-muted-foreground">
                  سيظهر هنا قائمة بكل الطلاب المسجلين في كورساتك مع تقدمهم في كل درس.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Revenue */}
          {activeTab === "revenue" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Card><CardContent className="p-4">
                  <Wallet className="mb-2 h-6 w-6 text-emerald-500" />
                  <div className="text-xl font-extrabold">{formatPrice(totalRevenue)}</div>
                  <div className="text-xs text-muted-foreground">إيرادات الشهر</div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <TrendingUp className="mb-2 h-6 w-6 text-primary" />
                  <div className="text-xl font-extrabold">{formatPrice(totalRevenue * 12)}</div>
                  <div className="text-xs text-muted-foreground">إجمالي الإيرادات</div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <DollarSign className="mb-2 h-6 w-6 text-amber-500" />
                  <div className="text-xl font-extrabold">{formatPrice(totalRevenue * 0.85)}</div>
                  <div className="text-xs text-muted-foreground">نصيبك (85%)</div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <Clock className="mb-2 h-6 w-6 text-primary" />
                  <div className="text-xl font-extrabold">{formatPrice(totalRevenue * 0.15)}</div>
                  <div className="text-xs text-muted-foreground">رسوم المنصة (15%)</div>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-base">الإيرادات الشهرية</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "IBM Plex Sans Arabic" }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                      <Tooltip
                        contentStyle={{ fontFamily: "IBM Plex Sans Arabic", borderRadius: 8 }}
                        formatter={(value: number) => [formatPrice(value), "الإيرادات"]}
                      />
                      <Bar dataKey="revenue" fill="#1A5F7A" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Announcements */}
          {activeTab === "announcements" && (
            <Card>
              <CardHeader><CardTitle className="text-base">إنشاء إعلان جديد</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>عنوان الإعلان</Label>
                  <Input placeholder="مثال: بث مباشر مراجعة نهائية" />
                </div>
                <div className="space-y-2">
                  <Label>المحتوى</Label>
                  <Textarea rows={4} placeholder="اكتب محتوى الإعلان هنا..." />
                </div>
                <div className="space-y-2">
                  <Label>الكورس</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="اختر الكورس" /></SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-brand-gradient" onClick={() => toast.success("تم نشر الإعلان بنجاح")}>
                  <Megaphone className="ms-1 h-4 w-4" />
                  نشر الإعلان
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <Card>
              <CardHeader><CardTitle className="text-base">الملف التعريفي</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>الاسم</Label>
                    <Input defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input defaultValue={user.email} dir="ltr" disabled />
                  </div>
                </div>
                <Button className="bg-brand-gradient" onClick={() => toast.success("تم حفظ التغييرات")}>
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create course modal — full flow with sections + lessons + uploads */}
      <CreateCourseModal
        open={courseModalOpen}
        onOpenChange={setCourseModalOpen}
        onCreated={loadCourses}
      />
    </div>
  );
}

// ============ Course Management Card ============
// Shows a course with its sections + lessons, allows adding sections/lessons/uploads

function CourseManagementCard({
  course,
  onUpdated,
  onDeleted,
}: {
  course: RealCourse;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const loadSections = useCallback(async () => {
    setLoadingSections(true);
    const res = await fetch(`/api/courses/${course.id}/sections`);
    const data = await res.json();
    if (data.sections) setSections(data.sections);
    setLoadingSections(false);
  }, [course.id]);

  useEffect(() => {
    if (expanded && sections.length === 0) {
      loadSections();
    }
  }, [expanded, sections.length, loadSections]);

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    const res = await createSection(course.id, { title: newSectionTitle });
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("تم إضافة القسم بنجاح");
      setNewSectionTitle("");
      setShowAddSection(false);
      loadSections();
      onUpdated();
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-foreground">{course.title}</h3>
              <Badge variant={course.is_published ? "default" : "secondary"}>
                {course.is_published ? "منشور" : "مسودة"}
              </Badge>
              {course.subjects && (
                <Badge variant="outline" style={{ color: course.subjects.color }}>
                  {course.subjects.name}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{course.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatNumber(course.student_count ?? 0)}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {course.total_lessons ?? 0} درس
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {course.rating ?? 0}
              </span>
              <span>{formatPrice(course.discount_price ?? course.price)}</span>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? "إخفاء" : "إدارة"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-4 border-t pt-4">
            {loadingSections ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <>
                {sections.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    لا توجد أقسام بعد. أضف أول قسم.
                  </p>
                ) : (
                  <Accordion type="multiple" className="space-y-2">
                    {sections.map((section) => (
                      <SectionManager
                        key={section.id}
                        courseId={course.id}
                        section={section}
                        onUpdated={loadSections}
                      />
                    ))}
                  </Accordion>
                )}

                {showAddSection ? (
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="عنوان القسم الجديد"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                    />
                    <Button size="sm" className="bg-brand-gradient" onClick={handleAddSection}>
                      حفظ
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddSection(false)}>
                      إلغاء
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => setShowAddSection(true)}
                  >
                    <Plus className="ms-1 h-4 w-4" />
                    إضافة قسم جديد
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============ Section Manager ============

function SectionManager({
  courseId,
  section,
  onUpdated,
}: {
  courseId: string;
  section: any;
  onUpdated: () => void;
}) {
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [lessons, setLessons] = useState<any[]>(section.lessons ?? []);

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) return;
    const res = await createLesson(courseId, section.id, { title: newLessonTitle });
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("تم إضافة الدرس بنجاح");
      setNewLessonTitle("");
      setShowAddLesson(false);
      // Refresh section data
      const refreshed = await fetch(`/api/courses/${courseId}/sections`).then(r => r.json());
      if (refreshed.sections) {
        const s = refreshed.sections.find((x: any) => x.id === section.id);
        if (s) setLessons(s.lessons ?? []);
      }
      onUpdated();
    }
  };

  return (
    <AccordionItem value={section.id} className="border rounded-lg px-3">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-1 items-center justify-between pe-2 text-right">
          <span className="font-bold text-sm">{section.title}</span>
          <Badge variant="secondary" className="text-[10px]">
            {lessons.length} دروس
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="space-y-1">
          {lessons.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-2">
              لا توجد دروس في هذا القسم
            </p>
          ) : (
            lessons.map((lesson) => (
              <LessonManager
                key={lesson.id}
                courseId={courseId}
                lesson={lesson}
                onUpdated={async () => {
                  const refreshed = await fetch(`/api/courses/${courseId}/sections`).then(r => r.json());
                  if (refreshed.sections) {
                    const s = refreshed.sections.find((x: any) => x.id === section.id);
                    if (s) setLessons(s.lessons ?? []);
                  }
                  onUpdated();
                }}
              />
            ))
          )}
        </div>

        {showAddLesson ? (
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="عنوان الدرس"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLesson()}
              className="text-sm"
            />
            <Button size="sm" className="bg-brand-gradient" onClick={handleAddLesson}>
              حفظ
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowAddLesson(false)}>
              إلغاء
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-xs"
            onClick={() => setShowAddLesson(true)}
          >
            <Plus className="ms-1 h-3 w-3" />
            إضافة درس
          </Button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

// ============ Lesson Manager ============
// Allows uploading video, PDF, and creating quizzes for a lesson

function LessonManager({
  courseId,
  lesson,
  onUpdated,
}: {
  courseId: string;
  lesson: any;
  onUpdated: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadStage, setUploadStage] = useState("");
  const [showQuizForm, setShowQuizForm] = useState(false);

  const hasVideo = lesson.videos && lesson.videos.length > 0;
  const hasAttachments = lesson.attachments && lesson.attachments.length > 0;
  const hasQuiz = lesson.quizzes && lesson.quizzes.length > 0;

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setUploadStage("جاري التحضير...");
    const res = await uploadAndAttachVideo(file, lesson.id, setUploadStage);
    setUploadingVideo(false);
    if (res.success) {
      toast.success("تم رفع الفيديو وربطه بالدرس بنجاح 🎬");
      onUpdated();
    } else {
      toast.error(res.error ?? "فشل رفع الفيديو");
    }
    e.target.value = ""; // reset
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    const res = await uploadAndAttachPdf(file, lesson.id);
    setUploadingPdf(false);
    if (res.success) {
      toast.success("تم رفع الملف بنجاح 📄");
      onUpdated();
    } else {
      toast.error(res.error ?? "فشل رفع الملف");
    }
    e.target.value = "";
  };

  return (
    <div className="rounded-lg border p-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 text-right"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
          {lesson.sort_order}
        </div>
        <span className="flex-1 truncate text-sm font-medium">{lesson.title}</span>
        {hasVideo && <Video className="h-3.5 w-3.5 text-primary" />}
        {hasAttachments && <FileText className="h-3.5 w-3.5 text-amber-500" />}
        {hasQuiz && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t pt-2">
          {/* Upload buttons */}
          <div className="grid grid-cols-3 gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
                disabled={uploadingVideo}
              />
              <div className="flex flex-col items-center gap-1 rounded-lg border p-2 text-xs hover:bg-muted/50 transition">
                {uploadingVideo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Video className="h-4 w-4 text-primary" />
                )}
                <span>رفع فيديو</span>
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handlePdfUpload}
                disabled={uploadingPdf}
              />
              <div className="flex flex-col items-center gap-1 rounded-lg border p-2 text-xs hover:bg-muted/50 transition">
                {uploadingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 text-amber-500" />
                )}
                <span>رفع PDF</span>
              </div>
            </label>
            <button
              onClick={() => setShowQuizForm(!showQuizForm)}
              className="flex flex-col items-center gap-1 rounded-lg border p-2 text-xs hover:bg-muted/50 transition"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>اختبار</span>
            </button>
          </div>

          {uploadingVideo && uploadStage && (
            <p className="text-center text-[10px] text-muted-foreground">{uploadStage}</p>
          )}

          {/* Existing video info */}
          {hasVideo && (
            <div className="rounded-md bg-primary/5 p-2 text-xs">
              <div className="flex items-center gap-1 text-primary">
                <Video className="h-3 w-3" />
                <span className="font-bold">الفيديو الحالي:</span>
                <Badge variant="outline" className="text-[9px]">
                  {lesson.videos[0].status === "READY" ? "جاهز" : lesson.videos[0].status === "PROCESSING" ? "قيد المعالجة" : "مرفوع"}
                </Badge>
              </div>
            </div>
          )}

          {/* Existing attachments */}
          {hasAttachments && (
            <div className="space-y-1">
              {lesson.attachments.map((att: any) => (
                <div key={att.id} className="flex items-center gap-2 rounded-md bg-muted/30 p-1.5 text-xs">
                  <FileText className="h-3 w-3 text-amber-500" />
                  <span className="flex-1 truncate">{att.file_name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {(att.file_size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quiz builder */}
          {showQuizForm && (
            <QuizBuilder
              lessonId={lesson.id}
              onSaved={() => {
                setShowQuizForm(false);
                onUpdated();
              }}
            />
          )}

          {hasQuiz && !showQuizForm && (
            <div className="rounded-md bg-emerald-50 p-2 text-xs dark:bg-emerald-950/30">
              <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span className="font-bold">يوجد اختبار:</span>
                <span>{lesson.quizzes[0].title}</span>
                <span className="text-[10px]">({lesson.quizzes[0].questions?.length ?? 0} أسئلة)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============ Quiz Builder ============

function QuizBuilder({ lessonId, onSaved }: { lessonId: string; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState<Array<{
    text: string;
    type: "SINGLE_CHOICE" | "TRUE_FALSE";
    answers: Array<{ text: string; isCorrect: boolean }>;
  }>>([
    { text: "", type: "SINGLE_CHOICE", answers: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ] },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, {
      text: "",
      type: "SINGLE_CHOICE",
      answers: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ],
    }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const addAnswer = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].answers.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const updated = [...questions];
    updated[qIdx].answers.splice(aIdx, 1);
    setQuestions(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("عنوان الاختبار مطلوب");
      return;
    }
    if (questions.some(q => !q.text.trim())) {
      toast.error("كل الأسئلة يجب أن يكون لها نص");
      return;
    }
    if (questions.some(q => q.answers.some(a => !a.text.trim()))) {
      toast.error("كل الإجابات يجب أن يكون لها نص");
      return;
    }
    if (questions.some(q => !q.answers.some(a => a.isCorrect))) {
      toast.error("كل سؤال يجب أن يكون له إجابة صحيحة واحدة على الأقل");
      return;
    }

    setSaving(true);
    const res = await createQuiz(lessonId, {
      title,
      description: description || undefined,
      passingScore,
      questions,
    });
    setSaving(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("تم حفظ الاختبار بنجاح ✅");
      onSaved();
    }
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <h4 className="text-sm font-bold">إنشاء اختبار</h4>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="عنوان الاختبار"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm"
        />
        <Input
          placeholder="وصف الاختبار (اختياري)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-sm"
        />
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">درجة النجاح:</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={passingScore}
            onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
            className="w-20 text-sm"
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="rounded-md border bg-card p-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-[10px] text-white font-bold">
                {qIdx + 1}
              </span>
              <Input
                placeholder="نص السؤال"
                value={q.text}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIdx].text = e.target.value;
                  setQuestions(updated);
                }}
                className="text-sm flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive h-7 w-7 p-0"
                onClick={() => removeQuestion(qIdx)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-1 ps-7">
              {q.answers.map((a, aIdx) => (
                <div key={aIdx} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = [...questions];
                      if (q.type === "SINGLE_CHOICE") {
                        updated[qIdx].answers = updated[qIdx].answers.map((x, i) => ({
                          ...x,
                          isCorrect: i === aIdx,
                        }));
                      } else {
                        updated[qIdx].answers[aIdx].isCorrect = !a.isCorrect;
                      }
                      setQuestions(updated);
                    }}
                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      a.isCorrect ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground/40"
                    }`}
                  >
                    {a.isCorrect && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  <Input
                    placeholder={`الإجابة ${aIdx + 1}`}
                    value={a.text}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx].answers[aIdx].text = e.target.value;
                      setQuestions(updated);
                    }}
                    className="text-xs h-7"
                  />
                  {q.answers.length > 2 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive h-6 w-6 p-0"
                      onClick={() => removeAnswer(qIdx, aIdx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="text-[10px] h-6"
                onClick={() => addAnswer(qIdx)}
              >
                <Plus className="ms-1 h-2 w-2" />
                إضافة إجابة
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full text-xs" onClick={addQuestion}>
        <Plus className="ms-1 h-3 w-3" />
        إضافة سؤال
      </Button>

      <div className="flex gap-2">
        <Button className="bg-brand-gradient flex-1" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="ms-1 h-3 w-3 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ الاختبار"
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={onSaved}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}

// ============ Create Course Modal ============

function CreateCourseModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CourseInput>({
    title: "",
    description: "",
    subjectId: "",
    gradeId: undefined,
    level: "BEGINNER",
    academicYear: "2025/2026",
    language: "العربية",
    price: 199,
    discountPrice: null,
    coverImageUrl: null,
    isPublished: false,
  });

  const reset = () => {
    setStep(1);
    setForm({
      title: "",
      description: "",
      subjectId: "",
      gradeId: undefined,
      level: "BEGINNER",
      academicYear: "2025/2026",
      language: "العربية",
      price: 199,
      discountPrice: null,
      coverImageUrl: null,
      isPublished: false,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.subjectId) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setSaving(true);
    const res = await createCourse(form);
    setSaving(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("تم إنشاء الكورس بنجاح! 🎉");
      handleClose();
      onCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">إنشاء كورس جديد — الخطوة {step} من 2</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <Progress value={(step / 2) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>عنوان الكورس *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="مثال: الرياضيات التطبيقية - الصف الثالث الثانوي"
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف *</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="وصف تفصيلي للكورس وأهدافه ومحتواه"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>المادة *</Label>
                <Select
                  value={form.subjectId}
                  onValueChange={(v) => setForm({ ...form, subjectId: v })}
                >
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الصف</Label>
                <Select
                  value={form.gradeId ?? ""}
                  onValueChange={(v) => setForm({ ...form, gradeId: v })}
                >
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المستوى</Label>
                <Select
                  value={form.level}
                  onValueChange={(v) => setForm({ ...form, level: v as CourseInput["level"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">مبتدئ</SelectItem>
                    <SelectItem value="INTERMEDIATE">متوسط</SelectItem>
                    <SelectItem value="ADVANCED">متقدم</SelectItem>
                    <SelectItem value="ALL_LEVELS">كل المستويات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>السنة الدراسية</Label>
                <Input
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>إلغاء</Button>
              <Button
                className="bg-brand-gradient"
                onClick={() => {
                  if (!form.title || !form.description || !form.subjectId) {
                    toast.error("املأ الحقول المطلوبة");
                    return;
                  }
                  setStep(2);
                }}
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>رابط صورة الغلاف (URL)</Label>
              <Input
                value={form.coverImageUrl ?? ""}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value || null })}
                placeholder="https://images.unsplash.com/..."
                dir="ltr"
              />
              <p className="text-[10px] text-muted-foreground">
                💡 يمكنك تركها فارغة وستُستخدم صورة افتراضية
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>السعر (ج.م)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>السعر بعد الخصم</Label>
                <Input
                  type="number"
                  value={form.discountPrice ?? ""}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="اتركها فارغة بدون خصم"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="publish"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="h-4 w-4 rounded"
              />
              <Label htmlFor="publish" className="text-sm cursor-pointer">
                نشر الكورس فوراً (يمكنك تعديل ذلك لاحقاً)
              </Label>
            </div>

            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                <Video className="ms-1 inline h-3 w-3" />
                بعد إنشاء الكورس، يمكنك إضافة الأقسام والدروس ورفع الفيديوهات والملفات والاختبارات من لوحة الإدارة.
              </p>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>السابق</Button>
              <Button className="bg-brand-gradient" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="ms-1 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء الكورس"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// X icon for quiz builder
function X(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
