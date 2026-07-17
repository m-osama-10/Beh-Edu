"use client";

import { Card } from "@/components/ui/card";

export function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-extrabold text-foreground font-display mb-2">
        سياسة الخصوصية
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        آخر تحديث: يناير 2026
      </p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">1. مقدمة</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            بكالوريا بيه تحترم خصوصية مستخدميها وتلتزم بحماية بياناتهم الشخصية.
            توضّح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا للمعلومات التي
            تقدّمها لنا عند استخدام منصتنا. باستخدامك للمنصة فإنك توافق على
            الممارسات الموضّحة في هذه السياسة.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">2. المعلومات التي نجمعها</h2>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>نجمع نوعين رئيسيين من المعلومات:</p>
            <ul className="list-disc list-inside space-y-1.5 pe-4">
              <li>
                <strong className="text-foreground">المعلومات الشخصية:</strong> الاسم،
                البريد الإلكتروني، رقم الهاتف، الصف الدراسي، اسم المدرسة.
              </li>
              <li>
                <strong className="text-foreground">معلومات الاستخدام:</strong> سجل
                المشاهدة، تقدمك في الكورسات، تفضيلات الجودة، استهلاك البيانات،
                نوع الجهاز والمتصفح.
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">3. كيف نستخدم معلوماتك</h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>نستخدم معلوماتك للأغراض التالية:</p>
            <ul className="list-disc list-inside space-y-1.5 pe-4">
              <li>تقديم وتحسين خدماتنا التعليمية.</li>
              <li>تتبع تقدمك في الكورسات وإصدار الشهادات.</li>
              <li>معالجة المدفوعات وإدارة الاشتراكات.</li>
              <li>إرسال إشعارات حول الكورسات الجديدة والتحديثات.</li>
              <li>حماية المحتوى التعليمي من القرصنة عبر العلامات المائية.</li>
              <li>تحليل استخدام المنصة لتحسين تجربة المستخدم.</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">4. حماية الفيديوهات</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            جميع الفيديوهات على منصتنا محمية بتقنية تشفير HLS مع توقيع رقمي
            للروابط. كما نضيف علامة مائية باسم الطالب وبريده الإلكتروني على كل
            فيديو لمنع التسريب. يُمنع منعاً باتاً تصوير الشاشة أو محاولة تحميل
            الفيديوهات، وأي مخالفة تعرض صاحبها للحظر الفوري والملاحقة القانونية.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">5. مشاركة المعلومات</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            لا نبيع أو نؤجر بياناتك الشخصية لأي طرف ثالث. قد نشارك معلومات محدودة
            مع مزوّدي خدمات الدفع (مثل فودافون كاش وإنستاباي) لمعالجة المعاملات
            فقط. نلتزم بالتعاون مع السلطات القانونية عند تلقي أمر قضائي.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">6. حقوقك</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها في أي وقت.
            يمكنك أيضاً تعطيل وضع توفير الباقة أو تغيير تفضيلات الجودة من إعدادات
            حسابك. للطلب بحذف حسابك، تواصل معنا على{" "}
            <a href="mailto:privacy@bakaloriaa-bey.test" className="text-primary hover:underline" dir="ltr">
              privacy@bakaloriaa-bey.test
            </a>
            .
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">7. ملفات تعريف الارتباط (Cookies)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            نستخدم ملفات تعريف الارتباط لتذكّر تفضيلاتك (مثل الوضع الليلي،
            الجودة المفضلة) ولتحليل أداء المنصة. يمكنك تعطيلها من إعدادات
            متصفحك، لكن قد يؤثر ذلك على بعض الميزات.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-lg text-foreground mb-3">8. التواصل معنا</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            لأي استفسار حول سياسة الخصوصية، يرجى التواصل معنا عبر:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>البريد: <a href="mailto:support@bakaloriaa-bey.test" className="text-primary hover:underline" dir="ltr">support@bakaloriaa-bey.test</a></li>
            <li>الهاتف: <span dir="ltr">+20 100 123 4567</span></li>
            <li>العنوان: القاهرة، جمهورية مصر العربية</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
