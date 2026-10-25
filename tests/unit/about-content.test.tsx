import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import ProgramsPage from "@/app/programs/page";
import { founder } from "@/content/founder";
import { programs } from "@/content/programs";
import { teacherTraining } from "@/content/teacher-training";

describe("/about with the 2026-10-24 bio-data", () => {
  const html = renderToString(<AboutPage />);

  it("shows the title line, every award, the expertise list, the IPP role, other roles and the vision line", () => {
    expect(html).toContain("Community Leader");
    founder.awards.forEach((a) => expect(html).toContain(a.name.replace("&", "&amp;")));
    expect(html).toContain("8 October 2026");
    founder.expertise.forEach((e) => expect(html).toContain(e.replace(/&/g, "&amp;")));
    expect(html).toContain("IPP (Immediate Past President) 2025–26");
    expect(html).toContain("Centurion Secretary");
    expect(html).toContain("MindShield Yagna");
    expect(html).toContain(founder.vision);
    expect(html).toContain("trained April 2021 and April 2023");
    expect(html).toContain("Rapid Teacher&#x27;s Training for ECCEd");
  });

  it("names each award on both faces of its flip card", () => {
    const awards = html.slice(html.indexOf('id="awards"'), html.indexOf('id="community"'));
    founder.awards.forEach((a) => expect(awards.split(a.name.replace("&", "&amp;")).length - 1).toBeGreaterThanOrEqual(2));
  });

  it("never shows excluded awards", () => {
    expect(html).not.toMatch(/Lata Mangeshkar|MIMAMSA|RCAN Nation Builder/);
  });
});

describe("Jolly English and the RTTI rule", () => {
  it("/programs heads the grammar section 'Jolly Grammar & Jolly English'", () => {
    expect(renderToString(<ProgramsPage />)).toContain("Jolly Grammar &amp; Jolly English");
  });

  it("Rapid Teacher's Training is a certification only, never a program or a teacher-training course", () => {
    expect(JSON.stringify([programs, teacherTraining])).not.toMatch(/Rapid/);
    expect(teacherTraining.arpan.credential).toContain("trained April 2021 and April 2023");
  });
});
