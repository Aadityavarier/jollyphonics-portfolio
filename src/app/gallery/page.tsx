import { pageMetadata } from "@/lib/metadata";
import { messages } from "@/content/messages";
import { galleryCategories, galleryHasPhotos, galleryPhotos, photoConsentTodo, visibleCategories } from "@/content/gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/layout/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Todo } from "@/components/blocks/Todo";

export const metadata = pageMetadata("gallery");

/**
 * Stays out of nav and sitemap until real photos exist (PLAN.md §5): the route itself must still
 * resolve so a direct link doesn't 404, but it shows nothing but a dev-only gap marker.
 */
export default function GalleryPage() {
  const hasPhotos = galleryHasPhotos();
  const categories = visibleCategories(galleryPhotos);

  return (
    <>
      <PageHero title="Gallery" intro="Photos from classes, workshops and teacher training." trail={[{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]} />

      <Section id="photos" tone="surface" labelledBy="photos-title">
        <h2 id="photos-title" className="sr-only">
          Photos
        </h2>
        {hasPhotos ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryPhotos
              .filter((p) => categories.includes(p.category))
              .map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <li key={p.src} className="overflow-hidden rounded-[var(--radius-panel)]">
                  <img src={p.src} alt={p.alt} className="aspect-square w-full object-cover" />
                </li>
              ))}
          </ul>
        ) : (
          <div className="grid gap-3">
            <p className="max-w-[48ch] text-muted">Photos are on the way. {galleryCategories.length} categories are planned.</p>
            <Todo value={photoConsentTodo} />
          </div>
        )}
      </Section>

      <CtaBand title="Want to see more?" text="Ask us on WhatsApp." message={messages.general} />
    </>
  );
}
