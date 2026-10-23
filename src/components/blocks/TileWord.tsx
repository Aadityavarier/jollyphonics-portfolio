"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { PHONICS_TILES } from "./PhonicsAccent";
import { EASE, hasFinePointer, prefersReducedMotion } from "@/components/motion/tokens";

interface Props {
  text: string;
  className?: string;
  /** Set inside a heading: tiles are smaller than the type, and spread closed from the sides without ever fading (the h1 is the LCP element). */
  inline?: boolean;
}

/** Resting angles, so the row reads as loose flash cards rather than a typeset word. */
const ANGLES = [-6, 4, -3, 5, -4, 3, -5];
/** Where each tile starts before it flies into place (em of the tile size, degrees). */
const SCATTER = [
  { x: -3.2, y: -2.4, r: -38 },
  { x: 2.4, y: 1.8, r: 52 },
  { x: -1.2, y: -2.9, r: -64 },
  { x: 3.4, y: 2.2, r: 41 },
  { x: -2.6, y: 2.6, r: -47 },
  { x: 1.6, y: -2.1, r: 70 },
  { x: -3.0, y: 1.4, r: -30 },
];

/**
 * The hero's sound tiles: two elements each (see motion.css). The outer .tile takes the pointer lean
 * (desktop) and the tap hop; the inner .tile-face holds the resting angle and the short idle bob.
 * Decorative: the word is given once to screen readers; tiles are not focusable.
 */
export function TileWord({ text, className = "", inline = false }: Props) {
  const area = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = area.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("@/components/motion/spring").then(({ attachLean }) => {
      if (cancelled) return;
      cleanup = attachLean(el, Array.from(el.querySelectorAll<HTMLElement>(".tile")));
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const hop = (e: PointerEvent<HTMLSpanElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>(".tile");
    if (!tile || prefersReducedMotion()) return;
    // translate/scale, not transform: the pointer lean owns `transform` on this element.
    tile.animate(
      [
        { translate: "0 0", scale: "1" },
        { translate: "0 -18%", scale: "1.12", offset: 0.4 },
        { translate: "0 0", scale: "1" },
      ],
      { duration: 360, easing: EASE.out },
    );
  };

  return (
    <span ref={area} onPointerDown={hop} data-tile-inline={inline || undefined} className={`inline-flex items-center gap-[0.14em] ${inline ? "text-[0.56em] align-middle" : ""} ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, k) => {
        const tile = PHONICS_TILES[k % PHONICS_TILES.length];
        const style = {
          "--r": `${ANGLES[k % ANGLES.length]}deg`,
          "--bob": `${1.4 + (k % 3) * 0.1}s`,
          "--bob-delay": `${2 + k * 0.12}s`,
          "--sx": `${SCATTER[k % SCATTER.length].x}em`,
          "--sy": `${SCATTER[k % SCATTER.length].y}em`,
          "--sr": `${SCATTER[k % SCATTER.length].r}deg`,
          "--asm": `${k * 55}ms`,
          "--spx": `${(k - (text.length - 1) / 2) * 0.7}em`,
        } as CSSProperties;
        return (
          <span key={k} aria-hidden="true" className="tile cursor-pointer select-none">
            <span
              className="tile-face size-[1.35em] place-items-center rounded-[0.24em] pt-[0.12em] font-display leading-none font-bold"
              style={{ ...style, background: tile.bg, color: tile.fg }}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </span>
  );
}
