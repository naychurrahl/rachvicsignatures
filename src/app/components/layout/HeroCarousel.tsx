import { Children, useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/components/ui/carousel";

// Generic carousel shell -- takes its slides as children (<Hero /> elements),
// so slide content lives at the call site, not in here.
export function HeroCarousel({ children }: { children: React.ReactNode }) {
  const slides = Children.toArray(children);
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());
    api.on("select", () => setSelectedIndex(api.selectedScrollSnap()));
  }, [api]);

  return (
    <Carousel
      className="relative"
      opts={{ loop: true }}
      plugins={[autoplay.current]}
      setApi={setApi}
    >
      <CarouselContent className="-ml-0">
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="pl-0">
            {slide}
          </CarouselItem>
        ))}
      </CarouselContent>

      {slides.length > 1 && (
        <>
          <CarouselPrevious className="left-4 text-white border-white/40 bg-white/10 hover:bg-white/20" />
          <CarouselNext className="right-4 text-white border-white/40 bg-white/10 hover:bg-white/20" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={`size-2 rounded-full transition-colors ${
                  index === selectedIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  );
}
