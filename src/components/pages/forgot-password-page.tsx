"use client";

import { useState } from "react";
import { useRouterStore } from "@/store/router-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Mail, ArrowRight, CheckCircle2, MailCheck } from "lucide-react";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setIsLoading(false);
    toast.success("تم إرسال رابط الاستعادة إلى بريدك");
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
            <Mail className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-2xl">استعادة كلمة المرور</CardTitle>
          <CardDescription>
            {submitted
              ? "تم إرسال رابط الاستعادة"
              : "أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <MailCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="mb-2 text-sm text-foreground">
                  تم إرسال رابط استعادة كلمة المرور إلى:
                </p>
                <p className="font-bold text-primary" dir="ltr">{email}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                تحقق من بريدك الإلكتروني (including spam folder). الرابط صالح لمدة ساعة واحدة فقط.
              </p>
              <Button className="w-full bg-brand-gradient" onClick={() => navigate("login")}>
                العودة لتسجيل الدخول
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="pr-9"
                    dir="ltr"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-brand-gradient" disabled={isLoading}>
                {isLoading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
                {!isLoading && <ArrowRight className="ms-2 h-4 w-4" />}
              </Button>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <CheckCircle2 className="ms-1 inline h-3 w-3 text-emerald-500" />
                  سنرسل لك تعليمات إعادة تعيين كلمة المرور على بريدك المسجل.
                </p>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <button onClick={() => navigate("login")} className="text-sm text-muted-foreground hover:text-primary">
            العودة لتسجيل الدخول
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
