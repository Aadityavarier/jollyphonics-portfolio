import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseCard } from "@/components/teacher-training/CourseCard";

describe("CourseCard", () => {
  it("labels its lists one level below the page's section heading (h2 → h3, no skipped level)", () => {
    render(<CourseCard title="Phonics Teacher Training" for={["Preschool teachers"]} topics={["42 sounds"]} open />);
    const labels = screen.getAllByRole("heading");
    expect(labels.map((h) => h.tagName)).toEqual(["H3", "H3"]);
    expect(labels.map((h) => h.textContent)).toEqual(["For", "Covers"]);
  });
});
