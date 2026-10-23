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
  /** A dashed outline of the finished shape to trace over, never animated. */
  trace?: string[];
  label?: string;
}

/** SVG strokes that draw themselves once on scroll-in (stroke-dashoffset). Complete when static. */
export function StrokeDraw({ viewBox, paths, duration = 900, strokeWidth = 8, className = "", guides = [], trace = [], label }: Props) {
  return (
    <RevealTarget as="div" attr="data-reveal" value="draw" className={className} data-failsafe={Math.round((paths.length - 1) * duration * 0.85 + duration + 400)}>
      <svg viewBox={viewBox} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false" className="draw-svg">
        {guides.map((d, i) => (
          <path key={`g${i}`} d={d} className="draw-guide" />
        ))}
        {trace.map((d, i) => (
          <path key={`t${i}`} d={d} className="draw-trace" />
        ))}
        {paths.map((d, i) => (
          <path key={i} d={d} pathLength={1} className="draw-path" strokeWidth={strokeWidth} style={{ "--i": i, "--dur": `${duration}ms` } as CSSProperties} />
        ))}
      </svg>
    </RevealTarget>
  );
}
