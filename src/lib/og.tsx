import { ImageResponse } from "next/og";
import { brand } from "@/content/brand";

export const OG_SIZE = { width: 1200, height: 630 } as const;
const TILES = [
  { bg: "#f80000", fg: "#ffffff" },
  { bg: "#f87000", fg: "#16204a" },
  { bg: "#00b8e8", fg: "#16204a" },
  { bg: "#f80098", fg: "#ffffff" },
  { bg: "#f8b000", fg: "#16204a" },
  { bg: "#10b800", fg: "#16204a" },
  { bg: "#1848a0", fg: "#ffffff" },
];

/** Social card: our own drawn sound tiles spelling "Phonics" on the brand red, plus a line of text. */
export function ogImage(line: string, sub: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#e3001b", color: "#ffffff", padding: 64 }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>{brand.fullName}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {Array.from("Phonics").map((ch, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 110, height: 110, borderRadius: 24, background: TILES[i].bg, color: TILES[i].fg, fontSize: 76, fontWeight: 700 }}>
                {ch}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.05, maxWidth: 1000 }}>{line}</div>
        </div>
        <div style={{ display: "flex", fontSize: 32 }}>{sub}</div>
      </div>
    ),
    OG_SIZE,
  );
}
