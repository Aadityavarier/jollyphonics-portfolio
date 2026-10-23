import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PageHero } from "@/components/blocks/PageHero";

const trail = [{ name: "Home", path: "/" }, { name: "Programs", path: "/programs" }];
const parse = (el: React.ReactElement) => new DOMParser().parseFromString(renderToString(el), "text/html");

describe("PageHero tile art", () => {
  it("fills the empty column with decorative tiles spelling the word when there is no photo slot", () => {
    const doc = parse(<PageHero title="Programs" trail={trail} art="read" />);
    const art = doc.querySelector("[data-hero-art]");
    expect(art?.getAttribute("aria-hidden")).toBe("true");
    expect([...doc.querySelectorAll("[data-art-tile]")].map((t) => t.textContent).join("")).toBe("read");
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
  });

  it("is hidden below 768px so it adds no height above the content", () => {
    const doc = parse(<PageHero title="Programs" trail={trail} art="read" />);
    expect(doc.querySelector("[data-hero-art]")?.className).toMatch(/\bhidden\b/);
    expect(doc.querySelector("[data-hero-art]")?.className).toMatch(/md:grid/);
  });

  it("lets a real photo slot win over the art", () => {
    const doc = parse(<PageHero title="About" trail={trail} slot="A1" art="read" />);
    expect(doc.querySelector("[data-hero-art]")).toBeNull();
  });

  it("renders nothing extra without art", () => {
    const doc = parse(<PageHero title="Programs" trail={trail} />);
    expect(doc.querySelector("[data-hero-art]")).toBeNull();
  });
});
