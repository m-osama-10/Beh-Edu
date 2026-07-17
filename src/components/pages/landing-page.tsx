"use client";

import { useEffect, useState } from "react";
import { useRouterStore } from "@/store/router-store";
import { CourseCard } from "@/components/shared/course-card";
import { SubjectCard } from "@/components/shared/subject-card";
import { TeacherCard } from "@/components/shared/teacher-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { DataSaverBadge } from "@/components/shared/data-saver-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  ShieldCheck,
  Leaf,
  Award,
  Users,
  BookOpen,
  Star,
  ArrowLeft,
  Wifi,
  Lock,
  Smartphone,
  GraduationCap,
  TrendingUp,
  Heart,
  Sparkles,
  CheckCircle2,
  Quote,
} from "lucide-react";
import {
  COURSES,
  TEACHERS,
  SUBJECTS,
  PLATFORM_STATS,
  formatNumber,
} from "@/data/mock-data";
import { CourseCardSkeleton } from "@/components/shared/empty-state";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "فيديوهات محمية بالكامل",
    description:
      "نستخدم تقنية تشفير HLS ومواقع موقعة مؤقتة لمنع تحميل أو مشاركة الفيديوهات. كل طالب يشاهد بعلامة مائية باسمه.",
    color: "#1A5F7A",
  },
  {
    icon: Leaf,
    title: "توفير الباقة",
    description:
      "وضع توفير الباقة يجبر الجودة على 480p لتقليل استهلاك الإنترنت بنسبة تصل إلى 60%. مناسب لباقات الإنترنت المحدودة في مصر.",
    color: "#10B981",
  },
  {
    icon: Award,
    title: "شهادات معتمدة",
    description:
      "احصل على شهادة إتمام لكل كورس تكمله بنجاح. الشهادات قابلة للتحميل ومشاركتها مع المؤسسات التعليمية وأولياء الأمور.",
    color: "#FFD700",
  },
  {
    icon: Users,
    title: "أفضل المدرسين",
    description:
      "نخبة من المدرسين المصريين المعتمدين بخبرات تتجاوز 10 سنوات في تدريس الثانوية العامة. تم اختيارهم بعناية لضمان جودة التعليم.",
    color: "#D62828",
  },
  {
    icon: Smartphone,
    title: "متوافق مع الموبايل",
    description:
      "منصة متجاوبة بالكامل تعمل بسلاسة على جميع الأجهزة من الموبايل إلى الكمبيوتر. تصميم Mobile First يضمن تجربة ممتازة على كل شاشة.",
    color: "#7C3AED",
  },
  {
    icon: TrendingUp,
    title: "تتبع التقدم",
    description:
      "نظام تتبع متقدم يعرض تقدمك في كل كورس ودرس. استكمل المشاهدة من حيث توقفت واعرف استهلاكك من البيانات بدقة.",
    color: "#06B6D4",
  },
];

const STEPS = [
  {
    number: "01",
    title: "أنشئ حسابك مجاناً",
    description:
      "سجل كطالب في دقيقة واحدة. اختر الصف الدراسي والمواد التي تهمك. لا حاجة لبطاقة ائتمان للتسجيل.",
  },
  {
    number: "02",
    title: "اختر كورساتك",
    description:
      "تصفح مئات الكورسات من أفضل المدرسين. استخدم الفلاتر للعثور على الكورس المناسب لمستواك وميزانيتك.",
  },
  {
    number: "03",
    title: "ابدأ التعلم فوراً",
    description:
      "ادفع بأي طريقة مناسبة (فودافون كاش، إنستاباي، فوري) وابدأ المشاهدة فوراً مع وضع توفير الباقة لتقليل الاستهلاك.",
  },
];

const TESTIMONIALS = [
  {
    name: "أحمد محمود",
    role: "طالب صف ثالث ثانوي - القاهرة",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ah&backgroundColor=1A5F7A",
    rating: 5,
    text: "بكالوريا بيه غيرت حياتي الدراسية. الكورسات ممتازة وأسعارها مناسبة جداً. خاصية توفير الباقة ساعدتني أكمل دراستي رغم إن باقة الإنترنت عندي صغيرة. أنصح كل زملائي بالمنصة.",
  },
  {
    name: "فاطمة علي",
    role: "طالبة صف ثالث ثانوي - الإسكندرية",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Fa&backgroundColor=D62828",
    rating: 5,
    text: "أ. منى السيد شرحها للنحو رائع جداً. كنت بكره النحو وبقيت بحبه. الفيديوهات بجودة ممتازة وبتستهلك باقة قليلة. حصلت على 95% في امتحان النحو في الفصل الدراسي الأول.",
  },
  {
    name: "محمود السيد",
    role: "ولي أمر طالب - الجيزة",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ma&backgroundColor=10B981",
    rating: 5,
    text: "كأب، كنت قلقان من تعليم ابني أونلاين. لكن بكالوريا بيه قدمت تجربة احترافية وموثوقة. الشهادات المعتمدة والدعم الفني الممتاز جعلني مطمئن. شكراً لكم على هذا المجهود الرائع.",
  },
];

