import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LearningPathScene } from "@/components/home/LearningPathScene";
import { programs } from "@/content/programs";

const doc = new DOMParser().parseFromString(
  renderToString(<LearningPathScene title="The learning path" steps={programs.phonics.learningPath} detail={programs.phonics.learningPathDetail} />),
  "text/html",
);

describe("LearningPathScene static content (no JS, reduced motion, phones)", () => {
  it("shows every step's description inside its own card, so the list is complete without the pinned scene", () => {
    const cards = [...doc.querySelectorAll(".path-steps > li")];
    expect(cards).toHaveLength(programs.phonics.learningPath.length);
    cards.forEach((c, i) => expect(c.querySelector(".path-card-detail")?.textContent).toBe(programs.phonics.learningPathDetail![i]));
  });
});
