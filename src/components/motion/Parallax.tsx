import type { CSSProperties, ReactNode } from "react";

interface Props {
  /** Fraction of a 10rem travel across the element's pass through the viewport. Keep it small (0.1–0.3). */
  speed?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Decorative drift on scroll. CSS scroll-driven animation (motion.css): runs on the compositor with no
 * JavaScript, desktop only, and simply stays still where unsupported or under reduced motion.
 * Never wrap content in this; it is for ornaments.
 */
export function Parallax({ speed = 0.15, className, style, children }: Props) {
  return (
    <span aria-hidden="true" data-parallax="" className={className} style={{ ...style, "--speed": speed } as CSSProperties}>
      {children}
    </span>
  );
}
