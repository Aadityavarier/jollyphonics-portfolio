import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { branchPhotoSlot, imageSlots, placedSlots } from "@/content/images";

/** Slot IDs written into pages and components (slot="C1", id="H1", slot: "H3"). The styleguide is internal. */
function slotIdsInSource(): Set<string> {
  const walk = (d: string): string[] => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
  const ids = new Set<string>();
  for (const f of [...walk("src/app"), ...walk("src/components")].filter((f) => f.endsWith(".tsx") && !/styleguide/.test(f))) {
    for (const m of readFileSync(f, "utf8").matchAll(/\b(?:slot|id)(?:=|:\s*)"([HAPCTSB]\d{1,2})"/g)) ids.add(m[1]);
  }
  Object.values(branchPhotoSlot).forEach((id) => ids.add(id));
  return ids;
}

describe("placed slots", () => {
  it("are exactly the slots some page renders, so npm run photos never publishes an unused photo", () => {
    expect([...placedSlots].sort()).toEqual([...slotIdsInSource()].sort());
  });
  it("only placed slots carry a photo", () => {
    for (const [id, slot] of Object.entries(imageSlots)) if (slot.photo) expect(placedSlots).toContain(id);
  });
});
