import type { CSSProperties } from "react";
import { PHONICS_TILES } from "./PhonicsAccent";

/** Resting angle and vertical offset per tile, so the word reads as loose flash cards. */
const TILT = [-6, 4, -3, 5, -4];
const LIFT = [0.12, -0.1, 0.06, -0.14, 0.04];

/**
 * Fills a PageHero's empty right column when a page has no photo yet: a few sound tiles spelling one word, on a
 * soft field with faint oversized tiles behind. Decorative only (aria-hidden), tablet and up only, so it never
 * adds height above the content on a phone. The tiles drop in once at first paint (CSS, never fading).
 */
export function HeroTileArt({ word }: { word: string }) {
  return (
    <div data-hero-art aria-hidden="true" className="hero-art hidden md:grid">
      <span className="hero-art-ghost hero-art-ghost-a" />
      <span className="hero-art-ghost hero-art-ghost-b" />
      <div className="hero-art-word">
        {Array.from(word).map((ch, i) => {
          const tile = PHONICS_TILES[(i + 2) % PHONICS_TILES.length];
          return (
            <span
              key={i}
              data-art-tile
              className="hero-art-tile"
              style={{ "--i": i, "--r": `${TILT[i % TILT.length]}deg`, "--lift": `${LIFT[i % LIFT.length]}em`, background: tile.bg, color: tile.fg } as CSSProperties}
            >
              <span className="translate-y-[0.05em]">{ch}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
