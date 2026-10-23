import { pageMetadata } from "@/lib/metadata";
import { coaching, coachingSteps } from "@/content/coaching";
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
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { FxHeading } from "@/components/motion/FxHeading";
import { FlipCard } from "@/components/motion/FlipCard";
import { Staircase } from "@/components/coaching/Staircase";
import { labels } from "@/content/labels";

export const metadata = pageMetadata("coaching");

const COACHING_FAQ = faqByQuestion("Do you provide academic coaching?", "Where are classes held?");

const T = labels.pages.coaching;

export default function CoachingPage() {
  return (
    <>
      <PageHero
        title={coaching.title}
        fx="tileflip"
        intro={`${coaching.range}. ${coaching.focus}`}
        trail={[{ name: labels.crumbs.home, path: "/" }, { name: labels.crumbs.coaching, path: "/coaching" }]}
        slot="C1"
      />

      <Section id="classes" tone="paper">
        <SectionHeading id="classes-title" fx="tileflip">
          {coaching.range}
        </SectionHeading>
        <div className="mt-8">
          <Staircase steps={coachingSteps} label={coaching.range} />
        </div>
      </Section>

      <Section id="subjects" tone="surface">
        <SectionHeading id="subjects-title" fx="tileflip">
          {T.subjects}
        </SectionHeading>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {coaching.subjects.map((s, i) => {
            const tile = PHONICS_TILES[i % PHONICS_TILES.length];
            return (
              <li key={s}>
                <FlipCard
                  delay={i * 90}
                  className="rounded-[var(--radius-panel)] bg-paper"
                  front={
                    <span
                      aria-hidden="true"
                      className="grid h-28 place-items-center rounded-[var(--radius-panel)] font-display text-[3rem] leading-none font-bold"
                      style={{ background: tile.bg, color: tile.fg }}
                    >
                      {s[0]}
                      {s[0].toLowerCase()}
                    </span>
                  }
                  back={<span className="grid h-28 place-items-center p-3 text-center font-display text-lead leading-tight font-bold">{s}</span>}
                />
              </li>
            );
          })}
        </ul>
        <Todo value={coaching.subjectsTodo} />
        <Todo value={coaching.boardsTodo} />
      </Section>

      <Section id="approach" tone="paper">
        <SectionHeading id="approach-title" fx="tileflip">
          {T.approach}
        </SectionHeading>
        <FxHeading as="p" fx="wipe" className="mt-4 max-w-[34ch] text-lead">
          {coaching.focus}
        </FxHeading>
        <p className="mt-4 font-display text-lead font-bold">{teachingApproach.title}</p>
      </Section>

      <Section id="why" tone="surface">
        <SectionHeading id="why-title" fx="tileflip">
          {labels.common.whyUs}
        </SectionHeading>
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
        <SectionHeading id="branches-title" fx="tileflip">
          {T.branches}
        </SectionHeading>
        <div className="mt-8">
          <BranchList />
        </div>
      </Section>

      <Section id="faq" tone="surface">
        <SectionHeading id="faq-title" fx="tileflip">
          {labels.common.questionsParentsAsk}
        </SectionHeading>
        <div className="mt-6 max-w-[60ch]">
          <FaqAccordion items={COACHING_FAQ} group="coaching-faq" />
        </div>
      </Section>

      <CtaBand title={T.cta.title} text={T.cta.text} message={messages.coaching} />
    </>
  );
}
