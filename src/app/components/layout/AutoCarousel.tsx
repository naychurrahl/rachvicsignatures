import { ReactNode, useEffect, useState } from "react";

const TRANSITIONS = [
  "animate-in fade-in duration-700",
  "animate-in zoom-in-95 duration-700",
  "animate-in slide-in-from-left-8 duration-700",
  "animate-in slide-in-from-right-8 duration-700",
  "animate-in slide-in-from-bottom-8 duration-700",
  "animate-in slide-in-from-top-8 duration-700",
];

interface AutoCarouselProps<T> {
  items: T[];
  intervalMs?: number;
  renderItem: (item: T) => ReactNode;
}

export function AutoCarousel<T>({ items, intervalMs = 6000, renderItem }: AutoCarouselProps<T>) {
  const [index, setIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState(TRANSITIONS[0]);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => {
      setTransitionClass(TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)]);
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [items.length, intervalMs]);

  if (items.length === 0) return null;

  return (
    <div key={index} className={transitionClass}>
      {renderItem(items[index])}
    </div>
  );
}
