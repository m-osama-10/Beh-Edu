"use client";

import { useState } from "react";
import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { COURSES, TEACHERS, REVENUE_DATA, ENROLLMENT_BY_SUBJECT, formatPrice, formatNumber, formatRelativeTime } from "@/data/mock-data";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  PieChart,
  Pie,
  Cell,
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

export function TeacherDashboard() {
  const navigate = useRouterStore((s) => s.navigate);
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [courseModalOpen, setCourseModalOpen] = useState(false);

  if (!user) {
    navigate("login");
    return null;
  }

  const teacher = TEACHERS[0]; // Mock: assume current user is teacher 0
  const teacherCourses = COURSES.filter((c) => c.teacherId === teacher.id);
  const totalStudents = teacher.totalStudents;
  const totalRevenue = teacher.totalRevenue;
  const avgRating = teacher.rating;

  // Mock students data
  const mockStudents = [
    { id: "s-1", name: "أحمد محمود", email: "ahmed@email.com", course: teacherCourses[0]?.title ?? "", progress: 75, enrolledAt: "2025-09-15" },
    { id: "s-2", name: "فاطمة علي", email: "fatma@email.com", course: teacherCourses[0]?.title ?? "", progress: 60, enrolledAt: "2025-09-20" },
    { id: "s-3", name: "محمود السيد", email: "mahmoud@email.com", course: teacherCourses[1]?.title ?? "", progress: 90, enrolledAt: "2025-09-25" },
    { id: "s-4", name: "سارة إبراهيم", email: "sara@email.com", course: teacherCourses[0]?.title ?? "", progress: 45, enrolledAt: "2025-10-01" },
    { id: "s-5", name: "عمر خالد", email: "omar@email.com", course: teacherCourses[1]?.title ?? "", progress: 100, enrolledAt: "2025-10-05" },
    { id: "s-6", name: "نورهان أحمد", email: "norhan@email.com", course: teacherCourses[0]?.title ?? "", progress: 30, enrolledAt: "2025-10-10" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center gap-3 pb-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {teacher.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-bold text-foreground">{teacher.name}</div>
                  <Badge variant="secondary" className="text-[10px]">
                    {teacher.approved ? "مدرس معتمد" : "بانتظار الموافقة"}
                  </Badge>
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
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {teacher.title} {teacher.name}
              </h1>
              <p className="text-sm text-muted-foreground">{teacher.specialization}</p>
            </div>
            <Button className="bg-brand-gradient" onClick={() => setCourseModalOpen(true)}>
              <Plus className="ms-1 h-4 w-4" />
              إنشاء كورس جديد
            </Button>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Users, label: "إجمالي الطلاب", value: formatNumber(totalStudents), change: "+12%", up: true, color: "primary" },
                  { icon: BookOpen, label: "الكورسات", value: teacherCourses.length, change: "+1", up: true, color: "amber" },
                  { icon: DollarSign, label: "الإيرادات الشهرية", value: formatPrice(28500), change: "+18%", up: true, color: "emerald" },
                  { icon: Star, label: "متوسط التقييم", value: avgRating, change: "+0.1", up: true, color: "primary" },
                ].map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-${stat.color}-100 text-${stat.color}-600 dark:bg-${stat.color}-950 dark:text-${stat.color}-400`}>
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

              {/* Revenue chart */}
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
                          <stop offset="5%" stopColor="#0055A4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0055A4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Cairo" }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                      <Tooltip
                        contentStyle={{ fontFamily: "Cairo", borderRadius: 8, border: "1px solid #E5E7EB" }}
                        formatter={(value: number) => [formatPrice(value), "الإيرادات"]}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#0055A4" strokeWidth={2} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top courses + recent enrollments */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">أفضل الكورسات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {teacherCourses.slice(0, 4).map((c) => (
                      <div key={c.id} className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.coverImageUrl} alt={c.title} className="h-10 w-14 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-bold">{c.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <Users className="h-3 w-3" />
                              {formatNumber(c.studentCount)}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {c.rating}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => navigate("course-detail", { courseId: c.id })}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">آخر التسجيلات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mockStudents.slice(0, 4).map((s) => (
                      <div key={s.id} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} alt={s.name} />
                          <AvatarFallback>{s.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-bold">{s.name}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            سجل في: {s.course.slice(0, 30)}...
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(s.enrolledAt)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* My Courses */}
          {activeTab === "courses" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">كورساتي ({teacherCourses.length})</h2>
                <Button className="bg-brand-gradient" onClick={() => setCourseModalOpen(true)}>
                  <Plus className="ms-1 h-4 w-4" />
                  كورس جديد
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-right text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 font-bold">الكورس</th>
                      <th className="p-3 font-bold hidden sm:table-cell">الطلاب</th>
                      <th className="p-3 font-bold hidden md:table-cell">التقييم</th>
                      <th className="p-3 font-bold hidden md:table-cell">السعر</th>
                      <th className="p-3 font-bold">الحالة</th>
                      <th className="p-3 font-bold">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherCourses.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c.coverImageUrl} alt={c.title} className="h-10 w-14 rounded object-cover" />
                            <div className="min-w-0">
                              <div className="truncate font-bold text-xs">{c.title}</div>
                              <div className="text-[10px] text-muted-foreground">{c.subject.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell">{formatNumber(c.studentCount)}</td>
                        <td className="p-3 hidden md:table-cell">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {c.rating}
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell">{formatPrice(c.discountPrice ?? c.price)}</td>
                        <td className="p-3">
                          <Badge variant={c.isPublished ? "default" : "secondary"}>
                            {c.isPublished ? "منشور" : "مسودة"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => navigate("course-detail", { courseId: c.id })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toast.info("تعديل الكورس غير متاح في النسخة التجريبية")}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.info("لا يمكن حذف كورس به طلاب مسجلون")}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Students */}
          {activeTab === "students" && (
            <div>
              <h2 className="mb-4 text-lg font-bold">الطلاب ({mockStudents.length})</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-right text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 font-bold">الطالب</th>
                      <th className="p-3 font-bold hidden sm:table-cell">الكورس</th>
                      <th className="p-3 font-bold">التقدم</th>
                      <th className="p-3 font-bold hidden md:table-cell">تاريخ التسجيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.map((s) => (
                      <tr key={s.id} className="border-t hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} alt={s.name} />
                              <AvatarFallback>{s.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold">{s.name}</div>
                              <div className="text-[10px] text-muted-foreground" dir="ltr">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell text-xs">{s.course}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Progress value={s.progress} className="h-1.5 w-16" />
                            <span className="text-xs">{s.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">
                          {new Date(s.enrolledAt).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue */}
          {activeTab === "revenue" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <Wallet className="mb-2 h-6 w-6 text-emerald-500" />
                    <div className="text-xl font-extrabold">{formatPrice(28500)}</div>
                    <div className="text-xs text-muted-foreground">إيرادات الشهر</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <TrendingUp className="mb-2 h-6 w-6 text-primary" />
                    <div className="text-xl font-extrabold">{formatPrice(285000)}</div>
                    <div className="text-xs text-muted-foreground">إجمالي الإيرادات</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <DollarSign className="mb-2 h-6 w-6 text-amber-500" />
                    <div className="text-xl font-extrabold">{formatPrice(15000)}</div>
                    <div className="text-xs text-muted-foreground">نصيبك (85%)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <Clock className="mb-2 h-6 w-6 text-primary" />
                    <div className="text-xl font-extrabold">{formatPrice(2850)}</div>
                    <div className="text-xs text-muted-foreground">رسوم المنصة (15%)</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">الإيرادات الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={REVENUE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Cairo" }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                      <Tooltip
                        contentStyle={{ fontFamily: "Cairo", borderRadius: 8, border: "1px solid #E5E7EB" }}
                        formatter={(value: number) => [formatPrice(value), "الإيرادات"]}
                      />
                      <Bar dataKey="revenue" fill="#0055A4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">آخر المدفوعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockStudents.slice(0, 5).map((s, i) => (
                      <div key={s.id} className="flex items-center gap-3 rounded-lg border p-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold">{s.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{s.course}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-emerald-600">+{formatPrice(399 - i * 50)}</div>
                          <div className="text-[10px] text-muted-foreground">{formatRelativeTime(s.enrolledAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Announcements */}
          {activeTab === "announcements" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">إنشاء إعلان جديد</CardTitle>
                </CardHeader>
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
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الكورس" />
                      </SelectTrigger>
                      <SelectContent>
                        {teacherCourses.map((c) => (
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">الإعلانات السابقة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { title: "بث مباشر مراجعة نهائية", content: "سأقوم بعمل بث مباشر يوم الجمعة الساعة 8 مساءً", date: "2025-12-15" },
                    { title: "إضافة مذكرة جديدة", content: "تم رفع مذكرة شاملة للباب الثاني", date: "2025-12-13" },
                  ].map((a, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold">{a.title}</h3>
                        <span className="text-[10px] text-muted-foreground">{formatRelativeTime(a.date)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{a.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">الملف التعريفي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>الاسم</Label>
                      <Input defaultValue={teacher.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>المسمى</Label>
                      <Select defaultValue={teacher.title}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="أ.">أستاذ</SelectItem>
                          <SelectItem value="د.">دكتور</SelectItem>
                          <SelectItem value="م.">مهندس</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>التخصص</Label>
                      <Input defaultValue={teacher.specialization} />
                    </div>
                    <div className="space-y-2">
                      <Label>المؤهل العلمي</Label>
                      <Input defaultValue={teacher.education} />
                    </div>
                    <div className="space-y-2">
                      <Label>سنوات الخبرة</Label>
                      <Input type="number" defaultValue={teacher.yearsExperience} />
                    </div>
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input defaultValue={teacher.email} dir="ltr" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>النبذة التعريفية</Label>
                    <Textarea rows={4} defaultValue={teacher.bio} />
                  </div>
                  <Button className="bg-brand-gradient" onClick={() => toast.success("تم حفظ التغييرات")}>
                    حفظ التغييرات
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">طرق الدفع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Vodafone Cash</Label>
                    <Input placeholder="0100 123 4567" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>InstaPay</Label>
                    <Input placeholder="name@instapay" dir="ltr" />
                  </div>
                  <Button variant="outline" onClick={() => toast.success("تم حفظ بيانات الدفع")}>
                    <Wallet className="ms-1 h-4 w-4" />
                    حفظ بيانات الدفع
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Create course modal */}
      <CreateCourseModal open={courseModalOpen} onOpenChange={setCourseModalOpen} />
    </div>
  );
}

function CreateCourseModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState(1);

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStep(1); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right">إنشاء كورس جديد - الخطوة {step} من 3</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>عنوان الكورس *</Label>
              <Input placeholder="مثال: الرياضيات التطبيقية - الصف الثالث الثانوي" />
            </div>
            <div className="space-y-2">
              <Label>الوصف *</Label>
              <Textarea rows={4} placeholder="وصف تفصيلي للكورس وأهدافه ومحتواه" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>المادة</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {["اللغة العربية", "الرياضيات", "الفيزياء", "الكيمياء", "الأحياء"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الصف</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g1">الصف الأول الثانوي</SelectItem>
                    <SelectItem value="g2">الصف الثاني الثانوي</SelectItem>
                    <SelectItem value="g3">الصف الثالث الثانوي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المستوى</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beg">مبتدئ</SelectItem>
                    <SelectItem value="int">متوسط</SelectItem>
                    <SelectItem value="adv">متقدم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>السنة الدراسية</Label>
                <Input defaultValue="2025/2026" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>إلغاء</Button>
              <Button className="bg-brand-gradient" onClick={() => setStep(2)}>التالي</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>صورة الغلاف</Label>
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                <div className="text-center">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">اسحب الصورة هنا أو اضغط للرفع</p>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG - حتى 2MB</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>السعر (ج.م)</Label>
                <Input type="number" placeholder="399" />
              </div>
              <div className="space-y-2">
                <Label>السعر بعد الخصم</Label>
                <Input type="number" placeholder="299" />
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                <Video className="ms-1 inline h-3 w-3" />
                سيتم معالجة الفيديوهات تلقائياً بـ FFmpeg وتحويلها إلى HLS مشفّر. جودة 480p افتراضياً لتوفير باقة الإنترنت.
              </p>
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>السابق</Button>
              <Button className="bg-brand-gradient" onClick={() => setStep(3)}>التالي</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>أبواب الكورس</Label>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder={`الباب ${i}: عنوان الباب`} defaultValue={`الباب ${i}`} />
                  <Button size="sm" variant="ghost" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="ms-1 h-4 w-4" />
                إضافة باب
              </Button>
            </div>
            <div className="space-y-2">
              <Label>الدروس</Label>
              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Input placeholder="عنوان الدرس" />
                  <Button size="sm" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
                <div className="rounded bg-muted/30 p-2 text-xs text-muted-foreground">
                  ⚙️ معالجة الفيديو: 480p H.264 → HLS + تشفير → رفع على R2
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>السابق</Button>
              <Button className="bg-brand-gradient" onClick={() => { handleClose(); toast.success("تم إنشاء الكورس بنجاح! 🎉"); }}>
                نشر الكورس
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
