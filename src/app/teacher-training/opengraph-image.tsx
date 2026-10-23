import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Phonics, ECCEd and Montessori teacher training in Ambernath";

export default function Image() {
  return ogImage("Teacher Training", "Phonics, ECCEd & Montessori, Ambernath");
}
