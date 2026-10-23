"use client";

import type { CSSProperties } from "react";
import { PHONICS_TILES } from "@/components/blocks/PhonicsAccent";
import { LayoutTabs } from "@/components/motion/LayoutTabs";

interface Track {
  audience: string;
  items: readonly string[];
}

/**
 * The three audience tracks (teachers / students / parents) as tabs with a sliding indicator; the panels slide
 * in from the side the tab is on, and each track's topics play in as a strip of frames (content order only, no
 * sequence or timing claims). Every panel is in the HTML; without JS all three show stacked.
 */
export function Tracks({ tracks }: { tracks: readonly Track[] }) {
  return (
    <LayoutTabs
      label="School workshop tracks"
      listClassName="schools-tabs"
      panelClassName="pt-7"
      tabs={tracks.map((t) => ({
        id: t.audience.toLowerCase().replace(/\W+/g, "-"),
        label: t.audience,
        panel: (
          <div>
            <h3 className="mb-5 font-display text-lead font-bold">{t.audience}</h3>
            <ul className="frames">
              {t.items.map((item, i) => (
                <li key={item} className="frame" style={{ "--i": i, "--c": PHONICS_TILES[i % PHONICS_TILES.length].bg } as CSSProperties}>
                  <span aria-hidden="true" className="frame-mark" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
      }))}
    />
  );
}
