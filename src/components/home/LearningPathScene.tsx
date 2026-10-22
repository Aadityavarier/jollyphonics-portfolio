"use client";

import { useEffect, useRef } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { SectionHeading } from "@/components/layout/Section";
import { loadGsap, whenNear } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/tokens";

interface Props {
  title: string;
  steps: readonly string[];
}

/**
 * The page's signature scroll moment: Hear → Recognise → Blend → Read → Spell → Write.
 * Desktop: the section pins and each scroll step makes the next stage the active one (big word,
 * lifted card, progress bar). Phone: no pinning; each step slides in as it reaches the screen while a
 * line draws down beside the list. GSAP loads only when the section is a screen away, and never under
 * reduced motion. Without it, the list below is the complete content (all six steps, in order).
 */
export function LearningPathScene({ title, steps }: Props) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    const stop = whenNear(el, async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      // matchMedia scoped to the section: each branch's tweens, pins and sets revert when its query stops
      // matching (resize across 1024px) and all of them on unmount.
      const mm = gsap.matchMedia(el);
      const cards = gsap.utils.toArray<HTMLElement>(".path-step", el);
      const last = cards.length - 1;
      const q = (sel: string) => el.querySelector<HTMLElement>(sel);

      mm.add("(min-width: 1024px)", () => {
        el.setAttribute("data-enhanced", "");
        const words = gsap.utils.toArray<HTMLElement>(".path-word", el);
        const count = el.querySelector<HTMLElement>(".path-count");
        let shown = 0;

        gsap.set(cards, { opacity: 0.35, scale: 0.92 });
        gsap.set(cards[0], { opacity: 1, scale: 1, y: -14 });
        gsap.set(words, { yPercent: 100, opacity: 0 });
        gsap.set(words[0], { yPercent: 0, opacity: 1 });
        gsap.set(q(".path-progress"), { scaleX: 0 });

        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" },
          scrollTrigger: {
            trigger: q(".path-pin"),
            start: "top top",
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            scrub: 0.6,
            // Nearest step to where the scroll stopped; with inertia a quick flick would fling past every step.
            snap: { snapTo: "labels", inertia: false, delay: 0.1, duration: { min: 0.2, max: 0.5 }, ease: "power1.inOut" },
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.round(self.progress * last);
              if (i !== shown && count) count.textContent = `Step ${i + 1} of ${cards.length}`;
              shown = i;
            },
          },
        });
        tl.addLabel("s0");
        for (let i = 1; i <= last; i++) {
          const t = i - 1;
          tl.to(cards[i - 1], { y: 0 }, t)
            .to(cards[i], { opacity: 1, scale: 1, y: -14 }, t)
            // Out, then in: the two big words never overlap mid-scrub.
            .to(words[i - 1], { yPercent: -100, opacity: 0, duration: 0.45, ease: "power2.in" }, t)
            .to(words[i], { yPercent: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, t + 0.55)
            .to(q(".path-progress"), { scaleX: i / last, ease: "none" }, t)
            .addLabel(`s${i}`);
        }
        return () => el.removeAttribute("data-enhanced");
      });

      mm.add("(max-width: 1023px)", () => {
        cards.forEach((card, i) => {
          gsap.from(card, {
            x: i % 2 ? 48 : -48,
            opacity: 0,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });
        gsap.fromTo(
          q(".path-line"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".path-steps"), start: "top 70%", end: "bottom 60%", scrub: 0.4 } },
        );
      });
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      stop();
      revert?.();
    };
  }, []);

  return (
    <section ref={root} id="learning-path" aria-labelledby="learning-path-title" className="bg-surface">
      <div className="path-pin lg:flex lg:min-h-svh lg:items-center">
        <div className="mx-auto grid w-full max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)] lg:gap-14 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="learning-path-title">{title}</SectionHeading>
            <p aria-hidden="true" className="path-count path-stage font-display text-lead font-bold text-muted tabular-nums">
              Step 1 of {steps.length}
            </p>
          </div>

          <div aria-hidden="true" className="path-stage overflow-clip">
            {steps.map((s) => (
              <span key={s} className="path-word col-start-1 row-start-1 font-display text-[clamp(4rem,9vw,9rem)] leading-[1.05] font-extrabold tracking-[-0.02em]">
                {s}
              </span>
            ))}
          </div>

          <div className="relative">
            <span aria-hidden="true" className="path-line absolute top-0 bottom-0 left-[1.6rem] w-1 origin-top rounded-full bg-red lg:hidden" />
            <ol className="path-steps relative grid gap-3 lg:grid-cols-6">
              {steps.map((s, i) => {
                const tile = PHONICS_TILES[i % PHONICS_TILES.length];
                return (
                  <li
                    key={s}
                    className="path-step flex items-center gap-4 rounded-[1.25rem] bg-paper p-3 pr-5 shadow-[0_10px_30px_-18px_rgba(22,32,74,0.4)] lg:grid lg:gap-5 lg:p-5"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-[3.25rem] shrink-0 place-items-center rounded-[0.8rem] font-display text-[1.75rem] leading-none font-extrabold lg:size-16 lg:text-[2.25rem]"
                      style={{ background: tile.bg, color: tile.fg }}
                    >
                      <span className="translate-y-[0.06em]">{s[0]}</span>
                    </span>
                    <span className="grid">
                      <span className="text-small text-muted">Step {i + 1}</span>
                      <span className="font-display text-lead leading-tight font-bold">{s}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <span aria-hidden="true" className="mt-6 hidden h-1.5 overflow-clip rounded-full bg-ink/10 lg:block">
              <span className="path-progress block h-full origin-left rounded-full bg-red" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
