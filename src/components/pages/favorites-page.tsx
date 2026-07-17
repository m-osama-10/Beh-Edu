"use client";

import { useRouterStore } from "@/store/router-store";
import { useFavoritesStore } from "@/store/app-stores";
import { CourseCard } from "@/components/shared/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { COURSES } from "@/data/mock-data";
import { Heart } from "lucide-react";

export function FavoritesPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const favorites = useFavoritesStore((s) => s.favorites);
  const favoriteCourses = COURSES.filter((c) => favorites.has(c.id));

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          المفضلة ({favoriteCourses.length})
        </h1>
        <p className="text-sm text-muted-foreground">الكورسات التي أضفتها إلى قائمتك المفضلة</p>
      </div>

      {favoriteCourses.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="قائمة المفضلة فارغة"
          description="تصفح الكورسات المتاحة وأضف ما يعجبك إلى المفضلة للوصول السريع إليه في أي وقت. ستجد هنا كل الكورسات التي قمت بحفظها."
          actionLabel="تصفح الكورسات"
          onAction={() => navigate("courses")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
