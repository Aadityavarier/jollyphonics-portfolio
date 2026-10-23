import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CountUp } from "@/components/motion/CountUp";

let ioCallback: IntersectionObserverCallback | undefined;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance"] });
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
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({ top: 2000, bottom: 2010, left: 0, right: 0, width: 0, height: 10, x: 0, y: 2000, toJSON() {} }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const shown = (c: HTMLElement) => c.querySelector("[aria-hidden]")!.textContent;
const entry = (o: object) => [{ ...o } as unknown as IntersectionObserverEntry];

describe("CountUp", () => {
  it("server markup holds the final figure", () => {
    const { container } = render(<CountUp value="4,500+" />);
    expect(container.textContent).toContain("4,500+");
  });

  it("counts from 0 while off screen and ends exactly on the value", () => {
    const { container } = render(<CountUp value="4,500+" />);
    expect(shown(container)).toBe("0+");
    act(() => ioCallback?.(entry({ isIntersecting: true, boundingClientRect: { top: 700 } }), {} as IntersectionObserver));
    act(() => vi.advanceTimersByTime(2000));
    expect(shown(container)).toBe("4,500+");
  });

  it("shows the final value when the figure is scrolled past without intersecting", () => {
    const { container } = render(<CountUp value="20+" />);
    act(() => ioCallback?.(entry({ isIntersecting: false, boundingClientRect: { top: -300 } }), {} as IntersectionObserver));
    expect(shown(container)).toBe("20+");
  });

  it("shows the final value when the tab is hidden mid-count", () => {
    const { container } = render(<CountUp value="4,500+" />);
    act(() => ioCallback?.(entry({ isIntersecting: true, boundingClientRect: { top: 700 } }), {} as IntersectionObserver));
    act(() => vi.advanceTimersByTime(300));
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(shown(container)).toBe("4,500+");
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  });

  it("unmounting mid-count leaves the final value", () => {
    const { container, unmount } = render(<CountUp value="4,500+" />);
    const node = container.querySelector("[aria-hidden]")!;
    act(() => ioCallback?.(entry({ isIntersecting: true, boundingClientRect: { top: 700 } }), {} as IntersectionObserver));
    act(() => vi.advanceTimersByTime(300));
    unmount();
    expect(node.textContent).toBe("4,500+");
  });

  it("the watchdog lands the final value even if frames never run", () => {
    const { container } = render(<CountUp value="20+" />);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    act(() => ioCallback?.(entry({ isIntersecting: true, boundingClientRect: { top: 700 } }), {} as IntersectionObserver));
    act(() => vi.advanceTimersByTime(1500));
    expect(shown(container)).toBe("20+");
  });
});
