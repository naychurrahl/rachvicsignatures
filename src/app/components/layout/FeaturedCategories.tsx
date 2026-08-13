import { Product } from "@/app/data/interFaces";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface FeaturedCategoriesProps {
  categories: string[];
  products: Product[];
  onSelect: (category: string) => void;
}

export function FeaturedCategories({ categories, products, onSelect }: FeaturedCategoriesProps) {
  const tiles = categories
    .filter((category) => category !== "All")
    .map((category) => ({
      category,
      image: products.find((product) => product.category.includes(category))?.image,
    }));

  if (tiles.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
          Shop by Category
        </p>
        <h2 className="text-2xl">Featured Categories</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map(({ category, image }) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 text-left"
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
        ))}
      </div>
    </section>
  );
}
