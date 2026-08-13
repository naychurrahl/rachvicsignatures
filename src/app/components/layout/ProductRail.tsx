import { Product } from "@/app/data/interFaces";
import { ProductCard } from "@/app/components/layout/ProductCard";

interface ProductRailProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductRail({ id, eyebrow, title, subtitle, products, onSelect }: ProductRailProps) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => onSelect(product)} />
        ))}
      </div>
    </section>
  );
}
