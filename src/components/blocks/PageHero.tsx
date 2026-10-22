import type { ReactNode } from "react";
import type { SlotId } from "@/content/images";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { ImageSlot } from "./ImageSlot";

interface Props {
  title: string;
  intro?: string;
  trail: Crumb[];
  slot?: SlotId;
  children?: ReactNode;
}

/** Inner-page hero: breadcrumbs, the page's one h1, a short intro, optional photo slot and actions. */
export function PageHero({ title, intro, trail, slot, children }: Props) {
  return (
    <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-[var(--gutter)] pt-6 pb-[var(--section-gap)] md:grid-cols-[1.2fr_1fr] md:items-end">
      <div className="grid content-start gap-6">
        <Breadcrumbs trail={trail} />
        <h1 className="type-display max-w-[14ch]">{title}</h1>
        {intro && <p className="max-w-[44ch] text-lead">{intro}</p>}
        {children}
      </div>
      {slot && <ImageSlot id={slot} sizes="(min-width: 768px) 45vw, 100vw" preload className="rounded-[var(--radius-panel)]" />}
    </div>
  );
}
