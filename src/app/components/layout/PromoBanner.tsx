import { ArrowRight } from "lucide-react";

interface PromoBannerProps {
  image?: string | null;
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export function PromoBanner({ image, eyebrow, heading, body, ctaLabel, ctaHref }: PromoBannerProps) {
  const hasImage = !!image;

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 sm:px-12 sm:py-16 text-center">
        {hasImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${image}')` }}
          >
            <div className="absolute inset-0 bg-gray-900/70" />
          </div>
        )}

        <div className="relative z-10">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
            {eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white max-w-xl mx-auto mb-4">
            {heading}
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto mb-8">{body}</p>
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
