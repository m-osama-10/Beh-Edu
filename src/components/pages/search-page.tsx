"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/shared/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { COURSES, TEACHERS } from "@/data/mock-data";
import { useRouterStore } from "@/store/router-store";
import { useState, useMemo } from "react";
import { Search, SearchX, Users } from "lucide-react";
import { TeacherCard } from "@/components/shared/teacher-card";

export function SearchPage() {
  const route = useRouterStore((s) => s.route);
  const navigate = useRouterStore((s) => s.navigate);
  const [query, setQuery] = useState(route.params?.q ?? "");

  const results = useMemo(() => {
    if (!query.trim()) return { courses: [], teachers: [] };
    const q = query.toLowerCase();
    return {
      courses: COURSES.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.subject.name.toLowerCase().includes(q) ||
          c.teacher.name.toLowerCase().includes(q)
      ),
      teachers: TEACHERS.filter(
        (t) =>
          t.approved &&
          (t.name.toLowerCase().includes(q) ||
            t.specialization.toLowerCase().includes(q) ||
            t.bio.toLowerCase().includes(q))
      ),
    };
  }, [query]);

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground font-display mb-3">
          البحث
        </h1>
        <div className="relative max-w-xl">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن كورس، مادة، أو مدرس..."
            className="ps-3 pe-9 h-12"
            autoFocus
          />
        </div>
      </div>

      {!query.trim() ? (
        <EmptyState
          icon={Search}
          title="ابدأ البحث"
          description="اكتب كلمة بحث في الحقل أعلاه للعثور على الكورسات والمدرسين."
        />
      ) : results.courses.length === 0 && results.teachers.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={`لا توجد نتائج لـ "${query}"`}
          description="جرب كلمات بحث أخرى أو تصفّح كل الكورسات."
          actionLabel="تصفّح الكورسات"
          onAction={() => navigate("courses")}
        />
      ) : (
        <div className="space-y-8">
          {results.courses.length > 0 && (
            <div>
              <h2 className="font-bold text-lg text-foreground mb-4">
                الكورسات ({results.courses.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.courses.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </div>
          )}

          {results.teachers.length > 0 && (
            <div>
              <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Users className="size-5 text-primary" />
                المدرسون ({results.teachers.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.teachers.map((t) => (
                  <TeacherCard key={t.id} teacher={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
