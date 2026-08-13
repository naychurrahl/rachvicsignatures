import { Product } from "@/app/data/interFaces";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { SectionToggleButton } from "@/app/components/layout/SectionToggleButton";
import { useExpandableSection } from "@/app/hooks/useExpandableSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";

interface FeaturedCategoriesProps {
  eyebrow: string;
  title: string;
  categories: string[];
  products: Product[];
  onSelect: (category: string) => void;
}

function CategoryTile({
  category,
  image,
  onSelect,
}: {
  category: string;
  image: string | undefined;
  onSelect: (category: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(category)}
      className="group relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 text-left"
    >
      <ImageWithFallback
        src={image}
        alt={category}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent" />
      <span className="absolute bottom-3 left-3 right-3 text-white font-medium truncate">
        {category}
      </span>
    </button>
  );
}

export function FeaturedCategories({ eyebrow, title, categories, products, onSelect }: FeaturedCategoriesProps) {
  const { expanded, toggle, ref } = useExpandableSection<HTMLElement>();

  const tiles = categories
    .filter((category) => category !== "All")
    .map((category) => ({
      category,
      image: products.find((product) => product.category.includes(category))?.image,
    }));

  if (tiles.length === 0) return null;

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
            {eyebrow}
          </p>
          <h2 className="text-2xl">{title}</h2>
        </div>
        {tiles.length > 4 && <SectionToggleButton expanded={expanded} onClick={toggle} />}
      </div>

      {expanded ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map(({ category, image }) => (
            <CategoryTile key={category} category={category} image={image} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <Carousel opts={{ align: "start" }} className="px-1">
          <CarouselContent>
            {tiles.map(({ category, image }) => (
              <CarouselItem key={category} className="basis-1/2 md:basis-1/4">
                <CategoryTile category={category} image={image} onSelect={onSelect} />
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
