import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";
import { Panel } from "@/components/layout/Panel";
import { SectionHeading } from "@/components/layout/Section";
import type { DecorLayout } from "@/components/blocks/DecorTiles";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";

export type BandTone = "red" | "teal";

interface Props {
  title: string;
  text: string;
  /** Prefilled WhatsApp message for this page's topic (C1). */
  message: string;
  tone?: BandTone;
  id?: string;
  /** Large faint sound tiles; keep to 2–3 sections per page so the motif stays special. */
  decor?: DecorLayout;
}

/** The close of a page: a full-bleed red or teal field, headline, one sentence, WhatsApp + Call. */
export function CtaBand({ title, text, message, tone = "red", id = "cta", decor }: Props) {
  return (
    <Panel id={id} tone={tone} decor={decor}>
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)] md:min-h-[60svh] md:content-between">
        <SectionHeading id={`${id}-title`} className="max-w-[16ch] text-paper">
          {title}
        </SectionHeading>
        <Reveal className="grid gap-6 md:grid-cols-[minmax(0,32rem)_auto] md:items-end md:justify-between">
          <p className="text-lead text-paper">{text}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <WhatsAppLink message={message} variant="primary" className="w-full" />
            </Magnetic>
            <CallLink variant="secondary" />
          </div>
        </Reveal>
      </div>
    </Panel>
  );
}
