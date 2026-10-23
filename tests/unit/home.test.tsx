import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import { usePlayInView } from "@/components/motion/usePlayInView";
import { TileWord } from "@/components/blocks/TileWord";
import { HOME_SECTIONS } from "@/content/home-sections";

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let ioCallback: IOCallback = () => {};

function stubEnv(reduced: boolean) {
  window.matchMedia = ((q: string) => ({ matches: reduced && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  class IO {
    constructor(cb: IOCallback) {
      ioCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", IO);
}

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  usePlayInView(ref);
  return <div ref={ref} data-testid="probe" />;
}

describe("usePlayInView", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sets data-play when the node is half visible and removes it when it leaves", () => {
    stubEnv(false);
    render(<Probe />);
    const el = screen.getByTestId("probe");
    expect(el).not.toHaveAttribute("data-play");
    act(() => ioCallback([{ target: el, isIntersecting: true, intersectionRatio: 0.6 }]));
    expect(el).toHaveAttribute("data-play");
    act(() => ioCallback([{ target: el, isIntersecting: false, intersectionRatio: 0 }]));
    expect(el).not.toHaveAttribute("data-play");
  });

  it("marks data-static and never data-play under reduced motion", () => {
    stubEnv(true);
    render(<Probe />);
    const el = screen.getByTestId("probe");
    expect(el).toHaveAttribute("data-static");
    expect(el).not.toHaveAttribute("data-play");
  });
});

describe("TileWord", () => {
  beforeEach(() => stubEnv(false));

  it("gives the word once to screen readers and hides one tile per letter", () => {
    const { container } = render(<TileWord text="Phonics" />);
    expect(screen.getByText("Phonics", { selector: ".sr-only" })).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(7);
  });
});

describe("HOME_SECTIONS", () => {
  it("never puts the same background on two neighbouring sections", () => {
    HOME_SECTIONS.forEach((s, i) => {
      if (i > 0) expect(s.tone, `${HOME_SECTIONS[i - 1].id} / ${s.id}`).not.toBe(HOME_SECTIONS[i - 1].tone);
    });
  });
});
