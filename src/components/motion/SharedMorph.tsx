"use client";

import { LazyMotion, m, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

/** framer-motion's layout engine, loaded on demand (not in the first-load bundle). */
const features = () => import("framer-motion").then((mod) => mod.domMax);

export function MorphProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={features}>{children}</LazyMotion>;
}

export const MorphDiv = m.div;
export const MorphSpan = m.span;
export type MorphDivProps = HTMLMotionProps<"div">;
