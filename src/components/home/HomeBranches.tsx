import { contact } from "@/content/contact";
import { Section, SectionHeading } from "@/components/layout/Section";
import { BranchList } from "@/components/contact/BranchList";
import { Todo } from "@/components/blocks/Todo";
import { labels } from "@/content/labels";

/** "Where and when": all four branches, grouped East / West, identical cards. */
export function HomeBranches() {
  return (
    <Section id="branches">
      <div className="grid gap-10">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
          <SectionHeading id="branches-title" className="max-w-none !text-[clamp(1.75rem,1.2rem+2vw,2.5rem)]">
            {labels.home.branches.title}
          </SectionHeading>
          <div className="max-w-[46ch] text-lead">
            <p>{contact.timingsLine}.</p>
            <Todo value={contact.timingsTodo} />
          </div>
        </div>
        <BranchList headingLevel={3} railway />
      </div>
    </Section>
  );
}
