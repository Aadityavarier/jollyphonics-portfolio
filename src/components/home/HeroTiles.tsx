"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { EASE, hasFinePointer, prefersReducedMotion } from "@/components/motion/tokens";

interface Props {
  text: string;
  className?: string;
}

/** Resting angles, so the row reads as loose flash cards rather than a typeset word. */
const ANGLES = [-6, 4, -3, 5, -4, 3, -5];

/**
 * The hero's sound tiles: two elements each (see motion.css). The outer .tile takes the pointer lean
 * (desktop) and the tap hop; the inner .tile-face holds the resting angle and the short idle bob.
 * Decorative: the word is given once to screen readers; tiles are not focusable.
 */
export function HeroTiles({ text, className = "" }: Props) {
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
    <span ref={area} onPointerDown={hop} className={`inline-flex items-center gap-[0.14em] ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, k) => {
        const tile = PHONICS_TILES[k % PHONICS_TILES.length];
        const style = {
          "--r": `${ANGLES[k % ANGLES.length]}deg`,
          "--bob": `${1.4 + (k % 3) * 0.1}s`,
          "--bob-delay": `${1 + k * 0.12}s`,
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
