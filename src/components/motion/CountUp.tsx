"use client";

import { useEffect, useRef } from "react";
import { DURATION, prefersReducedMotion } from "./tokens";

interface Props {
  /** The figure exactly as content.md writes it, e.g. "4,500+" or "20+". Rendered as-is on the server. */
  value: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/** Each text change costs a style + layout pass, so the count steps ~20 times instead of every frame. */
const STEP_MS = 60;

/**
 * Counts up to `value` once. The server HTML holds the final figure (no-JS, crawlers, screen readers).
 * It only counts when that cannot cause a visible jump: the figure is still off screen, or still inside
 * the hero's entrance delay (an ancestor `.enter` animation that has not yet started showing it).
 */
export function CountUp({ value }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^([\d,]+)(.*)$/);
    if (!el || !match || prefersReducedMotion()) return;
    const target = Number(match[1].replace(/,/g, ""));
    const suffix = match[2];
    const fmt = (n: number) => n.toLocaleString("en-IN") + suffix;

    let raf = 0;
    const run = (delay: number) => {
      const start = performance.now() + delay;
      let last = -Infinity;
      const tick = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / DURATION.count));
        if (t > 0 && (now - last >= STEP_MS || t === 1)) {
          last = now;
          el.textContent = fmt(Math.round(easeOut(t) * target));
        }
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const entrance = el.closest<HTMLElement>(".enter")?.getAnimations()[0];
    const delay = entrance ? Number(entrance.effect?.getTiming().delay ?? 0) : 0;
    const elapsed = entrance ? Number(entrance.currentTime ?? Infinity) : Infinity;
    if (entrance && elapsed < delay) {
      el.textContent = fmt(0);
      run(delay - elapsed);
      return () => cancelAnimationFrame(raf);
    }

    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.textContent = fmt(0);
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        run(0);
      });
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
      };
    }
  }, [value]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {value}
      </span>
    </>
  );
}
