import { SiteContent } from "@/app/data/interFaces";

// Mirrors backend Functions::defaultContent()'s seed -- keeps the homepage
// from flashing blank/broken copy before GET /content resolves (or if it fails).
export const DEFAULT_CONTENT: SiteContent = {
  featuredCategories: { eyebrow: "Shop by Category", title: "Featured Categories" },
  newArrivals: {
    eyebrow: "Just In",
    title: "New Arrivals",
    subtitle: "Fresh additions to the collection",
  },
  bestSellers: {
    eyebrow: "Fan Favorites",
    title: "Best-Selling Products",
    subtitle: "Loved and reviewed by our customers",
  },
  promoBanners: [
    {
      id: "promo_seed0001",
      image: null,
      eyebrow: "The Rachvic Signature Promise",
      heading: "Curated picks, handled with care from checkout to doorstep.",
      body: "Every order is packed carefully and backed by real support if anything's off.",
      ctaLabel: "Shop the Full Collection",
      ctaHref: "#products",
      sortOrder: 0,
      active: true,
    },
  ],
  shopAll: { eyebrow: "Full Collection", title: "Shop All" },
  collectionSpotlight: { eyebrow: "Collection Spotlight", productIds: [] },
  whyChooseUs: {
    eyebrow: "Why Choose Us",
    title: "Built Around Our Customers",
    benefits: [
      {
        icon: "Sparkles",
        title: "Thoughtfully Curated",
        description: "Every product in our catalog is chosen for quality and craftsmanship.",
      },
      {
        icon: "Lock",
        title: "Secure Checkout",
        description: "Payments are processed securely through Paystack -- never stored on our servers.",
      },
      {
        icon: "MessageCircle",
        title: "Real Support, Real Fast",
        description: "Chat live with our team for order help, product questions, or anything else.",
      },
      {
        icon: "RotateCcw",
        title: "Easy Returns",
        description: "Not the right fit? Return it, no hassle.",
      },
    ],
  },
  testimonials: { eyebrow: "Customer Reviews", title: "What Our Customers Say" },
  newsletter: {
    heading: "Stay in the Loop",
    body: "Get notified about new arrivals and collection drops. No spam, unsubscribe anytime.",
  },
};
