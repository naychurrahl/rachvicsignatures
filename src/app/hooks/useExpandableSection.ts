import { useEffect, useRef, useState } from "react";

// Backs the carousel <-> "See all" grid toggle used by the homepage rails.
// Expanding is explicit (button click); collapsing back to the carousel
// happens either via the same button or by clicking/tapping outside the
// section, so the grid doesn't linger once the user has moved on.
export function useExpandableSection<T extends HTMLElement = HTMLElement>() {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!expanded) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [expanded]);

  return {
    expanded,
    toggle: () => setExpanded((prev) => !prev),
    ref,
  };
}
