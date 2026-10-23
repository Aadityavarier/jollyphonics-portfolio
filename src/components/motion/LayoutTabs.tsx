"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

interface Props {
  tabs: TabItem[];
  /** Accessible name for the tab list. */
  label: string;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  initial?: number;
}

const NOSCRIPT_CSS = ".tabs [role=tabpanel][hidden]{display:block!important}.tabs [role=tablist]{display:none!important}";

/**
 * ARIA tabs with a sliding indicator (one element, transform only) and direction-aware panel entry.
 * Every panel is in the server HTML (crawlable); without JS a <noscript> rule shows them all stacked.
 * Arrow keys / Home / End move and activate; focus follows.
 */
export function LayoutTabs({ tabs, label, className = "", listClassName = "", panelClassName = "", initial = 0 }: Props) {
  const uid = useId();
  const [active, setActive] = useState(initial);
  const prev = useRef(initial);
  const [dir, setDir] = useState<"l" | "r" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  const place = useCallback(() => {
    const list = listRef.current;
    const b = btns.current[active];
    if (!list || !b) return;
    list.style.setProperty("--ind-x", `${b.offsetLeft}px`);
    list.style.setProperty("--ind-w", String(b.offsetWidth));
  }, [active]);

  useLayoutEffect(() => {
    place();
  }, [place]);

  useEffect(() => {
    setReady(true);
    if (typeof ResizeObserver === "undefined" || !listRef.current) return;
    const ro = new ResizeObserver(place);
    ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [place]);

  const go = (i: number, focus = false) => {
    if (i === active) return;
    setDir(i > prev.current ? "r" : "l");
    prev.current = i;
    setActive(i);
    if (focus) btns.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const n = tabs.length;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? (active + 1) % n
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? (active + n - 1) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    go(next, true);
  };

  return (
    <div className={`tabs ${className}`.trim()} data-ready={ready ? "" : undefined}>
      <noscript>
        <style>{NOSCRIPT_CSS}</style>
      </noscript>
      <div ref={listRef} role="tablist" aria-label={label} className={`tabs-list ${listClassName}`.trim()} onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              btns.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            className="tabs-tab"
            onClick={() => go(i)}
          >
            {t.label}
          </button>
        ))}
        <span aria-hidden="true" className="tabs-ind" />
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${uid}-panel-${t.id}`}
          aria-labelledby={`${uid}-tab-${t.id}`}
          hidden={i !== active}
          data-enter={i === active && dir ? dir : undefined}
          className={`tabs-panel ${panelClassName}`.trim()}
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
