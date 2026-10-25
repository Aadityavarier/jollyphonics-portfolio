"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion } from "./tokens";

/**
 * Cross-page transitions with the View Transitions API. Next 16.4's `experimental.viewTransition` flag is not in
 * the installed config types, so internal link clicks are wrapped here instead: the new page is pushed inside
 * document.startViewTransition and the transition resolves once the pathname has changed. The header (and the
 * logo in it) has its own view-transition-name, so it stays put while the page content cross-fades.
 * Browsers without the API, reduced motion, modified clicks, back/forward and external links navigate as usual.
 */
export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const resolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    resolveRef.current?.();
    resolveRef.current = null;
  }, [pathname]);

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (prefersReducedMotion()) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      // Links to files (a gallery photo, a PDF) are not pages: leave them to their own handlers or the browser.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      const href = url.pathname + url.search + url.hash;
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            resolveRef.current = resolve;
            router.push(href);
            window.setTimeout(resolve, 1200);
          }),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
