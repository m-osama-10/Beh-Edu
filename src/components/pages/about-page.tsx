"use client";

import { useRouterStore } from "@/store/router-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Shield, Users, BookOpen, Award, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { PLATFORM_STATS, formatNumber } from "@/data/mock-data";

export function AboutPage() {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <Badge className="mb-4 bg-brand-gradient text-primary-foreground">من نحن</Badge>
        <h1 className="mb-4 text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
          بكالوريا <span className="text-brand-gradient">بيه</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          منصة تعليمية مصرية متكاملة تأسست عام 2025 بهدف توفير تعليم عالي الجودة لكل طلاب الثانوية العامة والبكالوريا في مصر، بأسعار مناسبة وبتقنية تحترم باقة الإنترنت ووقت الطالب.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Users, label: "طالب نشط", value: formatNumber(PLATFORM_STATS.totalStudents) },
          { icon: BookOpen, label: "كورس متاح", value: formatNumber(PLATFORM_STATS.totalCourses) },
          { icon: Award, label: "مدرس معتمد", value: PLATFORM_STATS.totalTeachers },
          { icon: Target, label: "متوسط التقييم", value: PLATFORM_STATS.averageRating },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient-soft text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission / Vision / Values */}
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">رسالتنا</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              تمكين كل طالب مصري من الوصول لتعليم عالي الجودة بغض النظر عن موقعه الجغرافي أو مستواه المادي. نؤمن أن التعليم حق أساسي وليس سلعة كمالية. نسعى لتبسيط المحتوى التعليمي وجعله ممتعاً ومتاحاً لكل الطلاب عبر استخدام أحدث التقنيات التعليمية.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">رؤيتنا</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              أن نكون المنصة التعليمية الأولى في مصر والشرق الأوسط، وأن نساهم في رفع مستوى التعليم وتجهيز جيل من الطلاب قادر على المنافسة العلمية والعملية على المستوى العالمي. نطمح لأن نكون البيت الأول لكل طالب مصري يسعى للتفوق والنجاح في دراسته.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">قيمنا</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• الجودة قبل الكمية</li>
              <li>• احترام وقت ومال الطالب</li>
              <li>• الابتكار المستمر في التعليم</li>
              <li>• الشفافية والمصداقية</li>
              <li>• دعم المجتمع التعليمي المصري</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Story */}
      <Card className="mb-8">
        <CardContent className="p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">قصتنا</h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              بدأت فكرة بكالوريا بيه عندما لاحظ فريقنا أن العديد من الطلاب المصريين في المحافظات والمناطق النائية يعانون من صعوبة الوصول إلى مدرسين متميزين. كما أن باقات الإنترنت المحدودة والمكلفة في مصر تجعل من الصعب على الطلاب مشاهدة الفيديوهات التعليمية بجودة عالية دون استنزاف باقتهم.
            </p>
            <p>
              من هنا، جاءت فكرة إنشاء منصة تعليمية تدمج بين جودة المحتوى وكفاءة استخدام الإنترنت. صممنا تقنية "توفير الباقة" التي تجبر جودة الفيديو على 480p محسّنة، مما يقلل استهلاك الإنترنت بنسبة تصل إلى 60% مقارنة بالجودة العالية. كما طورنا نظام حماية متكامل للفيديوهات يمنع تحميلها أو مشاركتها، مع علامة مائية تعرض اسم الطالب أثناء المشاهدة لضمان حقوق المدرسين.
            </p>
            <p>
              اليوم، تضم المنصة أكثر من 50 مدرساً معتمداً من نخبة المدرسين المصريين، يقدمون كورسات في جميع مواد الثانوية العامة. ونحن نعمل باستمرار على تطوير المنصة وإضافة ميزات جديدة تستجيب لاحتياجات الطلاب والمدرسين على حد سواء.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground">تواصل معنا</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-bold text-foreground">البريد الإلكتروني</h3>
              <p className="text-sm text-muted-foreground" dir="ltr">info@bakaloriaa-bey.com</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-bold text-foreground">الهاتف</h3>
              <p className="text-sm text-muted-foreground" dir="ltr">+20 100 123 4567</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-bold text-foreground">العنوان</h3>
              <p className="text-sm text-muted-foreground">القاهرة، جمهورية مصر العربية</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button className="bg-brand-gradient" onClick={() => navigate("courses")}>
          تصفح الكورسات الآن
          <ArrowLeft className="ms-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
