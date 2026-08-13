import { Product } from "@/app/data/interFaces";
import { useApp } from "@/app/contexts/AppContext";
import { formatCurrency } from "@/app/lib/formatCurrency";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { StarRating } from "@/app/components/layout/StarRating";
import { ArrowRight } from "lucide-react";

interface CollectionSpotlightProps {
  eyebrow: string;
  product: Product | undefined;
  onSelect: (product: Product) => void;
}

export function CollectionSpotlight({ eyebrow, product, onSelect }: CollectionSpotlightProps) {
  const { settings } = useApp();

  if (!product) return null;

  return (
    <section className="bg-white dark:bg-gray-900 border-y">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 grid sm:grid-cols-2 gap-8 items-center">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
            {eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl mb-3">{product.name}</h2>
          {!!product.reviewCount && (
            <StarRating value={product.rating ?? 0} count={product.reviewCount} className="mb-3" />
          )}
          <p className="text-muted-foreground mb-4 line-clamp-3">{product.description}</p>
          <p className="text-2xl text-primary mb-6">
            {formatCurrency(product.price, settings.currencySymbol)}
          </p>
          <button
            onClick={() => onSelect(product)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            View Product
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
