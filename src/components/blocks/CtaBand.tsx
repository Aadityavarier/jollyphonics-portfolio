import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";

interface Props {
  title: string;
  text: string;
  /** Prefilled WhatsApp message for this page's topic (C1). */
  message: string;
  id?: string;
}

/** The close of a page: colours inverted (ink ground), headline, one sentence, WhatsApp + Call. */
export function CtaBand({ title, text, message, id = "cta" }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="on-dark bg-ink text-paper">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] py-[var(--section-gap)] md:min-h-[70svh] md:content-between">
        <h2 id={`${id}-title`} className="max-w-[14ch] text-head text-paper">
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
