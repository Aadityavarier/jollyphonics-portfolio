import type { ReactNode } from "react";

export type SectionTone = "paper" | "surface" | "red" | "teal" | "ink";

const TONE: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  surface: "bg-surface text-ink",
  red: "on-dark bg-red text-paper",
  teal: "on-dark bg-teal text-paper",
  ink: "on-dark bg-ink text-paper", // at most one ink band per page
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
  children: ReactNode;
}

/** Section heading: Baloo 2 700 at the head step. */
export function SectionHeading({ id, level = 2, className = "", children }: HeadingProps) {
  const H = `h${level}` as const;
  return (
    <H id={id} className={`max-w-[20ch] text-head ${className}`.trim()}>
      {children}
    </H>
  );
}
