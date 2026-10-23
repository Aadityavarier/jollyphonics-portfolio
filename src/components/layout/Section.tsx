import type { ReactNode } from "react";
import { RevealTarget } from "@/components/motion/RevealTarget";
import { FxHeading, type Fx } from "@/components/motion/FxHeading";

export type SectionTone = "paper" | "surface" | "red" | "teal" | "ink" | "calm";

const TONE: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  surface: "bg-surface text-ink",
  red: "on-dark bg-red text-paper",
  teal: "on-dark bg-teal text-paper",
  ink: "on-dark bg-ink text-paper", // at most one ink band per page
  calm: "bg-calm text-calm-ink", // ARPAN: muted ground, no playful colour
};

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-[var(--content-max)] px-[var(--gutter)] ${className}`.trim()}>{children}</div>;
}

interface SectionProps {
  id: string;
  tone?: SectionTone;
  /** Element id of the section's heading, for aria-labelledby. Defaults to `${id}-title`. */
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ id, tone = "paper", labelledBy, className = "", children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy ?? `${id}-title`} className={`${TONE[tone]} py-[var(--section-gap)] ${className}`.trim()}>
      <Container>{children}</Container>
    </section>
  );
}

interface HeadingProps {
  id: string;
  level?: 2 | 3;
  className?: string;
  /** A page's heading treatment (see FxHeading). Omit for the default mask rise. Needs plain-text children. */
  fx?: Fx;
  children: ReactNode;
}

/** Section heading: Baloo 2 700 at the head step. Rises out of its own box as it scrolls in (motion.css). */
export function SectionHeading({ id, level = 2, className = "", fx, children }: HeadingProps) {
  if (fx && typeof children === "string") {
    return (
      <FxHeading as={`h${level}` as "h2" | "h3"} fx={fx} id={id} className={`max-w-[20ch] text-head ${className}`.trim()}>
        {children}
      </FxHeading>
    );
  }
  return (
    <RevealTarget as={`h${level}`} attr="data-reveal" value="mask" id={id} className={`max-w-[20ch] text-head ${className}`.trim()}>
      <span className="reveal-line">{children}</span>
    </RevealTarget>
  );
}
