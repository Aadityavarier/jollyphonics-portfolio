import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { teaserMilestones } from "@/lib/journey";
import { journey } from "@/content/journey";
import { founder } from "@/content/founder";
import { FounderIntro } from "@/components/home/FounderIntro";

describe("teaserMilestones", () => {
  const picked = teaserMilestones(journey);

  it("picks four milestones: the start, joining Inner Wheel, the first award and the latest", () => {
    expect(picked).toHaveLength(4);
    expect(picked[0]).toBe(journey[0]);
    expect(picked[1].title).toMatch(/^Joined/);
    expect(picked[2].title).toMatch(/Award/);
    expect(picked[3]).toBe(journey[journey.length - 1]);
  });

  it("only shows dates that exist in the full journey, oldest first", () => {
    const whens = picked.map((m) => m.when);
    whens.forEach((w) => expect(journey.map((m) => m.when)).toContain(w));
    expect(whens).toEqual([...whens].sort());
  });
});

describe("FounderIntro", () => {
  const html = renderToString(<FounderIntro />);

  it("shows the credential, the belief, all three awards and the qualification titles as plain text", () => {
    expect(html).toContain("Internationally Certified Jolly Phonics Trainer");
    expect(html).toContain(founder.belief);
    founder.awards.forEach((a) => expect(html).toContain(a.name));
    founder.qualifications.forEach((q) => expect(html).toContain(q.title));
  });

  it("shows the four journey dates and links to the full About page", () => {
    teaserMilestones(journey).forEach((m) => expect(html).toContain(m.when));
    expect(html).toContain('href="/about"');
  });

  it("draws the seal as a decorative graphic, not a second heading or image", () => {
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"[^>]*class="[^"]*seal/);
    expect((html.match(/<h2/g) ?? []).length).toBe(1);
  });
});
