import { Fragment } from "react";
import { branches } from "@/content/branches";
import { groupBranchesBySide } from "@/lib/branches";
import { RevealTarget } from "@/components/motion/RevealTarget";
import { BranchCard } from "./BranchCard";

interface Props {
  withMap?: boolean;
  /** Level of the "Ambernath East / West" group headings; card names sit one level below. */
  headingLevel?: 2 | 3;
  /** Home: an abstract East | West railway line draws in, markers drop, then the cards rise. */
  railway?: boolean;
}

export function BranchList({ withMap = false, headingLevel = 3, railway = false }: Props) {
  const GroupHeading = `h${headingLevel}` as const;
  const cardLevel = (headingLevel + 1) as 3 | 4;
  const groups = groupBranchesBySide(branches);

  const list = groups.map((group, gi) => (
    <Fragment key={group.side}>
      {railway && gi === 1 && <div aria-hidden="true" className="rail-line" />}
      <section aria-labelledby={`branches-${group.side}`} data-side={group.side} className="branch-group grid grid-rows-[auto_1fr] gap-4">
        <GroupHeading id={`branches-${group.side}`} className="branch-group-label flex items-center gap-3 text-lead font-extrabold">
          {railway && <span aria-hidden="true" className="rail-dot" />}
          {group.label}
        </GroupHeading>
        <div className="branch-group-cards grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
          {group.branches.map((b) => (
            <BranchCard key={b.id} branch={b} grouped withMap={withMap} headingLevel={cardLevel} />
          ))}
        </div>
      </section>
    </Fragment>
  ));

  const layout = railway ? "branch-list branch-list-rail grid gap-6 lg:grid-cols-[3fr_auto_1fr] lg:gap-x-6" : "branch-list grid gap-10 lg:grid-cols-[3fr_1fr] lg:gap-3";
  if (!railway) return <div className={layout}>{list}</div>;
  return (
    <RevealTarget as="div" attr="data-reveal" value="rail" className={layout}>
      {list}
    </RevealTarget>
  );
}
