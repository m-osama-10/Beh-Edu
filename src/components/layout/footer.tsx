"use client";

import { useRouterStore } from "@/store/router-store";
import { SUBJECTS } from "@/data/mock-data";
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
  const navigate = useRouterStore((s) => s.navigate);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم اشتراكك في النشرة البريدية بنجاح!");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="بكالوريا بيه" className="h-10 w-10 rounded-lg" />
              <div>
                <div className="text-base font-extrabold text-foreground">
                  بكالوريا <span className="text-accent">بيه</span>
                </div>
                <div className="text-[10px] text-muted-foreground">منصة التعليم المصرية</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              منصة تعليمية مصرية متكاملة لطلاب الثانوية العامة والبكالوريا. نوفر كورسات أونلاين بفيديوهات محمية وبتقنية توفير الباقة لتقليل استهلاك الإنترنت. هدفنا توفير تعليم عالي الجودة بأسعار مناسبة لكل طلاب مصر.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Youtube" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Telegram" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition hover:bg-primary hover:text-primary-foreground">
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate("home")} className="text-muted-foreground transition hover:text-primary">
                  الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => navigate("courses")} className="text-muted-foreground transition hover:text-primary">
                  جميع الكورسات
                </button>
              </li>
              <li>
                <button onClick={() => navigate("courses", { view: "teachers" })} className="text-muted-foreground transition hover:text-primary">
                  المدرسون
                </button>
              </li>
              <li>
                <button onClick={() => navigate("about")} className="text-muted-foreground transition hover:text-primary">
                  من نحن
                </button>
              </li>
              <li>
                <button onClick={() => navigate("register", { role: "TEACHER" })} className="text-muted-foreground transition hover:text-primary">
                  انضم كمدرس
                </button>
              </li>
              <li>
                <button onClick={() => navigate("privacy")} className="text-muted-foreground transition hover:text-primary">
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button onClick={() => navigate("terms")} className="text-muted-foreground transition hover:text-primary">
                  الشروط والأحكام
                </button>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">المواد الدراسية</h4>
            <ul className="space-y-2 text-sm">
              {SUBJECTS.slice(0, 6).map((subject) => (
                <li key={subject.id}>
                  <button
                    onClick={() => navigate("courses", { subjectId: subject.id })}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    {subject.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="mb-4 font-bold text-foreground">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@bakaloriaa-bey.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>القاهرة، جمهورية مصر العربية</span>
              </li>
            </ul>

            <h5 className="mt-6 mb-2 text-sm font-bold text-foreground">النشرة البريدية</h5>
            <form onSubmit={handleNewsletter} className="flex gap-1">
              <Input
                type="email"
                required
                placeholder="بريدك الإلكتروني"
                className="text-sm"
              />
              <Button type="submit" size="sm" className="bg-brand-gradient px-3">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t pt-6">
          <span className="text-xs text-muted-foreground">طرق الدفع المدعومة:</span>
          {["Vodafone Cash", "InstaPay", "Fawry", "Etisalat Cash", "Orange Cash", "Visa", "Mastercard"].map((method) => (
            <span
              key={method}
              className="rounded-md border bg-muted px-2 py-1 text-[10px] font-medium text-foreground"
            >
              {method}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 بكالوريا بيه - جميع الحقوق محفوظة. صُنع بكل حب في مصر 🇪🇬
          </p>
        </div>
      </div>
    </footer>
  );
}
