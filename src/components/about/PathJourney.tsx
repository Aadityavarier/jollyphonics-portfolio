"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { Milestone } from "@/content/journey";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { SectionHeading } from "@/components/layout/Section";
import { loadGsap, whenNear } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/tokens";

interface Props {
  title: string;
  milestones: readonly Milestone[];
}

/** One smooth S-curve through a point per milestone, in a 0..1000 × 0..100 box (stretched to the track). */
function pathFor(n: number) {
  const pts = Array.from({ length: n }, (_, i) => [((i + 0.5) / n) * 1000, i % 2 ? 70 : 30] as const);
  let d = "M0 50";
  let [px, py] = [0, 50];
  for (const [x, y] of [...pts, [1000, 50] as const]) {
    const mid = (x - px) / 2;
    d += ` C${px + mid} ${py} ${x - mid} ${y} ${x} ${y}`;
    [px, py] = [x, y];
  }
  return d;
}

/**
 * About's signature: her years drawn as a path. Desktop: the section pins and the track scrolls sideways while
 * the path draws and each milestone lights up as the pen reaches it. Phone: a vertical path draws down beside
 * the list, scrubbed by ordinary scroll (no pin). Without GSAP, under reduced motion and without JS it is the
 * plain vertical list, every milestone fully visible.
 */
export function PathJourney({ title, milestones }: Props) {
  const root = useRef<HTMLElement>(null);
  const n = milestones.length;

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    const stop = whenNear(el, async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;
      const mm = gsap.matchMedia(el);
      const q = <T extends Element>(sel: string) => el.querySelector<T>(sel)!;
      const items = gsap.utils.toArray<HTMLElement>(".journey-item", el);

      mm.add("(min-width: 1024px)", () => {
        el.setAttribute("data-mode", "h");
        const track = q<HTMLElement>(".journey-track");
        const view = q<HTMLElement>(".journey-view");
        const path = q<SVGPathElement>(".journey-path path");
        const setX = gsap.quickSetter(track, "x", "px");
        // Measured once per refresh, never inside the scroll handler (no layout reads while scrolling).
        let m = { w: 0, d: 0, gut: 0, vw: 0, reach: [] as number[] };
        const measure = () => {
          const gut = parseFloat(getComputedStyle(view).paddingLeft) || 0;
          const w = track.scrollWidth;
          const vw = view.clientWidth;
          const d = Math.max(0, w - (vw - 2 * gut));
          // The pen sits 60% across the screen; milestone i lights when it is under the pen.
          const reach = items.map((_, i) => (d <= 0 ? 0 : Math.min(1, Math.max(0, ((i + 0.5) / n) * w + gut - vw * 0.6) / d)));
          m = { w, d, gut, vw, reach };
        };
        measure();
        let reached = items.map(() => false);
        const apply = (p: number) => {
          setX(-p * m.d);
          const f = Math.min(1, Math.max(0, (p * m.d + m.vw * 0.6 - m.gut) / m.w));
          path.style.strokeDashoffset = String(1 - f);
          items.forEach((it, i) => {
            const on = p >= m.reach[i] - 0.0001;
            if (on !== reached[i]) {
              reached[i] = on;
              it.classList.toggle("is-reached", on);
            }
          });
        };
        apply(0);
        ScrollTrigger.create({
          trigger: q(".journey-pin"),
          start: "top top",
          end: () => {
            measure();
            return `+=${m.d}`;
          },
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            measure();
            reached = items.map(() => false);
            apply(self.progress);
          },
          onUpdate: (self) => apply(self.progress),
        });
        ScrollTrigger.refresh();
        return () => {
          el.removeAttribute("data-mode");
          gsap.set(track, { clearProps: "transform" });
          path.style.strokeDashoffset = "";
          items.forEach((it) => it.classList.remove("is-reached"));
        };
      });

      mm.add("(max-width: 1023px)", () => {
        el.setAttribute("data-mode", "v");
        const list = q<HTMLElement>(".journey-list");
        const fill = q<HTMLElement>(".journey-fill");
        ScrollTrigger.create({
          trigger: list,
          start: "top 70%",
          end: "bottom 60%",
          onUpdate: (self) => (fill.style.transform = `scaleY(${self.progress.toFixed(3)})`),
        });
        items.forEach((it) =>
          ScrollTrigger.create({
            trigger: it,
            start: "top 78%",
            onEnter: () => it.classList.add("is-reached"),
            onLeaveBack: () => it.classList.remove("is-reached"),
          }),
        );
        return () => {
          el.removeAttribute("data-mode");
          fill.style.transform = "";
          items.forEach((it) => it.classList.remove("is-reached"));
        };
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      stop();
      revert?.();
    };
  }, [n]);

  return (
    <section ref={root} id="journey" aria-labelledby="journey-title" className="journey bg-surface">
      <div className="journey-pin">
        <div className="journey-head mx-auto w-full max-w-[var(--content-max)] px-[var(--gutter)] pt-[var(--section-gap)] pb-6 lg:pt-6">
          <SectionHeading id="journey-title" fx="stroke">
            {title}
          </SectionHeading>
        </div>
        <div className="journey-view mx-auto w-full max-w-[var(--content-max)] px-[var(--gutter)] pb-[var(--section-gap)] lg:max-w-none lg:pb-0">
          <div className="journey-track">
            <svg aria-hidden="true" className="journey-path" viewBox="0 0 1000 100" preserveAspectRatio="none" focusable="false">
              <path d={pathFor(n)} pathLength={1} />
            </svg>
            <ol className="journey-list">
              <li aria-hidden="true" className="journey-fill" />
              {milestones.map((m, i) => {
                const tile = PHONICS_TILES[i % PHONICS_TILES.length];
                return (
                  <li key={`${m.when}-${m.lines[0].id}`} className="journey-item" data-pos={i % 2 ? "low" : "high"} style={{ "--tc": tile.bg } as CSSProperties}>
                    <span aria-hidden="true" className="journey-dot" />
                    <div className="journey-card">
                      <p className="journey-when font-display text-lead font-bold">{m.when}</p>
                      {m.lines.map((l) => (
                        <div key={l.id} className="grid gap-0.5">
                          <p className="font-display text-[1.25rem] leading-tight font-bold">{l.title}</p>
                          {l.detail && <p className="text-small text-muted">{l.detail}</p>}
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
