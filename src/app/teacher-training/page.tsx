import { pageMetadata } from "@/lib/metadata";
import { teacherTraining } from "@/content/teacher-training";
import { founder } from "@/content/founder";
import { messages } from "@/content/messages";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { CredentialLine } from "@/components/blocks/CredentialLine";
import { ChipList } from "@/components/blocks/ChipList";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { CourseCard } from "@/components/teacher-training/CourseCard";
import { labels } from "@/content/labels";

export const metadata = pageMetadata("teacher-training");

const T = labels.pages.teacherTraining;

export default function TeacherTrainingPage() {
  return (
    <>
      <PageHero
        title={T.title}
        fx="wipe"
        art="teach"
        slot="T1"
        intro={T.intro}
        trail={[{ name: labels.crumbs.home, path: "/" }, { name: labels.crumbs.teacherTraining, path: "/teacher-training" }]}
      >
        <CredentialLine />
      </PageHero>

      <Section id="courses" tone="surface" labelledBy="courses-title">
        <SectionHeading id="courses-title" fx="wipe">
          {T.programs}
        </SectionHeading>
        <div className="stack mt-8 grid gap-4">
          <CourseCard
            index={0}
            title={teacherTraining.phonics.title}
            for={teacherTraining.phonics.for}
            topics={teacherTraining.phonics.covers}
            open
          />
          <CourseCard
            index={1}
            title={teacherTraining.ecced.title}
            subtitle={teacherTraining.ecced.fullName}
            for={teacherTraining.ecced.for}
            topics={teacherTraining.ecced.topics}
          />
          <CourseCard
            index={2}
            title={teacherTraining.montessori.title}
            intro={teacherTraining.montessori.intro}
            topics={teacherTraining.montessori.topics}
          />
        </div>
      </Section>

      <Section id="arpan" tone="calm">
        <Reveal variant="calm" className="grid gap-4">
          <h2 id="arpan-title" className="max-w-[20ch] text-head">
            {teacherTraining.arpan.title}
          </h2>
          <p className="max-w-[60ch] text-lead">{teacherTraining.arpan.credential}</p>
          <p className="max-w-[60ch]">{teacherTraining.arpan.intro}</p>
          <ChipList items={teacherTraining.arpan.topics} tone="paper" className="mt-2" />
        </Reveal>
      </Section>

      <Section id="trainer" tone="paper">
        <SectionHeading id="trainer-title" fx="wipe">{T.qualifications}</SectionHeading>
        <ChipList items={founder.qualifications.map((q) => `${q.title} — ${q.detail}`)} tone="surface" className="mt-5" />
      </Section>

      <CtaBand
        title={T.cta.title}
        text={T.cta.text}
        message={messages.teacherTraining}
      />
    </>
  );
}
