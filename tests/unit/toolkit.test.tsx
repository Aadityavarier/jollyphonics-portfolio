import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LayoutTabs } from "@/components/motion/LayoutTabs";
import { FlipCard } from "@/components/motion/FlipCard";
import { TypeOut } from "@/components/motion/TypeOut";
import { FxHeading } from "@/components/motion/FxHeading";

function stubMotion(reduced: boolean) {
  window.matchMedia = ((q: string) => ({ matches: reduced && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  class RO {
    observe() {}
    disconnect() {}
  }
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", RO);
  vi.stubGlobal("IntersectionObserver", IO);
}

describe("LayoutTabs", () => {
  beforeEach(() => stubMotion(false));
  const tabs = ["One", "Two", "Three"].map((l) => ({ id: l.toLowerCase(), label: l, panel: <p>{l} panel</p> }));

  it("renders every panel (crawlable) with only the first visible", () => {
    render(<LayoutTabs label="t" tabs={tabs} />);
    expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(3);
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("arrow keys, Home and End move the selection and focus", () => {
    render(<LayoutTabs label="t" tabs={tabs} />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    fireEvent.keyDown(list, { key: "End" });
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(list, { key: "Home" });
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("slides in from the right when moving forward and from the left when moving back", () => {
    render(<LayoutTabs label="t" tabs={tabs} />);
    fireEvent.click(screen.getByRole("tab", { name: "Three" }));
    expect(screen.getByRole("tabpanel")).toHaveAttribute("data-enter", "r");
    fireEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tabpanel")).toHaveAttribute("data-enter", "l");
  });
});

describe("FlipCard", () => {
  it("keeps both faces in the DOM and toggles aria-pressed on activation", () => {
    stubMotion(false);
    render(<FlipCard label="Award" enter="front" front={<span>2023</span>} back={<span>Award details</span>} />);
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("Award details")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Award" });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("under reduced motion stays unenhanced: both faces visible, toggle inert", () => {
    stubMotion(true);
    const { container } = render(<FlipCard label="Award" front={<span>2023</span>} back={<span>Award details</span>} />);
    expect(container.querySelector(".flip")).not.toHaveAttribute("data-enhanced");
    expect(screen.getByRole("button", { name: "Award" })).toBeDisabled();
  });
});

describe("TypeOut", () => {
  it("under reduced motion shows the complete text", () => {
    stubMotion(true);
    const { container } = render(<TypeOut text="Reading, writing" />);
    expect(container.querySelector(".typeout-live")?.textContent).toBe("Reading, writing");
    expect(container.querySelector(".sr-only")?.textContent).toBe("Reading, writing");
  });
});

describe("FxHeading", () => {
  it("exposes one plain-text name and hides the split pieces from assistive tech", () => {
    const { container } = render(<FxHeading fx="soundout">Hear it</FxHeading>);
    expect(container.querySelector(".sr-only")?.textContent).toBe("Hear it");
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(container.querySelectorAll(".fx-p")).toHaveLength(6);
  });
});
