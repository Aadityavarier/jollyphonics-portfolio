import { photoManifest } from "./photos.generated";

export const galleryCategories = [
  { slug: "phonics-classes", label: "Phonics classes" },
  { slug: "drawing-art", label: "Drawing & art" },
  { slug: "teacher-training", label: "Teacher training" },
  { slug: "workshops", label: "Workshops" },
  { slug: "school-sessions", label: "School sessions" },
  { slug: "certificate-distribution", label: "Certificate distribution" },
  { slug: "summer-camps", label: "Summer camps" },
  { slug: "student-achievements", label: "Student achievements" },
  { slug: "reading-activities", label: "Reading activities" },
  { slug: "phonics-games", label: "Phonics games" },
  { slug: "events", label: "Events" },
  { slug: "trainer-revathi-sessions", label: "Trainer Revathi conducting sessions" },
] as const;

export type GalleryCategorySlug = (typeof galleryCategories)[number]["slug"];

export interface GalleryPhoto {
  category: GalleryCategorySlug;
  src: string;
  /** Pre-built ~640px copy shown in grids (served as a plain file, outside the image optimizer). */
  thumb: string;
  alt: string;
  width: number;
  height: number;
  /** The original it came from, e.g. "WA0069". */
  source: string;
}

/** Filled by `npm run photos` from raw-images/gallery/<category>/ (see CONTENT-GUIDE.md). */
export const galleryPhotos: GalleryPhoto[] = photoManifest.gallery;

export const MIN_PHOTOS_PER_CATEGORY = 3;

/**
 * Home's gallery preview (slots H10–H12), by original photo. None of them may also be a Home slot photo
 * (H3 is WA0064, so the school pick is WA0069).
 */
export const galleryPreviewSources = ["WA0012", "WA0093", "WA0069"];

export function galleryPreviewPhotos(photos: GalleryPhoto[] = galleryPhotos): GalleryPhoto[] {
  const live = visibleCategories(photos);
  return galleryPreviewSources
    .map((s) => photos.find((p) => p.source === s && live.includes(p.category)))
    .filter((p): p is GalleryPhoto => Boolean(p));
}

export function visibleCategories(photos: GalleryPhoto[]): GalleryCategorySlug[] {
  return galleryCategories
    .map((c) => c.slug)
    .filter((slug) => photos.filter((p) => p.category === slug).length >= MIN_PHOTOS_PER_CATEGORY);
}

export function galleryHasPhotos(photos: GalleryPhoto[] = galleryPhotos): boolean {
  return visibleCategories(photos).length > 0;
}
