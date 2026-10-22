import type { CSSProperties } from "react";
import { brand } from "@/content/brand";
import { CountUp } from "@/components/motion/CountUp";

const STATS = [
  { figure: `${brand.numbers.years}`, label: "years in education", kind: "count" },
  { figure: brand.numbers.students, label: "students trained", kind: "count" },
  // A year: counting it up from 0 would mean nothing, so its digits roll in instead.
  { figure: brand.numbers.since, label: "started teaching Jolly Phonics", kind: "roll" },
] as const;

interface Props {
  className?: string;
  /** Hero use: numbers count up / roll in as part of the page-load entrance. */
  animated?: boolean;
  /** Entrance delay of the digit roll, matching the surrounding `.enter` delay. */
  delayMs?: number;
}

/** The three founder numbers from content.md, exactly as written there. */
export function TrustStats({ className = "", animated = false, delayMs = 0 }: Props) {
  return (
    <dl className={`grid grid-cols-3 gap-x-4 sm:gap-x-8 ${className}`.trim()}>
      {STATS.map((s) => (
        <div key={s.label} className="grid content-start gap-0.5">
          <dt className="row-start-2 text-small leading-snug text-muted">{s.label}</dt>
          <dd className="row-start-1 font-display text-[clamp(1.75rem,1.2rem+2.4vw,3rem)] leading-none font-bold">
            {!animated ? (
              s.figure
            ) : s.kind === "count" ? (
              <CountUp value={s.figure} />
            ) : (
              <>
                <span className="sr-only">{s.figure}</span>
                <span aria-hidden="true" className="inline-flex">
                  {Array.from(s.figure).map((d, i) => (
                    <span key={i} className="enter-digit" style={{ "--w": i, "--d": `${delayMs}ms` } as CSSProperties}>
                      <span>{d}</span>
                    </span>
                  ))}
                </span>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
