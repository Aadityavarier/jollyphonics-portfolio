/**
 * Pointer-following springs (framer-motion). Imported dynamically by Magnetic and HeroTiles only on
 * devices with a fine pointer and motion allowed, so phones never load this chunk.
 * Each target gets motion values written straight to `style.transform` (no React re-render per frame).
 */
import { animate, motionValue, type MotionValue } from "framer-motion";
import { SPRING } from "./tokens";

type Spring = { x: MotionValue<number>; y: MotionValue<number>; r: MotionValue<number> };

function springFor(el: HTMLElement): Spring {
  const s = { x: motionValue(0), y: motionValue(0), r: motionValue(0) };
  const write = () => {
    el.style.transform = `translate3d(${s.x.get()}px, ${s.y.get()}px, 0) rotate(${s.r.get()}deg)`;
  };
  s.x.on("change", write);
  s.y.on("change", write);
  s.r.on("change", write);
  return s;
}

function to(s: Spring, x: number, y: number, r = 0) {
  animate(s.x, x, SPRING);
  animate(s.y, y, SPRING);
  animate(s.r, r, SPRING);
}

export function attachMagnetic(el: HTMLElement, strength: number): () => void {
  const s = springFor(el);
  const move = (e: PointerEvent) => {
    const b = el.getBoundingClientRect();
    const dx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
    const dy = (e.clientY - (b.top + b.height / 2)) / (b.height / 2);
    to(s, Math.max(-1, Math.min(1, dx)) * strength, Math.max(-1, Math.min(1, dy)) * strength);
  };
  const leave = () => to(s, 0, 0);
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
    el.style.transform = "";
  };
}

/** Tiles lean towards the pointer while it is over `area`: up to `shift` px and `tilt` degrees. */
export function attachLean(area: HTMLElement, tiles: HTMLElement[], shift = 8, tilt = 6): () => void {
  const springs = tiles.map(springFor);
  // Rest positions are read once per hover (not per move) to avoid layout reads mid-animation.
  let centres: { x: number; y: number }[] = [];
  let frame = 0;
  const enter = () => {
    centres = tiles.map((t) => {
      const b = t.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    });
  };
  const move = (e: PointerEvent) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!centres.length) enter();
      const a = area.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v * 2));
      centres.forEach((c, i) => {
        const dx = clamp((e.clientX - c.x) / a.width);
        const dy = clamp((e.clientY - c.y) / a.height);
        to(springs[i], dx * shift, dy * shift, dx * tilt);
      });
    });
  };
  const leave = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    centres = [];
    springs.forEach((s) => to(s, 0, 0));
  };
  area.addEventListener("pointerenter", enter);
  area.addEventListener("pointermove", move);
  area.addEventListener("pointerleave", leave);
  return () => {
    cancelAnimationFrame(frame);
    area.removeEventListener("pointerenter", enter);
    area.removeEventListener("pointermove", move);
    area.removeEventListener("pointerleave", leave);
    tiles.forEach((t) => (t.style.transform = ""));
  };
}
