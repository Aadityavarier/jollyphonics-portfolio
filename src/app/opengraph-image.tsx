import { ogImage, OG_SIZE } from "@/lib/og";
import { brand } from "@/content/brand";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${brand.fullName}, Ambernath`;

export default function Image() {
  return ogImage("Phonics & English classes in Ambernath", "Ambernath East & West");
}
