import { messages } from "@/content/messages";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { CallLink } from "@/components/contact/CallLink";

/**
 * Mobile-only bottom bar (CLAUDE.md). Paper ground with a shadow because it truly floats over the page.
 * The layout pads <body> by --sticky-bar-h so it never covers content.
 */
export function StickyContactBar() {
  return (
    <nav
      aria-label="Contact"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.4fr_1fr] gap-2 bg-paper px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(22,32,74,0.14)] md:hidden"
    >
      <WhatsAppLink message={messages.general} variant="primary" className="w-full" />
      <CallLink variant="primary" className="w-full">
        Call
      </CallLink>
    </nav>
  );
}
