import type { CSSProperties } from "react";
import { RevealTarget } from "./RevealTarget";

interface Props {
  viewBox: string;
  /** Each path is drawn in turn. Paths use pathLength=1, so any geometry animates the same way. */
  paths: string[];
  /** Draw time per path, ms. */
  duration?: number;
  strokeWidth?: number;
  className?: string;
  /** Static guide geometry (ruled lines etc.), never animated. */
  guides?: string[];
  label?: string;
}

/** SVG strokes that draw themselves once on scroll-in (stroke-dashoffset). Complete when static. */
export function StrokeDraw({ viewBox, paths, duration = 900, strokeWidth = 8, className = "", guides = [], label }: Props) {
  return (
    <RevealTarget as="div" attr="data-reveal" value="draw" className={className}>
      <svg viewBox={viewBox} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false" className="draw-svg">
        {guides.map((d, i) => (
          <path key={`g${i}`} d={d} className="draw-guide" />
        ))}
        {paths.map((d, i) => (
          <path key={i} d={d} pathLength={1} className="draw-path" strokeWidth={strokeWidth} style={{ "--i": i, "--dur": `${duration}ms` } as CSSProperties} />
        ))}
      </svg>
    </RevealTarget>
  );
}
