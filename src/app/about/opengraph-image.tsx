import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Trainer Revathi, Internationally Certified Jolly Phonics Trainer";

export default function Image() {
  return ogImage("Trainer Revathi", "Internationally Certified Jolly Phonics Trainer");
}
