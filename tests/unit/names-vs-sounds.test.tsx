import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NamesVsSounds } from "@/components/home/NamesVsSounds";
import { parents } from "@/content/parents";

beforeEach(() => {
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
});

const { sounds, word } = parents.example;

describe("NamesVsSounds", () => {
  it("server-renders the sounds state with both lines in the HTML (no JavaScript needed)", () => {
    const html = renderToString(<NamesVsSounds sounds={sounds} word={word} />);
    expect(html).toContain('data-mode="sounds"');
    expect(html).toContain("c – a – t → cat");
    expect(html).toContain("C · A · T … ?");
  });

  it("the toggle is a pressed-state pair that switches between letter names and letter sounds", () => {
    const { container } = render(<NamesVsSounds sounds={sounds} word={word} />);
    const names = screen.getByRole("button", { name: "Letter names" });
    const soundsBtn = screen.getByRole("button", { name: "Letter sounds" });
    expect(soundsBtn).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(names);
    expect(container.querySelector("[data-mode]")).toHaveAttribute("data-mode", "names");
    expect(names).toHaveAttribute("aria-pressed", "true");
    expect(soundsBtn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(soundsBtn);
    expect(container.querySelector("[data-mode]")).toHaveAttribute("data-mode", "sounds");
  });

  it("keeps both layers in the DOM so reduced motion can show them side by side", () => {
    render(<NamesVsSounds sounds={sounds} word={word} />);
    expect(screen.getByText("C · A · T … ?")).toBeInTheDocument();
    expect(screen.getByText("c – a – t → cat")).toBeInTheDocument();
  });
});
