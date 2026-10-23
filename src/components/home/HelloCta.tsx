import { contact } from "@/content/contact";
import { messages } from "@/content/messages";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";
import { Panel } from "@/components/layout/Panel";
import { SectionHeading } from "@/components/layout/Section";
import { Magnetic } from "@/components/motion/Magnetic";
import { HelloChat } from "./HelloChat";
import { labels } from "@/content/labels";

/** Home's close: say hello. The prefilled message is shown as a chat bubble; the button sends exactly that message. */
export function HelloCta() {
  return (
    <Panel id="cta" tone="red" decor="edge">
      <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-10 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="grid content-start gap-6">
          <SectionHeading id="cta-title" className="max-w-[16ch] text-paper">
            {labels.home.hello.title}
          </SectionHeading>
          <p className="max-w-[40ch] text-lead text-paper">{contact.line}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <WhatsAppLink message={messages.general} variant="primary" className="w-full">
                {labels.common.sendOnWhatsApp}
              </WhatsAppLink>
            </Magnetic>
            <CallLink variant="secondary" />
          </div>
        </div>
        <div className="text-[clamp(2.5rem,1.8rem+3vw,4rem)]">
          <HelloChat message={messages.general} />
        </div>
      </div>
    </Panel>
  );
}
