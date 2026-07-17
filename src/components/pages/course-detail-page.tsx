"use client";

import { useState, useMemo } from "react";
import { useRouterStore } from "@/store/router-store";
import { useFavoritesStore, useEnrolledStore, useCartStore } from "@/store/app-stores";
import { RatingStars } from "@/components/shared/rating-stars";
import { DataSaverBadge, ProtectedContentBadge } from "@/components/shared/data-saver-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  BookOpen,
  Users,
  Star,
  Heart,
  Share2,
  PlayCircle,
  Lock,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Award,
  Globe,
  GraduationCap,
  Calendar,
  Eye,
  TrendingDown,
  ShoppingCart,
  Wifi,
  Leaf,
} from "lucide-react";
import {
  getCourseById,
  getReviewsByCourse,
  formatPrice,
  formatDuration,
  formatNumber,
  formatRelativeTime,
} from "@/data/mock-data";
import { toast } from "sonner";

export function CourseDetailPage() {
  const route = useRouterStore((s) => s.route);
  const navigate = useRouterStore((s) => s.navigate);
  const courseId = route.params?.courseId ?? "";
  const course = getCourseById(courseId);

  const isFavorite = useFavoritesStore((s) => (course ? s.isFavorite(course.id) : false));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isEnrolled = useEnrolledStore((s) => (course ? s.isEnrolled(course.id) : false));
  const enroll = useEnrolledStore((s) => s.enroll);
  const addToCart = useCartStore((s) => s.addToCart);

  const [activeTab, setActiveTab] = useState("overview");

  const reviews = useMemo(() => (course ? getReviewsByCourse(course.id) : []), [course]);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">الكورس غير موجود</h1>
        <Button className="mt-4" onClick={() => navigate("courses")}>
          العودة للكورسات
        </Button>
      </div>
    );
  }

  const currentPrice = course.discountPrice ?? course.price;
  const hasDiscount = course.discountPrice !== undefined && course.discountPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - course.discountPrice!) / course.price) * 100)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const pct = reviews.length ? (count / reviews.length) * 100 : 0;
    return { stars, count, pct };
  });

  const handleEnroll = () => {
    if (isEnrolled) {
      const firstLesson = course.sections[0]?.lessons[0];
      if (firstLesson) navigate("watch", { courseId: course.id, lessonId: firstLesson.id });
      return;
    }
    enroll(course.id);
    toast.success("تم التسجيل في الكورس بنجاح! 🎉");
    const firstLesson = course.sections[0]?.lessons[0];
    if (firstLesson) navigate("watch", { courseId: course.id, lessonId: firstLesson.id });
  };

  const handleAddToCart = () => {
    addToCart(course.id);
    toast.success("تمت الإضافة إلى السلة");
  };

  const handleFavorite = () => {
    toggleFavorite(course.id);
    toast.success(isFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة");
  };

  const handleShare = () => {
    toast.success("تم نسخ رابط الكورس");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <button onClick={() => navigate("home")} className="hover:text-primary">الرئيسية</button>
        <ChevronLeft className="h-3 w-3" />
        <button onClick={() => navigate("courses")} className="hover:text-primary">الكورسات</button>
        <ChevronLeft className="h-3 w-3" />
        <span className="text-foreground">{course.subject.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Cover */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-xl bg-muted">
            { }
            <img
              src={course.coverImageUrl}
              alt={course.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              onClick={() => navigate("watch", {
                courseId: course.id,
                lessonId: course.sections[0]?.lessons[0]?.id ?? "",
              })}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient shadow-lg transition hover:scale-110">
                <PlayCircle className="h-9 w-9 text-white" />
              </div>
            </button>
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Badge className="bg-black/60 text-white">
                <Eye className="ms-1 h-3 w-3" />
                {formatNumber(course.views)} مشاهدة
              </Badge>
              <ProtectedContentBadge />
            </div>
          </div>

          {/* Title + meta */}
          <div className="mb-4">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge style={{ backgroundColor: `${course.subject.color}20`, color: course.subject.color }}>
                {course.subject.name}
              </Badge>
              {course.isFeatured && (
                <Badge className="bg-gold-gradient text-black">مميز</Badge>
              )}
              <DataSaverBadge />
            </div>
            <h1 className="mb-3 text-xl font-bold leading-snug text-foreground sm:text-2xl md:text-3xl">
              {course.title}
            </h1>

            {/* Teacher + rating */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("courses", { view: "teachers" })}
                className="flex items-center gap-2"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={course.teacher.avatarUrl} alt={course.teacher.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {course.teacher.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground hover:text-primary">
                    {course.teacher.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{course.teacher.specialization}</div>
                </div>
              </button>

              <div className="flex items-center gap-2 border-r pr-4">
                <RatingStars rating={course.rating} size="sm" showCount />
                <span className="text-xs text-muted-foreground">
                  ({course.ratingCount} تقييم)
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {formatNumber(course.studentCount)} طالب
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="curriculum">المنهج</TabsTrigger>
              <TabsTrigger value="teacher">المدرس</TabsTrigger>
              <TabsTrigger value="reviews">التقييمات</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div>
                <h3 className="mb-3 text-lg font-bold text-foreground">عن هذا الكورس</h3>
                <p className="text-sm leading-relaxed text-foreground sm:text-base">
                  {course.description}
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-foreground">ماذا ستتعلم؟</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "فهم عميق لجميع مفاهيم المنهج الدراسي",
                    "حل أسئلة الامتحانات السابقة باحتراف",
                    "تطبيق عملي على مسائل متنوعة المستويات",
                    "استراتيجيات حل سريع للامتحانات",
                    "مذكرات وملخصات شاملة قابلة للتحميل",
                    "اختبارات تفاعلية لتقييم مستواك",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-foreground">المتطلبات</h3>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    معرفة أساسية بمحتوى الصف السابق
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    اتصال إنترنت مستقر (يفضل 3G أو أعلى)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    جهاز لمشاهدة الفيديوهات (موبايل، تابلت، أو كمبيوتر)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    الالتزام والجدية في الدراسة
                  </li>
                </ul>
              </div>

              <DataSaverBadge variant="card" dataMB={Math.round(course.totalDuration / 60 * 3.5)} />
            </TabsContent>

            {/* Curriculum */}
            <TabsContent value="curriculum" className="pt-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">محتوى الكورس</h3>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{course.sections.length} أبواب</span>
                  <span>•</span>
                  <span>{course.totalLessons} درس</span>
                  <span>•</span>
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
              </div>

              <Accordion type="multiple" className="space-y-2">
                {course.sections.map((section, idx) => (
                  <AccordionItem key={section.id} value={section.id} className="overflow-hidden rounded-lg border">
                    <AccordionTrigger className="hover:bg-muted/50 px-4">
                      <div className="flex flex-1 items-center justify-between pe-2 text-right">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient-soft text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-foreground">{section.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {section.lessons.length} دروس
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-2">
                      <div className="space-y-1">
                        {section.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              if (lesson.isPreview || isEnrolled) {
                                navigate("watch", { courseId: course.id, lessonId: lesson.id });
                              } else {
                                toast.info("هذا الدرس متاح فقط للمشتركين. اشترك لمشاهدة جميع الدروس.");
                              }
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-right transition hover:bg-muted/50"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                              {lesson.isPreview || isEnrolled ? (
                                <PlayCircle className="h-5 w-5 text-primary" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-sm font-medium text-foreground">
                                {lesson.title}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDuration(lesson.duration)}
                                {lesson.isPreview && (
                                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[9px]">
                                    معاينة مجانية
                                  </Badge>
                                )}
                                {lesson.attachments.length > 0 && (
                                  <span className="flex items-center gap-0.5">
                                    <FileText className="h-3 w-3" />
                                    {lesson.attachments.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Teacher */}
            <TabsContent value="teacher" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-20 w-20 flex-shrink-0">
                      <AvatarImage src={course.teacher.avatarUrl} alt={course.teacher.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {course.teacher.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">{course.teacher.name}</h3>
                        {course.teacher.verified && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            <CheckCircle2 className="ms-1 h-3 w-3" />
                            موثق
                          </Badge>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{course.teacher.specialization}</p>
                      <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {course.teacher.rating} تقييم
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {formatNumber(course.teacher.totalStudents)} طالب
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.teacher.totalCourses} كورس
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{course.teacher.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="space-y-6 pt-4">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-foreground">{course.rating}</div>
                  <RatingStars rating={course.rating} size="md" className="justify-center" />
                  <p className="mt-1 text-xs text-muted-foreground">{course.ratingCount} تقييم</p>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <span className="flex w-12 items-center gap-1 text-xs">
                        {item.stars}
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-xs text-muted-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    لا توجد تقييمات بعد. كن أول من يقيّم هذا الكورس!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={review.user.avatarUrl} alt={review.user.name} />
                            <AvatarFallback>{review.user.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-foreground">{review.user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatRelativeTime(review.createdAt)}
                            </div>
                          </div>
                          <RatingStars rating={review.rating} size="sm" />
                        </div>
                        {review.comment && (
                          <p className="text-sm leading-relaxed text-foreground">{review.comment}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardContent className="p-4 sm:p-6">
              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary">{formatPrice(currentPrice)}</span>
                  {hasDiscount && (
                    <span className="text-base text-muted-foreground line-through">
                      {formatPrice(course.price)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className="bg-accent text-accent-foreground">خصم {discountPercent}%</Badge>
                    {course.discountUntil && (
                      <span className="text-xs text-muted-foreground">
                        ينتهي خلال {Math.ceil((new Date(course.discountUntil).getTime() - Date.now()) / 86400000)} يوم
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full bg-brand-gradient"
                  onClick={handleEnroll}
                >
                  {isEnrolled ? (
                    <>
                      <PlayCircle className="ms-2 h-5 w-5" />
                      متابعة المشاهدة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="ms-2 h-5 w-5" />
                      اشترك الآن
                    </>
                  )}
                </Button>
                {!isEnrolled && (
                  <Button size="lg" variant="outline" className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="ms-2 h-4 w-4" />
                    أضف إلى السلة
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleFavorite}>
                    <Heart className={`ms-1 h-4 w-4 ${isFavorite ? "fill-accent text-accent" : ""}`} />
                    مفضلة
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="ms-1 h-4 w-4" />
                    مشاركة
                  </Button>
                </div>
              </div>

              {/* Course info */}
              <div className="mt-6 space-y-3 border-t pt-4">
                <h4 className="text-sm font-bold text-foreground">معلومات الكورس</h4>
                {[
                  { icon: BarChart, label: "المستوى", value: getLevelLabel(course.level) },
                  { icon: GraduationCap, label: "الصف", value: course.grade?.name ?? "—" },
                  { icon: Clock, label: "المدة الإجمالية", value: formatDuration(course.totalDuration) },
                  { icon: BookOpen, label: "عدد الدروس", value: `${course.totalLessons} درس` },
                  { icon: Calendar, label: "السنة الدراسية", value: course.academicYear },
                  { icon: Globe, label: "اللغة", value: course.language },
                  { icon: Award, label: "شهادة إتمام", value: "نعم، عند الاكتمال" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Data consumption */}
              <div className="mt-4 space-y-2 border-t pt-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  استهلاك البيانات
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between rounded-md bg-emerald-50 p-2 dark:bg-emerald-950/30">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                      <Leaf className="h-3 w-3" />
                      وضع توفير الباقة (480p)
                    </span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      ~{Math.round(course.totalDuration / 60 * 3.5)} MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                    <span className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      جودة عالية (720p)
                    </span>
                    <span className="font-bold">
                      ~{Math.round(course.totalDuration / 60 * 7)} MB
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    💡 تفعيل وضع توفير الباقة يقلل الاستهلاك بنسبة 50%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function getLevelLabel(level: string): string {
  const map: Record<string, string> = {
    BEGINNER: "مبتدئ",
    INTERMEDIATE: "متوسط",
    ADVANCED: "متقدم",
    ALL_LEVELS: "كل المستويات",
  };
  return map[level] ?? level;
}

// Bar chart icon (fallback to TrendingDown if not in lucide)
function BarChart(props: React.ComponentProps<"svg">) {
  return <TrendingDown {...props} />;
}
