"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import type { GalleryPhoto } from "@/content/gallery";
import { labels } from "@/content/labels";

const L = labels.pages.gallery.lightbox;

interface Props {
  photos: GalleryPhoto[];
  children: ReactNode;
}

/**
 * Wraps the server-rendered grid. Each thumbnail is a plain link to the full photo (works without JS); with JS a
 * click opens the native modal <dialog> instead, which traps focus and closes on Esc. The full-size file is only
 * fetched once the viewer opens. Arrow keys step through the photos. No motion beyond a fade, none when reduced.
 */
export function Lightbox({ photos, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-lightbox]");
    if (!link) return;
    const i = photos.findIndex((p) => p.src === link.getAttribute("href"));
    if (i < 0) return;
    e.preventDefault();
    opener.current = link;
    setIndex(i);
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      d.querySelector<HTMLButtonElement>("[data-close]")?.focus();
    }
    if (index === null && d.open) d.close();
  }, [index]);

  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  };

  const onClose = () => {
    setIndex(null);
    opener.current?.focus();
  };

  const photo = index === null ? null : photos[index];

  return (
    <div onClick={onClick}>
      {children}
      <dialog
        ref={dialog}
        aria-label={L.label}
        className="lightbox"
        onClose={onClose}
        onKeyDown={onKey}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        {photo && index !== null && (
          <figure className="lightbox-figure">
            <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized className="lightbox-img" />
            <figcaption className="lightbox-bar">
              <span className="text-small">{photo.alt}</span>
              <span className="text-small font-bold whitespace-nowrap" aria-live="polite">
                {L.position(index + 1, photos.length)}
              </span>
              <span className="flex gap-2">
                <button type="button" className="lightbox-btn" onClick={() => step(-1)} aria-label={L.prev}>
                  <Chevron dir="left" />
                </button>
                <button type="button" className="lightbox-btn" onClick={() => step(1)} aria-label={L.next}>
                  <Chevron dir="right" />
                </button>
                <button type="button" className="lightbox-btn" onClick={() => dialog.current?.close()} aria-label={L.close} data-close>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}
