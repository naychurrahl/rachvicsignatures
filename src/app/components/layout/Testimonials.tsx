import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Quote } from "lucide-react";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { Review, ReviewsResponse } from "@/app/data/interFaces";
import { StarRating } from "@/app/components/layout/StarRating";

interface TestimonialsProps {
  eyebrow: string;
  title: string;
}

export function Testimonials({ eyebrow, title }: TestimonialsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ApiRequest({ url: `${baseUrl}/reviews/store` })
      .then((data: ReviewsResponse) => {
        setReviews(data.reviews ?? []);
        setAverage(data.average || 0);
        setCount(data.count || 0);
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <section className="bg-white dark:bg-gray-900 border-y">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
            {eyebrow}
          </p>
          <h2 className="text-2xl mb-2">{title}</h2>
          {count > 0 && (
            <div className="flex justify-center">
              <StarRating value={average} count={count} />
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No reviews yet -- be the first to share your experience after your order.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="rounded-lg border p-5 bg-gray-50 dark:bg-gray-950">
                <Quote className="h-5 w-5 text-primary/40 mb-2" />
                <StarRating value={review.rating} size={14} className="mb-2" />
                {review.comment && (
                  <p className="text-sm mb-3 line-clamp-4">{review.comment}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {review.userName ?? "Verified Customer"} ·{" "}
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
