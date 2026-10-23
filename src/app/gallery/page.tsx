import { pageMetadata } from "@/lib/metadata";
import { messages } from "@/content/messages";
import { galleryCategories, galleryHasPhotos, galleryPhotos, photoConsentTodo, visibleCategories } from "@/content/gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Stagger } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Todo } from "@/components/blocks/Todo";
import { labels } from "@/content/labels";

// No photos yet: the page resolves for direct links but stays out of search until there is something to show.
export const metadata = galleryHasPhotos() ? pageMetadata("gallery") : { ...pageMetadata("gallery"), robots: { index: false, follow: true } };

/**
 * Stays out of nav and sitemap until real photos exist (PLAN.md §5): the route itself must still
 * resolve so a direct link doesn't 404, but it shows nothing but a dev-only gap marker.
 */
const T = labels.pages.gallery;

export default function GalleryPage() {
  const hasPhotos = galleryHasPhotos();
  const categories = visibleCategories(galleryPhotos);

  return (
    <>
      <PageHero title={T.title} fx="stroke" intro={T.intro} trail={[{ name: labels.crumbs.home, path: "/" }, { name: labels.crumbs.gallery, path: "/gallery" }]} />

      <Section id="photos" tone="surface" labelledBy="photos-title">
        <SectionHeading id="photos-title" fx="stroke">
          {T.photos}
        </SectionHeading>
        {hasPhotos ? (
          <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryPhotos
              .filter((p) => categories.includes(p.category))
              .map((p) => (
                <li key={p.src} className="overflow-hidden rounded-[var(--radius-panel)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.alt} className="aspect-square w-full object-cover" />
                </li>
              ))}
          </Stagger>
        ) : (
          <div className="grid gap-3">
            <p className="max-w-[48ch] text-muted">{T.onTheWay(galleryCategories.length)}</p>
            <Todo value={photoConsentTodo} />
          </div>
        )}
      </Section>

      <CtaBand title={T.cta.title} text={T.cta.text} message={messages.general} />
    </>
  );
}
