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
  it("lists the eight public pages, the gallery included now that it has live categories", () => {
    expect(galleryHasPhotos()).toBe(true);
    expect(sitemapPages()).toEqual(["home", "about", "programs", "coaching", "teacher-training", "for-schools", "gallery", "contact"]);
    const urls = sitemap().map((e) => e.url);
    expect(urls).toHaveLength(8);
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
    expect(person.award).toEqual(founder.awards.map((a) => `${a.name} (${a.year})`));
    expect((person.hasCredential as Node[]).map((c) => c.name)).toEqual([
      ...founder.qualifications.map((q) => q.title),
      ...founder.certifications.map((c) => c.name),
    ]);
    expect(person.knowsAbout).toEqual(founder.expertise);
    const roles = person.memberOf as Node[];
    expect(roles.map((r) => (r.memberOf as Node).name)).toEqual(["Inner Wheel Club of Ambernath", "Rotary Club of Ambernath East"]);
    expect(roles[0]).toMatchObject({ "@type": "OrganizationRole", roleName: "IPP (Immediate Past President)", startDate: "2017" });
    const org = nodes().find((n) => n["@type"] === "EducationalOrganization")!;
    expect(org.foundingDate).toBe("2023");
  });

  it("publishes exactly the four confirmed awards and never the excluded ones", () => {
    const all = JSON.stringify([siteGraph(), personGraph()]) + buildLlmsTxt();
    expect(founder.awards).toHaveLength(4);
    expect(all).not.toMatch(/Lata Mangeshkar|MIMAMSA|RCAN Nation Builder/);
    expect(all.match(/Nation Builder Award/g)).toHaveLength(2); // once in JSON-LD, once in llms.txt
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
