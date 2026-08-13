import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Textarea } from "@/app/components/ui/textarea";
import { StarRating } from "@/app/components/layout/StarRating";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { toast } from "sonner";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Review, ReviewsResponse } from "@/app/data/interFaces";
import { formatCurrency } from "@/app/lib/formatCurrency";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, products, orders, user, settings } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewAverage, setReviewAverage] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const product = products.find((p) => p.id === id);

  const hasPurchased =
    !!user &&
    orders.some(
      (o) =>
        o.userId === user.userId &&
        o.status === "completed" &&
        o.items.some((i) => i.id === id),
    );
  const alreadyReviewed = !!user && reviews.some((r) => r.userId === user.userId);

  useEffect(() => {
    if (!id) return;
    ApiRequest({ url: `${baseUrl}/reviews/${id}` })
      .then((data: ReviewsResponse) => {
        setReviews(data.reviews || []);
        setReviewAverage(data.average || 0);
        setReviewCount(data.count || 0);
      })
      .catch(console.error);
  }, [id]);

  const handleSubmitReview = async () => {
    if (!id || newRating === 0) return;
    setSubmittingReview(true);
    try {
      await ApiRequest({
        url: `${baseUrl}/reviews/${id}`,
        method: "POST",
        body: { rating: newRating, comment: newComment },
      });
      toast.success("Thanks for your review!");
      setNewRating(0);
      setNewComment("");
      const data: ReviewsResponse = await ApiRequest({
        url: `${baseUrl}/reviews/${id}`,
      });
      setReviews(data.reviews || []);
      setReviewAverage(data.average || 0);
      setReviewCount(data.count || 0);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    const expe = { ...product, quantity };

    try {
      await addToCart(expe);
      toast.success(`Added ${quantity} ${product.name} to cart`);
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 active:scale-90 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Image Carousel */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <div className="mb-4">
          <h1 className="text-2xl mb-2">{product.name}</h1>
          <p className="text-3xl text-primary">{formatCurrency(product.price, settings.currencySymbol)}</p>
          <StarRating value={reviewAverage} count={reviewCount} className="mt-1" />
          <div className="mt-2">
            {product.stock > 0 ? (
              product.stock < 10 ? (
                <Badge variant="destructive">Only {product.stock} left</Badge>
              ) : (
                <Badge variant="secondary">
                  In Stock ({product.stock} available)
                </Badge>
              )
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <Collapsible open={descriptionOpen} onOpenChange={setDescriptionOpen}>
          <CollapsibleTrigger className="w-full text-left py-3 border-t border-b flex items-center justify-between">
            <span className="text-sm">Description</span>
            <Plus
              className={`h-5 w-5 transition-transform ${descriptionOpen ? "rotate-45" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="py-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          </CollapsibleContent>
        </Collapsible>

        {/* Reviews */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-sm mb-3">
            Reviews {reviewCount > 0 && `(${reviewCount})`}
          </h2>

          {hasPurchased && !alreadyReviewed && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border p-3 mb-4">
              <p className="text-xs text-gray-500 mb-2">Write a review</p>
              <StarRating
                value={newRating}
                interactive
                onChange={setNewRating}
                size={22}
                className="mb-2"
              />
              <Textarea
                value={newComment}
                onChange={(e: any) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this product (optional)"
                className="mb-2"
              />
              <Button
                size="sm"
                disabled={newRating === 0 || submittingReview}
                onClick={handleSubmitReview}
              >
                {submittingReview ? "Submitting…" : "Submit Review"}
              </Button>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{review.userName || "Customer"}</span>
                    <StarRating value={review.rating} size={12} />
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Quantity
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border flex items-center justify-center active:scale-90 transition-transform"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-xl w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-10 rounded-full border flex items-center justify-center active:scale-90 transition-transform"
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="sticky bottom-16 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full h-14 text-lg"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
