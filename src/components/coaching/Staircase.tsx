"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { loadGsap, whenNear } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/tokens";

interface Props {
  steps: readonly string[];
  /** Accessible summary, e.g. "Sr. KG to Std. 8". */
  label: string;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Coaching's signature: Sr. KG to Std. 8 as a staircase. As the block scrolls through the screen the steps rise
 * one after another and a small tile climbs them (scrubbed by scroll, no pin). Wide screens: steps rise from the
 * floor and the tile hops up them. Phones: the same steps as bars that grow down the page, the tile stepping
 * down each rung. Without GSAP and under reduced motion every step is at full height with the tile on top.
 */
export function Staircase({ steps, label }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const n = steps.length;

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    const stop = whenNear(el, async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;
      const mm = gsap.matchMedia(el);
      const items = gsap.utils.toArray<HTMLElement>(".stair-step", el);
      const bgs = gsap.utils.toArray<HTMLElement>(".stair-bg", el);
      const labels = gsap.utils.toArray<HTMLElement>(".stair-label", el);
      const tile = el.querySelector<HTMLElement>(".stair-tile")!;

      const run = (wide: boolean) => {
        el.setAttribute("data-enhanced", wide ? "wide" : "tall");
        const reset = () => {
          bgs.forEach((bg) => (bg.style.transform = ""));
          labels.forEach((l) => (l.style.opacity = ""));
        };
        let spots: { x: number; y: number }[] = [];
        const measure = () => {
          const box = el.getBoundingClientRect();
          const tw = tile.offsetWidth;
          const th = tile.offsetHeight;
          spots = items.map((it) => {
            const r = it.getBoundingClientRect();
            return wide
              ? { x: r.left - box.left + r.width / 2 - tw / 2, y: r.top - box.top - th + 4 }
              : { x: r.right - box.left - tw - 6, y: r.top - box.top + r.height / 2 - th / 2 };
          });
        };
        // Steps are laid out at full size, so measure before they are scaled down.
        measure();
        const apply = (p: number) => {
          bgs.forEach((bg, i) => {
            const k = clamp((p - (i / n) * 0.85) / 0.15);
            bg.style.transform = wide ? `scaleY(${k})` : `scaleX(${k})`;
            labels[i].style.opacity = String(k);
          });
          const f = clamp(p / 0.96) * (n - 1);
          const i = Math.min(n - 2, Math.floor(f));
          const t = f - i;
          const a = spots[i];
          const b = spots[i + 1];
          if (!a || !b) return;
          const hop = Math.sin(t * Math.PI) * (wide ? 18 : 6);
          tile.style.transform = `translate(${a.x + (b.x - a.x) * t}px, ${a.y + (b.y - a.y) * t - hop}px) rotate(${(t - 0.5) * (wide ? 14 : 0)}deg)`;
        };
        apply(0);
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          end: "bottom 38%",
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            reset();
            measure();
            apply(self.progress);
          },
          onUpdate: (self) => apply(self.progress),
        });
        ScrollTrigger.refresh();
        return () => {
          el.removeAttribute("data-enhanced");
          reset();
          tile.style.transform = "";
        };
      };

      mm.add("(min-width: 768px)", () => run(true));
      mm.add("(max-width: 767px)", () => run(false));
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      stop();
      revert?.();
    };
  }, [n]);

  return (
    <div ref={root} className="stair" role="group" aria-label={label}>
      <ol className="stair-list">
        {steps.map((s, i) => (
          <li
            key={s}
            className="stair-step"
            style={{ "--k": i + 1, "--c": PHONICS_TILES[i % PHONICS_TILES.length].bg, "--fg": PHONICS_TILES[i % PHONICS_TILES.length].fg } as CSSProperties}
          >
            <span aria-hidden="true" className="stair-bg" />
            <span className="stair-label">{s}</span>
          </li>
        ))}
      </ol>
      <span aria-hidden="true" className="stair-tile">
        a
      </span>
    </div>
  );
}
