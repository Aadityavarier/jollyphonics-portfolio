import Link from "next/link";
import { nav } from "@/content/nav";
import { contact } from "@/content/contact";
import { messages } from "@/content/messages";
import { galleryHasPhotos } from "@/content/gallery";
import { telHref } from "@/lib/contact";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { PhoneIcon } from "@/components/contact/CallLink";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";
import { labels } from "@/content/labels";

/**
 * Sticky bar: logo, links, one action. Fixed height and a solid paper field from the first paint; once the
 * page scrolls (MotionRoot sets [data-scrolled]) the shadow deepens and the logo shrinks, without moving the layout.
 * Gallery joins the nav once it has photos (PLAN §5).
 */
export function SiteHeader() {
  const items = nav.filter((i) => i.key !== "gallery" || galleryHasPhotos());

  return (
    <header className="site-header sticky top-0 z-30 isolate">
      <div className="mx-auto flex max-w-[var(--content-max)] items-center justify-between gap-6 px-[var(--gutter)] py-3 lg:py-4">
        <Link href="/" className="header-logo shrink-0">
          <Logo className="h-11 w-auto lg:h-12" preload />
        </Link>
        <nav aria-label={labels.header.mainNav} className="hidden lg:block">
          <NavLinks indicator items={items} className="flex items-center gap-7" linkClassName="font-display text-[1.0625rem] font-bold hover:text-red" />
        </nav>
        <div className="hidden lg:block">
          <WhatsAppLink message={messages.general} variant="primary" />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <a href={telHref()} className="grid size-11 place-items-center rounded-full bg-surface">
            <PhoneIcon />
            <span className="sr-only">{labels.common.call} {contact.phoneDisplay}</span>
          </a>
          <MobileNav items={items} />
        </div>
      </div>
    </header>
  );
}
