"use client";

import { useState } from "react";

interface Props {
  name: string;
  src: string;
}

/** Tap-to-load map (C4): no Google Maps request until the visitor asks for it. */
export function BranchMap({ name, src }: Props) {
  const [shown, setShown] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div data-part="map" className="branch-map mt-3 overflow-hidden rounded-2xl">
      {shown ? (
        <div className="map-frame">
        <iframe
          src={src}
          onLoad={() => setLoaded(true)}
          title={`Map of ${name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full rounded-[inherit] border-0"
        />
        {loaded && (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="map-pin" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
        )}
        </div>
      ) : (
        <button type="button" onClick={() => setShown(true)} className="branch-map-button cta cta-inline underline decoration-2 underline-offset-4">
          Show map
        </button>
      )}
    </div>
  );
}
