import Link from "next/link";
import { parents } from "@/content/parents";
import { messages } from "@/content/messages";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { Panel } from "@/components/layout/Panel";
import { SectionHeading } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SoundBlend } from "./SoundBlend";

/** Answers the parent's first question, "what is phonics, really?", on the red panel. */
export function WhyPhonics() {
  return (
    <Panel id="why-phonics" tone="red" decor="corners">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div className="grid content-start gap-6">
          <SectionHeading id="why-phonics-title" className="max-w-[18ch]">
            {parents.question}
          </SectionHeading>
          <Reveal className="grid gap-6">
            <p className="max-w-[48ch] text-lead">{parents.answer}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/programs#phonics" className="link-u">
                How Jolly Phonics is taught
              </Link>
              <WhatsAppLink message={messages.phonicsSuitability} variant="inline">
                Ask if it suits your child
              </WhatsAppLink>
            </div>
          </Reveal>
        </div>
        <Reveal className="rounded-[var(--radius-panel)] bg-paper p-6 text-ink shadow-[0_24px_48px_-24px_rgba(22,32,74,0.45)] sm:p-10">
          <SoundBlend sounds={parents.example.sounds} word={parents.example.word} />
        </Reveal>
      </div>
    </Panel>
  );
}
