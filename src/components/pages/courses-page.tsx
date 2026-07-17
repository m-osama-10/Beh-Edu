"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouterStore } from "@/store/router-store";
import { CourseCard } from "@/components/shared/course-card";
import { TeacherCard } from "@/components/shared/teacher-card";
import { EmptyState, CourseCardSkeleton } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  SlidersHorizontal,
  BookX,
  Users,
  Star,
  X,
} from "lucide-react";
import { SUBJECTS, GRADES, TEACHERS, COURSES, searchCourses, formatPrice } from "@/data/mock-data";

type SortOption = "newest" | "rating" | "price-low" | "popular";

export function CoursesPage() {
  const route = useRouterStore((s) => s.route);
  const navigate = useRouterStore((s) => s.navigate);

  const view = route.params?.view;
  const isTeachersView = view === "teachers";

  const initialSubjectId = route.params?.subjectId;
  const initialQuery = route.params?.q ?? "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialSubjectId ? [initialSubjectId] : [],
  );
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Sync from URL params
  useEffect(() => {
    if (route.params?.q) setSearchQuery(route.params.q);
    if (route.params?.subjectId) setSelectedSubjects([route.params.subjectId]);
  }, [route.params]);

  const filteredCourses = useMemo(() => {
    let results = searchCourses(searchQuery, {
      subjectId: selectedSubjects.length === 1 ? selectedSubjects[0] : undefined,
      gradeId: selectedGrade || undefined,
      level: selectedLevel || undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
    });

    // Multi-subject filter
    if (selectedSubjects.length > 1) {
      results = results.filter((c) => selectedSubjects.includes(c.subjectId));
    }

    // Sort
    switch (sortBy) {
      case "rating":
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        results = [...results].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case "popular":
        results = [...results].sort((a, b) => b.studentCount - a.studentCount);
        break;
      default:
        results = [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }, [searchQuery, selectedSubjects, selectedGrade, selectedLevel, priceRange, minRating, sortBy]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((s) => s !== subjectId) : [...prev, subjectId],
    );
  };

  const clearFilters = () => {
    setSelectedSubjects([]);
    setSelectedGrade("");
    setSelectedLevel("");
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSearchQuery("");
  };

  const activeFiltersCount =
    selectedSubjects.length +
    (selectedGrade ? 1 : 0) +
    (selectedLevel ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0);

  // Teachers view
  if (isTeachersView) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">مدرسونا المعتمدون</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            نخبة من أفضل المدرسين في مصر بخبرات تتجاوز 10 سنوات في تدريس الثانوية العامة
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TEACHERS.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    );
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Subjects */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">المادة</h3>
        <div className="space-y-2">
          {SUBJECTS.map((subject) => (
            <div key={subject.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`subject-${subject.id}`}
                checked={selectedSubjects.includes(subject.id)}
                onCheckedChange={() => toggleSubject(subject.id)}
              />
              <Label
                htmlFor={`subject-${subject.id}`}
                className="flex w-full cursor-pointer items-center justify-between text-sm"
              >
                <span>{subject.name}</span>
                <Badge variant="secondary" className="text-[10px]">
                  {COURSES.filter((c) => c.subjectId === subject.id).length}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Grade */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">الصف الدراسي</h3>
        <RadioGroup value={selectedGrade} onValueChange={setSelectedGrade}>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="" id="grade-all" />
            <Label htmlFor="grade-all" className="cursor-pointer text-sm">الكل</Label>
          </div>
          {GRADES.map((grade) => (
            <div key={grade.id} className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value={grade.id} id={`grade-${grade.id}`} />
              <Label htmlFor={`grade-${grade.id}`} className="cursor-pointer text-sm">
                {grade.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Level */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">المستوى</h3>
        <RadioGroup value={selectedLevel} onValueChange={setSelectedLevel}>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="" id="level-all" />
            <Label htmlFor="level-all" className="cursor-pointer text-sm">الكل</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="BEGINNER" id="level-beg" />
            <Label htmlFor="level-beg" className="cursor-pointer text-sm">مبتدئ</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="INTERMEDIATE" id="level-int" />
            <Label htmlFor="level-int" className="cursor-pointer text-sm">متوسط</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="ADVANCED" id="level-adv" />
            <Label htmlFor="level-adv" className="cursor-pointer text-sm">متقدم</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">نطاق السعر</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            min={0}
            max={2000}
            step={50}
            minStepsBetweenThumbIndex={1}
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">التقييم</h3>
        <RadioGroup value={String(minRating)} onValueChange={(v) => setMinRating(Number(v))}>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="0" id="rate-0" />
            <Label htmlFor="rate-0" className="cursor-pointer text-sm">الكل</Label>
          </div>
          {[4.5, 4, 3.5].map((r) => (
            <div key={r} className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value={String(r)} id={`rate-${r}`} />
              <Label htmlFor={`rate-${r}`} className="flex cursor-pointer items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {r} فأعلى
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="ms-2 h-4 w-4" />
          مسح الفلاتر ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          استكشف الكورسات
        </h1>
        <p className="text-sm text-muted-foreground">
          ابحث عن الكورس المناسب لك من بين {COURSES.length}+ كورس متنوع
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالعنوان، المادة، أو المدرس..."
            className="pr-9"
          />
        </div>

        {/* Mobile filter button */}
        <Sheet open={showFiltersMobile} onOpenChange={setShowFiltersMobile}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge className="ms-1 bg-accent text-accent-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-right">تصفية النتائج</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="ترتيب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="rating">الأعلى تقييماً</SelectItem>
            <SelectItem value="price-low">الأقل سعراً</SelectItem>
            <SelectItem value="popular">الأكثر طلباً</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-shrink-0 md:block">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-foreground">تصفية</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </div>
              <FiltersContent />
            </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? "جاري التحميل..." : `${filteredCourses.length} كورس`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <EmptyState
              icon={BookX}
              title="لا توجد كورسات مطابقة"
              description="جرب تعديل الفلاتر أو البحث بكلمات مختلفة. تأكد من إملاء الكلمات بشكل صحيح."
              actionLabel="مسح الفلاتر"
              onAction={clearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
