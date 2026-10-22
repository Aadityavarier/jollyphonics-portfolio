import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { todo } from "@/content/todo";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.doUnmock("@/content/images");
});

async function loadImageSlot(photo?: { src: string; alt: string }) {
  if (photo) {
    const real = await vi.importActual<typeof import("@/content/images")>("@/content/images");
    vi.doMock("@/content/images", () => ({
      ...real,
      imageSlots: { ...real.imageSlots, H1: { ...real.imageSlots.H1, photo } },
    }));
  }
  return (await import("@/components/blocks/ImageSlot")).ImageSlot;
}

describe("ImageSlot", () => {
  it("shows a labelled placeholder in dev when the photo is missing", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const ImageSlot = await loadImageSlot();
    const { container } = render(<ImageSlot id="H1" sizes="100vw" />);
    const placeholder = container.querySelector("[data-placeholder]");
    expect(placeholder).not.toBeNull();
    expect(placeholder).toHaveTextContent("H1");
    expect(placeholder).toHaveTextContent(/trainer revathi/i);
  });

  it("renders nothing in production when the photo is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const ImageSlot = await loadImageSlot();
    const { container } = render(<ImageSlot id="H1" sizes="100vw" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the photo with its alt text when present", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const ImageSlot = await loadImageSlot({ src: "/images/home/H1.jpg", alt: "Trainer Revathi smiling" });
    render(<ImageSlot id="H1" sizes="100vw" />);
    expect(screen.getByRole("img", { name: "Trainer Revathi smiling" })).toBeInTheDocument();
  });
});

describe("Todo", () => {
  const t = todo("phonics-age", "Exact starting age for phonics");

  it("shows a visible TODO note in dev", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const { Todo } = await import("@/components/blocks/Todo");
    const { container } = render(<Todo value={t} />);
    expect(container.querySelector("[data-todo]")).toHaveTextContent("TODO: Exact starting age for phonics");
  });

  it("renders nothing in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { Todo } = await import("@/components/blocks/Todo");
    const { container } = render(<Todo value={t} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderMaybeTodo passes plain strings through", async () => {
    const { renderMaybeTodo } = await import("@/components/blocks/Todo");
    expect(renderMaybeTodo("20+")).toBe("20+");
  });
});
