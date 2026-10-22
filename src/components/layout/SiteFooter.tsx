import Link from "next/link";
import { brand } from "@/content/brand";
import { contact } from "@/content/contact";
import { nav } from "@/content/nav";
import { messages } from "@/content/messages";
import { branches } from "@/content/branches";
import { galleryHasPhotos } from "@/content/gallery";
import { isTodo } from "@/content/todo";
import { groupBranchesBySide } from "@/lib/branches";
import { telHref } from "@/lib/contact";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { Todo } from "@/components/blocks/Todo";
import { Logo } from "./Logo";

const SOCIAL = [
  { label: "Instagram", value: contact.social.instagram },
  { label: "Facebook", value: contact.social.facebook },
  { label: "YouTube", value: contact.social.youtube },
] as const;

/** Keep each "•" on the line of the word before it, so a tagline never strands a bullet. */
const keepBullets = (s: string) => s.replace(/ • /g, " • ");

/** Footer: full area-first branch names (not cards), links, contact, trademark line. */
export function SiteFooter() {
  const links = [{ label: "Home", href: "/" }, ...nav.filter((i) => i.key !== "gallery" || galleryHasPhotos())];
  const social = SOCIAL.flatMap((s) => (typeof s.value === "string" ? [{ label: s.label, href: s.value }] : []));

  return (
    <footer className="bg-surface text-ink">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-12 px-[var(--gutter)] pt-16 pb-10 md:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_1fr_1.4fr]">
        <div className="grid content-start gap-4">
          <Logo className="h-14 w-auto self-start" />
          <p className="font-display text-lead font-bold">{keepBullets(brand.tagline)}</p>
          <p className="text-muted">{keepBullets(brand.secondaryLine)}</p>
        </div>

        <nav aria-label="Footer" className="grid content-start gap-3">
          <h2 className="text-lead">Explore</h2>
          <ul className="grid gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid content-start gap-3">
          <h2 className="text-lead">Contact</h2>
          <p>{contact.status}</p>
          <p>
            <a href={telHref()} className="font-bold underline decoration-2 underline-offset-4">
              Call {contact.phoneDisplay}
            </a>
          </p>
          <p>
            <WhatsAppLink message={messages.general} variant="inline">
              WhatsApp {contact.phoneDisplay}
            </WhatsAppLink>
          </p>
          <p className="text-muted">{contact.area}</p>
          {social.length > 0 ? (
            <ul className="flex gap-4">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" className="underline underline-offset-4">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            isTodo(contact.social.instagram) && <Todo value={contact.social.instagram} />
          )}
        </div>

        <div className="grid content-start gap-3">
          <h2 className="text-lead">Branches</h2>
          {groupBranchesBySide(branches).map((g) => (
            <ul key={g.side} className="grid gap-3">
              {g.branches.map((b) => (
                <li key={b.id}>
                  <p className="font-bold">{b.name}</p>
                  {b.secondary && <p className="text-small text-muted">{b.secondary}</p>}
                  <p className="text-small text-muted">{b.address}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-[var(--content-max)] gap-2 px-[var(--gutter)] pt-6 pb-10 text-small text-muted md:flex md:justify-between">
        <p>{brand.fullName}</p>
        <p>{brand.trademarkNote}</p>
      </div>
    </footer>
  );
}
