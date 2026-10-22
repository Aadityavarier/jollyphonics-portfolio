import { contact } from "@/content/contact";
import { Section, SectionHeading } from "@/components/layout/Section";
import { BranchList } from "@/components/contact/BranchList";
import { Todo } from "@/components/blocks/Todo";

/** "Where and when": all four branches, grouped East / West, identical cards. */
export function HomeBranches() {
  return (
    <Section id="branches" className="pt-0">
      <div className="grid gap-10">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
          <SectionHeading id="branches-title">Four branches across Ambernath</SectionHeading>
          <div className="max-w-[46ch] text-lead">
            <p>{contact.timingsLine}.</p>
            <Todo value={contact.timingsTodo} />
          </div>
        </div>
        <BranchList headingLevel={3} />
      </div>
    </Section>
  );
}
