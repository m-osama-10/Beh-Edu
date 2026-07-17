"use client";

import { useState } from "react";
import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff, User, Phone, GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { GRADES } from "@/data/mock-data";
import { toast } from "sonner";

export function RegisterPage() {
  const route = useRouterStore((s) => s.route);
  const navigate = useRouterStore((s) => s.navigate);
  const { register } = useAuthStore();
  const [role, setRole] = useState<"STUDENT" | "TEACHER">(route.params?.role === "TEACHER" ? "TEACHER" : "STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (!acceptTerms) {
      toast.error("يجب الموافقة على الشروط والأحكام");
      return;
    }
    setIsLoading(true);
    const result = await register({ name, email, password, role });
    setIsLoading(false);
    if (result.success) {
      toast.success(role === "TEACHER" ? "تم إنشاء حسابك! سيتم مراجعة طلبك من الإدارة" : "أهلاً بك في بكالوريا بيه! 🎉");
      navigate(role === "TEACHER" ? "teacher-dashboard" : "student-dashboard");
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient">
            { }
            <img src="/logo.png" alt="بكالوريا بيه" className="h-12 w-12 rounded-lg" />
          </div>
          <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>انضم إلى آلاف الطلاب والمدرسين في بكالوريا بيه</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Role selector */}
          <div className="mb-4">
            <Label className="mb-2 block">أنا:</Label>
            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as "STUDENT" | "TEACHER")}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="role-student"
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                  role === "STUDENT" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="STUDENT" id="role-student" className="sr-only" />
                <User className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold">طالب</span>
                <span className="text-[10px] text-muted-foreground text-center">أتعملم من أفضل المدرسين</span>
              </Label>
              <Label
                htmlFor="role-teacher"
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                  role === "TEACHER" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="TEACHER" id="role-teacher" className="sr-only" />
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-sm font-bold">مدرس</span>
                <span className="text-[10px] text-muted-foreground text-center">أنشئ كورساتي وحقق دخلاً</span>
              </Label>
            </RadioGroup>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "TEACHER" ? "أ. محمد عبد الله" : "أحمد محمود"}
                  className="pr-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0100 123 4567"
                    className="pr-9"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {role === "STUDENT" && (
              <div className="space-y-2">
                <Label htmlFor="grade">الصف الدراسي</Label>
                <Select value={gradeId} onValueChange={setGradeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصف الدراسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="px-9"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="px-9"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(v) => setAcceptTerms(v === true)}
              />
              <Label htmlFor="terms" className="text-xs cursor-pointer leading-relaxed">
                أوافق على{" "}
                <button type="button" onClick={() => navigate("terms")} className="text-primary hover:underline">الشروط والأحكام</button>
                {" "}و{" "}
                <button type="button" onClick={() => navigate("privacy")} className="text-primary hover:underline">سياسة الخصوصية</button>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-brand-gradient" disabled={isLoading}>
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              {!isLoading && <ArrowLeft className="ms-2 h-4 w-4" />}
            </Button>
          </form>

          {role === "TEACHER" && (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <CheckCircle2 className="ms-1 inline h-3 w-3" />
                سيتم مراجعة طلبك من إدارة المنصة خلال 24-48 ساعة قبل تفعيل حسابك كمدرس معتمد.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <button onClick={() => navigate("login")} className="font-bold text-primary hover:underline">
              تسجيل الدخول
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
