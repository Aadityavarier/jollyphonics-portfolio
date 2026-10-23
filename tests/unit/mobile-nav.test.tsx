import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

let path = "/";
vi.mock("next/navigation", () => ({ usePathname: () => path }));

import { MobileNav } from "@/components/layout/MobileNav";

const items = [
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
] as never;

const toggle = () => screen.getByRole("button", { name: /menu|close/i });

describe("MobileNav", () => {
  afterEach(() => {
    path = "/";
    document.documentElement.style.overflow = "";
  });

  it("locks page scroll while open and restores it on close", () => {
    render(<MobileNav items={items} />);
    fireEvent.click(toggle());
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireEvent.click(toggle());
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("traps Tab inside the toggle and the menu links", () => {
    render(<MobileNav items={items} />);
    fireEvent.click(toggle());
    const links = screen.getAllByRole("link");
    const last = links[links.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(toggle());
    toggle().focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("closes on Escape and returns focus to the toggle", () => {
    render(<MobileNav items={items} />);
    fireEvent.click(toggle());
    screen.getAllByRole("link")[0].focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(toggle());
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("closes when the route changes", () => {
    const { rerender } = render(<MobileNav items={items} />);
    fireEvent.click(toggle());
    path = "/about";
    act(() => rerender(<MobileNav items={items} />));
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(document.documentElement.style.overflow).toBe("");
  });
});
