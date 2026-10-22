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
    <div className="branch-list">
      {groupBranchesBySide(branches).map((group) => (
        <section key={group.side} aria-labelledby={`branches-${group.side}`} className="branch-group">
          <GroupHeading id={`branches-${group.side}`} className="branch-group-label">
            {group.label}
          </GroupHeading>
          <div className="branch-group-cards">
            {group.branches.map((b) => (
              <BranchCard key={b.id} branch={b} withMap={withMap} headingLevel={cardLevel} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
