"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore, useWatchProgressStore, useEnrolledStore } from "@/store/app-stores";
import { ProtectedVideoPlayer } from "@/components/video/protected-video-player";
import { DataSaverBadge, ProtectedContentBadge } from "@/components/shared/data-saver-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  FileText,
  Download,
  HelpCircle,
  Check,
  X,
  Award,
  Leaf,
  Wifi,
  TrendingDown,
  ListChecks,
  ScrollText,
} from "lucide-react";
import {
  getCourseById,
  formatDuration,
  formatPrice,
} from "@/data/mock-data";
import { toast } from "sonner";

export function WatchPage() {
  const route = useRouterStore((s) => s.route);
  const navigate = useRouterStore((s) => s.navigate);
  const goBack = useRouterStore((s) => s.goBack);
  const { user } = useAuthStore();
  const { dataSaverMode, toggleDataSaver } = useSettingsStore();
  const { progress, update, markComplete } = useWatchProgressStore();
  const isEnrolled = useEnrolledStore((s) => s.isEnrolled(route.params?.courseId ?? ""));

  const courseId = route.params?.courseId ?? "";
  const lessonId = route.params?.lessonId ?? "";
  const course = getCourseById(courseId);

  const [activeTab, setActiveTab] = useState("overview");
  const [watchedMB, setWatchedMB] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Find current lesson
  const currentLesson = (() => {
    if (!course) return null;
    for (const section of course.sections) {
      const lesson = section.lessons.find((l) => l.id === lessonId);
      if (lesson) return { ...lesson, section };
    }
    return null;
  })();

  // Find next & previous lessons
  const { nextLesson, prevLesson } = (() => {
    if (!course || !currentLesson) return { nextLesson: null, prevLesson: null };
    const allLessons = course.sections.flatMap((s) =>
      s.lessons.map((l) => ({ ...l, sectionId: s.id, sectionTitle: s.title })),
    );
    const idx = allLessons.findIndex((l) => l.id === lessonId);
    return {
      nextLesson: idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
      prevLesson: idx > 0 ? allLessons[idx - 1] : null,
    };
  })();

  // Track progress
  useEffect(() => {
    if (currentLesson) {
      const existing = progress[currentLesson.id];
      setWatchedMB(existing?.watchedMB ?? 0);
    }
  }, [currentLesson, progress]);

  if (!course || !currentLesson) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">الدرس غير موجود</h1>
        <Button className="mt-4" onClick={() => navigate("courses")}>
          العودة للكورسات
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">يجب تسجيل الدخول أولاً</h1>
        <p className="mt-2 text-muted-foreground">سجل دخولك لمشاهدة هذا الدرس</p>
        <Button className="mt-4" onClick={() => navigate("login")}>
          تسجيل الدخول
        </Button>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">هذا المحتوى للمشتركين فقط</h1>
        <p className="mt-2 text-muted-foreground">
          يجب الاشتراك في الكورس لمشاهدة هذا الدرس
        </p>
        <Button
          className="mt-4 bg-brand-gradient"
          onClick={() => navigate("course-detail", { courseId })}
        >
          الاشتراك الآن
        </Button>
      </div>
    );
  }

  const lessonProgress = progress[currentLesson.id];
  const totalLessons = course.totalLessons;
  const completedLessons = course.sections.flatMap((s) => s.lessons).filter((l) => progress[l.id]?.completed).length;
  const courseProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const handleProgress = (position: number, mb: number) => {
    setWatchedMB(mb);
    update(currentLesson.id, position, currentLesson.duration, mb);
  };

  const handleComplete = () => {
    if (!lessonProgress?.completed) {
      markComplete(currentLesson.id);
      toast.success("🎉 أحسنت! لقد أكملت هذا الدرس بنجاح");
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate("watch", { courseId, lessonId: nextLesson.id });
      setWatchedMB(0);
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const quiz = currentLesson.quizzes[0];
    if (!quiz) return;
    let correct = 0;
    let total = 0;
    quiz.questions.forEach((q) => {
      total += q.points;
      const selected = quizAnswers[q.id];
      const correctAns = q.answers.find((a) => a.id === selected);
      if (correctAns?.isCorrect) correct += q.points;
    });
    const pct = Math.round((correct / total) * 100);
    if (pct >= quiz.passingScore) {
      toast.success(`🎉 نجحت في الاختبار! نسبتك: ${pct}%`);
    } else {
      toast.error(`نسبتك: ${pct}% - تحتاج إلى ${quiz.passingScore}% للنجاح`);
    }
  };

  const estimatedDataMB = Math.round(currentLesson.duration / 60 * (dataSaverMode ? 2 : 3.5));

  return (
    <div className="container mx-auto px-2 py-3 md:px-4 md:py-6">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <button onClick={goBack} className="flex items-center gap-1 hover:text-primary">
          <ChevronRight className="h-3 w-3" />
          رجوع
        </button>
        <span>•</span>
        <button onClick={() => navigate("course-detail", { courseId })} className="hover:text-primary">
          {course.title}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main video player + content */}
        <div className="lg:col-span-2">
          {/* Video player */}
          <ProtectedVideoPlayer
            src={currentLesson.video?.hlsPlaylistUrl ?? "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
            title={currentLesson.title}
            studentName={user.name}
            studentEmail={user.email}
            lessonDuration={currentLesson.duration}
            initialPosition={lessonProgress?.position ?? 0}
            dataSaverMode={dataSaverMode}
            onProgress={handleProgress}
            onComplete={handleComplete}
          />

          {/* Lesson info */}
          <div className="mt-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{currentLesson.section.title}</Badge>
              <ProtectedContentBadge />
              {lessonProgress?.completed && (
                <Badge className="bg-emerald-600 text-white">
                  <CheckCircle2 className="ms-1 h-3 w-3" />
                  مكتمل
                </Badge>
              )}
            </div>
            <h1 className="mb-2 text-lg font-bold text-foreground sm:text-xl md:text-2xl">
              {currentLesson.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(currentLesson.duration)}
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                ~{estimatedDataMB} MB
              </span>
              <span className="flex items-center gap-1">
                <Wifi className="h-3.5 w-3.5" />
                {dataSaverMode ? "وضع توفير الباقة" : "جودة عادية"}
              </span>
            </div>
          </div>

          {/* Data consumption tracker */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <TrendingDown className="h-4 w-4 text-emerald-500" />
                  تتبع استهلاك البيانات
                </h3>
                <Switch checked={dataSaverMode} onCheckedChange={toggleDataSaver} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {watchedMB.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">ميجابايت مستهلكة</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {estimatedDataMB}
                  </div>
                  <div className="text-[10px] text-muted-foreground">الإجمالي المتوقع</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {Math.max(0, estimatedDataMB - Math.round(watchedMB))}
                  </div>
                  <div className="text-[10px] text-muted-foreground">المتبقي</div>
                </div>
              </div>
              <Progress
                value={Math.min(100, (watchedMB / estimatedDataMB) * 100)}
                className="mt-3 h-2"
              />
              <p className="mt-2 text-[10px] text-muted-foreground">
                💡 {dataSaverMode
                  ? "وضع توفير الباقة مُفعّل - استهلاكك أقل بنسبة 60%"
                  : "فعّل وضع توفير الباقة لتقليل الاستهلاك بنسبة 60%"}
              </p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="resources">الموارد</TabsTrigger>
              <TabsTrigger value="quiz">الاختبارات</TabsTrigger>
              <TabsTrigger value="notes">ملاحظاتي</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3 font-bold text-foreground">عن هذا الدرس</h3>
                  <p className="text-sm leading-relaxed text-foreground">
                    {currentLesson.description ?? "في هذا الدرس سنتعلم المفاهيم الأساسية بشكل مبسط ومفصل، مع أمثلة عملية وتطبيقات متنوعة. شرح تفاعلي يضمن فهمك العميق للمحتوى وقدرتك على تطبيق ما تعلمته في حل المسائل والامتحانات."}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <Clock className="mx-auto mb-1 h-5 w-5 text-primary" />
                      <div className="text-xs font-bold">{formatDuration(currentLesson.duration)}</div>
                      <div className="text-[10px] text-muted-foreground">المدة</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <FileText className="mx-auto mb-1 h-5 w-5 text-primary" />
                      <div className="text-xs font-bold">{currentLesson.attachments.length}</div>
                      <div className="text-[10px] text-muted-foreground">مرفقات</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <HelpCircle className="mx-auto mb-1 h-5 w-5 text-primary" />
                      <div className="text-xs font-bold">{currentLesson.quizzes.length}</div>
                      <div className="text-[10px] text-muted-foreground">اختبارات</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <Award className="mx-auto mb-1 h-5 w-5 text-primary" />
                      <div className="text-xs font-bold">{currentLesson.quizzes.reduce((s, q) => s + q.questions.reduce((sum, qq) => sum + qq.points, 0), 0)}</div>
                      <div className="text-[10px] text-muted-foreground">نقاط</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="pt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3 font-bold text-foreground">الملفات والمرفقات</h3>
                  {currentLesson.attachments.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      <FileText className="mx-auto mb-2 h-10 w-10 opacity-40" />
                      لا توجد مرفقات لهذا الدرس
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentLesson.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-3 rounded-lg border p-3 transition hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm font-medium text-foreground">{att.fileName}</div>
                            <div className="text-xs text-muted-foreground">
                              {(att.fileSize / 1024 / 1024).toFixed(2)} MB • {att.fileType.toUpperCase()}
                            </div>
                          </div>
                          {att.isDownloadable ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.success("بدأ التحميل...")}
                            >
                              <Download className="ms-1 h-4 w-4" />
                              تحميل
                            </Button>
                          ) : (
                            <Badge variant="secondary">
                              <Lock className="ms-1 h-3 w-3" />
                              للقراءة فقط
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz" className="pt-4">
              <Card>
                <CardContent className="p-4">
                  {currentLesson.quizzes.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      <HelpCircle className="mx-auto mb-2 h-10 w-10 opacity-40" />
                      لا توجد اختبارات لهذا الدرس
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                          <ListChecks className="h-5 w-5 text-primary" />
                          {currentLesson.quizzes[0].title}
                        </h3>
                        <Badge variant="secondary">
                          {currentLesson.quizzes[0].questions.length} أسئلة
                        </Badge>
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {currentLesson.quizzes[0].description}
                      </p>

                      <div className="space-y-4">
                        {currentLesson.quizzes[0].questions.map((q, idx) => (
                          <div key={q.id} className="rounded-lg border p-3">
                            <div className="mb-3 flex items-start gap-2">
                              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-gradient-soft text-xs font-bold text-primary">
                                {idx + 1}
                              </span>
                              <p className="text-sm font-medium text-foreground">{q.text}</p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {q.answers.map((a) => {
                                const isSelected = quizAnswers[q.id] === a.id;
                                const showCorrect = quizSubmitted && a.isCorrect;
                                const showWrong = quizSubmitted && isSelected && !a.isCorrect;
                                return (
                                  <button
                                    key={a.id}
                                    onClick={() => !quizSubmitted && setQuizAnswers((p) => ({ ...p, [q.id]: a.id }))}
                                    disabled={quizSubmitted}
                                    className={`flex items-center gap-2 rounded-lg border p-2 text-right text-sm transition ${
                                      showCorrect
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                                        : showWrong
                                          ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                                          : isSelected
                                            ? "border-primary bg-primary/5"
                                            : "hover:bg-muted/50"
                                    }`}
                                  >
                                    {showCorrect ? (
                                      <Check className="h-4 w-4 text-emerald-600" />
                                    ) : showWrong ? (
                                      <X className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <div className={`h-4 w-4 rounded-full border-2 ${isSelected ? "border-primary" : "border-muted-foreground/30"}`} />
                                    )}
                                    <span className="text-foreground">{a.text}</span>
                                  </button>
                                );
                              })}
                            </div>
                            {quizSubmitted && q.explanation && (
                              <p className="mt-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                                💡 {q.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <Button
                          className="mt-4 w-full bg-brand-gradient"
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length < currentLesson.quizzes[0].questions.length}
                        >
                          تسليم الاختبار
                        </Button>
                      ) : (
                        <Button
                          className="mt-4 w-full"
                          variant="outline"
                          onClick={() => {
                            setQuizSubmitted(false);
                            setQuizAnswers({});
                          }}
                        >
                          إعادة المحاولة
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="pt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-foreground">
                    <ScrollText className="h-5 w-5 text-primary" />
                    ملاحظاتي الشخصية
                  </h3>
                  <textarea
                    className="min-h-[200px] w-full rounded-lg border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="اكتب ملاحظاتك على هذا الدرس هنا..."
                    onChange={(e) => toast.info("سيتم حفظ ملاحظاتك تلقائياً عند الكتابة")}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    💡 تُحفظ ملاحظاتك بشكل آمن ويمكنك الرجوع إليها في أي وقت
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation buttons */}
          <div className="mt-6 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => prevLesson && navigate("watch", { courseId, lessonId: prevLesson.id })}
              disabled={!prevLesson}
            >
              <ChevronRight className="ms-1 h-4 w-4" />
              الدرس السابق
            </Button>
            <Button
              className="bg-brand-gradient"
              onClick={() => {
                handleComplete();
                handleNextLesson();
              }}
              disabled={!nextLesson}
            >
              {lessonProgress?.completed ? "الدرس التالي" : "إتمام ومتابعة"}
              <ChevronLeft className="ms-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar: Lessons list */}
        <aside className="lg:sticky lg:top-20 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Card>
            <CardContent className="p-4">
              {/* Course title + progress */}
              <div className="mb-4">
                <h3 className="line-clamp-2 text-sm font-bold text-foreground">{course.title}</h3>
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>التقدم: {completedLessons}/{totalLessons} درس</span>
                    <span>{Math.round(courseProgress)}%</span>
                  </div>
                  <Progress value={courseProgress} className="h-1.5" />
                </div>
              </div>

              {/* Sections & lessons */}
              <Accordion
                type="multiple"
                defaultValue={[currentLesson.section.id]}
                className="space-y-1"
              >
                {course.sections.map((section) => (
                  <AccordionItem key={section.id} value={section.id} className="border-0">
                    <AccordionTrigger className="hover:no-underline px-2 py-2 text-sm">
                      <div className="flex flex-1 items-center justify-between pe-2 text-right">
                        <span className="font-bold text-foreground">{section.title}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {section.lessons.filter((l) => progress[l.id]?.completed).length}/{section.lessons.length}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <div className="space-y-0.5">
                        {section.lessons.map((lesson) => {
                          const isCurrent = lesson.id === currentLesson.id;
                          const isCompleted = progress[lesson.id]?.completed;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => navigate("watch", { courseId, lessonId: lesson.id })}
                              className={`flex w-full items-center gap-2 rounded-lg p-2 text-right transition ${
                                isCurrent
                                  ? "bg-primary/10 ring-1 ring-primary"
                                  : "hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                                {isCompleted ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : isCurrent ? (
                                  <PlayCircle className="h-5 w-5 text-primary" />
                                ) : (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30 text-[10px] text-muted-foreground">
                                    {lesson.sortOrder}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`truncate text-xs ${isCurrent ? "font-bold text-primary" : "text-foreground"}`}>
                                  {lesson.title}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {formatDuration(lesson.duration)}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
