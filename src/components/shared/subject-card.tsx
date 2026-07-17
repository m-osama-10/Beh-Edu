"use client";

import { useRouterStore } from "@/store/router-store";
import type { Subject } from "@/types";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface SubjectCardProps {
  subject: Subject;
  className?: string;
}

export function SubjectCard({ subject, className }: SubjectCardProps) {
  const navigate = useRouterStore((s) => s.navigate);

  // Get icon from lucide
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[subject.icon] ?? LucideIcons.BookOpen;

  return (
    <button
      onClick={() => navigate("courses", { subjectId: subject.id })}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center card-hover",
        className,
      )}
      style={{ borderTopColor: subject.color, borderTopWidth: 3 }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full transition group-hover:scale-110"
        style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
      >
        <IconComponent className="h-7 w-7" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground">{subject.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {subject.coursesCount} كورس
        </p>
      </div>
    </button>
  );
}
