"use client";

import { useState } from "react";

interface Props {
  name: string;
  src: string;
}

/** Tap-to-load map (C4): no Google Maps request until the visitor asks for it. */
export function BranchMap({ name, src }: Props) {
  const [shown, setShown] = useState(false);

  return (
    <div data-part="map" className="branch-map">
      {shown ? (
        <iframe
          src={src}
          title={`Map of ${name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full rounded-[inherit] border-0"
        />
      ) : (
        <button type="button" onClick={() => setShown(true)} className="branch-map-button">
          Show map
        </button>
      )}
    </div>
  );
}
