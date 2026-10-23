import { faq } from "@/content/faq";
import { messages } from "@/content/messages";
import { coaching } from "@/content/coaching";
import { programs } from "@/content/programs";
import { Section, SectionHeading } from "@/components/layout/Section";
import Link from "next/link";
import type { SlotId } from "@/content/images";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { Todo } from "@/components/blocks/Todo";
import { AudienceSelector } from "./AudienceSelector";

const ageAnswer = faq[0];

const LEARNERS = [
  {
    tab: "Young children",
    title: "Young children",
    text: `${programs.phonics.title}, ${programs.grammar.title} and handwriting: ${programs.phonics.whoCanJoin[0].text.toLowerCase()}`,
    href: "/programs",
    linkLabel: "See the programs",
    slot: "H3",
    message: messages.phonicsSuitability,
  },
  {
    tab: "School students",
    title: `School students, ${coaching.range}`,
    text: `Coaching and tuition. ${coaching.focus}`,
    href: "/coaching",
    linkLabel: "About coaching",
    slot: "H4",
    message: messages.coaching,
  },
  {
    tab: "Adults",
    title: "Adults & homemakers",
    text: `Reading, spoken English and grammar. ${programs.phonics.whoCanJoin[5].text}`,
    href: "/programs#english",
    linkLabel: "English programs",
    slot: "H5",
    message: messages.english,
  },
  {
    tab: "Teachers",
    title: "Teachers & educators",
    text: `Phonics, ECCEd and Montessori teacher training. ${programs.phonics.whoCanJoin[3].text}`,
    href: "/teacher-training",
    linkLabel: "Teacher training",
    slot: "H6",
    message: messages.teacherTraining,
  },
] as const;

function AudienceCard({ title, text, href, linkLabel, slot, message }: { title: string; text: string; href: string; linkLabel: string; slot: SlotId; message: string }) {
  return (
    <article className="grid overflow-hidden rounded-[var(--radius-panel)] bg-surface md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <ImageSlot id={slot} sizes="(min-width: 768px) 40vw, 100vw" className="md:h-full md:!aspect-auto" />
      <div className="flex flex-col gap-3 p-6 md:p-10">
        <h3 className="max-w-[18ch] font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] leading-none font-bold">{title}</h3>
        <p className="max-w-[46ch] text-lead">{text}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-4">
          <Link href={href} className="link-u">
            {linkLabel}
          </Link>
          <WhatsAppLink message={message} variant="inline">
            Ask on WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}

/** "Is it right for my child?": who each program is for, each card with its own WhatsApp message. */
export function WhoIsItFor() {
  return (
    <Section id="who">
      <div className="grid gap-10">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
          <SectionHeading id="who-title">Is it right for my child?</SectionHeading>
          <div className="max-w-[46ch] text-lead">
            <p>{ageAnswer.a}</p>
            {ageAnswer.todo && <Todo value={ageAnswer.todo} />}
          </div>
        </div>
        <AudienceSelector
          label="Who is learning?"
          items={LEARNERS.map(({ tab, ...l }) => ({
            id: tab.toLowerCase().replace(/\W+/g, "-"),
            label: tab,
            card: <AudienceCard {...l} />,
          }))}
        />
      </div>
    </Section>
  );
}
