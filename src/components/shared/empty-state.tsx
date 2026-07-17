"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <LoadingSkeleton className="aspect-video rounded-none" />
      <div className="space-y-3 p-4">
        <LoadingSkeleton className="h-3 w-20" />
        <LoadingSkeleton className="h-5 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}
