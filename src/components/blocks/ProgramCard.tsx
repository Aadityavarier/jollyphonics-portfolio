import Link from "next/link";
import type { SlotId } from "@/content/images";
import { ImageSlot } from "./ImageSlot";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { labels } from "@/content/labels";

interface Props {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  slot?: SlotId;
  message?: string;
  headingLevel?: 3 | 4;
}

export function ProgramCard({ title, text, href, linkLabel, slot, message, headingLevel = 3 }: Props) {
  const H = `h${headingLevel}` as const;
  return (
    <article className="lift flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-surface">
      {slot && <ImageSlot id={slot} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />}
      <div className="flex flex-1 flex-col gap-2 p-6">
        <H className="text-lead">{title}</H>
        <p>{text}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-3">
          <Link href={href} className="link-u">
            {linkLabel}
          </Link>
          {message && (
            <WhatsAppLink message={message} variant="inline">
              {labels.common.askOnWhatsApp}
            </WhatsAppLink>
          )}
        </div>
      </div>
    </article>
  );
}
