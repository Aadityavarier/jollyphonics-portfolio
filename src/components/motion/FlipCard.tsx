"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { armReveal } from "./reveal-engine";
import { prefersReducedMotion } from "./tokens";

interface Props {
  front: ReactNode;
  back: ReactNode;
  /** "back": the card turns to its back once when it enters (About awards). "front": stays on the front until tapped. */
  enter?: "back" | "front";
  /** Stagger for the entry turn, in ms. */
  delay?: number;
  className?: string;
}

/**
 * Two faces. Without JS, under reduced motion and until hydration, both faces are plainly visible together.
 * When enhanced, the card sits on its front and turns to the back as it scrolls in; tap or Enter/Space turns it
 * again. Both faces stay in the accessibility tree and name the button (what is on the card is what it is called);
 * aria-pressed reports which side is up.
 */
export function FlipCard({ front, back, enter = "back", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    setEnhanced(true);
    if (enter !== "back") return;
    let t = 0;
    const off = armReveal(el, {
      hide: false,
      onShow: () => {
        t = window.setTimeout(() => setFlipped(true), 350 + delay);
      },
    });
    return () => {
      off();
      clearTimeout(t);
    };
  }, [enter, delay]);

  return (
    <div ref={ref} className={`flip ${className}`.trim()} data-enhanced={enhanced ? "" : undefined} data-flipped={flipped ? "" : undefined}>
      <button type="button" className="flip-btn" aria-pressed={flipped} onClick={() => setFlipped((f) => !f)} disabled={!enhanced}>
        <span className="flip-inner">
          <span className="flip-face flip-front">{front}</span>
          <span className="flip-face flip-back">{back}</span>
        </span>
      </button>
    </div>
  );
}
