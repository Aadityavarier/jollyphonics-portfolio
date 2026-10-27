import { describe, expect, it } from "vitest";
import { buildJourney, journey } from "@/content/journey";
import { teaserMilestones } from "@/lib/journey";
import { founder } from "@/content/founder";

describe("journey (curated, data-driven)", () => {
  it("has the six agreed stops, oldest first (ARPAN 2021 removed 2026-10-27)", () => {
    expect(journey.map((m) => m.when)).toEqual(["2001", "2017", "2023", "2024–25", "2025", "2026"]);
  });

  it("groups same-year events into one stop: 2023 founding + Business award, 2025 ROVEX + Nation Builder", () => {
    const at = (w: string) => journey.find((m) => m.when === w)!.lines.map((l) => l.id);
    expect(at("2023")).toEqual(["founded", "award-business"]);
    expect(at("2025")).toEqual(["award-rovex", "award-nation-builder"]);
  });

  it("keeps roles and certifications that are not flagged off the journey", () => {
    const ids = journey.flatMap((m) => m.lines.map((l) => l.id));
    expect(ids).not.toContain("iw-ipp");
    expect(ids).not.toContain("iw-centurion-secretary");
    expect(ids.some((i) => /arpan/i.test(i))).toBe(false);
  });

  it("a new flagged award becomes a new last stop with no code change", () => {
    const extra = { id: "x", name: "Future Award", detail: "Somewhere", year: "2027", journey: true as const };
    const j = buildJourney({ ...founder, awards: [extra, ...founder.awards] });
    expect(j.at(-1)!.when).toBe("2027");
    expect(teaserMilestones(j).at(-1)!.when).toBe("2027");
  });
});

describe("teaserMilestones", () => {
  it("picks 2001 start, 2017 Inner Wheel, 2023 founding and the latest stop", () => {
    expect(teaserMilestones(journey).map((m) => m.when)).toEqual(["2001", "2017", "2023", "2026"]);
  });
});
