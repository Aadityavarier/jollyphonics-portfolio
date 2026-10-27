import Image from "next/image";
import { imageSlots, type Ratio, type SlotId } from "@/content/images";
import { showTodos } from "@/lib/env";

const RATIO_CLASS: Record<Ratio, string> = {
  "4:5": "aspect-[4/5]",
  "4:3": "aspect-[4/3]",
  "3:2": "aspect-[3/2]",
  "1:1": "aspect-square",
};

interface Props {
  id: SlotId;
  sizes: string;
  preload?: boolean;
  className?: string;
}

/** A §4 photo slot. Missing photo: labelled placeholder in dev, nothing in production. */
export function ImageSlot({ id, sizes, preload = false, className = "" }: Props) {
  const slot = imageSlots[id];
  const frame = `relative overflow-hidden ${RATIO_CLASS[slot.ratio]} ${className}`.trim();

  if (slot.photo) {
    return (
      <div className={frame}>
        <Image src={slot.photo.src} alt={slot.photo.alt} fill sizes={sizes} preload={preload} className="object-cover" style={slot.focus ? { objectPosition: slot.focus } : undefined} />
      </div>
    );
  }

  if (!showTodos()) return null;

  return (
    <div data-placeholder={id} className={`${frame} image-placeholder`}>
      <span className="image-placeholder-id">{id}</span>
      <span className="image-placeholder-text">{slot.description}</span>
    </div>
  );
}
