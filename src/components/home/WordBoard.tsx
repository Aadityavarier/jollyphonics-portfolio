"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { home } from "@/content/home";
import { matchWord, nextSlot } from "@/lib/word-board";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { useHydrated } from "@/components/motion/useHydrated";
import { EASE, prefersReducedMotion } from "@/components/motion/tokens";
import { labels } from "@/content/labels";

const { words, example, prompt, title } = home.board;
const letters: readonly string[] = home.board.letters;
const SLOTS = 3;
const EMPTY: (string | null)[] = Array(SLOTS).fill(null);
const EXAMPLE = Array.from(example) as (string | null)[];

/** The tile colour follows the letter, so a sound keeps its colour wherever it sits. */
const tileFor = (l: string) => PHONICS_TILES[letters.indexOf(l) % PHONICS_TILES.length];

type Mode = "example" | "demo" | "free";

/**
 * The hero's moment: tap sounds to build a three-letter word and watch them blend. It opens showing "cat"
 * (server HTML, no-JS and reduced motion all see that), plays one short demo by itself, and any tap hands over
 * to the visitor. Transforms only; the tray tile is the FLIP origin of each placed sound.
 */
export function WordBoard() {
  const hydrated = useHydrated();
  const [slots, setSlots] = useState<(string | null)[]>(EXAMPLE);
  const [mode, setMode] = useState<Mode>("example");
  const timers = useRef<number[]>([]);
  const tray = useRef<Record<string, HTMLButtonElement | null>>({});
  const faceEls = useRef<(HTMLSpanElement | null)[]>([]);
  const fly = useRef<{ slot: number; letter: string } | null>(null);

  const full = nextSlot(slots) === -1;
  const word = full ? matchWord(slots, words) : null;
  const blended = full && word !== null;
  const spelled = slots.filter(Boolean).join(" – ");
  const line = word ? `${spelled} → ${word}` : spelled;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (ms: number, fn: () => void) => void timers.current.push(window.setTimeout(fn, ms));

  const place = (letter: string, from: (string | null)[]) => {
    const i = nextSlot(from);
    if (i === -1) return from;
    fly.current = { slot: i, letter };
    return from.map((s, k) => (k === i ? letter : s));
  };

  // Plays the placed sound in from its tray tile (FLIP: measured once, transform only). The FLIP runs on the
  // tile face; the slot around it owns the blend shift, so no element ever has two transform animations.
  useLayoutEffect(() => {
    const f = fly.current;
    fly.current = null;
    if (!f || prefersReducedMotion()) return;
    const to = faceEls.current[f.slot];
    const from = tray.current[f.letter];
    if (!to || !from || typeof to.animate !== "function") return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    to.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(0.8)` }, { transform: "none" }], {
      duration: 340,
      easing: EASE.out,
    });
  }, [slots]);

  // One demo, a moment after hydration: c, a, t drop in and blend. Skipped under reduced motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    later(1200, () => {
      setMode("demo");
      setSlots(EMPTY);
      let t = 0;
      Array.from(example).forEach((l) => {
        t += 380;
        later(t, () => setSlots((s) => place(l, s)));
      });
      later(t + 500, () => setMode("free"));
    });
    return clearTimers;
  }, []);

  const add = (letter: string) => {
    clearTimers();
    // A full board (or the opening example / demo) starts a fresh word.
    setSlots((s) => place(letter, mode === "free" && nextSlot(s) !== -1 ? s : EMPTY));
    setMode("free");
  };
  const removeLast = () => {
    clearTimers();
    setMode("free");
    setSlots((s) => {
      const filled = s.filter(Boolean).length;
      return filled === 0 ? s : s.map((v, k) => (k === filled - 1 ? null : v));
    });
  };
  const clear = () => {
    clearTimers();
    setMode("free");
    setSlots(EMPTY);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      removeLast();
    }
  };

  return (
    <div role="group" aria-label={labels.home.board.name} onKeyDown={onKey} className="grid gap-5 text-[clamp(2.25rem,1.4rem+3.2vw,4rem)]">
      <p className="font-display text-[0.4em] leading-none font-bold text-paper/90">{title}</p>
      <div data-testid="board-slots" className="flex min-h-[1.3em] items-center justify-center gap-[0.14em]">
        {slots.map((s, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`inline-grid size-[1.2em] rounded-[0.22em] font-display leading-none font-bold transition-transform duration-500 ease-[var(--ease-in-out)] motion-reduce:transition-none ${s ? "" : "border-2 border-dashed border-paper/50"}`}
            style={{ transform: blended ? `translateX(${-i * 0.14}em)` : "none" } as CSSProperties}
          >
            {s && (
              <span
                data-face=""
                ref={(el) => {
                  faceEls.current[i] = el;
                }}
                className="grid place-items-center rounded-[inherit]"
                style={{ background: tileFor(s).bg, color: tileFor(s).fg }}
              >
                <span className="translate-y-[0.05em]">{s}</span>
              </span>
            )}
          </span>
        ))}
      </div>
      <p className="min-h-[1.5em] text-center font-display text-[0.4em] leading-tight font-bold text-paper" aria-live="polite">
        {line}
      </p>
      <div className="flex justify-center gap-[0.12em]">
        {letters.map((l) => (
          <button
            key={l}
            type="button"
            ref={(el) => {
              tray.current[l] = el;
            }}
            aria-label={`Add sound ${l}`}
            onClick={() => add(l)}
            disabled={!hydrated}
            className="inline-grid size-[0.9em] cursor-pointer place-items-center rounded-[0.22em] font-display text-[0.9em] leading-none font-bold transition-transform duration-150 active:scale-90 enabled:hover:-translate-y-0.5 motion-reduce:transition-none"
            style={{ background: tileFor(l).bg, color: tileFor(l).fg }}
          >
            <span className="translate-y-[0.05em]">{l}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 text-[0.3em]">
        <p className={`font-bold text-paper ${hydrated ? "" : "invisible"}`}>{prompt}</p>
        <button type="button" onClick={clear} disabled={!hydrated} className="font-bold text-paper underline underline-offset-4">
          {labels.home.board.clear}
        </button>
      </div>
    </div>
  );
}
