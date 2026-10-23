"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./tokens";

interface Options {
  /** Fraction of the node that must be visible before it plays. */
  threshold?: number;
}

/**
 * Switches CSS-only previews on and off: `data-play` is set while the node is at least `threshold` visible and
 * removed when it leaves, which resets the animation (CSS keeps nothing running off screen). Under reduced
 * motion it sets `data-static` instead and never `data-play`, so CSS shows the end frame. It only writes to
 * its own node, from an effect, so server HTML is untouched until it has hydrated.
 */
export function usePlayInView(ref: RefObject<Element | null>, { threshold = 0.5 }: Options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-static", "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= threshold) el.setAttribute("data-play", "");
          else if (!e.isIntersecting) el.removeAttribute("data-play");
        }
      },
      { threshold: [0, threshold] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeAttribute("data-play");
    };
  }, [ref, threshold]);
}
