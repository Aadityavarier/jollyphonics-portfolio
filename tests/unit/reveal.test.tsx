import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal, Stagger } from "@/components/motion/Reveal";

let ioCallback: IntersectionObserverCallback | undefined;
let top = 2000;

beforeEach(() => {
  vi.useFakeTimers();
  top = 2000;
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  class IO {
    constructor(cb: IntersectionObserverCallback) {
      ioCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ top, bottom: top + 10, left: 0, right: 0, width: 0, height: 10, x: 0, y: top, toJSON() {} }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Reveal", () => {
  it("renders visible server markup with no hidden attributes", () => {
    const html = (render(<Reveal>hello</Reveal>), document.body.innerHTML);
    expect(html).toContain("hello");
  });

  it("shows in-view nodes immediately and never arms them", () => {
    top = 100;
    const { container } = render(<Reveal>hi</Reveal>);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute("data-shown");
    expect(el).not.toHaveAttribute("data-armed");
  });

  it("arms below-fold nodes, then shows them on scroll past without ever intersecting", async () => {
    const { container } = render(<Stagger>{[1, 2].map((n) => <p key={n}>{n}</p>)}</Stagger>);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute("data-armed");
    expect(el).not.toHaveAttribute("data-shown");
    top = -500; // jumped past in one frame
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => (cb(0), 1));
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(el).toHaveAttribute("data-shown");
  });

  it("forces the finished state 1500ms after the trigger", () => {
    const { container } = render(<Reveal>x</Reveal>);
    const el = container.firstElementChild!;
    act(() => ioCallback?.([{ target: el, isIntersecting: true, boundingClientRect: { top: 700 } } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(el).toHaveAttribute("data-shown");
    expect(el).not.toHaveAttribute("data-done");
    act(() => vi.advanceTimersByTime(1500));
    expect(el).toHaveAttribute("data-done");
  });

  it("beforeprint reveals everything pending", () => {
    const { container } = render(
      <>
        <Reveal>a</Reveal>
        <Reveal>b</Reveal>
      </>,
    );
    act(() => window.dispatchEvent(new Event("beforeprint")));
    for (const el of Array.from(container.children)) expect(el).toHaveAttribute("data-shown");
  });
});
