import Link from "next/link";
import { parents } from "@/content/parents";
import { programs } from "@/content/programs";
import { messages } from "@/content/messages";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { LearningPath } from "@/components/blocks/LearningPath";
import { SoundBlend } from "./SoundBlend";

/** Answers the parent's first question, "what is phonics, really?", on the red panel. */
export function WhyPhonics() {
  return (
    <section id="why-phonics" aria-labelledby="why-phonics-title" className="on-dark bg-red text-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div className="grid content-start gap-6">
          <h2 id="why-phonics-title" className="max-w-[18ch] text-head">
            {parents.question}
          </h2>
          <p className="max-w-[48ch] text-lead">{parents.answer}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/programs#phonics" className="font-bold underline decoration-2 underline-offset-4">
              How Jolly Phonics is taught
            </Link>
            <WhatsAppLink message={messages.phonicsSuitability} variant="inline">
              Ask if it suits your child
            </WhatsAppLink>
          </div>
        </div>
        <div className="grid gap-8 rounded-[var(--radius-panel)] bg-paper p-6 text-ink sm:p-10">
          <SoundBlend sounds={parents.example.sounds} word={parents.example.word} />
          <div className="grid gap-3">
            <h3 className="text-lead">The learning path</h3>
            <LearningPath steps={programs.phonics.learningPath} tone="surface" />
          </div>
        </div>
      </div>
    </section>
  );
}
