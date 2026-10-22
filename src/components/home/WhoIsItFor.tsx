import { faq } from "@/content/faq";
import { messages } from "@/content/messages";
import { coaching } from "@/content/coaching";
import { programs } from "@/content/programs";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ProgramCard } from "@/components/blocks/ProgramCard";
import { Todo } from "@/components/blocks/Todo";
import { Stagger } from "@/components/motion/Reveal";

const ageAnswer = faq[0];

const LEARNERS = [
  {
    title: "Young children",
    text: `${programs.phonics.title}, ${programs.grammar.title} and handwriting: ${programs.phonics.whoCanJoin[0].text.toLowerCase()}`,
    href: "/programs",
    linkLabel: "See the programs",
    slot: "H3",
    message: messages.phonicsSuitability,
  },
  {
    title: `School students, ${coaching.range}`,
    text: `Coaching and tuition. ${coaching.focus}`,
    href: "/coaching",
    linkLabel: "About coaching",
    slot: "H4",
    message: messages.coaching,
  },
  {
    title: "Adults & homemakers",
    text: `Reading, spoken English and grammar. ${programs.phonics.whoCanJoin[5].text}`,
    href: "/programs#english",
    linkLabel: "English programs",
    slot: "H5",
    message: messages.english,
  },
  {
    title: "Teachers & educators",
    text: `Phonics, ECCEd and Montessori teacher training. ${programs.phonics.whoCanJoin[3].text}`,
    href: "/teacher-training",
    linkLabel: "Teacher training",
    slot: "H6",
    message: messages.teacherTraining,
  },
] as const;

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
        <Stagger as="ul" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEARNERS.map((l) => (
            <li key={l.title}>
              <ProgramCard {...l} />
            </li>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
