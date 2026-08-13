import { ArrowRight } from "lucide-react";

interface PromoBannerProps {
  onCtaClick: () => void;
}

export function PromoBanner({ onCtaClick }: PromoBannerProps) {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 sm:px-12 sm:py-16 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
          The Rachvic Signature Promise
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white max-w-xl mx-auto mb-4">
          Curated picks, handled with care from checkout to doorstep.
        </h2>
        <p className="text-gray-300 max-w-lg mx-auto mb-8">
          Every order is packed carefully and backed by real support if anything's off.
        </p>
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Shop New Arrivals
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
