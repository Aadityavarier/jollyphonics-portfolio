import { SITE_URL } from "@/lib/site";
import { brand } from "@/content/brand";
import { contact } from "@/content/contact";
import { branches } from "@/content/branches";
import { founder } from "@/content/founder";
import { programs } from "@/content/programs";
import { coaching } from "@/content/coaching";
import { schools } from "@/content/schools";
import { seo } from "@/content/seo";
import { galleryHasPhotos } from "@/content/gallery";
import type { PageKey } from "@/content/types";

/** llms.txt: a plain-text summary for AI crawlers, built only from content/ (no placeholders, no TODOs). */
export function buildLlmsTxt(): string {
  const pages = (Object.keys(seo) as PageKey[]).filter((k) => k !== "gallery" || galleryHasPhotos());
  const lines = [
    `# ${brand.fullName}`,
    "",
    `> ${seo.home.description}`,
    "",
    `${founder.knownAs} (${founder.fullName}) is an ${founder.credential}. ${brand.numbers.years} years in education; teaching Jolly Phonics since ${brand.numbers.since}; ${brand.numbers.students} students trained.`,
    "",
    "## What is taught",
    `- ${programs.phonics.title}: ${programs.phonics.whatItIs}`,
    `- ${programs.grammar.title}: ${programs.grammar.intro}`,
    `- ${programs.english.title}: ${programs.english.items.map((i) => i.title).join(", ")}`,
    `- ${programs.handwriting.title}`,
    `- Coaching & tuition: ${coaching.range}`,
    "- Teacher training: Phonics, ECCEd, Montessori; ARPAN child-safety training",
    `- School workshops: ${schools.intro}`,
    "",
    "## Branches",
    ...branches.map((b) => `- ${b.name}${b.secondary ? ` (${b.secondary})` : ""}: ${b.address}`),
    "",
    "## Contact",
    `- Phone / WhatsApp: ${contact.phoneDisplay}`,
    `- ${contact.status}`,
    "",
    "## Pages",
    ...pages.map((k) => `- [${seo[k].title}](${SITE_URL}${seo[k].path === "/" ? "" : seo[k].path}): ${seo[k].description}`),
    "",
    brand.trademarkNote,
    "",
  ];
  return lines.join("\n");
}
