import { HeroSlide } from "@/app/data/interFaces";

// One hero slide's content, driven by a DB-backed HeroSlide. When a slide
// has no image (e.g. the static fallback used before any slides exist in
// the DB), it renders as today's plain dark panel instead of a photo hero.
export function Hero({ slide }: { slide: HeroSlide }) {
  const hasImage = !!slide.image;

  return (
    <section
      className={`relative flex items-center ${hasImage ? "min-h-[420px] sm:min-h-[520px]" : "bg-gray-900"}`}
    >
      {hasImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slide.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 relative z-10 w-full">
        {slide.eyebrow && (
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-3">
            {slide.eyebrow}
          </p>
        )}
        {slide.heading && (
          <h1 className="text-3xl sm:text-5xl font-semibold mb-6 max-w-xl text-white">
            {slide.heading}
          </h1>
        )}
        {slide.body && (
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-xl">
            {slide.body}
          </p>
        )}
        {(slide.primaryCtaLabel || slide.secondaryCtaLabel) && (
          <div className="flex flex-wrap gap-3">
            {slide.primaryCtaLabel && slide.primaryCtaHref && (
              <a
                href={slide.primaryCtaHref}
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                {slide.primaryCtaLabel}
              </a>
            )}
            {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
              <a
                href={slide.secondaryCtaHref}
                className="inline-block border border-white/40 text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                {slide.secondaryCtaLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
