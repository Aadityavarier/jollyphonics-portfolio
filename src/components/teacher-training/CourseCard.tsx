import type { CSSProperties } from "react";
import { labels } from "@/content/labels";

interface Props {
  /** Position in the stack (0-based): sets the sticky offset on wide screens. */
  index?: number;
  title: string;
  subtitle?: string;
  intro?: string;
  for?: readonly string[];
  topics: readonly string[];
  topicsLabel?: string;
  open?: boolean;
}

/** A native <details> "course card". Phones: expands on tap. Wide screens: always open, stacked (fx.css). */
export function CourseCard({ index = 0, title, subtitle, intro, for: forWhom, topics, topicsLabel = "Covers", open }: Props) {
  return (
    <details
      open={open}
      style={{ "--i": index } as CSSProperties}
      className="course-card stack-card group rounded-[var(--radius-panel)] bg-surface p-6 transition-colors duration-[var(--dur-ui)] open:bg-paper open:shadow-[0_10px_30px_-18px_rgba(22,32,74,0.4)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-display text-lead font-bold">{title}</span>
          {subtitle && <span className="block text-small text-muted">{subtitle}</span>}
        </span>
        <span aria-hidden="true" className="relative size-5 shrink-0">
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-current" />
          <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-current transition-[transform,opacity] duration-[var(--dur-ui)] ease-[var(--ease-out)] group-open:rotate-90 group-open:opacity-0" />
        </span>
      </summary>
      <div className="mt-5 grid gap-5">
        {intro && <p>{intro}</p>}
        {forWhom && (
          <div>
            <h4 className="text-small font-bold text-muted uppercase">{labels.courseCard.for}</h4>
            <p className="mt-1">{forWhom.join(", ")}.</p>
          </div>
        )}
        <div>
          <h4 className="text-small font-bold text-muted uppercase">{topicsLabel}</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {topics.map((t) => (
              <li key={t} className="rounded-full bg-surface px-3.5 py-1.5 text-small font-medium">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
