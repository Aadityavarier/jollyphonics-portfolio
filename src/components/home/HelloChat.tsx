"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { TypeOut } from "@/components/motion/TypeOut";
import { armReveal } from "@/components/motion/reveal-engine";

const WORD = "hello";
type Phase = "rest" | "tiles" | "bubble";

/** Tiles drop in (about 0.9s), the bubble grows from the last tile's corner and types, then everything rests. */
const TILES_MS = 1000;
const TYPING_MS = 1500;

/**
 * "hello" in sound tiles above a WhatsApp-style bubble holding the same prefilled message the button sends.
 * The server HTML and reduced motion are the finished state (tiles + the full message). Once on screen it
 * plays once: tiles, then bubble, then typing. A tap skips to the finished state. Both boxes keep their size
 * throughout (the typed text sits over an invisible copy), so nothing shifts.
 */
export function HelloChat({ message }: { message: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [phase, setPhase] = useState<Phase>("rest");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = timers.current;
    const off = armReveal(el, {
      hide: false,
      onShow: () => {
        setPhase("tiles");
        timer.push(window.setTimeout(() => setPhase("bubble"), TILES_MS));
        timer.push(window.setTimeout(() => setPhase("rest"), TILES_MS + TYPING_MS));
      },
    });
    return () => {
      off();
      timer.forEach(clearTimeout);
      timer.length = 0;
    };
  }, []);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("rest");
  };

  return (
    <div ref={ref} data-hello-chat data-phase={phase} onClick={skip} className="hc grid gap-4">
      <div aria-hidden="true" className="hc-tiles">
        {Array.from(WORD).map((ch, i) => (
          <span
            key={i}
            data-hello-tile
            className="hc-tile"
            style={{ "--i": i, background: PHONICS_TILES[i % PHONICS_TILES.length].bg, color: PHONICS_TILES[i % PHONICS_TILES.length].fg } as CSSProperties}
          >
            <span className="translate-y-[0.05em]">{ch}</span>
          </span>
        ))}
      </div>
      <div className="enq-bubble hc-bubble max-w-[28rem] whitespace-pre-line">
        {phase === "bubble" ? <TypeOut text={message} speed={22} maxMs={1400} /> : <span>{message}</span>}
      </div>
    </div>
  );
}
