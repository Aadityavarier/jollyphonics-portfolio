import Image from "next/image";
import { pageMetadata } from "@/lib/metadata";
import { messages } from "@/content/messages";
import { galleryCategories, galleryHasPhotos, galleryPhotos, visibleCategories } from "@/content/gallery";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Lightbox } from "@/components/gallery/Lightbox";
import { labels } from "@/content/labels";

// No photos yet: the page resolves for direct links but stays out of search until there is something to show.
export const metadata = galleryHasPhotos() ? pageMetadata("gallery") : { ...pageMetadata("gallery"), robots: { index: false, follow: true } };

const T = labels.pages.gallery;

/**
 * One section per category with 3+ photos. Grids show pre-built ~640px thumbnails as plain files (no image
 * optimizer); each links to its full photo, which the lightbox opens in place when JS is on. Out of nav and
 * sitemap until a category is live; the route still resolves so a direct link never 404s.
 */
export default function GalleryPage() {
  const live = visibleCategories(galleryPhotos);
  const shown = galleryPhotos.filter((p) => live.includes(p.category));

  return (
    <>
      <PageHero title={T.title} fx="stroke" intro={T.intro} trail={[{ name: labels.crumbs.home, path: "/" }, { name: labels.crumbs.gallery, path: "/gallery" }]} />

      {shown.length ? (
        <Lightbox photos={shown}>
          {galleryCategories
            .filter((c) => live.includes(c.slug))
            .map((c, ci) => {
              const photos = shown.filter((p) => p.category === c.slug);
              return (
                <Section key={c.slug} id={c.slug} tone={ci % 2 ? "paper" : "surface"} labelledBy={`${c.slug}-title`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <SectionHeading id={`${c.slug}-title`} fx="stroke">
                      {c.label}
                    </SectionHeading>
                    <p className="text-small text-muted">{T.count(photos.length)}</p>
                  </div>
                  <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {photos.map((p, i) => (
                      <li key={p.src}>
                        <a href={p.src} data-lightbox className="block overflow-hidden rounded-[var(--radius-panel)]">
                          <Image
                            src={p.thumb}
                            alt={p.alt}
                            width={640}
                            height={Math.round((640 * p.height) / p.width)}
                            unoptimized
                            loading={ci === 0 && i < 4 ? "eager" : "lazy"}
                            className="aspect-square w-full object-cover transition-transform duration-300 motion-safe:hover:scale-[1.03]"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Section>
              );
            })}
        </Lightbox>
      ) : (
        <Section id="photos" tone="surface" labelledBy="photos-title">
          <SectionHeading id="photos-title" fx="stroke">
            {T.photos}
          </SectionHeading>
          <p className="mt-4 max-w-[48ch] text-muted">{T.onTheWay(galleryCategories.length)}</p>
        </Section>
      )}

      <CtaBand title={T.cta.title} text={T.cta.text} message={messages.general} />
    </>
  );
}
