"use client";

import { useEffect, useRef, useState } from "react";
import { armReveal } from "./reveal-engine";
import { prefersReducedMotion } from "./tokens";

interface Props {
  text: string;
  /** Milliseconds per word (a comfortable speaking pace is about 330). */
  pace?: number;
  className?: string;
}

/**
 * A line read aloud: once it scrolls in, a highlight moves word by word like a reading pointer, and the words it
 * has passed stay solid. Server HTML and reduced motion show the whole line normally. Until the pointer reaches a
 * word it is dimmed, never hidden.
 */
export function ReadAloud({ text, pace = 330, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const [at, setAt] = useState(words.length);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let timer = 0;
    if (el.getBoundingClientRect().top >= window.innerHeight * 0.9) setAt(-1);
    const off = armReveal(el, {
      hide: false,
      onShow: () => {
        let i = -1;
        setAt(-1);
        timer = window.setInterval(() => {
          i += 1;
          setAt(i);
          if (i >= words.length) clearInterval(timer);
        }, pace);
      },
    });
    return () => {
      off();
      clearInterval(timer);
    };
  }, [pace, words.length]);

  return (
    <p ref={ref} className={`read-aloud ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="ra-w" data-state={i === at ? "now" : i < at ? "done" : at >= 0 ? "next" : "wait"}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </p>
  );
}
