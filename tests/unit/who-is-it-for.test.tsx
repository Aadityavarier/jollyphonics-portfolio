import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WhoIsItFor } from "@/components/home/WhoIsItFor";
import { messages } from "@/content/messages";

const html = renderToString(<WhoIsItFor />);
const panels = html.split('role="tabpanel"').slice(1);

describe("WhoIsItFor (Home's decision tool)", () => {
  it("keeps all four audiences in the server HTML", () => {
    expect(panels).toHaveLength(4);
  });

  it("gives every audience one primary WhatsApp button carrying that audience's own message", () => {
    const expected = [messages.phonicsSuitability, messages.coaching, messages.english, messages.teacherTraining];
    panels.forEach((panel, i) => {
      const primaries = panel.match(/<a [^>]*data-variant="primary"[^>]*>/g) ?? [];
      expect(primaries, `panel ${i}`).toHaveLength(1);
      const href = primaries[0]!.match(/href="([^"]+)"/)![1].replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
      expect(new URL(href).searchParams.get("text")).toBe(expected[i]);
    });
  });

  it("keeps the age answer next to the question, and a page link per audience", () => {
    expect(html).toContain("Is it right for my child?");
    ['href="/programs"', 'href="/coaching"', 'href="/programs#english"', 'href="/teacher-training"'].forEach((h) => expect(html).toContain(h));
  });
});
