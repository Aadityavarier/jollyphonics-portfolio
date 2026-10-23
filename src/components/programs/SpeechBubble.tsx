"use client";

import { useState } from "react";
import { TypeOut } from "@/components/motion/TypeOut";
import { prefersReducedMotion } from "@/components/motion/tokens";

/**
 * English demo: a speech bubble whose text types itself out, then a small "listening" badge pulses three times
 * and stops. Reading, then speaking. The bubble text is the full line for assistive tech and reduced motion.
 */
export function SpeechBubble({ text }: { text: string }) {
  const [listening, setListening] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="bubble relative max-w-[34rem] rounded-[1.5rem] rounded-bl-[0.4rem] bg-ink px-6 py-4 font-display text-[clamp(1.25rem,1.1rem+0.8vw,1.75rem)] leading-snug font-bold text-paper">
        <TypeOut text={text} onDone={() => setListening(!prefersReducedMotion())} />
      </div>
      <span aria-hidden="true" className="waves grid h-12 grid-flow-col items-center gap-1" data-on={listening ? "" : undefined}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="wave-bar" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </span>
    </div>
  );
}
