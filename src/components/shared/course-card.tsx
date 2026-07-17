"use client";

import Link from "next/link";
import { useRouterStore } from "@/store/router-store";
import { useFavoritesStore, useEnrolledStore, useCartStore } from "@/store/app-stores";
import { RatingStars } from "./rating-stars";
import { Heart, Eye, Users, Clock, BookOpen, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatDuration, formatNumber } from "@/data/mock-data";
import type { Course } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
  variant?: "default" | "compact" | "horizontal";
  className?: string;
}

export function CourseCard({ course, variant = "default", className }: CourseCardProps) {
  const navigate = useRouterStore((s) => s.navigate);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(course.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isEnrolled = useEnrolledStore((s) => s.isEnrolled(course.id));
  const addToCart = useCartStore((s) => s.addToCart);
  const isInCart = useCartStore((s) => s.isInCart(course.id));

  const currentPrice = course.discountPrice ?? course.price;
  const hasDiscount = course.discountPrice !== undefined && course.discountPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price - course.discountPrice!) / course.price) * 100)
    : 0;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(course.id);
    toast.success(isFavorite ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى المفضلة");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnrolled) {
      navigate("watch", { courseId: course.id, lessonId: course.sections[0]?.lessons[0]?.id ?? "" });
      return;
    }
    if (isInCart) {
      navigate("courses");
      return;
    }
    addToCart(course.id);
    toast.success("تمت الإضافة إلى السلة");
  };

  if (variant === "horizontal") {
    return (
      <div
        onClick={() => navigate("course-detail", { courseId: course.id })}
        className={cn(
          "group flex cursor-pointer gap-3 overflow-hidden rounded-xl border bg-card p-3 card-hover",
          className,
        )}
      >
        <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-lg sm:w-40">
          { }
          <img
            src={course.coverImageUrl}
            alt={course.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
          {hasDiscount && (
            <Badge className="absolute right-1 top-1 bg-accent text-accent-foreground text-[10px]">
              -{discountPercent}%
            </Badge>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Badge variant="secondary" className="mb-1 w-fit text-[10px]" style={{ color: course.subject.color }}>
            {course.subject.name}
          </Badge>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
            {course.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{course.teacher.name}</p>
          <div className="mt-auto flex items-center justify-between">
            <RatingStars rating={course.rating} size="sm" showCount />
            <div className="flex items-center gap-1">
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(course.price)}
                </span>
              )}
              <span className="text-sm font-bold text-primary">{formatPrice(currentPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate("course-detail", { courseId: course.id })}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card card-hover",
        variant === "compact" && "max-w-xs",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        { }
        <img
          src={course.coverImageUrl}
          alt={course.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <button
          onClick={handleFavorite}
          className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white"
          aria-label="إضافة للمفضلة"
        >
          <Heart
            className={cn("h-4 w-4", isFavorite ? "fill-accent text-accent" : "text-foreground")}
          />
        </button>
        {hasDiscount && (
          <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">
            خصم {discountPercent}%
          </Badge>
        )}
        {isEnrolled && (
          <Badge className="absolute bottom-2 right-2 bg-emerald-600 text-white">
            <CheckCircle2 className="ms-1 h-3 w-3" />
            مسجل
          </Badge>
        )}
        {course.isFeatured && !isEnrolled && (
          <Badge className="absolute bottom-2 right-2 bg-gold-gradient text-black">
            مميز
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-[10px]"
            style={{
              backgroundColor: `${course.subject.color}15`,
              color: course.subject.color,
            }}
          >
            {course.subject.name}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {course.grade?.name}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary sm:text-base">
          {course.title}
        </h3>

        <div className="mb-3 flex items-center gap-2">
          { }
          <img
            src={course.teacher.avatarUrl}
            alt={course.teacher.name}
            className="h-6 w-6 rounded-full object-cover"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground">{course.teacher.name}</span>
        </div>

        <div className="mb-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(course.totalDuration)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {course.totalLessons} درس
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {formatNumber(course.studentCount)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <RatingStars rating={course.rating} count={course.ratingCount} size="sm" showCount />
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(course.price)}
              </span>
            )}
            <span className="text-base font-bold text-primary sm:text-lg">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className={cn(
            "mt-3 w-full",
            isEnrolled
              ? "bg-emerald-600 hover:bg-emerald-700"
              : isInCart
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-brand-gradient",
          )}
          size="sm"
        >
          {isEnrolled ? (
            <>
              <Eye className="ms-1 h-4 w-4" />
              متابعة المشاهدة
            </>
          ) : isInCart ? (
            "في السلة"
          ) : (
            <>
              <Lock className="ms-1 h-4 w-4" />
              اشترك الآن
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
