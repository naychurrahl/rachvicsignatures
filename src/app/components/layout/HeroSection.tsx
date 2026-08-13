import { useApp } from "@/app/contexts/AppContext";
import { HeroSlide } from "@/app/data/interFaces";
import { HeroCarousel } from "@/app/components/layout/HeroCarousel";
import { Hero } from "@/app/components/layout/Hero";

// Used whenever the DB has no active hero slides -- keeps today's copy
// as the fallback instead of showing a blank hero.
const FALLBACK_SLIDE: HeroSlide = {
  id: "fallback",
  image: "",
  eyebrow: "Rachvic Signatures",
  heading: "Everything you need, in one place.",
  primaryCtaLabel: "Shop now",
  primaryCtaHref: "#products",
  sortOrder: 0,
  active: true,
};

export function HeroSection() {
  const { settings } = useApp();
  const activeSlides = settings.heroSlides.filter((slide) => slide.active);
  const slides = activeSlides.length > 0 ? activeSlides : [FALLBACK_SLIDE];

  return (
    <HeroCarousel>
      {slides.map((slide) => (
        <Hero key={slide.id} slide={slide} />
      ))}
    </HeroCarousel>
  );
}
