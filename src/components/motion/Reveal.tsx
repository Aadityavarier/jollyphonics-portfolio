import type { ElementType, ReactNode } from "react";

export type RevealVariant = "rise" | "fade" | "mask" | "panel";

interface RevealProps {
  as?: ElementType;
  variant?: RevealVariant;
  className?: string;
  id?: string;
  children?: ReactNode;
}

/**
 * Reveals once on scroll (MotionRoot observes it). Server component: it only writes data attributes.
 * "mask" expects a single line wrapper; use SectionHeading or <MaskText> for headings.
 */
export function Reveal({ as: Tag = "div", variant = "rise", className, id, children }: RevealProps) {
  return (
    <Tag data-reveal={variant} className={className} id={id}>
      {variant === "mask" ? <span className="reveal-line">{children}</span> : children}
    </Tag>
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
export function Stagger({ as: Tag = "div", direction = "rise", className, children }: StaggerProps) {
  return (
    <Tag data-stagger={direction === "side" ? "side" : ""} className={className}>
      {children}
    </Tag>
  );
}
