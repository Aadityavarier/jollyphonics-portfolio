import type { BranchId } from "./types";
import { photoManifest } from "./photos.generated";

/**
 * Photo slots from PLAN.md §4. To add a photo, drop it in raw-images/ named after its slot (e.g. H1-portrait.jpg)
 * and run `npm run photos`: the photo is converted, and its slot picks it up from photos.generated.ts. Alt text
 * is edited in images.md. A `photo` set by hand below still wins.
 */
export type Ratio = "4:5" | "4:3" | "3:2" | "1:1";

export interface ImageSlotDef {
  description: string;
  ratio: Ratio;
  /** CSS object-position for this slot's photo: where the faces are, so a cover crop never cuts heads. */
  focus?: string;
  photo?: { src: string; alt: string; width?: number; height?: number; source?: string };
}

const slots = {
  // Home
  H1: { description: "Trainer Revathi, warm, waist-up portrait, smiling at camera", ratio: "4:5" },
  H2: { description: "Child's hand on letter-sound cards or tracing letters (no faces needed)", ratio: "4:3" },
  H3: { description: "Small group of young children in a phonics activity", ratio: "3:2", focus: "50% 40%" },
  H4: { description: "Older primary student working with tutor at a desk", ratio: "3:2", focus: "55% 25%" },
  H5: { description: "Adult learner reading or practising with Tr. Revathi", ratio: "3:2" },
  H6: { description: "Tr. Revathi training a group of teachers", ratio: "3:2", focus: "50% 20%" },
  H7: { description: "Candid: Tr. Revathi teaching a small group of children", ratio: "3:2", focus: "50% 30%" },
  H8: { description: "Teachers teaser card (can reuse T1)", ratio: "3:2" },
  H9: { description: "Schools teaser card (can reuse S1)", ratio: "3:2" },
  H10: { description: "Gallery preview photo 1", ratio: "1:1" },
  H11: { description: "Gallery preview photo 2", ratio: "1:1" },
  H12: { description: "Gallery preview photo 3", ratio: "1:1" },
  H13: { description: "Gallery preview photo 4", ratio: "1:1" },
  H14: { description: "Gallery preview photo 5", ratio: "1:1" },
  H15: { description: "Gallery preview photo 6", ratio: "1:1" },
  // About
  A1: { description: "Second portrait of Tr. Revathi in her classroom, three-quarter length", ratio: "4:5", focus: "50% 15%" },
  A2: { description: "Jolly Phonics Trainer certificate (CPD College UK), flat, straight-on", ratio: "4:3" },
  A4: { description: "Receiving the Business Entrepreneur Award (2023)", ratio: "3:2" },
  A5: { description: "Receiving the ROVEX Award – SHAKTI (2025)", ratio: "3:2" },
  A6: { description: "Receiving the Nation Builder Award (2025)", ratio: "3:2" },
  A7: { description: "Tr. Revathi at an Inner Wheel or Rotary event", ratio: "3:2" },
  A8: { description: "Little moment: Tr. Revathi with one child, candid", ratio: "1:1", focus: "50% 30%" },
  A9: { description: "Receiving the Innovative Teaching Award (2026)", ratio: "3:2" },
  // Programs
  P1: { description: "Children doing phonics sound actions or sound cards", ratio: "3:2", focus: "50% 30%" },
  P2: { description: "Children writing sentences or doing a grammar worksheet", ratio: "3:2", focus: "50% 35%" },
  P3: { description: "Older student or adult reading aloud or speaking", ratio: "3:2" },
  P4: { description: "Close-up of pencil grip on a practice sheet (no faces needed)", ratio: "4:3" },
  P5: { description: "Summer camp, drawing or art activity", ratio: "3:2", focus: "50% 50%" },
  // Coaching
  C1: { description: "Tutor helping a primary-school student at a desk", ratio: "3:2", focus: "60% 30%" },
  C2: { description: "Small group studying together, notebooks open", ratio: "3:2", focus: "50% 35%" },
  // Teacher training
  T1: { description: "Tr. Revathi leading a teacher-training session", ratio: "3:2", focus: "50% 25%" },
  T2: { description: "Teachers practising phonics activities or games", ratio: "3:2" },
  T3: { description: "Teachers doing a hands-on early-childhood activity", ratio: "3:2" },
  T4: { description: "Montessori-style learning materials on a table (no faces needed)", ratio: "4:3" },
  // For schools
  S1: { description: "Phonics workshop in a school classroom or hall", ratio: "3:2", focus: "50% 30%" },
  S2: { description: "Tr. Revathi with a school's teachers", ratio: "3:2", focus: "40% 25%" },
  // Branches
  B1: { description: "Ambernath East — Shiv Basav Nagar: building entrance or signage (Om Dubey Dham, above Shobha Hospital)", ratio: "3:2" },
  B2: { description: "Ambernath West — Chinchpada: Navare Residency entrance or signage", ratio: "3:2" },
  B3: { description: "Ambernath East — Vadavali: Little Champs Playschool entrance", ratio: "3:2" },
  B4: { description: "Ambernath East — Nisarg Green: Flying Bird Preschool entrance", ratio: "3:2" },
} satisfies Record<string, ImageSlotDef>;

export type SlotId = keyof typeof slots;

/**
 * Slots some page actually renders. `npm run photos` publishes photos only for these, so a photo dropped in for
 * an unplaced slot never ships. Place a slot on a page, then add it here (a test keeps the two in step).
 */
export const placedSlots: readonly SlotId[] = ["H1", "H3", "H4", "H5", "H6", "A1", "C1", "S1", "T1", "B1", "B2", "B3", "B4"];

export const imageSlots: Record<SlotId, ImageSlotDef> = Object.fromEntries(
  Object.entries(slots).map(([id, def]) => [id, { ...def, photo: (def as ImageSlotDef).photo ?? photoManifest.slots[id] }]),
) as Record<SlotId, ImageSlotDef>;

export const branchPhotoSlot: Record<BranchId, SlotId> = {
  "shiv-basav-nagar": "B1",
  chinchpada: "B2",
  vadavali: "B3",
  "nisarg-green": "B4",
};
