import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Testimonials } from "@/components/home/Testimonials";
import { testimonials } from "@/content/testimonials";
import { HOME_SECTIONS } from "@/content/home-sections";

describe("Testimonials", () => {
  beforeEach(() => {
    window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    window.IntersectionObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  it("ships empty: no real testimonials yet, so nothing renders (CLAUDE.md: hide until real ones exist)", () => {
    expect(testimonials).toEqual([]);
    const { container } = render(<Testimonials />);
    expect(container).toBeEmptyDOMElement();
  });

  it("appears as soon as one real testimonial is added", () => {
    render(<Testimonials items={[{ quote: "My son reads on his own now.", name: "A parent", context: "Jolly Phonics, Ambernath East" }]} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/My son reads on his own now\./)).toBeInTheDocument();
    expect(screen.getByText("A parent")).toBeInTheDocument();
    expect(screen.getByText("Jolly Phonics, Ambernath East")).toBeInTheDocument();
  });

  it("has a place in Home's tone map between why-us and the FAQ", () => {
    const ids = HOME_SECTIONS.map((s) => s.id);
    expect(ids.indexOf("testimonials")).toBe(ids.indexOf("why-us") + 1);
    expect(ids.indexOf("faq")).toBe(ids.indexOf("testimonials") + 1);
  });
});
