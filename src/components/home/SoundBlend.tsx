"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/components/motion/tokens";

const TILES = [
  { bg: "var(--color-letter-c)", fg: "var(--color-ink)" },
  { bg: "var(--color-letter-s)", fg: "#ffffff" },
  { bg: "var(--color-letter-p)", fg: "#ffffff" },
];

interface Props {
  sounds: readonly string[];
  word: string;
}

/**
 * The page's one live thing: tap to blend separate sounds into a word, the way phonics teaches it.
 * Without JavaScript the tiles and the "c – a – t → cat" line still read correctly.
 */
export function SoundBlend({ sounds, word }: Props) {
  const [blended, setBlended] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const spelled = sounds.join(" – ");

  // Plays the blend once by itself the first time the card is well in view (never under reduced
  // motion, and never after the visitor has used the button themselves).
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => !touched.current && setBlended(true), 450);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={root} className="grid gap-6">
      <div className="flex items-center gap-[0.18em] text-[clamp(3.5rem,2.4rem+5vw,6rem)]" aria-hidden="true">
        {sounds.map((s, i) => (
          <span
            key={s}
            className="inline-grid size-[1.2em] place-items-center rounded-[0.22em] font-display leading-none font-bold transition-transform duration-500 ease-[var(--ease-in-out)] motion-reduce:transition-none"
            style={{
              background: TILES[i % TILES.length].bg,
              color: TILES[i % TILES.length].fg,
              transform: blended ? `translateX(${-i * 0.14}em)` : "none",
            }}
          >
            <span className="translate-y-[0.05em]">{s}</span>
          </span>
        ))}
      </div>
      <p className="font-display text-lead font-bold" aria-live="polite">
        {spelled} → {blended ? <span className="text-red">{word}</span> : word}
      </p>
      <button
        type="button"
        onClick={() => {
          touched.current = true;
          setBlended((b) => !b);
        }}
        aria-pressed={blended}
        className="cta cta-call cta-primary justify-self-start"
      >
        {blended ? "Say the sounds again" : "Blend the sounds"}
      </button>
    </div>
  );
}
