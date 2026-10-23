import type { CSSProperties } from "react";

const COLOURS = ["#f80000", "#f87000", "#00b8e8", "#f80098", "#f8b000", "#10b800", "#1848a0"];
const SEGMENTS = 28;

/**
 * Reading progress as a row of small sound tiles under the header: each tile lights up as the page scrolls
 * past its share. Pure CSS scroll timeline (compositor); hidden where scroll timelines or motion are unavailable.
 */
export function TileProgress() {
  return (
    <div aria-hidden="true" className="tile-progress">
      {Array.from({ length: SEGMENTS }, (_, k) => (
        <span key={k} style={{ "--k": k, "--c": COLOURS[k % COLOURS.length] } as CSSProperties} />
      ))}
    </div>
  );
}
