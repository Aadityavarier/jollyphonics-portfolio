import type { Branch, Side } from "@/content/types";
import { branchPhotoSlot, imageSlots } from "@/content/images";

/** Branch photos show only when all four exist, so the four cards stay identical. */
export function branchPhotosReady(): boolean {
  return Object.values(branchPhotoSlot).every((id) => Boolean(imageSlots[id].photo));
}

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

/** What the map searches for: the exact pin when the client has supplied one, otherwise the address. */
const place = (b: Branch) => (b.geo ? `${b.geo.lat},${b.geo.lng}` : b.address);

export function directionsUrl(b: Branch): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place(b))}`;
}

export function mapEmbedUrl(b: Branch): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(place(b))}&output=embed`;
}
