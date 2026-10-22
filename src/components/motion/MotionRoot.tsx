"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGETS = "[data-reveal]:not([data-shown]),[data-stagger]:not([data-shown])";

/**
 * One IntersectionObserver for every Reveal / Stagger on the page, plus the header's scrolled state.
 * Hidden "before" states only exist once this has run (html[data-motion]); anything already on screen
 * at that moment is marked shown first, so nothing visible ever blinks out after hydration.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    const limit = window.innerHeight * 0.9;
    document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
      if (el.getBoundingClientRect().top < limit) el.setAttribute("data-shown", "");
      else io.observe(el);
    });
    document.documentElement.setAttribute("data-motion", "");

    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    let scrolled = false;
    const update = () => {
      const next = window.scrollY > 24;
      if (next === scrolled) return;
      scrolled = next;
      header.toggleAttribute("data-scrolled", next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return null;
}
