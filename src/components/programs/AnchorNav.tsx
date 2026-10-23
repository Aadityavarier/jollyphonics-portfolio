"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHydrated } from "@/components/motion/useHydrated";

interface Item {
  id: string;
  label: string;
}

/**
 * Sticky secondary nav under the header: the section in view is underlined by a single bar that slides between
 * items (transform only), and on a phone the active item scrolls into the middle of the strip.
 */
export function AnchorNav({ items }: { items: readonly Item[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const ul = useRef<HTMLUListElement>(null);
  const ready = useHydrated();

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const place = useCallback(() => {
    const list = ul.current;
    const a = list?.querySelector<HTMLElement>("a[aria-current]");
    if (!list || !a) return;
    list.style.setProperty("--ind-x", `${a.offsetLeft}px`);
    list.style.setProperty("--ind-w", String(a.offsetWidth));
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
  }, []);

  useLayoutEffect(() => {
    place();
  }, [active, place]);

  return (
    <nav aria-label="Programs" className="sticky top-[var(--header-h)] z-20 border-b border-ink/10 bg-paper">
      <ul
        ref={ul}
        data-ready={ready ? "" : undefined}
        className="anchor-list relative mx-auto flex max-w-[var(--content-max)] gap-6 overflow-x-auto px-[var(--gutter)] text-small font-medium whitespace-nowrap"
      >
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={`block py-3.5 transition-colors duration-[var(--dur-ui)] ${active === i.id ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {i.label}
            </a>
          </li>
        ))}
        <li aria-hidden="true" className="anchor-ind" />
      </ul>
    </nav>
  );
}
