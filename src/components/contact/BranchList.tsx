import { branches } from "@/content/branches";
import { groupBranchesBySide } from "@/lib/branches";
import { BranchCard } from "./BranchCard";

interface Props {
  withMap?: boolean;
  /** Level of the "Ambernath East / West" group headings; card names sit one level below. */
  headingLevel?: 2 | 3;
}

export function BranchList({ withMap = false, headingLevel = 3 }: Props) {
  const GroupHeading = `h${headingLevel}` as const;
  const cardLevel = (headingLevel + 1) as 3 | 4;

  return (
    <div className="branch-list grid gap-10 lg:grid-cols-[3fr_1fr] lg:gap-3">
      {groupBranchesBySide(branches).map((group) => (
        <section key={group.side} aria-labelledby={`branches-${group.side}`} className="branch-group grid grid-rows-[auto_1fr] gap-4">
          <GroupHeading id={`branches-${group.side}`} className="branch-group-label text-lead font-extrabold">
            {group.label}
          </GroupHeading>
          <div className="branch-group-cards grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
            {group.branches.map((b) => (
              <BranchCard key={b.id} branch={b} grouped withMap={withMap} headingLevel={cardLevel} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
