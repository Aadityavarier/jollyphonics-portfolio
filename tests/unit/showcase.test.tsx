import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Showcase } from "@/components/home/Showcase";

const html = renderToString(<Showcase />);
const doc = new DOMParser().parseFromString(html, "text/html");
const tiles = [...doc.querySelectorAll("a[data-showcase-tile]")];

describe("Showcase (programs bento)", () => {
  it("has seven tiles, each one a link to the page or anchor it previews", () => {
    expect(tiles.map((t) => t.getAttribute("href"))).toEqual([
      "/programs#phonics",
      "/programs#grammar",
      "/programs#english",
      "/programs#handwriting",
      "/coaching",
      "/teacher-training",
      "/for-schools",
    ]);
  });

  it("names every link by its title; the miniature itself is hidden from assistive tech", () => {
    tiles.forEach((t) => {
      expect(t.querySelectorAll("[data-preview]")).toHaveLength(1);
      expect(t.querySelector("[data-preview]")!.getAttribute("aria-hidden")).toBe("true");
      expect(t.querySelector("h3")?.textContent?.trim()).toBeTruthy();
    });
  });

  it("draws the 42 sounds as 42 plain tiles with no letters in them", () => {
    const wall = tiles[0].querySelectorAll("[data-preview] [data-sound]");
    expect(wall).toHaveLength(42);
    wall.forEach((w) => expect(w.textContent).toBe(""));
  });

  it("keeps the grammar sentence in the right DOM order", () => {
    const words = [...tiles[1].querySelectorAll("[data-word]")].map((w) => w.textContent);
    expect(words).toEqual(["The", "dog", "runs", "fast"]);
  });

  it("is the only h2 of its section", () => {
    expect(doc.querySelectorAll("h2")).toHaveLength(1);
  });
});
