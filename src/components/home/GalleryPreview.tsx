import Image from "next/image";
import Link from "next/link";
import { galleryHasPhotos, galleryPhotos } from "@/content/gallery";
import { Section, SectionHeading } from "@/components/layout/Section";

/** Hidden until the gallery has photos (PLAN §5). */
export function GalleryPreview() {
  if (!galleryHasPhotos()) return null;

  return (
    <Section id="gallery-preview">
      <div className="grid gap-8">
        <SectionHeading id="gallery-preview-title">From our classes</SectionHeading>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {galleryPhotos.slice(0, 6).map((p) => (
            <li key={p.src} className="relative aspect-square overflow-hidden rounded-[var(--radius-panel)]">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
            </li>
          ))}
        </ul>
        <Link href="/gallery" className="font-bold underline decoration-2 underline-offset-4">
          See the gallery
        </Link>
      </div>
    </Section>
  );
}
