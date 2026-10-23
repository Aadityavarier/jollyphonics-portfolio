import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// As if `npm run photos` had placed H1 and the client had described it in images.md.
vi.mock("@/content/photos.generated", () => ({
  photoManifest: {
    slots: { H1: { src: "/images/home/H1.webp", alt: "Trainer Revathi smiling in her classroom", width: 1600, height: 2000 } },
    gallery: [],
  },
}));

import { ImageSlot } from "@/components/blocks/ImageSlot";
import { imageSlots } from "@/content/images";

describe("a converted photo reaches its slot without code changes", () => {
  it("imageSlots picks the photo up from the manifest", () => {
    expect(imageSlots.H1.photo?.src).toBe("/images/home/H1.webp");
    expect(imageSlots.H2.photo).toBeUndefined();
  });

  it("ImageSlot renders the photo with its alt text instead of the placeholder", () => {
    const { container } = render(<ImageSlot id="H1" sizes="100vw" />);
    expect(screen.getByAltText("Trainer Revathi smiling in her classroom")).toBeInTheDocument();
    expect(container.querySelector("[data-placeholder]")).toBeNull();
  });
});
