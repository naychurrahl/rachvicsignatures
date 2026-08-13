import { Star } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

interface StarRatingProps {
  value: number;
  count?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function StarRating({
  value,
  count,
  size = 16,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {stars.map((star) =>
          interactive ? (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="p-0.5 -m-0.5"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                style={{ width: size, height: size }}
                className={cn(
                  star <= value
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-gray-300 dark:text-gray-600",
                )}
              />
            </button>
          ) : (
            <Star
              key={star}
              style={{ width: size, height: size }}
              className={cn(
                star <= Math.round(value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-gray-300 dark:text-gray-600",
              )}
            />
          ),
        )}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-gray-500">
          {value > 0 ? value.toFixed(1) : "No ratings"}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  );
}
