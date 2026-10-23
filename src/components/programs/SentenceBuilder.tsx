"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { armReveal } from "@/components/motion/reveal-engine";
import { EASE, prefersReducedMotion } from "@/components/motion/tokens";

export interface Word {
  text: string;
  /** Part-of-speech label shown once the sentence is in order. Omit for words we do not label. */
  pos?: "noun" | "verb" | "adverb" | "adjective" | "pronoun";
}

interface Props {
  words: readonly Word[];
  /** Visual order while jumbled: jumble[i] is the slot of word i. */
  jumble: readonly number[];
  className?: string;
}

const POS_COLOUR: Record<NonNullable<Word["pos"]>, string> = {
  noun: "var(--color-letter-o)",
  verb: "var(--color-letter-p)",
  adverb: "var(--color-letter-c)",
  adjective: "var(--color-letter-i)",
  pronoun: "var(--color-letter-n)",
};

type Phase = "done" | "jumbled" | "ordered";

/**
 * Grammar demo: word tiles drop in jumbled, snap into order (FLIP, transforms only), then each gets its part
 * of speech as a colour and a small label. DOM order is always the correct sentence (screen readers read it
 * right); the jumble is visual only (CSS order). Static and complete without JS and under reduced motion.
 */
export function SentenceBuilder({ words, jumble, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("done");
  const first = useRef<Map<number, DOMRect>>(new Map());
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top >= window.innerHeight * 0.9) setPhase("jumbled");
    const off = armReveal(el, {
      hide: false,
      onShow: () => {
        setPhase("jumbled");
        timers.current.push(
          window.setTimeout(() => {
            first.current = new Map(Array.from(el.querySelectorAll<HTMLElement>("[data-w]")).map((n) => [Number(n.dataset.w), n.getBoundingClientRect()]));
            setPhase("ordered");
          }, 1100),
        );
      },
    });
    const pending = timers.current;
    return () => {
      off();
      pending.forEach(clearTimeout);
    };
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (phase !== "ordered" || !el) return;
    el.querySelectorAll<HTMLElement>("[data-w]").forEach((n) => {
      const i = Number(n.dataset.w);
      const a = first.current.get(i);
      if (!a) return;
      const b = n.getBoundingClientRect();
      n.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: "none" }], {
        duration: 620,
        delay: i * 70,
        easing: EASE.out,
        fill: "backwards",
      });
    });
  }, [phase]);

  const tagged = phase === "done" || phase === "ordered";
  return (
    <div ref={root} className={`sentence ${className}`.trim()} data-phase={phase}>
      <p className="sr-only">{words.map((w) => w.text).join(" ")}</p>
      <ul aria-hidden="true" className="flex flex-wrap items-start gap-3">
        {words.map((w, i) => (
          <li
            key={w.text}
            data-w={i}
            className="sentence-word grid justify-items-center gap-1"
            style={{ order: phase === "jumbled" ? jumble[i] : 0, "--i": i } as CSSProperties}
          >
            <span
              className="sentence-tile rounded-[0.9rem] px-4 py-2 font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-none font-bold"
              style={{ "--pos": w.pos ? POS_COLOUR[w.pos] : "var(--color-ink)" } as CSSProperties}
              data-tagged={tagged && w.pos ? "" : undefined}
            >
              {w.text}
            </span>
            <span className="sentence-label text-small font-bold text-muted" data-on={tagged && w.pos ? "" : undefined}>
              {w.pos ?? " "}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
