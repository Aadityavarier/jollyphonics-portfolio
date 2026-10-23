"use client";

import { useEffect } from "react";

/**
 * Sets html[data-motion] and drives the header's scrolled state. It never touches page content:
 * reveals arm themselves (reveal-engine.ts), so nothing here can race hydration of the page segment.
 */
export function MotionRoot() {
  useEffect(() => {
    document.documentElement.setAttribute("data-motion", "");
  }, []);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    // --header-h has a CSS default; the observer only corrects it, reading the size it is handed rather than
    // forcing a layout (a synchronous offsetHeight here, right after data-motion, was a forced reflow).
    const root = document.documentElement.style;
    const ro =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(([entry]) => {
            const h = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
            if (h && root.getPropertyValue("--header-h") !== `${h}px`) root.setProperty("--header-h", `${h}px`);
          });
    ro?.observe(header);
    let scrolled = false;
    const update = () => {
      const next = window.scrollY > 24;
      if (next === scrolled) return;
      scrolled = next;
      header.toggleAttribute("data-scrolled", next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, []);

  return null;
}
