import { describe, expect, it } from "vitest";
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
    expect(groups[0].branches.map((b) => b.id)).toEqual(["om-dubey-dham", "vadavali", "nisarg-green"]);
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
    render(<BranchCard branch={byId("om-dubey-dham")} withMap />);
    const card = screen.getByTestId("branch-card");
    expect(card.querySelector("iframe")).toBeNull();
    fireEvent.click(within(card).getByRole("button", { name: /show map/i }));
    const frames = card.querySelectorAll("iframe");
    expect(frames).toHaveLength(1);
    expect(frames[0].title).toBe("Map of Ambernath East — Om Dubey Dham");
  });
});
