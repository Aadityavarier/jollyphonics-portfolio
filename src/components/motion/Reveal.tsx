import type { ElementType, ReactNode } from "react";
import { RevealTarget } from "./RevealTarget";

export type RevealVariant = "rise" | "fade" | "mask" | "panel" | "calm";

interface RevealProps {
  as?: ElementType;
  variant?: RevealVariant;
  className?: string;
  id?: string;
  children?: ReactNode;
}

/**
 * Reveals once on scroll. Server markup is complete and visible; the hidden state is applied by the
 * hydrated leaf (RevealTarget) only when the node is below the fold.
 * "mask" expects a single line wrapper; use SectionHeading for headings.
 */
export function Reveal({ as, variant = "rise", className, id, children }: RevealProps) {
  return (
    <RevealTarget as={as} attr="data-reveal" value={variant} className={className} id={id}>
      {variant === "mask" ? <span className="reveal-line">{children}</span> : children}
    </RevealTarget>
  );
}

interface StaggerProps {
  as?: ElementType;
  /** "rise" (default) lifts each child; "side" slides each child in from the left. */
  direction?: "rise" | "side";
  className?: string;
  children?: ReactNode;
}

/** Direct children enter one after another, 60ms apart (--stagger). */
export function Stagger({ as, direction = "rise", className, children }: StaggerProps) {
  return (
    <RevealTarget as={as} attr="data-stagger" value={direction === "side" ? "side" : ""} className={className}>
      {children}
    </RevealTarget>
  );
}
