import {
  IconStarFill,
  IconStarHalf,
  IconStarOutline,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { useState } from "react";

const valueSizeMap = {
  sm: "text-base",
  default: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
} as const;

type RatingProps = {
  value?: number;
  max?: number;
  readOnly?: boolean;
  showValue?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
};

export function Rating({
  value = 0,
  max = 5,
  readOnly = true,
  showValue = false,
  onChange,
  size = "default",
  className = "",
}: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const displayRating = hover || value;

  const displayValue = Math.round(displayRating * 10) / 10; // Làm tròn 1 chữ số thập phân

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;

        const isFilled = displayRating >= star;
        const isHalfFilled =
          displayRating >= star - 0.5 && displayRating < star;

        const StarIcon = isFilled
          ? IconStarFill
          : isHalfFilled
            ? IconStarHalf
            : IconStarOutline;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(null)}
            className={cn(
              "transition-transform",
              !readOnly && "hover:scale-110 pr-1",
            )}
          >
            <StarIcon
              size={size}
              color="custom"
              className={cn(
                isFilled || isHalfFilled
                  ? "text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        );
      })}

      {showValue && (
        <span
          className={cn("font-bold text-foreground ml-1", valueSizeMap[size])}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
}
