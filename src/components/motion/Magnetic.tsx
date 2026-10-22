"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { hasFinePointer, prefersReducedMotion } from "./tokens";

interface Props {
  /** Max travel towards the pointer, in px. */
  strength?: number;
  className?: string;
  children: ReactNode;
}

/**
 * The wrapped button leans a few pixels towards the mouse and springs back on leave.
 * Phones never download the spring code: it is imported only for a fine pointer with motion allowed.
 * The wrapper element itself never changes, so observers that watch it (StickyContactBar) stay valid.
 */
export function Magnetic({ strength = 6, className = "", children }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("./spring").then(({ attachMagnetic }) => {
      if (!cancelled) cleanup = attachMagnetic(el, strength);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic ${className}`.trim()}>
      {children}
    </span>
  );
}
