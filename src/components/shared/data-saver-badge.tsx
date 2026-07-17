"use client";

import { Leaf, Wifi, ShieldCheck, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DataSaverBadgeProps {
  className?: string;
  variant?: "badge" | "card";
  dataMB?: number;
}

export function DataSaverBadge({ className, variant = "badge", dataMB }: DataSaverBadgeProps) {
  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/40",
          className,
        )}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
          <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              وضع توفير الباقة
            </h4>
            <Badge variant="outline" className="border-emerald-300 text-[10px] text-emerald-700 dark:border-emerald-700 dark:text-emerald-400">
              مُفعّل
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            جودة 480p محسّنة لتقليل استهلاك الإنترنت بأكثر من 60% مقارنة بـ 720p
          </p>
          {dataMB !== undefined && (
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="h-3 w-3" />
              استهلاك هذا الدرس التقريبي: {dataMB} ميجابايت
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Badge
      className={cn(
        "gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400",
        className,
      )}
      variant="secondary"
    >
      <Leaf className="h-3 w-3" />
      توفير الباقة
    </Badge>
  );
}

export function ProtectedContentBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        "gap-1 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20",
        className,
      )}
      variant="secondary"
    >
      <ShieldCheck className="h-3 w-3" />
      محتوى محمي
    </Badge>
  );
}

export function QualityBadge({ quality, className }: { quality: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1 text-[10px]", className)}>
      <Wifi className="h-3 w-3" />
      {quality}
    </Badge>
  );
}
