import { pageMetadata } from "@/lib/metadata";
import { contact } from "@/content/contact";
import { faq } from "@/content/faq";
import { messages } from "@/content/messages";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";
import { BranchList } from "@/components/contact/BranchList";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Todo } from "@/components/blocks/Todo";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <>
      <PageHero
        title={contact.status}
        intro={contact.line}
        trail={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink message={messages.general} variant="primary" />
          <CallLink variant="secondary" />
        </div>
      </PageHero>

      <Section id="branches" tone="surface">
        <SectionHeading id="branches-title">Our branches</SectionHeading>
        <p className="mt-3 max-w-[60ch] text-muted">{contact.timingsLine}</p>
        <Todo value={contact.timingsTodo} />
        <div className="mt-8">
          <BranchList withMap />
        </div>
      </Section>

      <Section id="enquire" tone="paper">
        <SectionHeading id="enquire-title">Send an enquiry</SectionHeading>
        <p className="mt-3 max-w-[60ch] text-muted">Fill this in and it opens a prefilled WhatsApp message — nothing is stored on our side.</p>
        <div className="mt-8 max-w-[36rem]">
          <EnquiryForm />
        </div>
      </Section>

      <Section id="faq" tone="surface">
        <SectionHeading id="faq-title">Frequently asked questions</SectionHeading>
        <div className="mt-6 max-w-[60ch]">
          <FaqAccordion items={faq} group="contact-faq" />
        </div>
      </Section>
    </>
  );
}
