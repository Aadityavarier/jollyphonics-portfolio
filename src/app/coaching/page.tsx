import { pageMetadata } from "@/lib/metadata";
import { coaching } from "@/content/coaching";
import { teachingApproach } from "@/content/programs";
import { why } from "@/content/why";
import { messages } from "@/content/messages";
import { faqByQuestion } from "@/content/faq";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Todo } from "@/components/blocks/Todo";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { BranchList } from "@/components/contact/BranchList";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Stagger } from "@/components/motion/Reveal";

export const metadata = pageMetadata("coaching");

const COACHING_FAQ = faqByQuestion("Do you provide academic coaching?", "Where are classes held?");

export default function CoachingPage() {
  return (
    <>
      <PageHero
        title={coaching.title}
        intro={`${coaching.range}. ${coaching.focus}`}
        trail={[{ name: "Home", path: "/" }, { name: "Coaching", path: "/coaching" }]}
        slot="C1"
      />

      <Section id="subjects" tone="surface">
        <SectionHeading id="subjects-title">Subjects</SectionHeading>
        <Stagger as="ul" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {coaching.subjects.map((s) => (
            <li key={s} className="rounded-[var(--radius-panel)] bg-paper p-4 text-center font-medium">
              {s}
            </li>
          ))}
        </Stagger>
        <Todo value={coaching.subjectsTodo} />
        <Todo value={coaching.boardsTodo} />
      </Section>

      <Section id="approach" tone="paper">
        <SectionHeading id="approach-title">Our approach</SectionHeading>
        <p className="mt-4 max-w-[60ch] text-lead">{coaching.focus}</p>
        <p className="mt-4 font-display text-lead font-bold">{teachingApproach.title}</p>
      </Section>

      <Section id="why" tone="surface">
        <SectionHeading id="why-title">Why Tr. Revathi</SectionHeading>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.points.slice(0, 4).map((p) => (
            <li key={p.title} className="rounded-[var(--radius-panel)] bg-paper p-5">
              <p className="font-bold">{p.title}</p>
              <p className="text-small text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="branches" tone="paper">
        <SectionHeading id="branches-title">Branches</SectionHeading>
        <div className="mt-8">
          <BranchList />
        </div>
      </Section>

      <Section id="faq" tone="surface">
        <SectionHeading id="faq-title">Questions parents ask</SectionHeading>
        <div className="mt-6 max-w-[60ch]">
          <FaqAccordion items={COACHING_FAQ} group="coaching-faq" />
        </div>
      </Section>

      <CtaBand title="Enquire about coaching" text="Tell us your child's class on WhatsApp." message={messages.coaching} />
    </>
  );
}
