"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { NavItem } from "@/content/nav";

interface Props {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
  /** Desktop bar: a single underline slides between links instead of each link drawing its own. */
  indicator?: boolean;
}

export function NavLinks({ items, className = "", linkClassName = "", onNavigate, indicator = false }: Props) {
  const pathname = usePathname();
  const ref = useRef<HTMLUListElement>(null);
  const [ready, setReady] = useState(false);

  const place = useCallback(() => {
    const ul = ref.current;
    const cur = ul?.querySelector<HTMLElement>("a[aria-current]");
    if (!ul) return;
    if (!cur) {
      ul.style.setProperty("--ind-w", "0");
      return;
    }
    ul.style.setProperty("--ind-x", `${cur.offsetLeft}px`);
    ul.style.setProperty("--ind-w", String(cur.offsetWidth));
  }, []);

  useLayoutEffect(() => {
    if (indicator) place();
  }, [indicator, place, pathname]);

  useEffect(() => {
    if (!indicator) return;
    setReady(true);
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [indicator, place]);

  return (
    <ul ref={ref} className={`${className} ${indicator ? "nav-ul relative" : ""}`.trim()} data-ready={ready ? "" : undefined}>
      {items.map((item) => {
        const current = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              onClick={onNavigate}
              className={`${linkClassName} ${current ? "nav-cur" : ""}`.trim()}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
      {indicator && <li aria-hidden="true" className="nav-ind" />}
    </ul>
  );
}
