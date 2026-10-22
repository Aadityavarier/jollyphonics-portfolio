import { messages } from "@/content/messages";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";

/** Mobile-only bottom bar (CLAUDE.md). The layout pads <body> by --sticky-bar-h so it never covers content. */
export function StickyContactBar() {
  return (
    <nav
      aria-label="Contact"
      className="on-dark fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.4fr_1fr] gap-2 bg-ink px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <WhatsAppLink message={messages.general} variant="primary" className="w-full" />
      <CallLink variant="secondary" className="w-full">
        Call
      </CallLink>
    </nav>
  );
}
