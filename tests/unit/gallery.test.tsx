import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GalleryPage from "@/app/gallery/page";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { galleryCategories, galleryPhotos, galleryPreviewPhotos, visibleCategories } from "@/content/gallery";
import { imageSlots } from "@/content/images";

const srcs = (html: string) => [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/&amp;/g, "&")));

describe("/gallery", () => {
  const html = renderToString(<GalleryPage />);

  it("has one section per live category, each with an h2", () => {
    const live = visibleCategories(galleryPhotos);
    expect(live.length).toBeGreaterThanOrEqual(1);
    for (const slug of live) {
      const label = galleryCategories.find((c) => c.slug === slug)!.label.replace(/&/g, "&amp;");
      expect(html).toMatch(new RegExp(`<h2[^>]*id="${slug}-title"[^>]*><span class="sr-only">${label}</span>`));
    }
  });

  it("shows pre-built thumbnails (not the optimizer) and links each to its full-size photo", () => {
    for (const p of galleryPhotos) {
      expect(html).toContain(`href="${p.src}"`);
      expect(html).toContain(`src="${p.thumb}"`);
    }
    expect(html).not.toContain("/_next/image");
  });

  it("never renders the same photo twice", () => {
    const s = srcs(html);
    expect(new Set(s).size).toBe(s.length);
  });
});

describe("Home gallery preview", () => {
  it("shows three pre-built thumbnails, none of them a photo already used in a Home slot", () => {
    const picks = galleryPreviewPhotos();
    expect(picks).toHaveLength(3);
    const homeSources = (["H1", "H3", "H4", "H5", "H6"] as const).map((id) => imageSlots[id].photo?.source).filter(Boolean);
    picks.forEach((p) => expect(homeSources).not.toContain(p.source));
    const html = renderToString(<GalleryPreview />);
    picks.forEach((p) => expect(html).toContain(`src="${p.thumb}"`));
    expect(html).not.toContain("/_next/image");
  });
});
