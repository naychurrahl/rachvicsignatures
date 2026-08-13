import { Product } from "@/app/data/interFaces";
import { ProductCard } from "@/app/components/layout/ProductCard";
import { SectionToggleButton } from "@/app/components/layout/SectionToggleButton";
import { useExpandableSection } from "@/app/hooks/useExpandableSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";

interface ProductRailProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductRail({ id, eyebrow, title, subtitle, products, onSelect }: ProductRailProps) {
  const { expanded, toggle, ref } = useExpandableSection<HTMLElement>();

  if (products.length === 0) return null;

  return (
    <section id={id} ref={ref} className="max-w-6xl mx-auto px-4 py-10 sm:py-14 scroll-mt-20">
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
        {products.length > 4 && <SectionToggleButton expanded={expanded} onClick={toggle} />}
      </div>

      {expanded ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => onSelect(product)} />
          ))}
        </div>
      ) : (
        <Carousel opts={{ align: "start" }} className="px-1">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 md:basis-1/4">
                <ProductCard product={product} onClick={() => onSelect(product)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 sm:-left-4 bg-white dark:bg-gray-900" />
          <CarouselNext className="-right-3 sm:-right-4 bg-white dark:bg-gray-900" />
        </Carousel>
      )}
    </section>
  );
}
