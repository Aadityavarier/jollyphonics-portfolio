import type { CSSProperties } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { CountUp } from "@/components/motion/CountUp";
import { RevealTarget } from "@/components/motion/RevealTarget";

const COLS = 7;
const TOTAL = 42;

/**
 * The 42 letter sounds as 42 plain coloured tiles (the sounds themselves are Jolly Learning's material, so the
 * tiles carry no letters). They ripple in from the centre while the counter lands on "42 sounds".
 */
export function SoundWall({ className = "" }: { className?: string }) {
  const rows = TOTAL / COLS;
  const cx = (COLS - 1) / 2;
  const cy = (rows - 1) / 2;
  return (
    <div className={`grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-10 ${className}`.trim()}>
      <p className="font-display text-[clamp(2.5rem,2rem+3vw,4.5rem)] leading-none font-bold">
        <CountUp value="42 sounds" />
      </p>
      <RevealTarget as="ul" attr="data-reveal" value="ripple" aria-hidden className="sound-wall grid max-w-[34rem] grid-cols-7 gap-[clamp(4px,1.2vw,8px)]">
        {Array.from({ length: TOTAL }, (_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          const d = Math.hypot(c - cx, r - cy);
          return (
            <li
              key={i}
              className="aspect-square rounded-[22%]"
              style={{ background: PHONICS_TILES[(c + r) % PHONICS_TILES.length].bg, "--d": `${Math.round(d * 75)}ms` } as CSSProperties}
            />
          );
        })}
      </RevealTarget>
    </div>
  );
}
