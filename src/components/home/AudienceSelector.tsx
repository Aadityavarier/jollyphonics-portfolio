"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MorphDiv, MorphProvider, MorphSpan } from "@/components/motion/SharedMorph";
import { prefersReducedMotion } from "@/components/motion/tokens";

export interface Audience {
  id: string;
  label: string;
  card: ReactNode;
}

const NOSCRIPT_CSS = ".aud [role=tabpanel][hidden]{display:block!important;margin-bottom:1rem}.aud [role=tablist]{display:none!important}";

/**
 * "Is it right for my child?" as one shared card that changes into each audience's content. The active-tab
 * pill and the card frame use framer-motion shared layout (loaded lazily). All four audiences stay in the
 * server HTML (inactive panels are `hidden`, crawlable); without JS they show stacked.
 */
export function AudienceSelector({ items, label }: { items: Audience[]; label: string }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const prev = useRef(0);
  const [dir, setDir] = useState<"l" | "r" | null>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [motionOk, setMotionOk] = useState(false);

  const go = (i: number, focus = false) => {
    if (i === active) return;
    setMotionOk(!prefersReducedMotion());
    setDir(i > prev.current ? "r" : "l");
    prev.current = i;
    setActive(i);
    if (focus) btns.current[i]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const n = items.length;
    const next = e.key === "ArrowRight" ? (active + 1) % n : e.key === "ArrowLeft" ? (active + n - 1) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    go(next, true);
  };

  return (
    <MorphProvider>
      <div className="aud grid gap-5">
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
        <div role="tablist" aria-label={label} onKeyDown={onKey} className="aud-list -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {items.map((it, i) => (
            <button
              key={it.id}
              ref={(el) => {
                btns.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${uid}-t-${it.id}`}
              aria-selected={i === active}
              aria-controls={`${uid}-p-${it.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
              className="relative isolate min-h-12 shrink-0 rounded-full px-5 font-display text-lead font-bold"
            >
              {i === active && (
                <MorphSpan
                  layoutId={`${uid}-pill`}
                  transition={motionOk ? { type: "spring", stiffness: 420, damping: 34 } : { duration: 0 }}
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                  aria-hidden="true"
                />
              )}
              <span className={i === active ? "text-paper" : "text-ink"}>{it.label}</span>
              {i !== active && <span aria-hidden="true" className="absolute inset-0 -z-20 rounded-full bg-surface" />}
            </button>
          ))}
        </div>
        <MorphDiv layout transition={motionOk ? { type: "spring", stiffness: 300, damping: 32 } : { duration: 0 }} className="aud-card">
          {items.map((it, i) => (
            <div
              key={it.id}
              role="tabpanel"
              id={`${uid}-p-${it.id}`}
              aria-labelledby={`${uid}-t-${it.id}`}
              hidden={i !== active}
              data-enter={i === active && dir ? dir : undefined}
              className="tabs-panel"
            >
              {it.card}
            </div>
          ))}
        </MorphDiv>
      </div>
    </MorphProvider>
  );
}
