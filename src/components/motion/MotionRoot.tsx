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
