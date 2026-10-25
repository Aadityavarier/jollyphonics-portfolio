import Image from "next/image";
import Link from "next/link";
import { galleryPreviewPhotos } from "@/content/gallery";
import { Section, SectionHeading } from "@/components/layout/Section";
import { labels } from "@/content/labels";

/** Three picks from the gallery (slots H10–H12), as pre-built thumbnails. Hidden until the gallery has photos. */
export function GalleryPreview() {
  const picks = galleryPreviewPhotos();
  if (!picks.length) return null;

  return (
    <Section id="gallery-preview">
      <div className="grid gap-8">
        <SectionHeading id="gallery-preview-title">{labels.home.gallery.title}</SectionHeading>
        <ul className="grid grid-cols-3 gap-3">
          {picks.map((p) => (
            <li key={p.src} className="overflow-hidden rounded-[var(--radius-panel)]">
              <Image src={p.thumb} alt={p.alt} width={640} height={Math.round((640 * p.height) / p.width)} unoptimized className="aspect-square w-full object-cover" />
            </li>
          ))}
        </ul>
        <Link href="/gallery" className="link-u">
          {labels.home.gallery.link}
        </Link>
      </div>
    </Section>
  );
}
