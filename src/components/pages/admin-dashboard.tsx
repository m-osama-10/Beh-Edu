"use client";

import { useState } from "react";
import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { COURSES, TEACHERS, USERS_MOCK, REVENUE_DATA, ENROLLMENT_BY_SUBJECT, PLATFORM_STATS, formatPrice, formatNumber, formatRelativeTime } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Settings,
  TrendingUp,
  TrendingDown,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Ban,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";

const NAV = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "users", label: "المستخدمون", icon: Users },
  { id: "teachers", label: "المدرسون", icon: GraduationCap },
  { id: "courses", label: "الكورسات", icon: BookOpen },
  { id: "payments", label: "المدفوعات", icon: DollarSign },
  { id: "reports", label: "التقارير", icon: TrendingUp },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

export function AdminDashboard() {
  const navigate = useRouterStore((s) => s.navigate);
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  if (!user) {
    navigate("login");
    return null;
  }

  // Mock pending teachers (not in approved list)
  const pendingTeachers = [
    { id: "pt-1", name: "أ. كريم حسن", email: "karim@email.com", specialization: "اللغة الفرنسية", appliedAt: "2025-12-10" },
    { id: "pt-2", name: "د. منى رضا", email: "mona.r@email.com", specialization: "الفلسفة والمنطق", appliedAt: "2025-12-12" },
    { id: "pt-3", name: "م. شريف نبيل", email: "sherif@email.com", specialization: "الفيزياء", appliedAt: "2025-12-14" },
  ];

  // Mock payments
  const payments = [
    { id: "p-1", user: "أحمد محمود", course: "الرياضيات التطبيقية", amount: 399, method: "Vodafone Cash", status: "COMPLETED", date: "2025-12-15" },
    { id: "p-2", user: "فاطمة علي", course: "الكيمياء العضوية", amount: 349, method: "InstaPay", status: "COMPLETED", date: "2025-12-14" },
    { id: "p-3", user: "محمود السيد", course: "الفيزياء الحديثة", amount: 449, method: "Fawry", status: "PENDING", date: "2025-12-14" },
    { id: "p-4", user: "سارة إبراهيم", course: "اللغة العربية", amount: 299, method: "Card", status: "COMPLETED", date: "2025-12-13" },
    { id: "p-5", user: "عمر خالد", course: "اللغة الإنجليزية", amount: 329, method: "Orange Cash", status: "FAILED", date: "2025-12-13" },
  ];

  const totalRevenue = REVENUE_DATA.reduce((s, r) => s + r.revenue, 0);
  const totalUsers = PLATFORM_STATS.totalStudents + 1000;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center gap-3 pb-4 border-b">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">لوحة الإدارة</div>
                  <Badge className="bg-accent text-accent-foreground text-[10px]">ADMIN</Badge>
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
                    {item.id === "teachers" && pendingTeachers.length > 0 && (
                      <Badge className="ms-auto bg-accent text-accent-foreground text-[10px]">
                        {pendingTeachers.length}
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
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">لوحة تحكم الإدارة</h1>
            <p className="text-sm text-muted-foreground">إدارة وتنظيم منصة بكالوريا بيه</p>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Users, label: "إجمالي المستخدمين", value: formatNumber(totalUsers), change: "+8.2%", up: true },
                  { icon: GraduationCap, label: "المدرسون النشطون", value: PLATFORM_STATS.totalTeachers, change: "+3", up: true },
                  { icon: BookOpen, label: "الكورسات المنشورة", value: PLATFORM_STATS.totalCourses, change: "+24", up: true },
                  { icon: DollarSign, label: "الإيرادات الإجمالية", value: formatPrice(totalRevenue), change: "+18%", up: true },
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

              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">نمو المستخدمين</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D62828" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#D62828" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Cairo" }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ fontFamily: "Cairo", borderRadius: 8 }}
                          formatter={(value: number) => [value, "طالب"]}
                        />
                        <Area type="monotone" dataKey="students" stroke="#D62828" strokeWidth={2} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">الإيرادات الشهرية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1A5F7A" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#1A5F7A" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Cairo" }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}K`} />
                        <Tooltip
                          contentStyle={{ fontFamily: "Cairo", borderRadius: 8 }}
                          formatter={(value: number) => [formatPrice(value), "الإيرادات"]}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#1A5F7A" strokeWidth={2} fill="url(#colorRev2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Activity feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">آخر الأنشطة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { type: "enroll", text: "طالب جديد سجل في كورس الرياضيات", time: "2025-12-15T10:00:00Z" },
                    { type: "teacher", text: "مدرس جديد تقدم بطلب تسجيل", time: "2025-12-15T09:30:00Z" },
                    { type: "payment", text: "تم استلام دفعة بقيمة 399 ج.م", time: "2025-12-15T09:00:00Z" },
                    { type: "course", text: "تم نشر كورس جديد: اللغة العربية", time: "2025-12-14T15:00:00Z" },
                    { type: "review", text: "تقييم جديد 5 نجوم على كورس الفيزياء", time: "2025-12-14T14:00:00Z" },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        act.type === "enroll" ? "bg-primary/10 text-primary" :
                        act.type === "teacher" ? "bg-amber-100 text-amber-600" :
                        act.type === "payment" ? "bg-emerald-100 text-emerald-600" :
                        act.type === "course" ? "bg-purple-100 text-purple-600" :
                        "bg-yellow-100 text-yellow-600"
                      }`}>
                        {act.type === "enroll" ? <Users className="h-4 w-4" /> :
                          act.type === "teacher" ? <GraduationCap className="h-4 w-4" /> :
                          act.type === "payment" ? <DollarSign className="h-4 w-4" /> :
                          act.type === "course" ? <BookOpen className="h-4 w-4" /> :
                          <Star className="h-4 w-4" />}
                      </div>
                      <p className="flex-1 text-sm">{act.text}</p>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(act.time)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">إدارة المستخدمين</h2>
                <div className="relative w-64">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="بحث..."
                    className="pr-9"
                  />
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-right text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 font-bold">المستخدم</th>
                      <th className="p-3 font-bold hidden sm:table-cell">الدور</th>
                      <th className="p-3 font-bold hidden md:table-cell">تاريخ التسجيل</th>
                      <th className="p-3 font-bold">الحالة</th>
                      <th className="p-3 font-bold">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {USERS_MOCK.filter((u) => !search || u.name.includes(search) || u.email.includes(search)).map((u) => (
                      <tr key={u.id} className="border-t hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatarUrl} alt={u.name} />
                              <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-bold text-xs">{u.name}</div>
                              <div className="text-[10px] text-muted-foreground" dir="ltr">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <Badge variant="secondary">
                            {u.role === "ADMIN" ? "مدير" : u.role === "TEACHER" ? "مدرس" : "طالب"}
                          </Badge>
                        </td>
                        <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="p-3">
                          <Badge variant={u.status === "ACTIVE" ? "default" : u.status === "PENDING" ? "secondary" : "destructive"}>
                            {u.status === "ACTIVE" ? "نشط" : u.status === "PENDING" ? "معلق" : "محظور"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => toast.info("عرض الملف")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {u.status === "ACTIVE" ? (
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.success("تم تعليق الحساب")}>
                                <Ban className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => toast.success("تم تفعيل الحساب")}>
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Teachers */}
          {activeTab === "teachers" && (
            <div className="space-y-6">
              {/* Pending */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    طلبات بانتظار الموافقة ({pendingTeachers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {pendingTeachers.map((t) => (
                    <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} alt={t.name} />
                        <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.specialization}</div>
                        <div className="text-[10px] text-muted-foreground" dir="ltr">{t.email}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success(`تمت الموافقة على ${t.name}`)}>
                          <Check className="ms-1 h-4 w-4" />
                          موافقة
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => toast.info(`تم رفض طلب ${t.name}`)}>
                          <XCircle className="ms-1 h-4 w-4" />
                          رفض
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active teachers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">المدرسون المعتمدون ({TEACHERS.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {TEACHERS.map((t) => (
                    <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={t.avatarUrl} alt={t.name} />
                        <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.specialization}</div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatNumber(t.totalStudents)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {t.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatPrice(t.totalRevenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Courses */}
          {activeTab === "courses" && (
            <div>
              <h2 className="mb-4 text-lg font-bold">إدارة الكورسات ({COURSES.length})</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-right text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 font-bold">الكورس</th>
                      <th className="p-3 font-bold hidden sm:table-cell">المدرس</th>
                      <th className="p-3 font-bold hidden md:table-cell">الطلاب</th>
                      <th className="p-3 font-bold hidden md:table-cell">التقييم</th>
                      <th className="p-3 font-bold">الحالة</th>
                      <th className="p-3 font-bold">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COURSES.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            { }
                            <img src={c.coverImageUrl} alt={c.title} className="h-10 w-14 rounded object-cover" />
                            <div className="min-w-0">
                              <div className="truncate font-bold text-xs max-w-[200px]">{c.title}</div>
                              <div className="text-[10px] text-muted-foreground">{c.subject.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell text-xs">{c.teacher.name}</td>
                        <td className="p-3 hidden md:table-cell">{formatNumber(c.studentCount)}</td>
                        <td className="p-3 hidden md:table-cell">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {c.rating}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            <Badge variant={c.isPublished ? "default" : "secondary"}>
                              {c.isPublished ? "منشور" : "مسودة"}
                            </Badge>
                            {c.isFeatured && (
                              <Badge className="bg-gold-gradient text-black text-[9px]">مميز</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => navigate("course-detail", { courseId: c.id })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                toast.success(c.isFeatured ? "تمت إزالة التمييز" : "تم تمييز الكورس");
                              }}
                            >
                              <Star className={`h-4 w-4 ${c.isFeatured ? "fill-amber-400 text-amber-400" : ""}`} />
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

          {/* Payments */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Card><CardContent className="p-4">
                  <div className="text-xl font-extrabold text-emerald-600">{formatPrice(285000)}</div>
                  <div className="text-xs text-muted-foreground">مكتملة</div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="text-xl font-extrabold text-amber-600">{formatPrice(15000)}</div>
                  <div className="text-xs text-muted-foreground">معلقة</div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="text-xl font-extrabold text-red-600">{formatPrice(3200)}</div>
                  <div className="text-xs text-muted-foreground">فاشلة</div>
                </CardContent></Card>
                <Card><CardContent className="p-4">
                  <div className="text-xl font-extrabold text-primary">{formatPrice(2850)}</div>
                  <div className="text-xs text-muted-foreground">عمولة المنصة</div>
                </CardContent></Card>
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-right text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 font-bold">المستخدم</th>
                      <th className="p-3 font-bold hidden sm:table-cell">الكورس</th>
                      <th className="p-3 font-bold">المبلغ</th>
                      <th className="p-3 font-bold hidden md:table-cell">الطريقة</th>
                      <th className="p-3 font-bold">الحالة</th>
                      <th className="p-3 font-bold hidden md:table-cell">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t hover:bg-muted/30">
                        <td className="p-3 font-bold text-xs">{p.user}</td>
                        <td className="p-3 hidden sm:table-cell text-xs">{p.course}</td>
                        <td className="p-3 font-bold">{formatPrice(p.amount)}</td>
                        <td className="p-3 hidden md:table-cell">
                          <Badge variant="outline" className="text-[10px]">{p.method}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={p.status === "COMPLETED" ? "default" : p.status === "PENDING" ? "secondary" : "destructive"}>
                            {p.status === "COMPLETED" ? "مكتملة" : p.status === "PENDING" ? "معلقة" : "فاشلة"}
                          </Badge>
                        </td>
                        <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">
                          {new Date(p.date).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">التسجيلات حسب المادة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={ENROLLMENT_BY_SUBJECT} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fontFamily: "Cairo" }} width={80} />
                        <Tooltip
                          contentStyle={{ fontFamily: "Cairo", borderRadius: 8 }}
                          formatter={(value: number) => [value, "طالب"]}
                        />
                        <Bar dataKey="students" radius={[0, 6, 6, 0]}>
                          {ENROLLMENT_BY_SUBJECT.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">توزيع الإيرادات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={ENROLLMENT_BY_SUBJECT.slice(0, 5)}
                          dataKey="students"
                          nameKey="subject"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ subject, percent }) => `${subject} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={false}
                          style={{ fontFamily: "Cairo", fontSize: 11 }}
                        >
                          {ENROLLMENT_BY_SUBJECT.slice(0, 5).map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontFamily: "Cairo", borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">أفضل المدرسين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...TEACHERS].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5).map((t, i) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground text-sm font-bold">
                          {i + 1}
                        </div>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={t.avatarUrl} alt={t.name} />
                          <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.specialization}</div>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {formatNumber(t.totalStudents)}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-emerald-600">
                            <DollarSign className="h-3 w-3" />
                            {formatPrice(t.totalRevenue)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">إعدادات المنصة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold">اسم المنصة</label>
                      <Input defaultValue="بكالوريا بيه" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-bold">عمولة المنصة</label>
                      <Input defaultValue="15" type="number" className="mt-1" />
                      <p className="mt-1 text-[10px] text-muted-foreground">% من كل عملية بيع</p>
                    </div>
                  </div>
                  <Button className="bg-brand-gradient" onClick={() => toast.success("تم حفظ الإعدادات")}>
                    حفظ الإعدادات
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
