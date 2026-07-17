"use client";

import { useRouterStore } from "@/store/router-store";
import type { Teacher } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen, BadgeCheck } from "lucide-react";
import { formatNumber } from "@/data/mock-data";
import { cn } from "@/lib/utils";

interface TeacherCardProps {
  teacher: Teacher;
  className?: string;
}

export function TeacherCard({ teacher, className }: TeacherCardProps) {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <button
      onClick={() => navigate("courses", { teacherId: teacher.id })}
      className={cn(
        "flex w-full flex-col items-center rounded-xl border bg-card p-5 text-center card-hover",
        className,
      )}
    >
      <div className="relative mb-3">
        <Avatar className="h-20 w-20 border-2 border-background ring-2 ring-primary/30">
          <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {teacher.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        {teacher.verified && (
          <BadgeCheck className="absolute -bottom-1 -left-1 h-6 w-6 fill-primary text-primary-foreground" />
        )}
      </div>

      <h3 className="text-base font-bold text-foreground">{teacher.name}</h3>
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
        {teacher.specialization}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-foreground">{teacher.rating}</span>
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {formatNumber(teacher.totalStudents)}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          {teacher.totalCourses}
        </span>
      </div>

      {teacher.education && (
        <p className="mt-3 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
          {teacher.education}
        </p>
      )}

      <Badge variant="secondary" className="mt-3 bg-brand-gradient-soft">
        مدرس معتمد
      </Badge>
    </button>
  );
}
