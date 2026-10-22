"use client";

import { useEffect, useRef, useState } from "react";

interface Item {
  id: string;
  label: string;
}

/** Sticky secondary nav: the section currently in view gets the active underline. */
export function AnchorNav({ items }: { items: readonly Item[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const ref = useRef<HTMLElement>(null);

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

  return (
    <nav
      ref={ref}
      aria-label="Programs"
      className="sticky top-[64px] z-20 border-b border-ink/10 bg-paper/90 backdrop-blur md:top-[88px]"
    >
      <ul className="mx-auto flex max-w-[var(--content-max)] gap-6 overflow-x-auto px-[var(--gutter)] py-3 text-small font-medium whitespace-nowrap">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={`inline-block pb-1 transition-colors duration-[var(--dur-ui)] ${
                active === i.id ? "border-b-2 border-red text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
