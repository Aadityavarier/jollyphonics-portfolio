import { faq } from "@/content/faq";
import { messages } from "@/content/messages";
import { coaching } from "@/content/coaching";
import { programs } from "@/content/programs";
import { teacherTraining } from "@/content/teacher-training";
import { imageSlots } from "@/content/images";
import { ChipList } from "@/components/blocks/ChipList";
import { Section, SectionHeading } from "@/components/layout/Section";
import Link from "next/link";
import type { SlotId } from "@/content/images";
import { ImageSlot } from "@/components/blocks/ImageSlot";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { Todo } from "@/components/blocks/Todo";
import { AudienceSelector } from "./AudienceSelector";
import { labels } from "@/content/labels";

const ageAnswer = faq[0];

const LEARNERS = [
  {
    tab: "Young children",
    title: "Young children",
    text: `${programs.phonics.title}, ${programs.grammar.title} and handwriting: ${programs.phonics.whoCanJoin[0].text.toLowerCase()}`,
    href: "/programs",
    linkLabel: "See the programs",
    slot: "H3",
    chips: [programs.phonics.title, programs.grammar.title, programs.handwriting.title],
    message: messages.phonicsSuitability,
  },
  {
    tab: "School students",
    title: `School students, ${coaching.range}`,
    text: `Coaching and tuition. ${coaching.focus}`,
    href: "/coaching",
    linkLabel: "About coaching",
    slot: "H4",
    chips: [coaching.range],
    message: messages.coaching,
  },
  {
    tab: "Adults",
    title: "Adults & homemakers",
    text: `Reading, spoken English and grammar. ${programs.phonics.whoCanJoin[5].text}`,
    href: "/programs#english",
    linkLabel: "English programs",
    slot: "H5",
    chips: programs.english.items.map((i) => i.title),
    message: messages.english,
  },
  {
    tab: "Teachers",
    title: "Teachers & educators",
    text: `Phonics, ECCEd and Montessori teacher training. ${programs.phonics.whoCanJoin[3].text}`,
    href: "/teacher-training",
    linkLabel: "Teacher training",
    slot: "H6",
    chips: [teacherTraining.phonics.title, teacherTraining.ecced.title, teacherTraining.montessori.title],
    message: messages.teacherTraining,
  },
] as const;

interface CardProps {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  slot: SlotId;
  message: string;
  chips: readonly string[];
}

/**
 * Photo | title, text, chips, then the next step (WhatsApp with this audience's own message, and the page link).
 * Wide screens (1280px+): the photo fills its column's full height (cover, focal point from images.ts). Narrower (phones, tablets, small laptops, where a near-square photo box would cut off people at the sides): on top at 3:2.
 */
function AudienceCard({ title, text, href, linkLabel, slot, message, chips }: CardProps) {
  const photo = Boolean(imageSlots[slot].photo);
  return (
    <article className={`grid overflow-hidden rounded-[var(--radius-panel)] bg-surface ${photo ? "xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : ""}`}>
      {photo && <ImageSlot id={slot} sizes="(min-width: 1280px) 40vw, 100vw" className="xl:h-full xl:min-h-[24rem] xl:!aspect-auto" />}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <h3 className="max-w-[18ch] font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] leading-none font-bold">{title}</h3>
        <p className="max-w-[46ch] text-lead">{text}</p>
        <ChipList items={chips} tone="paper" />
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-ink/10 pt-6">
          <WhatsAppLink message={message} variant="primary" className="w-full sm:w-auto">
            {labels.home.who.ask}
          </WhatsAppLink>
          <Link href={href} className="link-u">
            {linkLabel}
          </Link>
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
          <SectionHeading id="who-title">{labels.home.who.title}</SectionHeading>
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
