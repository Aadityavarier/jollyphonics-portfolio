"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { MorphDiv, MorphProvider } from "@/components/motion/SharedMorph";
import { labels } from "@/content/labels";

export interface BranchGroup {
  side: "east" | "west";
  label: string;
  content: ReactNode;
}

const OPTIONS = [
  { id: "all", label: "All branches" },
  { id: "east", label: "Ambernath East" },
  { id: "west", label: "Ambernath West" },
] as const;

/**
 * East / West toggle for the branch cards: choosing a side lays out only that side's cards and the rest of the
 * layout glides to its new place (framer-motion layout animation, loaded lazily). All four branches are in the
 * server HTML; "All branches" is the default and the no-JS state.
 */
export function BranchExplorer({ groups }: { groups: BranchGroup[] }) {
  const [side, setSide] = useState<"all" | "east" | "west">("all");
  const reduced = useReducedMotion();
  const shown = groups.filter((g) => side === "all" || g.side === side);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 320, damping: 34 };

  return (
    <MorphProvider>
      <div role="group" aria-label={labels.branches.toggle} className="mb-8 flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button key={o.id} type="button" aria-pressed={side === o.id} onClick={() => setSide(o.id)} className="enq-chip">
            <span className={side === o.id ? "!border-ink !bg-ink !text-paper" : undefined}>{o.label}</span>
          </button>
        ))}
      </div>
      <MorphDiv layout transition={t} className={`branch-list grid gap-10 ${shown.length > 1 ? "lg:grid-cols-[3fr_1fr] lg:gap-3" : ""}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((g) => (
            <MorphDiv key={g.side} layout transition={t} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
              {g.content}
            </MorphDiv>
          ))}
        </AnimatePresence>
      </MorphDiv>
    </MorphProvider>
  );
}
