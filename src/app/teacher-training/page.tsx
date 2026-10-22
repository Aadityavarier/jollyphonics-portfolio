import { pageMetadata } from "@/lib/metadata";
import { teacherTraining } from "@/content/teacher-training";
import { founder } from "@/content/founder";
import { messages } from "@/content/messages";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { CredentialLine } from "@/components/blocks/CredentialLine";
import { ChipList } from "@/components/blocks/ChipList";
import { CtaBand } from "@/components/blocks/CtaBand";
import { CourseCard } from "@/components/teacher-training/CourseCard";

export const metadata = pageMetadata("teacher-training");

export default function TeacherTrainingPage() {
  return (
    <>
      <PageHero
        title="Teacher Training"
        intro="Training for teachers and aspiring teachers."
        trail={[{ name: "Home", path: "/" }, { name: "Teacher Training", path: "/teacher-training" }]}
      >
        <CredentialLine />
      </PageHero>

      <Section id="courses" tone="surface" labelledBy="courses-title">
        <h2 id="courses-title" className="sr-only">
          Training programs
        </h2>
        <div className="grid gap-4">
          <CourseCard
            title={teacherTraining.phonics.title}
            for={teacherTraining.phonics.for}
            topics={teacherTraining.phonics.covers}
            open
          />
          <CourseCard
            title={teacherTraining.ecced.title}
            subtitle={teacherTraining.ecced.fullName}
            for={teacherTraining.ecced.for}
            topics={teacherTraining.ecced.topics}
          />
          <CourseCard
            title={teacherTraining.montessori.title}
            intro={teacherTraining.montessori.intro}
            topics={teacherTraining.montessori.topics}
          />
        </div>
      </Section>

      <Section id="arpan" tone="teal">
        <SectionHeading id="arpan-title" className="text-paper">
          {teacherTraining.arpan.title}
        </SectionHeading>
        <p className="mt-4 max-w-[60ch] text-lead">{teacherTraining.arpan.credential}</p>
        <p className="mt-3 max-w-[60ch]">{teacherTraining.arpan.intro}</p>
        <ChipList items={teacherTraining.arpan.topics} tone="paper" className="mt-6" />
      </Section>

      <Section id="trainer" tone="paper">
        <SectionHeading id="trainer-title">Trainer qualifications</SectionHeading>
        <ChipList items={founder.qualifications.map((q) => `${q.title} — ${q.detail}`)} tone="surface" className="mt-5" />
      </Section>

      <CtaBand
        title="Train with Trainer Revathi"
        text="Ask about dates and fees on WhatsApp."
        message={messages.teacherTraining}
      />
    </>
  );
}
