import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";

export type BandTone = "red" | "teal";

const TONE: Record<BandTone, string> = {
  red: "bg-red",
  teal: "bg-teal",
};

interface Props {
  title: string;
  text: string;
  /** Prefilled WhatsApp message for this page's topic (C1). */
  message: string;
  tone?: BandTone;
  id?: string;
}

/** The close of a page: a full-bleed red or teal field, headline, one sentence, WhatsApp + Call. */
export function CtaBand({ title, text, message, tone = "red", id = "cta" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`on-dark ${TONE[tone]} text-paper`}>
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)] md:min-h-[60svh] md:content-between">
        <h2 id={`${id}-title`} className="max-w-[16ch] text-head text-paper">
          {title}
        </h2>
        <div className="grid gap-6 md:grid-cols-[minmax(0,32rem)_auto] md:items-end md:justify-between">
          <p className="text-lead text-paper">{text}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink message={message} variant="primary" />
            <CallLink variant="secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
