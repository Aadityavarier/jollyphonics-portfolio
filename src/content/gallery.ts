import { todo } from "./todo";
import { photoManifest } from "./photos.generated";

export const galleryCategories = [
  { slug: "phonics-classes", label: "Phonics classes" },
  { slug: "student-activities", label: "Student activities" },
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
  alt: string;
}

/** Filled by `npm run photos` from raw-images/gallery/<category>/ (see CONTENT-GUIDE.md). */
export const galleryPhotos: GalleryPhoto[] = photoManifest.gallery;

export const MIN_PHOTOS_PER_CATEGORY = 3;

export function visibleCategories(photos: GalleryPhoto[]): GalleryCategorySlug[] {
  return galleryCategories
    .map((c) => c.slug)
    .filter((slug) => photos.filter((p) => p.category === slug).length >= MIN_PHOTOS_PER_CATEGORY);
}

export function galleryHasPhotos(photos: GalleryPhoto[] = galleryPhotos): boolean {
  return visibleCategories(photos).length > 0;
}

export const photoConsentTodo = todo(
  "photo-consent",
  "Confirm parents have consented to children's photos being published (content.md Q11).",
);
