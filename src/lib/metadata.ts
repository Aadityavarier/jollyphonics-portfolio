import type { Metadata } from "next";
import { seo } from "@/content/seo";
import { brand } from "@/content/brand";
import type { PageKey } from "@/content/types";

/** Per-page metadata from PLAN.md §6. Titles are final as written (no template). */
export function pageMetadata(key: PageKey): Metadata {
  const page = seo[key];
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      url: page.path,
      title: page.title,
      description: page.description,
      siteName: brand.name,
      locale: "en_IN",
    },
  };
}
