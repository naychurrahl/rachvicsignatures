import { Product } from "@/app/data/interFaces";
import { Badge } from "@/app/components/ui/badge";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { StarRating } from "@/app/components/layout/StarRating";
import { useApp } from "@/app/contexts/AppContext";
import { formatCurrency } from "@/app/lib/formatCurrency";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { settings } = useApp();

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden active:scale-95 transition-transform cursor-pointer hover:shadow-md"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-lg text-primary">{formatCurrency(product.price, settings.currencySymbol)}</p>
        {!!product.reviewCount && (
          <StarRating value={product.rating ?? 0} count={product.reviewCount} size={12} className="mt-0.5" />
        )}
        <div className="mt-1">
          {product.stock < 10 ? (
            <Badge variant="destructive" className="text-xs">
              Low Stock
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              In Stock
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
