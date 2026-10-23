"use client";

import { useEffect, useRef, useState } from "react";
import { armReveal } from "./reveal-engine";
import { prefersReducedMotion } from "./tokens";

interface Props {
  text: string;
  /** Milliseconds per character; the whole line is capped at maxMs. */
  speed?: number;
  maxMs?: number;
  className?: string;
  onDone?: () => void;
}

/**
 * Types `text` once when it scrolls in. The full text is the server HTML and the accessible name (sr-only);
 * the typed layer is decoration stacked on an invisible copy so the box never changes size. Tap to skip.
 */
export function TypeOut({ text, speed = 38, maxMs = 1800, className = "", onDone }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(text.length);
  const done = useRef(onDone);
  const timer = useRef(0);

  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      done.current?.();
      return;
    }
    const step = Math.max(14, Math.min(speed, maxMs / text.length));
    let i = 0;
    if (el.getBoundingClientRect().top >= window.innerHeight * 0.9) setN(0);
    const off = armReveal(el, {
      hide: false,
      onShow: () => {
        i = 0;
        setN(0);
        timer.current = window.setInterval(() => {
          i += 1;
          setN(i);
          if (i >= text.length) {
            clearInterval(timer.current);
            done.current?.();
          }
        }, step);
      },
    });
    return () => {
      off();
      clearInterval(timer.current);
    };
  }, [text, speed, maxMs]);

  const skip = () => {
    clearInterval(timer.current);
    if (n < text.length) {
      setN(text.length);
      done.current?.();
    }
  };

  return (
    <span ref={ref} className={`typeout ${className}`.trim()} onClick={skip}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="typeout-box">
        <span className="typeout-ghost">{text}</span>
        <span className="typeout-live">
          {text.slice(0, n)}
          {n < text.length && <span className="typeout-caret" />}
        </span>
      </span>
    </span>
  );
}
