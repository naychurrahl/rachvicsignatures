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
import { AutoCarousel } from "@/app/components/layout/AutoCarousel";
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
  const { products, categories, content } = useApp();

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

  const spotlightProducts = useMemo(() => {
    const pickedIds = content.collectionSpotlight.productIds ?? [];
    if (pickedIds.length > 0) {
      return pickedIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p);
    }
    const top = [...products].sort(
      (a, b) => (b.rating ?? 0) * (b.reviewCount ?? 0) - (a.rating ?? 0) * (a.reviewCount ?? 0),
    )[0];
    return top ? [top] : [];
  }, [products, content.collectionSpotlight.productIds]);

  const activePromoBanners = useMemo(
    () =>
      content.promoBanners
        .filter((banner) => banner.active)
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [content.promoBanners],
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

      <ProductRail
        id="new-arrivals"
        eyebrow={content.newArrivals.eyebrow}
        title={content.newArrivals.title ?? "New Arrivals"}
        subtitle={content.newArrivals.subtitle}
        products={newArrivals}
        onSelect={goToProduct}
      />

      <FeaturedCategories
        eyebrow={content.featuredCategories.eyebrow ?? ""}
        title={content.featuredCategories.title ?? "Featured Categories"}
        categories={categories}
        products={products}
        onSelect={goToCategory}
      />

      <AutoCarousel
        items={activePromoBanners}
        renderItem={(banner) => (
          <PromoBanner
            image={banner.image}
            eyebrow={banner.eyebrow}
            heading={banner.heading}
            body={banner.body}
            ctaLabel={banner.ctaLabel}
            ctaHref={banner.ctaHref}
          />
        )}
      />

      <ProductRail
        id="best-sellers"
        eyebrow={content.bestSellers.eyebrow}
        title={content.bestSellers.title ?? "Best-Selling Products"}
        subtitle={content.bestSellers.subtitle}
        products={bestSellers}
        onSelect={goToProduct}
      />

      <section id="products" className="max-w-6xl mx-auto px-4 py-10 sm:py-14 scroll-mt-20">
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
            {content.shopAll.eyebrow}
          </p>
          <h2 className="text-2xl">{content.shopAll.title ?? "Shop All"}</h2>
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

      <AutoCarousel
        items={spotlightProducts}
        renderItem={(product) => (
          <CollectionSpotlight
            eyebrow={content.collectionSpotlight.eyebrow ?? "Collection Spotlight"}
            product={product}
            onSelect={goToProduct}
          />
        )}
      />

      <WhyChooseUs
        eyebrow={content.whyChooseUs.eyebrow}
        title={content.whyChooseUs.title}
        benefits={content.whyChooseUs.benefits}
      />

      <Testimonials
        eyebrow={content.testimonials.eyebrow ?? "Customer Reviews"}
        title={content.testimonials.title ?? "What Our Customers Say"}
      />

      <NewsletterCta heading={content.newsletter.heading} body={content.newsletter.body} />

      <SiteFooter />
    </div>
  );
}
