import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { branches } from "@/content/branches";
import { directionsUrl, groupBranchesBySide, mapEmbedUrl } from "@/lib/branches";
import { BranchList } from "@/components/contact/BranchList";
import { BranchCard } from "@/components/contact/BranchCard";

const byId = (id: string) => branches.find((b) => b.id === id)!;

function cardShape(card: HTMLElement) {
  const parts = Array.from(card.querySelectorAll<HTMLElement>("[data-part]"))
    .map((el) => `${el.dataset.part}|${el.tagName}|${el.className}`)
    .sort();
  return { className: card.className, parts };
}

describe("groupBranchesBySide", () => {
  it("lists Ambernath East first with three branches, then Ambernath West", () => {
    const groups = groupBranchesBySide(branches);
    expect(groups.map((g) => g.label)).toEqual(["Ambernath East", "Ambernath West"]);
    expect(groups[0].branches.map((b) => b.id)).toEqual(["shiv-basav-nagar", "vadavali", "nisarg-green"]);
    expect(groups[1].branches.map((b) => b.id)).toEqual(["chinchpada"]);
  });
});

describe("map links", () => {
  it("builds a Google Maps search link from the full address", () => {
    const url = new URL(directionsUrl(byId("chinchpada")));
    expect(url.origin + url.pathname).toBe("https://www.google.com/maps/search/");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("query")).toBe(byId("chinchpada").address);
  });

  it("builds an embeddable map URL from the full address", () => {
    const url = new URL(mapEmbedUrl(byId("vadavali")));
    expect(url.searchParams.get("q")).toBe(byId("vadavali").address);
    expect(url.searchParams.get("output")).toBe("embed");
  });
});

describe("BranchList parity", () => {
  it.each([false, true])("renders four structurally identical cards (withMap=%s)", (withMap) => {
    render(<BranchList withMap={withMap} />);
    const cards = screen.getAllByTestId("branch-card");
    expect(cards).toHaveLength(4);
    const [first, ...rest] = cards.map(cardShape);
    for (const shape of rest) expect(shape).toEqual(first);
    expect(first.parts.map((p) => p.split("|")[0])).toEqual(
      withMap
        ? ["address", "directions", "map", "name", "secondary", "whatsapp"]
        : ["address", "directions", "name", "secondary", "whatsapp"],
    );
  });

  it("groups cards under Ambernath East and Ambernath West headings", () => {
    render(<BranchList headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Ambernath East" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Ambernath West" })).toBeInTheDocument();
  });
});

describe("BranchList card text inside East/West groups", () => {
  const partText = (part: string) =>
    screen.getAllByTestId("branch-card").map((c) => c.querySelector(`[data-part="${part}"]`)!.textContent);

  it("titles each card with its locality only", () => {
    render(<BranchList />);
    expect(partText("name")).toEqual(["Shiv Basav Nagar", "Vadavali", "Nisarg Green", "Chinchpada"]);
  });

  it("shows a host-preschool line for branches 3 and 4 only, and no landmark line", () => {
    render(<BranchList />);
    expect(partText("secondary")).toEqual(["", "at Little Champs Playschool", "at Flying Bird Preschool", ""]);
  });

  it("keeps action labels in the accessibility tree", () => {
    render(<BranchList />);
    const card = screen.getAllByTestId("branch-card")[1];
    expect(within(card).getByRole("link", { name: /get directions/i })).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: /whatsapp/i })).toBeInTheDocument();
  });
});

describe("standalone BranchCard", () => {
  it("uses the full area-first name", () => {
    render(<BranchCard branch={byId("chinchpada")} />);
    expect(screen.getByTestId("branch-card").querySelector('[data-part="name"]')!.textContent).toBe(
      "Ambernath West — Chinchpada",
    );
  });
});

describe("branch photos are all-or-nothing", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("@/content/images");
    vi.unstubAllEnvs();
  });

  async function renderWithPhotos(ids: string[]) {
    vi.stubEnv("NODE_ENV", "development");
    const real = await vi.importActual<typeof import("@/content/images")>("@/content/images");
    const slots = { ...real.imageSlots };
    for (const id of ids) {
      const key = id as keyof typeof slots;
      slots[key] = { ...slots[key], photo: { src: `/images/contact/${id}.jpg`, alt: `Entrance ${id}` } };
    }
    vi.doMock("@/content/images", () => ({ ...real, imageSlots: slots }));
    const { BranchList: List } = await import("@/components/contact/BranchList");
    render(<List />);
    return screen.getAllByTestId("branch-card");
  }

  it("shows no photo or placeholder on any card when only some branch photos exist", async () => {
    const cards = await renderWithPhotos(["B1", "B2", "B3"]);
    for (const card of cards) {
      expect(card.querySelector("img")).toBeNull();
      expect(card.querySelector("[data-placeholder]")).toBeNull();
    }
  });

  it("shows a photo on every card once all four exist, keeping cards identical", async () => {
    const cards = await renderWithPhotos(["B1", "B2", "B3", "B4"]);
    for (const card of cards) expect(card.querySelectorAll("img")).toHaveLength(1);
    const [first, ...rest] = cards.map(cardShape);
    for (const shape of rest) expect(shape).toEqual(first);
  });
});

describe("BranchCard", () => {
  it("shows the full address of the longest branch", () => {
    render(<BranchCard branch={byId("nisarg-green")} />);
    expect(screen.getByText(byId("nisarg-green").address)).toBeInTheDocument();
  });

  it("links WhatsApp with a message naming the branch", () => {
    render(<BranchCard branch={byId("vadavali")} />);
    const link = screen.getByTestId("branch-card").querySelector<HTMLAnchorElement>('[data-part="whatsapp"] a, a[data-part="whatsapp"]')!;
    expect(new URL(link.href).searchParams.get("text")).toContain("Ambernath East — Vadavali");
  });

  it("loads the map iframe only after Show map is pressed", () => {
    render(<BranchCard branch={byId("shiv-basav-nagar")} withMap />);
    const card = screen.getByTestId("branch-card");
    expect(card.querySelector("iframe")).toBeNull();
    fireEvent.click(within(card).getByRole("button", { name: /show map/i }));
    const frames = card.querySelectorAll("iframe");
    expect(frames).toHaveLength(1);
    expect(frames[0].title).toBe("Map of Ambernath East — Shiv Basav Nagar");
  });
});
