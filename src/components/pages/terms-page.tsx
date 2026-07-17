"use client";

import { Card } from "@/components/ui/card";

export function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold text-foreground font-display mb-2">
        الشروط والأحكام
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        آخر تحديث: يناير 2026
      </p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">1. قبول الشروط</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            باستخدامك لمنصة بكالوريا بيه، فإنك توافق على الالتزام بهذه الشروط
            والأحكام كاملةً. إذا كنت لا توافق على أي بند من هذه الشروط، يرجى عدم
            استخدام المنصة. قد نقوم بتحديث هذه الشروط من وقت لآخر، واستمرارك في
            استخدام المنصة بعد التحديث يعتبر موافقة على الشروط المعدّلة.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">2. التسجيل والحساب</h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>عند إنشاء حساب على المنصة، تلتزم بـ:</p>
            <ul className="list-disc list-inside space-y-1.5 pe-4">
              <li>تقديم معلومات صحيحة وكاملة.</li>
              <li>المحافظة على سرية كلمة المرور.</li>
              <li>عدم مشاركة حسابك مع أي شخص آخر.</li>
              <li>تحمل المسؤولية الكاملة عن أي نشاط يتم عبر حسابك.</li>
              <li>إخطارنا فوراً بأي استخدام غير مصرّح به لحسابك.</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">3. الاشتراكات والمدفوعات</h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              تُباع الكورسات بنظام الدفع لمرة واحدة (Pay once, access forever). تتم
              المدفوعات عبر إحدى الوسائل المعتمدة: فودافون كاش، إنستاباي، فوري،
              أو بطاقة بنكية.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pe-4">
              <li>الأسعار بالجنيه المصري وتشمل ضريبة القيمة المضافة.</li>
              <li>الخصومات سارية حتى التاريخ المحدد فقط ولا يمكن تمديدها.</li>
              <li>يمكنك طلب استرداد المبلغ خلال 7 أيام من الشراء إذا لم تتجاوز مشاهدة 25% من الكورس.</li>
              <li>عمولة المنصة من كل بيع هي 30% تُخصم تلقائياً من حصة المدرس.</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">4. حقوق الملكية الفكرية</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            جميع المحتويات على المنصة (فيديوهات، نصوص، رسومات، اختبارات) محمية
            بموجب قوانين حقوق الملكية الفكرية المصرية والدولية. يُمنع نسخ أو
            إعادة توزيع أو تحميل أي محتوى دون إذن كتابي صريح من المنصة أو المدرس
            صاحب المحتوى.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">5. حماية المحتوى</h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              المنصة تستخدم تقنيات متعددة لحماية المحتوى التعليمي تشمل:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pe-4">
              <li>تشفير HLS مع توقيع رقمي للروابط (تنتهي خلال 5 دقائق).</li>
              <li>علامة مائية باسم الطالب وبريده على كل فيديو.</li>
              <li>تعطيل خيارات النسخ والتحميل وفتح الروابط في تبويبات أخرى.</li>
              <li>تتبع سلوك المشاهدة لاكتشاف الأنشطة المشبوهة.</li>
            </ul>
            <p className="text-accent font-semibold mt-3">
              أي محاولة لتجاوز هذه الحماية ستعرض صاحبها للحظر الفوري ومساءلة قانونية.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">6. سلوك المستخدم</h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>يُمنع على المستخدمين:</p>
            <ul className="list-disc list-inside space-y-1.5 pe-4">
              <li>مشاركة بيانات حسابهم مع آخرين.</li>
              <li>تسجيل أو تصوير الفيديوهات بأي وسيلة.</li>
              <li>نشر محتوى مسيء أو مخالف للآداب في التعليقات أو التقييمات.</li>
              <li>محاولة اختراق المنصة أو الوصول لبيانات غير مصرّح بها.</li>
              <li>استخدام المنصة لأغراض تجارية دون اتفاق مسبق.</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">7. الشهادات</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            تُمنح الشهادات للطلاب الذين يكملون الكورس بنسبة 80% فأكثر. كل شهادة
            تحمل رقماً تسلسلياً يمكن التحقق منه عبر المنصة. الشهادات ليست
            معادلة لشهادات رسمية حكومية، بل هي شهادة إتمال من بكالوريا بيه
            تثبت اجتيازك للكورس.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">8. حدود المسؤولية</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            تُقدّم المنصة "كما هي" دون أي ضمانات صريحة أو ضمنية. لسنا مسؤولين
            عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام المنصة. لا
            نضمن أن النتائج الأكاديمية للطالب ستتحسن بالضرورة، فالنجاح يعتمد
            بشكل أساسي على جهد الطالب نفسه.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">9. التواصل والشكاوى</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            لأي شكوى أو استفسار قانوني، يمكنكم التواصل عبر البريد:
            <a href="mailto:legal@bakaloriaa-bey.test" className="text-primary hover:underline mr-1" dir="ltr">
              legal@bakaloriaa-bey.test
            </a>
            أو الهاتف:
            <span dir="ltr" className="mx-1">+20 100 123 4567</span>
            خلال أوقات العمل الرسمية.
          </p>
        </Card>
      </div>
    </div>
  );
}
