import { useMemo, useState } from "react";
import { Product } from "@/app/data/interFaces";
import { useApp } from "@/app/contexts/AppContext";
import { useNavigate } from "react-router-dom";

import { AnnouncementBar } from "@/app/components/layout/AnnouncementBar";
import { SiteHeader } from "@/app/components/layout/SiteHeader";
import { HeroSection } from "@/app/components/layout/HeroSection";
import { TrustStrip } from "@/app/components/layout/TrustStrip";
import { FeaturedCategories } from "@/app/components/layout/FeaturedCategories";
import { CategoryRail } from "@/app/components/layout/CategoryRail";
import { ProductCard } from "@/app/components/layout/ProductCard";
import { ProductRail } from "@/app/components/layout/ProductRail";
import { PromoBanner } from "@/app/components/layout/PromoBanner";
import { CollectionSpotlight } from "@/app/components/layout/CollectionSpotlight";
import { WhyChooseUs } from "@/app/components/layout/WhyChooseUs";
import { Testimonials } from "@/app/components/layout/Testimonials";
import { NewsletterCta } from "@/app/components/layout/NewsletterCta";
import { SiteFooter } from "@/app/components/layout/SiteFooter";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { products, categories } = useApp();

  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category.includes(selectedCategory);
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bestSellers = useMemo(
    () => [...products].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)).slice(0, 8),
    [products],
  );

  const newArrivals = useMemo(() => [...products].slice(-8).reverse(), [products]);

  const spotlightProduct = useMemo(
    () =>
      [...products].sort(
        (a, b) => (b.rating ?? 0) * (b.reviewCount ?? 0) - (a.rating ?? 0) * (a.reviewCount ?? 0),
      )[0],
    [products],
  );

  const goToProduct = (product: Product) => navigate(`/product/${product.id}`);

  const goToCategory = (category: string) => {
    setSelectedCategory(category);
    scrollToId("products");
  };

  return (
    <div className="pb-20">
      <AnnouncementBar />
      <SiteHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <HeroSection />

      <TrustStrip />

      <FeaturedCategories categories={categories} products={products} onSelect={goToCategory} />

      <section id="products" className="max-w-6xl mx-auto px-4 py-10 sm:py-14 scroll-mt-20">
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
            Full Collection
          </p>
          <h2 className="text-2xl">Shop All</h2>
        </div>

        <CategoryRail
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {filteredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No products match your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {filteredProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => goToProduct(product)}
              />
            ))}
          </div>
        )}
      </section>

      <ProductRail
        id="best-sellers"
        eyebrow="Fan Favorites"
        title="Best-Selling Products"
        subtitle="Loved and reviewed by our customers"
        products={bestSellers}
        onSelect={goToProduct}
      />

      <PromoBanner onCtaClick={() => scrollToId("new-arrivals")} />

      <ProductRail
        id="new-arrivals"
        eyebrow="Just In"
        title="New Arrivals"
        subtitle="Fresh additions to the collection"
        products={newArrivals}
        onSelect={goToProduct}
      />

      <CollectionSpotlight product={spotlightProduct} onSelect={goToProduct} />

      <WhyChooseUs />

      <Testimonials />

      <NewsletterCta />

      <SiteFooter />
    </div>
  );
}
