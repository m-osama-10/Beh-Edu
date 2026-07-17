"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouterStore } from "@/store/router-store";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Upload,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export function TeacherOnboardingPage() {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
      <div className="text-center mb-8">
        <div className="size-20 rounded-2xl bg-brand-gradient mx-auto flex items-center justify-center mb-4 shadow-lg">
          <CheckCircle2 className="size-10 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground font-display mb-2">
          تم إنشاء حسابك بنجاح!
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          مرحباً بك في بكالوريا بيه كمدرس. حسابك الآن قيد المراجعة من قبل فريق
          الإدارة. ستتم الموافقة عليه خلال 24 ساعة كحد أقصى.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="font-bold text-lg text-foreground mb-4">حالة طلبك</h2>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <Clock className="size-6 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground">قيد المراجعة</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              نتحقق الآن من بياناتك ومؤهلاتك. ستصل إشعار فور الموافقة.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="font-bold text-lg text-foreground mb-4">خطواتك القادمة</h2>
        <div className="space-y-4">
          {[
            {
              icon: ShieldCheck,
              title: "انتظر موافقة الإدارة",
              desc: "تتم مراجعة كل طلب مدرس يدوياً لضمان جودة المنصة. تستغرق العملية عادةً 2-4 ساعات.",
              done: true,
            },
            {
              icon: Upload,
              title: "أكمل ملفك الشخصي",
              desc: "بعد الموافقة، أضف صورتك الشخصية، نبذة مهنية، ومعلومات مؤهلاتك بالتفصيل.",
              done: false,
            },
            {
              icon: CheckCircle2,
              title: "أنشئ كورسك الأول",
              desc: "ابدأ بإنشاء كورسك الأول. أضف الأقسام والدروس وارفع الفيديوهات (سيتم تحويلها تلقائياً لـ HLS 480p و 720p).",
              done: false,
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${step.done ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                <step.icon className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
              {step.done && <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-brand-gradient-soft border-primary/30">
        <h2 className="font-bold text-base text-foreground mb-2">
          💡 نصائح لمدرس ناجح
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <ArrowLeft className="size-4 text-primary mt-0.5 shrink-0" />
            ابدأ بشرح واضح ومنظّم؛ الطلاب يقدّرون التسلسل المنطقي.
          </li>
          <li className="flex items-start gap-2">
            <ArrowLeft className="size-4 text-primary mt-0.5 shrink-0" />
            استخدم الرسومات والأمثلة الواقعية لترسيخ المفاهيم.
          </li>
          <li className="flex items-start gap-2">
            <ArrowLeft className="size-4 text-primary mt-0.5 shrink-0" />
            أضف اختبارات قصيرة بعد كل درس؛ التفاعل يثبّت المعلومة.
          </li>
          <li className="flex items-start gap-2">
            <ArrowLeft className="size-4 text-primary mt-0.5 shrink-0" />
            ردّ على تعليقات الطلاب وأسئلتهم بانتظام لبناء مجتمع.
          </li>
        </ul>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate("home")}
        >
          <ArrowRight className="size-4 ml-2" />
          العودة للرئيسية
        </Button>
        <Button
          className="flex-1 bg-brand-gradient"
          onClick={() => {
            toast.info("ستتمكن من الوصول للوحة المدرس بعد الموافقة");
            navigate("teacher-dashboard");
          }}
        >
          معاينة لوحة المدرس
          <ArrowLeft className="size-4 mr-2" />
        </Button>
      </div>
    </div>
  );
}
