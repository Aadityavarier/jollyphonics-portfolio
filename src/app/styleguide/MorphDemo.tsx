"use client";

import { useState } from "react";
import { MorphDiv, MorphProvider } from "@/components/motion/SharedMorph";

/** Styleguide-only: two cards that swap places with a shared layout animation (the Home selector and Contact branch toggle use the same engine). */
export function MorphDemo() {
  const [flip, setFlip] = useState(false);
  const cards = ["East", "West"];
  return (
    <MorphProvider>
      <div className="grid gap-4">
        <button type="button" aria-pressed={flip} onClick={() => setFlip((f) => !f)} className="cta cta-call cta-secondary justify-self-start">
          Swap the cards
        </button>
        <div className="flex gap-3">
          {(flip ? [...cards].reverse() : cards).map((c) => (
            <MorphDiv key={c} layout transition={{ type: "spring", stiffness: 300, damping: 32 }} className="rounded-[var(--radius-panel)] bg-surface px-6 py-4 font-display font-bold">
              {c}
            </MorphDiv>
          ))}
        </div>
      </div>
    </MorphProvider>
  );
}
