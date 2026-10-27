import type { FaqItem } from "@/content/types";
import { Todo } from "./Todo";

interface Props {
  items: FaqItem[];
  /** Shared `name` makes the <details> exclusive: one open at a time. */
  group: string;
}

/**
 * Native <details> cards: work without JavaScript, keyboard via the summary. The +/− sits right before the
 * question; the whole row is the tap target. Open card turns teal.
 */
export function FaqAccordion({ items, group }: Props) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details
          key={item.q}
          {...{ name: group }}
          className="faq group rounded-[1.25rem] bg-surface text-ink shadow-[0_1px_0_rgba(22,32,74,0.06)] transition-colors duration-[var(--dur-ui)] open:bg-teal open:text-paper"
        >
          <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 rounded-[1.25rem] px-5 py-4 font-display text-[1.125rem] leading-snug font-bold hover:bg-ink/[0.04] group-open:hover:bg-transparent sm:px-6 [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="relative grid size-8 shrink-0 place-items-center rounded-full bg-paper text-teal transition-colors duration-[var(--dur-ui)] group-open:bg-paper/20 group-open:text-paper">
              <span className="absolute h-[2.5px] w-3.5 rounded-full bg-current" />
              <span className="absolute h-3.5 w-[2.5px] rounded-full bg-current transition-[transform,opacity] duration-[var(--dur-ui)] ease-[var(--ease-out)] group-open:rotate-90 group-open:opacity-0" />
            </span>
            {item.q}
          </summary>
          <div className="faq-answer max-w-[56ch] pr-6 pb-5 pl-[4.25rem] sm:pl-[4.5rem]">
            <p>{item.a}</p>
            {item.todo && <Todo value={item.todo} />}
          </div>
        </details>
      ))}
    </div>
  );
}
