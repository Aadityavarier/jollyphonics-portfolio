import { act, fireEvent, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HelloCta } from "@/components/home/HelloCta";
import { messages } from "@/content/messages";

function stubEnv(reduced: boolean) {
  window.matchMedia = ((q: string) => ({ matches: reduced && q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
}

describe("HelloCta (server HTML, no JavaScript)", () => {
  const doc = new DOMParser().parseFromString(renderToString(<HelloCta />), "text/html");

  it("shows the whole message, five tiles spelling hello, and one primary WhatsApp button with that message", () => {
    expect(doc.body.textContent).toContain(messages.general);
    const tiles = [...doc.querySelectorAll("[data-hello-tile]")].map((t) => t.textContent).join("");
    expect(tiles).toBe("hello");
    const primary = [...doc.querySelectorAll('a[data-variant="primary"]')];
    expect(primary).toHaveLength(1);
    expect(new URL(primary[0].getAttribute("href")!).searchParams.get("text")).toBe(messages.general);
    expect(doc.querySelector('a[href^="tel:"]')).toBeTruthy();
  });

  it("has a single h2 and starts at rest", () => {
    expect(doc.querySelectorAll("h2")).toHaveLength(1);
    expect(doc.querySelector("[data-hello-chat]")?.getAttribute("data-phase")).toBe("rest");
  });
});

describe("HelloCta (client)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("plays tiles, then the bubble, then rests", () => {
    stubEnv(false);
    const { container } = render(<HelloCta />);
    const chat = container.querySelector("[data-hello-chat]")!;
    expect(chat.getAttribute("data-phase")).toBe("tiles");
    act(() => void vi.advanceTimersByTime(1100));
    expect(chat.getAttribute("data-phase")).toBe("bubble");
    act(() => void vi.advanceTimersByTime(2500));
    expect(chat.getAttribute("data-phase")).toBe("rest");
  });

  it("a tap skips straight to the finished state", () => {
    stubEnv(false);
    const { container } = render(<HelloCta />);
    const chat = container.querySelector("[data-hello-chat]")!;
    fireEvent.click(chat);
    expect(chat.getAttribute("data-phase")).toBe("rest");
  });

  it("never plays under reduced motion", () => {
    stubEnv(true);
    const { container } = render(<HelloCta />);
    const chat = container.querySelector("[data-hello-chat]")!;
    act(() => void vi.advanceTimersByTime(3000));
    expect(chat.getAttribute("data-phase")).toBe("rest");
  });
});
