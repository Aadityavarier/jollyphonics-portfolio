import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { why } from "@/content/why";

const doc = new DOMParser().parseFromString(renderToString(<WhyChooseUs />), "text/html");
const rows = [...doc.querySelectorAll("ol > li")];

describe("WhyChooseUs (ruled list)", () => {
  it("lists all eight reasons in content order, numbered 1 to 8", () => {
    expect(rows).toHaveLength(8);
    rows.forEach((r, i) => {
      expect(r.querySelector("[data-num]")?.textContent).toBe(String(i + 1));
      expect(r.textContent).toContain(why.points[i].title);
    });
  });

  it("keeps every detail line verbatim, with a figure set large when the detail starts with one", () => {
    rows.forEach((r, i) => expect(r.querySelector("[data-detail]")?.textContent).toBe(why.points[i].text));
    expect(rows[0].querySelector("[data-figure]")?.textContent).toBe("20+");
    expect(rows[2].querySelector("[data-figure]")?.textContent).toBe("4,500+");
  });
});
