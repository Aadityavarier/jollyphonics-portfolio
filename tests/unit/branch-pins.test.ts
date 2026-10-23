import { describe, expect, it } from "vitest";
import { branches } from "@/content/branches";
import { directionsUrl, mapEmbedUrl } from "@/lib/branches";
import { branchNode } from "@/lib/jsonld";
import type { Branch } from "@/content/types";

// Pincodes and map pins are client-supplied (TODO pincodes). Adding them to a branch is data only.
const pinned: Branch = { ...branches[0], postalCode: "421501", geo: { lat: 19.2, lng: 73.19 } };

describe("branch pincode and map pin, once supplied", () => {
  it("ship without them today: addresses only, nothing invented", () => {
    for (const b of branches) {
      expect(b.postalCode).toBeUndefined();
      expect(b.geo).toBeUndefined();
      expect(branchNode(b).address).not.toHaveProperty("postalCode");
    }
  });

  it("go into the structured data", () => {
    const node = branchNode(pinned) as Record<string, unknown>;
    expect(node.address).toMatchObject({ postalCode: "421501" });
    expect(node.geo).toEqual({ "@type": "GeoCoordinates", latitude: 19.2, longitude: 73.19 });
  });

  it("make directions and the map land on the exact pin", () => {
    expect(new URL(directionsUrl(pinned)).searchParams.get("query")).toBe("19.2,73.19");
    expect(mapEmbedUrl(pinned)).toContain(encodeURIComponent("19.2,73.19"));
  });
});
