import { pageMetadata } from "@/lib/metadata";
import { brand } from "@/content/brand";
import { programs, teachingApproach } from "@/content/programs";
import { messages } from "@/content/messages";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ChipList } from "@/components/blocks/ChipList";
import { ButtonLink } from "@/components/blocks/ButtonLink";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Todo } from "@/components/blocks/Todo";
import { Stagger } from "@/components/motion/Reveal";
import { SoundWall } from "@/components/programs/SoundWall";
import { SentenceBuilder } from "@/components/programs/SentenceBuilder";
import { SpeechBubble } from "@/components/programs/SpeechBubble";
import { StrokeDraw } from "@/components/motion/StrokeDraw";
import { TileProgress } from "@/components/motion/TileProgress";
import { LearningPathScene } from "@/components/home/LearningPathScene";
import { AnchorNav } from "@/components/programs/AnchorNav";

export const metadata = pageMetadata("programs");

const LETTER_A = (x: number) => ({
  bowl: `M${x + 38} 78 A18 18 0 1 0 ${x + 2} 78 A18 18 0 1 0 ${x + 38} 78`,
  stem: `M${x + 38} 60 L${x + 38} 96`,
});
const LETTERS = [14, 80, 146].map(LETTER_A);

const SENTENCE = [{ text: "The" }, { text: "dog", pos: "noun" as const }, { text: "runs", pos: "verb" as const }, { text: "fast", pos: "adverb" as const }];

const ANCHORS = [
  { id: "phonics", label: "Phonics" },
  { id: "grammar", label: "Grammar" },
  { id: "english", label: "English" },
  { id: "handwriting", label: "Handwriting" },
  { id: "special-classes", label: "Special Classes" },
];

export default function ProgramsPage() {
  return (
    <>
      <TileProgress />
      <PageHero
        title="Programs"
        art="read"
        fx="soundout"
        intro="Jolly Phonics, Jolly Grammar, English, handwriting and seasonal special classes."
        trail={[{ name: "Home", path: "/" }, { name: "Programs", path: "/programs" }]}
      >
        <ChipList items={brand.programsStrip} />
      </PageHero>

      <AnchorNav items={ANCHORS} />

      <Section id="phonics" tone="paper">
        <SectionHeading id="phonics-title" fx="soundout">{programs.phonics.title}</SectionHeading>
        <p className="mt-4 max-w-[60ch] text-lead">{programs.phonics.whatItIs}</p>
        <SoundWall className="mt-10" />
      </Section>

      <LearningPathScene
        title="The learning path"
        steps={programs.phonics.learningPath}
        detail={programs.phonics.learningPathDetail}
      />

      <Section id="phonics-covers" tone="surface" labelledBy="phonics-covers-title">
        <h3 id="phonics-covers-title" className="text-lead">
          What it covers
        </h3>
        <Stagger as="ul" className="mt-5 flex flex-wrap gap-2">
          {programs.phonics.covers.map((c) => (
            <li key={c} className="rounded-full bg-paper px-3.5 py-1.5 text-small font-medium">
              {c}
            </li>
          ))}
        </Stagger>
        <h3 className="mt-10 text-lead">Rules &amp; patterns</h3>
        <ChipList items={programs.phonics.rules} tone="paper" className="mt-4" />
        <h3 className="mt-10 text-lead">Who can join</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.phonics.whoCanJoin.map((w) => (
            <li key={w.title} className="rounded-[var(--radius-panel)] bg-paper p-5">
              <p className="font-bold">{w.title}</p>
              <p className="text-small text-muted">{w.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="grammar" tone="paper">
        <SectionHeading id="grammar-title" fx="soundout">{programs.grammar.title}</SectionHeading>
        <p className="mt-4 max-w-[60ch] text-lead">{programs.grammar.intro}</p>
        <SentenceBuilder words={SENTENCE} jumble={[2, 0, 3, 1]} className="mt-8" />
        <ChipList items={programs.grammar.topics} className="mt-8" />
        <p className="mt-5 font-bold">{programs.grammar.goal}</p>
      </Section>

      <Section id="english" tone="surface">
        <SectionHeading id="english-title" fx="soundout">{programs.english.title}</SectionHeading>
        <SpeechBubble text={programs.english.items.map((i) => i.title).join(" · ")} />
        <Stagger as="ul" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.english.items.map((i) => (
            <li key={i.title} className="rounded-[var(--radius-panel)] bg-paper p-5">
              <p className="font-bold">{i.title}</p>
              <p className="text-small text-muted">{i.text}</p>
            </li>
          ))}
        </Stagger>
      </Section>

      <Section id="handwriting" tone="paper">
        <SectionHeading id="handwriting-title" fx="soundout">{programs.handwriting.title}</SectionHeading>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-14">
          <StrokeDraw
            viewBox="0 0 200 120"
            className="rounded-[var(--radius-panel)] bg-surface p-5 text-ink"
            guides={["M0 24H200", "M0 60H200", "M0 96H200"]}
            trace={LETTERS.flatMap((l) => [l.bowl, l.stem])}
            paths={LETTERS.flatMap((l) => [l.bowl, l.stem])}
            strokeWidth={6}
            duration={650}
            label="The letter a, written three times between guide lines"
          />
          <ChipList items={programs.handwriting.focus} tone="surface" />
        </div>
      </Section>

      <Section id="special-classes" tone="surface">
        <SectionHeading id="special-classes-title" fx="soundout">{programs.specialClasses.title}</SectionHeading>
        <p className="text-small font-medium text-muted">{programs.specialClasses.note}</p>
        <ChipList items={programs.specialClasses.items} tone="paper" className="conveyor mt-5" />
        <Todo value={programs.specialClasses.scholarshipTodo} />
      </Section>

      <Section id="approach" tone="teal">
        <SectionHeading id="approach-title" className="text-paper">
          {teachingApproach.title}
        </SectionHeading>
        <ChipList items={teachingApproach.items} tone="paper" className="mt-5" />
        <ButtonLink href="/coaching" className="mt-8 justify-self-start">
          Coaching for Sr. KG to Std. 8
        </ButtonLink>
      </Section>

      <CtaBand title="Ready to start?" text="Tell us what you're looking for on WhatsApp." message={messages.phonics} />
    </>
  );
}
