/**
 * Shared motion tokens. CSS reads the same values from :root in motion.css; keep the two in sync.
 * Everything animates transform and opacity only (the FAQ height is the one agreed exception).
 */
export const EASE = {
  /** Entrances and UI responses: cubic-bezier(0.23, 1, 0.32, 1). */
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  /** On-screen movement: cubic-bezier(0.77, 0, 0.175, 1). */
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  /** GSAP's closest built-in to EASE.out (CustomEase is not loaded, to keep the bundle small). */
  gsapOut: "expo.out",
} as const;

/** Milliseconds. */
export const DURATION = {
  press: 140,
  ui: 220,
  reveal: 640,
  count: 1200,
} as const;

export const STAGGER_MS = 60;

/** A spring for decorative pointer-following (Magnetic, hero tiles). */
export const SPRING = { type: "spring", stiffness: 170, damping: 16, mass: 0.6 } as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Mouse or trackpad: hover-driven motion only runs here, never on touch. */
export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
