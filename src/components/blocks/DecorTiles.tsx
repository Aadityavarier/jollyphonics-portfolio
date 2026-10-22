import type { CSSProperties } from "react";
import { Parallax } from "@/components/motion/Parallax";

export type DecorLayout = "corners" | "edge";

interface Tile {
  ch: string;
  /** Position and size, as Tailwind classes (literal strings so they are generated). */
  pos: string;
  r: number;
  speed: number;
}

/** Letters from the logo's "Phonics", oversized and faint, bleeding off the panel edges. */
const LAYOUTS: Record<DecorLayout, Tile[]> = {
  corners: [
    { ch: "P", pos: "-top-16 -right-10 size-56 text-[9rem] lg:size-80 lg:text-[13rem]", r: 12, speed: 0.25 },
    { ch: "s", pos: "-bottom-20 -left-12 size-48 text-[8rem] lg:size-64 lg:text-[10rem]", r: -10, speed: 0.15 },
  ],
  edge: [
    { ch: "h", pos: "top-1/4 -right-20 size-52 text-[8.5rem] lg:size-72 lg:text-[12rem]", r: -8, speed: 0.2 },
    { ch: "o", pos: "-bottom-24 right-1/3 size-40 text-[6.5rem] max-lg:hidden", r: 14, speed: 0.12 },
  ],
};

/** Decorative only: hidden from assistive tech, never interactive, drifts on desktop scroll. */
export function DecorTiles({ layout }: { layout: DecorLayout }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 select-none">
      {LAYOUTS[layout].map((t) => (
        <Parallax
          key={t.ch}
          speed={t.speed}
          style={{ "--r": `${t.r}deg`, transform: `rotate(${t.r}deg)` } as CSSProperties}
          className={`absolute grid place-items-center rounded-[0.18em] bg-white/[0.07] font-display leading-none font-extrabold text-white/[0.13] ${t.pos}`}
        >
          <span className="translate-y-[0.06em]">{t.ch}</span>
        </Parallax>
      ))}
    </span>
  );
}
