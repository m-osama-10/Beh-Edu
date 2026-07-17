"use client";

import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { CERTIFICATES, formatRelativeTime } from "@/data/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Award, Download, Calendar, User, BookOpen } from "lucide-react";
import { toast } from "sonner";

export function CertificatesPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { user } = useAuthStore();

  if (!user) {
    navigate("login");
    return null;
  }

  const userCerts = CERTIFICATES.filter((c) => c.userId === "u-student-1");

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">شهاداتي ({userCerts.length})</h1>
        <p className="text-sm text-muted-foreground">
          الشهادات المعتمدة التي حصلت عليها عند إتمام الكورسات بنجاح
        </p>
      </div>

      {userCerts.length === 0 ? (
        <EmptyState
          icon={Award}
          title="لا توجد شهادات بعد"
          description="أكمل كورساً بنجاح للحصول على شهادة معتمدة. ستظهر جميع شهاداتك هنا بمجرد حصولك عليها. الشهادات قابلة للتحميل ومشاركتها مع المؤسسات التعليمية وأولياء الأمور."
          actionLabel="تصفح الكورسات"
          onAction={() => navigate("courses")}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {userCerts.map((cert) => (
            <Card key={cert.id} className="card-hover overflow-hidden">
              <div className="bg-gold-gradient h-2" />
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-gradient">
                    <Award className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">شهادة إتمام</h3>
                    <p className="text-xs text-muted-foreground">بكالوريا بيه</p>
                  </div>
                </div>

                <h2 className="mb-2 text-lg font-bold text-foreground">{cert.courseTitle}</h2>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>الطالب: <span className="font-bold text-foreground">{cert.studentName}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>المدرس: <span className="font-bold text-foreground">{cert.teacherName}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>تاريخ الإصدار: <span className="font-bold text-foreground">{new Date(cert.issuedAt).toLocaleDateString("ar-EG")}</span></span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-2xl font-extrabold text-primary">{cert.finalScore}%</div>
                    <div className="text-[10px] text-muted-foreground">النتيجة النهائية</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <div className="text-xs font-bold text-foreground">{cert.certificateNumber}</div>
                    <div className="text-[10px] text-muted-foreground">رقم الشهادة</div>
                  </div>
                </div>

                <Button className="w-full bg-brand-gradient" onClick={() => toast.success("جاري تحميل الشهادة...")}>
                  <Download className="ms-1 h-4 w-4" />
                  تحميل الشهادة (PDF)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
