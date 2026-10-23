import type { SectionTone } from "@/components/layout/Section";

/** Home's sections in page order with their backgrounds. No two neighbours share a tone (tests/unit/home.test.tsx). */
export const HOME_SECTIONS: { id: string; tone: SectionTone }[] = [
  { id: "hero", tone: "paper" },
  { id: "why-phonics", tone: "red" },
  { id: "learning-path", tone: "surface" },
  { id: "founder", tone: "teal" },
  { id: "who", tone: "paper" },
  { id: "showcase", tone: "ink" },
  { id: "branches", tone: "paper" },
  { id: "why-us", tone: "surface" },
  /** Hidden until src/content/testimonials.ts has a real entry. */
  { id: "testimonials", tone: "teal" },
  { id: "faq", tone: "paper" },
  { id: "cta", tone: "red" },
];
