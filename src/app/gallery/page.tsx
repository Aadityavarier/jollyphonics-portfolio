import { pageMetadata } from "@/lib/metadata";
import { messages } from "@/content/messages";
import { galleryCategories, galleryHasPhotos, galleryPhotos, photoConsentTodo, visibleCategories } from "@/content/gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Stagger } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Todo } from "@/components/blocks/Todo";

// No photos yet: the page resolves for direct links but stays out of search until there is something to show.
export const metadata = galleryHasPhotos() ? pageMetadata("gallery") : { ...pageMetadata("gallery"), robots: { index: false, follow: true } };

/**
 * Stays out of nav and sitemap until real photos exist (PLAN.md §5): the route itself must still
 * resolve so a direct link doesn't 404, but it shows nothing but a dev-only gap marker.
 */
export default function GalleryPage() {
  const hasPhotos = galleryHasPhotos();
  const categories = visibleCategories(galleryPhotos);

  return (
    <>
      <PageHero title="Gallery" fx="stroke" intro="Photos from classes, workshops and teacher training." trail={[{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }]} />

      <Section id="photos" tone="surface" labelledBy="photos-title">
        <SectionHeading id="photos-title" fx="stroke">
          Photos
        </SectionHeading>
        {hasPhotos ? (
          <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryPhotos
              .filter((p) => categories.includes(p.category))
              .map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <li key={p.src} className="overflow-hidden rounded-[var(--radius-panel)]">
                  <img src={p.src} alt={p.alt} className="aspect-square w-full object-cover" />
                </li>
              ))}
          </Stagger>
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
