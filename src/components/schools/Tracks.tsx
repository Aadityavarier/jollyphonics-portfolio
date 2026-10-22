"use client";

import { useState } from "react";

interface Track {
  audience: string;
  items: readonly string[];
}

/** Three audience tracks as tabs: teachers / students / parents. */
export function Tracks({ tracks }: { tracks: readonly Track[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div role="tablist" aria-label="School workshop tracks" className="flex flex-wrap gap-2">
        {tracks.map((t, i) => (
          <button
            key={t.audience}
            type="button"
            role="tab"
            id={`track-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`track-panel-${i}`}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 text-small font-bold transition-colors duration-[var(--dur-ui)] ${
              active === i ? "bg-red text-paper" : "bg-surface text-ink hover:bg-ink/10"
            }`}
          >
            {t.audience}
          </button>
        ))}
      </div>
      {tracks.map((t, i) => (
        <div
          key={t.audience}
          role="tabpanel"
          id={`track-panel-${i}`}
          aria-labelledby={`track-tab-${i}`}
          hidden={active !== i}
          className="mt-6"
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.items.map((item) => (
              <li key={item} className="rounded-[var(--radius-panel)] bg-surface p-4 font-medium">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
