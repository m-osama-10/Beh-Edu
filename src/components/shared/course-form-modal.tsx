"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  SUBJECTS,
  GRADES,
} from "@/data/mock-data";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  GripVertical,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SectionData {
  id: string;
  title: string;
  description: string;
  lessons: LessonData[];
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  isPreview: boolean;
  uploadProgress: number;
  hasAttachment: boolean;
}

const STEPS = [
  { id: 1, label: "معلومات الكورس" },
  { id: 2, label: "الغلاف والسعر" },
  { id: 3, label: "الأقسام" },
  { id: 4, label: "الدروس" },
  { id: 5, label: "المراجعة" },
];

export function CourseFormModal({ open, onOpenChange }: CourseFormModalProps) {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  // Step 1 data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [level, setLevel] = useState("");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [language, setLanguage] = useState("العربية");

  // Step 2 data
  const [coverUrl, setCoverUrl] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountUntil, setDiscountUntil] = useState("");

  // Step 3 data
  const [sections, setSections] = useState<SectionData[]>([
    {
      id: "sec-1",
      title: "الوحدة 1: المقدمة",
      description: "",
      lessons: [],
    },
  ]);

  // Step 4 data (current section being edited)
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setDescription("");
    setSubjectId("");
    setGradeId("");
    setLevel("");
    setAcademicYear("2025/2026");
    setLanguage("العربية");
    setCoverUrl("");
    setPrice("");
    setDiscountPrice("");
    setDiscountUntil("");
    setSections([{ id: "sec-1", title: "الوحدة 1: المقدمة", description: "", lessons: [] }]);
    setActiveSectionIdx(0);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim() || !description.trim() || !subjectId || !gradeId || !level) {
        toast.error("يرجى تعبئة جميع الحقول المطلوبة");
        return;
      }
    }
    if (step === 2) {
      if (!price.trim()) {
        toast.error("يرجى تحديد سعر الكورس");
        return;
      }
    }
    if (step === 3) {
      if (sections.length === 0 || !sections[0].title.trim()) {
        toast.error("أضف قسماً واحداً على الأقل بعنوان");
        return;
      }
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: `sec-${prev.length + 1}-${Date.now()}`,
        title: `الوحدة ${prev.length + 1}`,
        description: "",
        lessons: [],
      },
    ]);
  };

  const updateSection = (idx: number, updates: Partial<SectionData>) => {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, ...updates } : s)));
  };

  const removeSection = (idx: number) => {
    if (sections.length === 1) {
      toast.error("يجب أن يحتوي الكورس على قسم واحد على الأقل");
      return;
    }
    setSections((prev) => prev.filter((_, i) => i !== idx));
    if (activeSectionIdx >= idx) setActiveSectionIdx(Math.max(0, activeSectionIdx - 1));
  };

  const addLesson = (sectionIdx: number) => {
    const newLesson: LessonData = {
      id: `l-${Date.now()}`,
      title: "درس جديد",
      description: "",
      isPreview: false,
      uploadProgress: 0,
      hasAttachment: false,
    };
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx ? { ...s, lessons: [...s.lessons, newLesson] } : s
      )
    );

    // Simulate video upload + transcoding
    simulateUpload(sectionIdx, newLesson.id);
  };

  const simulateUpload = (sectionIdx: number, lessonId: string) => {
    const interval = setInterval(() => {
      setSections((prev) =>
        prev.map((s, i) =>
          i === sectionIdx
            ? {
                ...s,
                lessons: s.lessons.map((l) =>
                  l.id === lessonId
                    ? { ...l, uploadProgress: Math.min(100, l.uploadProgress + 10) }
                    : l
                ),
              }
            : s
        )
      );
    }, 400);
    setTimeout(() => clearInterval(interval), 5000);
  };

  const updateLesson = (sectionIdx: number, lessonId: string, updates: Partial<LessonData>) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx
          ? { ...s, lessons: s.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
          : s
      )
    );
  };

  const removeLesson = (sectionIdx: number, lessonId: string) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIdx ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s
      )
    );
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast.success("تم نشر الكورس بنجاح! 🎉", {
        description: "الكورس الآن متاح للطلاب.",
      });
      onOpenChange(false);
      resetForm();
    }, 2000);
  };

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setTimeout(resetForm, 300); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-xl font-bold font-display">
            إنشاء كورس جديد
          </DialogTitle>
          <DialogDescription>
            اتبع الخطوات لإنشاء كورسك. سيتم تحويل الفيديوهات تلقائياً إلى HLS 480p و720p مع تشفير.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                      step === s.id
                        ? "bg-primary text-primary-foreground"
                        : step > s.id
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step > s.id ? <CheckCircle2 className="size-4" /> : s.id}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] hidden sm:block",
                      step >= s.id ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2",
                      step > s.id ? "bg-emerald-600" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Course info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">عنوان الكورس *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: الرياضيات التطبيقية للصف الثالث الثانوي"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">وصف الكورس *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً تفصيلياً لما سيتعلمه الطالب في هذا الكورس..."
                  rows={4}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>المادة *</Label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
                    <SelectTrigger><SelectValue placeholder="اختر المادة" /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>الصف *</Label>
                  <Select value={gradeId} onValueChange={setGradeId}>
                    <SelectTrigger><SelectValue placeholder="اختر الصف" /></SelectTrigger>
                    <SelectContent>
                      {GRADES.map((g) => (
                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>المستوى *</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger><SelectValue placeholder="اختر المستوى" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">مبتدئ</SelectItem>
                      <SelectItem value="INTERMEDIATE">متوسط</SelectItem>
                      <SelectItem value="ADVANCED">متقدم</SelectItem>
                      <SelectItem value="ALL_LEVELS">كل المستويات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>السنة الدراسية</Label>
                  <Input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>لغة الكورس</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="العربية">العربية</SelectItem>
                      <SelectItem value="الإنجليزية">الإنجليزية</SelectItem>
                      <SelectItem value="ثنائي اللغة">ثنائي اللغة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Cover & pricing */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label>صورة الغلاف</Label>
                <div className="flex items-center gap-4">
                  <div className="relative size-24 rounded-lg overflow-hidden border-2 border-dashed border-border bg-muted/40 flex items-center justify-center shrink-0">
                    {coverUrl ? (
                      <Image src={coverUrl} alt="غلاف" fill sizes="96px" className="object-cover" unoptimized />
                    ) : (
                      <Upload className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="ألصق رابط صورة الغلاف هنا..."
                    />
                    <p className="text-xs text-muted-foreground">
                      يُفضّل صورة بأبعاد 1280x720 (16:9) وجودة عالية.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">السعر (ج.م) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 499"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="discount">سعر الخصم (اختياري)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="مثال: 349"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="discountUntil">ينتهي العرض في</Label>
                  <Input
                    id="discountUntil"
                    type="date"
                    value={discountUntil}
                    onChange={(e) => setDiscountUntil(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
                💡 عند تحديد سعر خصم، سيتم عرض شارة "خصم" بنسبة مئوية على الكورس تلقائياً.
              </div>
            </div>
          )}

          {/* Step 3: Sections */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">الأقسام</h3>
                <Button size="sm" variant="outline" onClick={addSection}>
                  <Plus className="size-4 ml-1" />
                  إضافة قسم
                </Button>
              </div>
              <div className="space-y-3">
                {sections.map((sec, idx) => (
                  <div key={sec.id} className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start gap-2 mb-3">
                      <GripVertical className="size-4 text-muted-foreground mt-3 cursor-grab" />
                      <div className="flex-1 space-y-2">
                        <Input
                          value={sec.title}
                          onChange={(e) => updateSection(idx, { title: e.target.value })}
                          placeholder="عنوان القسم"
                          className="font-semibold"
                        />
                        <Textarea
                          value={sec.description}
                          onChange={(e) => updateSection(idx, { description: e.target.value })}
                          placeholder="وصف القسم (اختياري)"
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-accent"
                        onClick={() => removeSection(idx)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground me-6">
                      {sec.lessons.length} دروس
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Lessons */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIdx(idx)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                      activeSectionIdx === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/60"
                    )}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">
                  دروس {sections[activeSectionIdx]?.title}
                </h3>
                <Button size="sm" variant="outline" onClick={() => addLesson(activeSectionIdx)}>
                  <Plus className="size-4 ml-1" />
                  إضافة درس
                </Button>
              </div>

              <div className="space-y-3">
                {sections[activeSectionIdx]?.lessons.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
                    لا توجد دروس في هذا القسم. اضغط "إضافة درس" لإنشاء أول درس.
                  </div>
                )}
                {sections[activeSectionIdx]?.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 rounded-lg border border-border bg-card space-y-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="size-4 text-muted-foreground mt-3 cursor-grab" />
                      <div className="flex-1 space-y-2">
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(activeSectionIdx, lesson.id, { title: e.target.value })}
                          placeholder="عنوان الدرس"
                          className="font-semibold"
                        />
                        <Textarea
                          value={lesson.description}
                          onChange={(e) => updateLesson(activeSectionIdx, lesson.id, { description: e.target.value })}
                          placeholder="وصف الدرس (اختياري)"
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-accent"
                        onClick={() => removeLesson(activeSectionIdx, lesson.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    {/* Video upload */}
                    <div className="ps-6">
                      {lesson.uploadProgress === 0 ? (
                        <button
                          className="w-full p-3 rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-muted-foreground flex items-center justify-center gap-2"
                          onClick={() => simulateUpload(activeSectionIdx, lesson.id)}
                        >
                          <Upload className="size-4" />
                          اضغط لرفع فيديو الدرس
                        </button>
                      ) : lesson.uploadProgress < 100 ? (
                        <div className="p-3 rounded-lg bg-muted/40">
                          <div className="flex items-center gap-2 mb-2">
                            <Loader2 className="size-4 animate-spin text-primary" />
                            <span className="text-xs font-semibold text-foreground">
                              جارٍ المعالجة (Transcode → HLS → Encrypt)
                            </span>
                          </div>
                          <Progress value={lesson.uploadProgress} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {lesson.uploadProgress}% - تحويل 480p و720p
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                          <Video className="size-4 text-emerald-600" />
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                            تم رفع الفيديو ومعالجته بنجاح
                          </span>
                          <Badge variant="secondary" className="text-[10px] mr-auto">
                            HLS 480p + 720p
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lesson.isPreview}
                            onChange={(e) => updateLesson(activeSectionIdx, lesson.id, { isPreview: e.target.checked })}
                            className="size-3.5 accent-primary"
                          />
                          <Eye className="size-3.5 text-primary" />
                          معاينة مجانية
                        </label>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lesson.hasAttachment}
                            onChange={(e) => updateLesson(activeSectionIdx, lesson.id, { hasAttachment: e.target.checked })}
                            className="size-3.5 accent-primary"
                          />
                          <FileText className="size-3.5 text-primary" />
                          مرفق PDF
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-foreground">مراجعة الكورس</h3>

              {coverUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={coverUrl} alt="غلاف" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" unoptimized />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">العنوان</p>
                  <p className="font-semibold text-foreground">{title || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">السعر</p>
                  <p className="font-semibold text-foreground">
                    {price} ج.م {discountPrice && `(بخصم: ${discountPrice} ج.م)`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">المادة</p>
                  <p className="font-semibold text-foreground">
                    {SUBJECTS.find((s) => s.id === subjectId)?.name ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">الصف</p>
                  <p className="font-semibold text-foreground">
                    {GRADES.find((g) => g.id === gradeId)?.name ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">المستوى</p>
                  <p className="font-semibold text-foreground">
                    {level === "BEGINNER" ? "مبتدئ" : level === "INTERMEDIATE" ? "متوسط" : level === "ADVANCED" ? "متقدم" : "كل المستويات"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">عدد الأقسام / الدروس</p>
                  <p className="font-semibold text-foreground">
                    {sections.length} أقسام • {totalLessons} دروس
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-brand-gradient-soft border-primary/30">
                <p className="text-sm text-foreground leading-relaxed">
                  ✅ بمجرد النشر، سيظهر الكورس في صفحة الكورسات ويمكن للطلاب الاشتراك فيه.
                  سيتم تحويل جميع الفيديوهات تلقائياً إلى HLS 480p و720p مع تشفير وعلامة مائية.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-4 border-t border-border shrink-0">
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ChevronRight className="size-4 ml-1" />
              السابق
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">
                الخطوة {step} من {STEPS.length}
              </span>
              {step < 5 ? (
                <Button onClick={handleNext} className="bg-brand-gradient">
                  التالي
                  <ChevronLeft className="size-4 mr-1" />
                </Button>
              ) : (
                <Button onClick={handlePublish} disabled={isPublishing} className="bg-emerald-600 hover:bg-emerald-700">
                  {isPublishing ? (
                    <>
                      <Loader2 className="size-4 ml-2 animate-spin" />
                      جارٍ النشر...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4 ml-2" />
                      نشر الكورس
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

void ArrowLeft;
void ArrowRight;
