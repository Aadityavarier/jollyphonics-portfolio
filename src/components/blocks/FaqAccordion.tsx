import type { FaqItem } from "@/content/types";
import { Todo } from "./Todo";

interface Props {
  items: FaqItem[];
  /** Shared `name` makes the <details> exclusive: one open at a time. */
  group: string;
}

/** Native <details> tiles: works without JavaScript. Open tile turns teal. */
export function FaqAccordion({ items, group }: Props) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <details
          key={item.q}
          {...{ name: group }}
          className="group rounded-[1.25rem] bg-surface text-ink transition-colors open:bg-teal open:text-paper"
        >
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-[1.125rem] font-bold leading-snug [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden="true" className="relative size-4 shrink-0">
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-current" />
              <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-current transition-transform group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <div className="max-w-[56ch] px-5 pb-5">
            <p>{item.a}</p>
            {item.todo && <Todo value={item.todo} />}
          </div>
        </details>
      ))}
    </div>
  );
}