export function LandingPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const featuredCourses = COURSES.filter((c) => c.isFeatured).slice(0, 6);
  const topTeachers = TEACHERS.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-gradient-soft hero-pattern">
        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="text-center lg:text-right">
              <Badge className="mb-4 bg-brand-gradient text-primary-foreground">
                <Sparkles className="ms-1 h-3 w-3" />
                منصة التعليم المصرية الأولى
              </Badge>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                تعلم بذكاء.
                <br />
                <span className="text-brand-gradient">تفوق بثقة.</span>
              </h1>
              <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                منصة بكالوريا بيه توفر لك أفضل الكورسات التعليمية لطلاب الثانوية العامة في مصر. فيديوهات محمية بتقنية تشفير HLS، خاصية توفير الباقة لتقليل استهلاك الإنترنت، ومدرسون معتمدون بخبرات طويلة. تعلم في أي وقت ومن أي مكان بأسعار تناسب كل الطلاب.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="w-full bg-brand-gradient text-base sm:w-auto"
                  onClick={() => navigate("register")}
                >
                  ابدأ التعلم مجاناً
                  <ArrowLeft className="ms-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-base sm:w-auto"
                  onClick={() => navigate("courses")}
                >
                  <PlayCircle className="ms-2 h-5 w-5" />
                  تصفح الكورسات
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:gap-6 lg:justify-start">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  بدون بطاقة ائتمان
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  أكثر من 500 كورس
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  دعم مصري 24/7
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="relative mx-auto max-w-md">
                {/* Mockup */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-card shadow-2xl">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-amber-500/20 p-4">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          <Leaf className="ms-1 h-3 w-3" />
                          توفير الباقة مُفعّل
                        </Badge>
                        <Badge variant="secondary" className="bg-black/10">
                          <Lock className="ms-1 h-3 w-3" />
                          محتوى محمي
                        </Badge>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient shadow-lg">
                          <PlayCircle className="h-9 w-9 text-white" />
                        </div>
                        <p className="text-xs font-medium text-foreground">الرياضيات - الباب الأول</p>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-black/10">
                          <div className="h-full w-2/3 rounded-full bg-brand-gradient" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>12:30 / 27:00</span>
                          <span className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            85 MB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-3/4 rounded bg-muted" />
                    <div className="h-2 w-full rounded bg-muted/60" />
                    <div className="h-2 w-5/6 rounded bg-muted/60" />
                  </div>
                </div>

                {/* Floating cards */}
                <Card className="absolute -right-4 top-12 hidden w-44 shadow-lg sm:block">
                  <CardContent className="flex items-center gap-2 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">شهادة معتمدة</div>
                      <div className="text-[10px] text-muted-foreground">عند إتمام الكورس</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute -left-4 bottom-24 hidden w-44 shadow-lg sm:block">
                  <CardContent className="flex items-center gap-2 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">تتبع التقدم</div>
                      <div className="text-[10px] text-muted-foreground">في كل درس</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 py-8 md:grid-cols-4">
            {[
              { icon: Users, label: "طالب نشط", value: formatNumber(PLATFORM_STATS.totalStudents), suffix: "+" },
              { icon: BookOpen, label: "كورس متاح", value: formatNumber(PLATFORM_STATS.totalCourses), suffix: "+" },
              { icon: GraduationCap, label: "مدرس معتمد", value: PLATFORM_STATS.totalTeachers, suffix: "+" },
              { icon: Star, label: "متوسط التقييم", value: PLATFORM_STATS.averageRating, suffix: "/5" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient-soft text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  {stat.value}
                  <span className="text-primary">{stat.suffix}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="استكشف حسب المادة"
            subtitle="اختر من بين أهم مواد الثانوية العامة"
            viewAllTarget="courses"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {SUBJECTS.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="كورسات مميزة"
            subtitle="أفضل الكورسات المختارة بعناية لطلاب الثانوية العامة"
            viewAllTarget="courses"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
              : featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <Badge className="mb-3 bg-brand-gradient-soft text-primary">لماذا بكالوريا بيه؟</Badge>
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              تعليم عالي الجودة يلبي احتياجات الطالب المصري
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              صممنا منصتنا خصيصاً لطلاب مصر مع مراعاة ظروف الإنترنت والأجهزة المختلفة. كل ميزة لدينا تحل مشكلة حقيقية يواجهها الطلاب في رحلتهم التعليمية.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="card-hover overflow-hidden">
                <CardContent className="p-6">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DATA SAVER FEATURE */}
      <section className="bg-gradient-to-l from-emerald-50 to-emerald-100/50 py-12 dark:from-emerald-950/30 dark:to-emerald-900/20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge className="mb-3 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                <Leaf className="ms-1 h-3 w-3" />
                ميزة فريدة
              </Badge>
              <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                توفير الباقة: تعلم أكثر، استهلك أقل
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                نعلم أن باقات الإنترنت في مصر محدودة ومكلفة. لذلك صممنا خاصية "توفير الباقة" التي تجبر جودة الفيديو على 480p محسّنة بدلاً من 720p، مما يقلل استهلاك الإنترنت بنسبة تصل إلى 60%. المنصة تعرض لك استهلاكك التقريبي لكل درس قبل البدء، وتتبع استهلاكك الكلي أثناء المشاهدة.
              </p>
              <ul className="space-y-3">
                {[
                  "جودة 480p محسّنة - واضحة وتستهلك باقة قليلة",
                  "تتبع مباشر للاستهلاك بالميجابايت",
                  "تنبيهات عند تجاوز حد معين من البيانات",
                  "يعمل بشكل ممتاز حتى على شبكات 3G الضعيفة",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate("courses")}>
                جرب الآن مجاناً
              </Button>
            </div>

            <div className="flex justify-center">
              <Card className="w-full max-w-sm shadow-xl">
                <CardContent className="p-6">
                  <DataSaverBadge variant="card" dataMB={120} />
                  <div className="my-4 space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span className="text-sm">جودة 720p</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">~280 MB</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm">جودة 480p (توفير)</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">~120 MB</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">التوفير</span>
                      </div>
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-400">160 MB (57%)</span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    *الأرقام تقديرية لدرس مدته 27 دقيقة
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <Badge className="mb-3 bg-brand-gradient-soft text-primary">بسيطة وسريعة</Badge>
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              ابدأ رحلتك التعليمية في 3 خطوات
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-2xl font-extrabold text-primary-foreground shadow-lg">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP TEACHERS */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="نخبة المدرسين"
            subtitle="تعلم على يد أفضل المدرسين في مصر"
            viewAllTarget="courses"
            viewAllParams={{ view: "teachers" }}
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {topTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <Badge className="mb-3 bg-brand-gradient-soft text-primary">آراء طلابنا</Badge>
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              قصص نجاح حقيقية من طلابنا
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              أكثر من 12,000 طالب مصري اختاروا بكالوريا بيه لرحلتهم التعليمية. اقرأ تجاربهم وكيف ساعدتهم المنصة على التفوق.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="card-hover relative">
                <CardContent className="p-6">
                  <Quote className="absolute left-4 top-4 h-8 w-8 text-primary/20" />
                  <div className="mb-4 flex items-center gap-3">
                    { }
                    <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full" />
                    <div>
                      <div className="font-bold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{t.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 text-center text-primary-foreground md:p-16">
            <div className="hero-pattern absolute inset-0 opacity-20" />
            <div className="relative">
              <h2 className="mb-4 text-2xl font-extrabold sm:text-3xl md:text-4xl">
                جاهز لبدء رحلتك نحو التفوق؟
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-sm text-primary-foreground/90 sm:text-base">
                انضم لأكثر من 12,000 طالب مصري اختاروا بكالوريا بيه. سجل مجاناً اليوم واحصل على أول درس تجريبي بلا مقابل.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
                  onClick={() => navigate("register")}
                >
                  <Heart className="ms-2 h-5 w-5" />
                  سجل مجاناً الآن
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground sm:w-auto"
                  onClick={() => navigate("courses")}
                >
                  تصفح الكورسات
                  <ArrowLeft className="ms-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
