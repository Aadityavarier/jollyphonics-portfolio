"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { useHydrated } from "@/components/motion/useHydrated";
import { prefersReducedMotion } from "@/components/motion/tokens";

interface Props {
  sounds: readonly string[];
  word: string;
}

type Mode = "names" | "sounds";

/**
 * The difference parents feel but can't name: knowing letter names (C, A, T: separate, nothing to blend) versus
 * letter sounds (c – a – t slide together into "cat"). Both layers are always in the HTML. The server state is
 * "sounds", which no-JS readers get; once on screen it plays names, then sounds, once; the toggle then lets the
 * visitor flip between them. Under reduced motion both layers show side by side (motion.css), no toggle.
 */
export function NamesVsSounds({ sounds, word }: Props) {
  const hydrated = useHydrated();
  const [mode, setMode] = useState<Mode>("sounds");
  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  // Plays names → sounds once, the first time the card is well in view (never after the visitor has used the toggle).
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (touched.current) return;
        setMode("names");
        timer = window.setTimeout(() => !touched.current && setMode("sounds"), 1300);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const choose = (m: Mode) => {
    touched.current = true;
    setMode(m);
  };
  const namesLine = `${sounds.map((s) => s.toUpperCase()).join(" · ")} … ?`;
  const soundsLine = `${sounds.join(" – ")} → ${word}`;

  return (
    <div ref={root} data-mode={mode} className="nvs grid gap-6">
      <div className={`nvs-toggle inline-flex justify-self-start rounded-full bg-surface p-1 ${hydrated ? "" : "invisible"}`} role="group" aria-label="Show letter names or letter sounds">
        {(["names", "sounds"] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => choose(m)}
            className={`min-h-11 rounded-full px-5 font-display text-lead font-bold transition-colors duration-200 ${mode === m ? "bg-ink text-paper" : "text-ink"}`}
          >
            {m === "names" ? "Letter names" : "Letter sounds"}
          </button>
        ))}
      </div>

      <div className="nvs-stack">
        <div className="nvs-layer nvs-names grid gap-4" aria-hidden={mode !== "names" && hydrated ? true : undefined}>
          <div className="nvs-row" aria-hidden="true">
            {sounds.map((s, i) => (
              <span key={s} className="nvs-tile" style={{ "--i": i, background: PHONICS_TILES[i % PHONICS_TILES.length].bg, color: PHONICS_TILES[i % PHONICS_TILES.length].fg } as CSSProperties}>
                <span className="translate-y-[0.05em]">{s.toUpperCase()}</span>
              </span>
            ))}
          </div>
          <p className="font-display text-lead font-bold">{namesLine}</p>
        </div>
        <div className="nvs-layer nvs-sounds grid gap-4" aria-hidden={mode !== "sounds" && hydrated ? true : undefined}>
          <div className="nvs-row" aria-hidden="true">
            {sounds.map((s, i) => (
              <span key={s} className="nvs-tile" style={{ "--i": i, background: PHONICS_TILES[(i + 3) % PHONICS_TILES.length].bg, color: PHONICS_TILES[(i + 3) % PHONICS_TILES.length].fg } as CSSProperties}>
                <span className="translate-y-[0.05em]">{s}</span>
              </span>
            ))}
          </div>
          <p className="font-display text-lead font-bold" aria-live="polite">
            {soundsLine}
          </p>
        </div>
      </div>
    </div>
  );
}
