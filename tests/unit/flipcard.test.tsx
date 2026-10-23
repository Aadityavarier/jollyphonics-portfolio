import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { FlipCard } from "@/components/motion/FlipCard";

describe("FlipCard", () => {
  beforeEach(() => {
    window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    window.IntersectionObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  it("names its button from the visible text of both faces (no aria-label override)", () => {
    // The pages used to pass a `label`; whatever is passed, the name must come from what is on the card.
    const props = { label: "Award, 2023" } as Record<string, string>;
    render(<FlipCard {...props} front={<span>2023</span>} back={<span>Business Entrepreneur Award</span>} />);
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("aria-label");
    expect(button).toHaveAccessibleName(/2023/);
    expect(button).toHaveAccessibleName(/Business Entrepreneur Award/);
  });

  it("leaves decorative content out of the name", () => {
    render(
      <FlipCard
        front={
          <span aria-hidden="true">
            Ee
          </span>
        }
        back={<span>English</span>}
      />,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("English");
  });
});
