"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouterStore } from "@/store/router-store";
import { toast } from "sonner";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});
type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    toast.success("تم إرسال رابط الاستعادة", {
      description: `تحقق من بريدك: ${data.email}`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <button
            onClick={() => navigate("home")}
            className="inline-flex items-center justify-center mb-3"
            aria-label="العودة للرئيسية"
          >
            <Image
              src="/logo.png"
              alt="بكالوريا بيه"
              width={56}
              height={56}
              className="size-14 object-contain"
            />
          </button>
          <h1 className="text-2xl font-extrabold text-foreground font-display">
            استعادة كلمة المرور
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور.
          </p>
        </div>

        <Card className="border-border/70">
          <CardContent className="pt-6">
            {sent ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto size-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                  <CheckCircle2 className="size-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    تم إرسال الرابط
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    تحقق من بريدك الإلكتروني. الرابط سينتهي خلال 30 دقيقة. إذا
                    لم تصلك رسالة، تحقق من مجلد الرسائل غير المرغوب فيها.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("login")}
                >
                  <ArrowRight className="size-4 ml-2" />
                  العودة لتسجيل الدخول
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="ps-3 pe-9"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-accent">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-gradient font-bold h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-5">
          تذكرت كلمة المرور؟{" "}
          <button
            onClick={() => navigate("login")}
            className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            تسجيل الدخول
            <ArrowLeft className="size-3.5" />
          </button>
        </p>
      </motion.div>
    </div>
  );
}
