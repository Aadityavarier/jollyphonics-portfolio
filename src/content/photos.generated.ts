// Written by `npm run photos` (scripts/photos.mjs). Do not edit by hand: change alt text in images.md and re-run.
import type { GalleryCategorySlug } from "./gallery";

export interface PhotoFile {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const photoManifest: { slots: Record<string, PhotoFile>; gallery: (PhotoFile & { category: GalleryCategorySlug })[] } = {
  "slots": {},
  "gallery": []
};
