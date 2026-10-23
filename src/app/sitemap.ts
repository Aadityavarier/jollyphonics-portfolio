import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { seo } from "@/content/seo";
import { galleryHasPhotos } from "@/content/gallery";
import type { PageKey } from "@/content/types";

/** Every public page except /gallery until it has photos. /styleguide is never listed. */
export function sitemapPages(): PageKey[] {
  return (Object.keys(seo) as PageKey[]).filter((k) => k !== "gallery" || galleryHasPhotos());
}

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPages().map((k) => ({ url: `${SITE_URL}${seo[k].path === "/" ? "" : seo[k].path}`, changeFrequency: "monthly", priority: k === "home" ? 1 : 0.7 }));
}
