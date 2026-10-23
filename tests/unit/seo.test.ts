import { describe, expect, it } from "vitest";
import sitemap, { sitemapPages } from "@/app/sitemap";
import { breadcrumbGraph, faqGraph, personGraph, siteGraph } from "@/lib/jsonld";
import { buildLlmsTxt } from "@/lib/llms";
import { faq } from "@/content/faq";
import { founder } from "@/content/founder";
import { galleryHasPhotos } from "@/content/gallery";

type Node = Record<string, unknown>;
const nodes = () => (siteGraph()["@graph"] as Node[]);

describe("sitemap", () => {
  it("lists the seven public pages and leaves the gallery out while it has no photos", () => {
    expect(galleryHasPhotos()).toBe(false);
    expect(sitemapPages()).toEqual(["home", "about", "programs", "coaching", "teacher-training", "for-schools", "contact"]);
    const urls = sitemap().map((e) => e.url);
    expect(urls).toHaveLength(7);
    expect(urls.some((u) => u.includes("gallery"))).toBe(false);
    expect(urls.some((u) => u.includes("styleguide"))).toBe(false);
  });
});

describe("JSON-LD", () => {
  it("has the organisation, two LocalBusiness branches and two Place branches (partner preschools)", () => {
    const g = nodes();
    expect(g.filter((n) => n["@type"] === "EducationalOrganization")).toHaveLength(1);
    expect(g.filter((n) => n["@type"] === "LocalBusiness")).toHaveLength(2);
    expect(g.filter((n) => n["@type"] === "Place")).toHaveLength(2);
    const org = g.find((n) => n["@type"] === "EducationalOrganization")!;
    expect(org.location).toHaveLength(4);
  });

  it("Person awards and credentials equal the content", () => {
    const person = (personGraph()["@graph"] as Node[])[0];
    expect(person.award).toEqual(founder.awards.map((a) => a.name));
    expect((person.hasCredential as Node[]).map((c) => c.name)).toEqual(founder.qualifications.map((q) => q.title));
  });

  it("FAQPage carries every visible question; BreadcrumbList is positioned from the trail", () => {
    expect((faqGraph(faq).mainEntity as Node[]).length).toBe(faq.length);
    const b = breadcrumbGraph([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]);
    expect((b.itemListElement as Node[]).map((i) => i.position)).toEqual([1, 2]);
  });

  it("never contains placeholder text", () => {
    const all = JSON.stringify([siteGraph(), personGraph(), faqGraph(faq)]);
    expect(all).not.toMatch(/TODO|content\.md|undefined/);
  });
});

describe("llms.txt", () => {
  it("is built from content and has no placeholders", () => {
    const t = buildLlmsTxt();
    expect(t).toContain("Tr. Revathi Phonics & Coaching Classes");
    expect(t).toContain("Om Dubey Dham");
    expect(t).not.toMatch(/TODO|content\.md|undefined/);
  });
});
