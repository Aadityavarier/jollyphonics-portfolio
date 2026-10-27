import Link from "next/link";
import type { FaqItem } from "@/content/types";
import { messages } from "@/content/messages";
import { labels } from "@/content/labels";
import { Section, SectionHeading } from "@/components/layout/Section";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import type { Fx } from "@/components/motion/FxHeading";
import { FaqAccordion } from "./FaqAccordion";

interface Props {
  items: FaqItem[];
  /** Exclusive-open group name for the accordion. */
  group: string;
  title?: string;
  fx?: Fx;
  /** Link to the full list on /contact (off on /contact itself). */
  more?: boolean;
}

const F = labels.common.faq;

/**
 * "Questions parents ask". ≥1024px: heading, a one-line nudge and the WhatsApp button on the left, the
 * accordion on the right. Phone: heading, accordion, then the nudge and button. No structured data here:
 * the FAQPage JSON-LD lives on /contact only.
 */
export function FaqSection({ items, group, title = labels.common.questionsParentsAsk, fx, more = false }: Props) {
  return (
    <Section id="faq" tone="paper" className="faq-section">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <SectionHeading id="faq-title" fx={fx} className="lg:col-start-1 lg:row-start-1">
          {title}
        </SectionHeading>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <FaqAccordion items={items} group={group} />
        </div>
        <div className="grid content-start justify-items-start gap-4 lg:col-start-1 lg:row-start-2">
          <p className="max-w-[32ch] text-lead">{F.notFound}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <WhatsAppLink message={messages.faq} variant="primary">
              {F.ask}
            </WhatsAppLink>
            {more && (
              <Link href="/contact#faq" className="link-u">
                {F.more}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
