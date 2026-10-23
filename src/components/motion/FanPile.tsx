"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { armReveal } from "./reveal-engine";

interface Props {
  as?: "ul" | "ol";
  className?: string;
  children: ReactNode;
}

const TILT = [-5, 3, -2, 5, -4, 2, -3];

/**
 * Cards that start stacked in a pile (all on the first card's spot, slightly rotated) and fan out into their
 * grid positions as the group scrolls in. Offsets are measured once, before arming, so the pile is exact at any
 * width; transforms only. Server HTML and reduced motion are the plain grid.
 */
export function FanPile({ as: Tag = "ul", className = "", children }: Props) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    if (cards.length < 2) return;
    const origin = cards[0].getBoundingClientRect();
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--fx", `${origin.left - r.left}px`);
      c.style.setProperty("--fy", `${origin.top - r.top}px`);
      c.style.setProperty("--fr", `${TILT[i % TILT.length]}deg`);
      c.style.setProperty("--fz", String(cards.length - i));
      c.style.setProperty("--i", String(i));
    });
    return armReveal(el);
  }, []);

  const Component = Tag as "ul";
  return (
    <Component ref={ref} data-reveal="fan" className={className}>
      {children}
    </Component>
  );
}
