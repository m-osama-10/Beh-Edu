"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showCount?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  count,
  size = "md",
  interactive = false,
  onChange,
  showCount = false,
  className,
}: RatingStarsProps) {
  const sizeClass = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" }[size];
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              className={cn(
                "relative",
                interactive && "cursor-pointer hover:scale-110 transition-transform",
                !interactive && "cursor-default",
              )}
              aria-label={`${star} نجوم`}
            >
              <Star className={cn(sizeClass, "text-muted-foreground/30")} />
              {(filled || half) && (
                <Star
                  className={cn(
                    sizeClass,
                    "absolute inset-0 fill-amber-400 text-amber-400",
                    half && "overflow-hidden [clip-path:inset(0_50%_0_0)]",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {showCount && (
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
