import type { Branch, Side } from "@/content/types";

export type SideLabel = "Ambernath East" | "Ambernath West";

export interface BranchGroup {
  side: Side;
  label: SideLabel;
  branches: Branch[];
}

const SIDES: { side: Side; label: SideLabel }[] = [
  { side: "east", label: "Ambernath East" },
  { side: "west", label: "Ambernath West" },
];

/** East first, then West; content.md order within each side. */
export function groupBranchesBySide(bs: Branch[]): BranchGroup[] {
  return SIDES.map(({ side, label }) => ({ side, label, branches: bs.filter((b) => b.side === side) })).filter(
    (g) => g.branches.length > 0,
  );
}

export function directionsUrl(b: Branch): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`;
}

export function mapEmbedUrl(b: Branch): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(b.address)}&output=embed`;
}
