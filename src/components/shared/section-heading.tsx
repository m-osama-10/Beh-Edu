"use client";

import { useRouterStore } from "@/store/router-store";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllText?: string;
  viewAllTarget?: Parameters<ReturnType<typeof useRouterStore.getState>["navigate"]>[0];
  viewAllParams?: Record<string, string>;
  className?: string;
  align?: "right" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  viewAllText = "عرض الكل",
  viewAllTarget,
  viewAllParams,
  className,
  align = "right",
}: SectionHeadingProps) {
  const navigate = useRouterStore((s) => s.navigate);

  return (
    <div
      className={cn(
        "mb-6 flex items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        )}
      </div>
      {viewAllTarget && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(viewAllTarget, viewAllParams)}
          className="flex-shrink-0 text-primary hover:text-primary"
        >
          {viewAllText}
          <ChevronLeft className="ms-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
