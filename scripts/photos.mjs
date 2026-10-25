// npm run photos — turns photos dropped into raw-images/ into site-ready WebP files and wires them in.
//
//   raw-images/H1-anything.jpg            → public/images/home/H1.webp        (the slot's ImageSlot shows it)
//   raw-images/gallery/<category>/x.jpg   → public/images/gallery/<category>/<n>.webp (+ <n>-thumb.webp, 640px)
//   raw-images/inbox/                     → ignored (unsorted originals waiting to be picked)
//
// Long edge at most 2000px, WebP quality 78, EXIF rotation applied; EXIF/GPS and other metadata are not copied.
// Gallery thumbnails are pre-built so the site serves them as plain files, outside the image optimizer. Writes src/content/photos.generated.ts
// (read by images.ts and gallery.ts) and images.md (alt text you can edit; your edits are kept).
// Files it cannot place or read are listed as skipped; it never stops halfway.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { galleryFromPath, parseImagesMd, renderImagesMd, slotFromName } from "./photos-lib.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX = 2000;
const QUALITY = 78;
const THUMB = 640;
const THUMB_QUALITY = 72;
const READABLE = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);
const PAGE = { H: "home", A: "about", P: "programs", C: "coaching", T: "teacher-training", S: "for-schools", B: "branches" };

/** Slot IDs and descriptions straight from src/content/images.ts, so the two never drift apart. */
function readSlots() {
  const src = readFileSync(join(ROOT, "src/content/images.ts"), "utf8");
  const slots = new Map();
  for (const m of src.matchAll(/^\s+([A-Z]\d+): \{ description: "((?:[^"\\]|\\.)*)"/gm)) slots.set(m[1], m[2]);
  return slots;
}

function readGallery() {
  const src = readFileSync(join(ROOT, "src/content/gallery.ts"), "utf8");
  const cats = new Map();
  for (const m of src.matchAll(/\{ slug: "([a-z0-9-]+)", label: "([^"]+)" \}/g)) cats.set(m[1], m[2]);
  return cats;
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// sharp copies no metadata unless asked (.withMetadata), so outputs carry no EXIF, GPS, XMP or IPTC.
async function convert(from, to, max = MAX, quality = QUALITY) {
  mkdirSync(dirname(to), { recursive: true });
  const info = await sharp(from).rotate().resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).webp({ quality }).toFile(to);
  return { width: info.width, height: info.height };
}

/** "H3-WA0064.jpg" → "WA0064", "gallery/events/01-WA0093.jpg" → "WA0093": which original a file came from. */
const sourceOf = (rel, slot) =>
  rel
    .split("/")
    .pop()
    .replace(/\.[^.]+$/, "")
    .replace(slot ? new RegExp(`^${slot}[-_ ]?`, "i") : /^\d+[-_ ]/, "");

export async function runPhotos({
  raw = join(ROOT, "raw-images"),
  publicDir = join(ROOT, "public"),
  manifest = join(ROOT, "src/content/photos.generated.ts"),
  md = join(ROOT, "images.md"),
  quiet = false,
} = {}) {
  const log = (...a) => !quiet && console.log(...a);
  const slots = readSlots();
  const cats = readGallery();
  const keptAlt = existsSync(md) ? parseImagesMd(readFileSync(md, "utf8")) : new Map();
  const out = { slots: {}, gallery: [] };
  const rows = [];
  const skipped = [];
  const counters = {};

  const files = walk(raw)
    .map((f) => relative(raw, f).replace(/\\/g, "/"))
    .filter((f) => !/(^|\/)(README\.md|\.gitkeep|\.DS_Store|Thumbs\.db)$/i.test(f) && !f.startsWith("inbox/"))
    .sort();

  for (const rel of files) {
    const ext = extname(rel).toLowerCase();
    if (!READABLE.has(ext)) {
      skipped.push(rel);
      log(`skip  ${rel}  (${ext === ".heic" || ext === ".heif" ? "HEIC: export it as JPG first" : "not an image this script reads"})`);
      continue;
    }
    const category = galleryFromPath(rel, [...cats.keys()]);
    const slot = category ? null : rel.includes("/") ? null : slotFromName(rel, [...slots.keys()]);
    if (!category && !slot) {
      skipped.push(rel);
      log(`skip  ${rel}  (name it after a slot, e.g. H1-portrait.jpg, or put it in gallery/<category>/)`);
      continue;
    }
    try {
      if (slot) {
        if (out.slots[slot]) {
          skipped.push(rel);
          log(`skip  ${rel}  (${slot} already has a photo from this folder)`);
          continue;
        }
        const src = `/images/${PAGE[slot[0]] ?? "misc"}/${slot}.webp`;
        const size = await convert(join(raw, rel), join(publicDir, src));
        const alt = keptAlt.get(slot) || slots.get(slot);
        out.slots[slot] = { src, alt, ...size, source: sourceOf(rel, slot) };
        rows.push({ key: slot, file: src, alt, description: slots.get(slot) });
        log(`ok    ${rel} → ${src} (${size.width}×${size.height})`);
      } else {
        counters[category] = (counters[category] ?? 0) + 1;
        const src = `/images/gallery/${category}/${counters[category]}.webp`;
        const size = await convert(join(raw, rel), join(publicDir, src));
        const thumb = `/images/gallery/${category}/${counters[category]}-thumb.webp`;
        await convert(join(raw, rel), join(publicDir, thumb), THUMB, THUMB_QUALITY);
        const key = `gallery/${category}/${counters[category]}`;
        const alt = keptAlt.get(key) || cats.get(category);
        out.gallery.push({ category, src, thumb, alt, ...size, source: sourceOf(rel) });
        rows.push({ key, file: src, alt, description: `Gallery: ${cats.get(category)}` });
        log(`ok    ${rel} → ${src}`);
      }
    } catch (e) {
      skipped.push(rel);
      log(`skip  ${rel}  (could not read it: ${e.message.split("\n")[0]})`);
    }
  }

  mkdirSync(dirname(manifest), { recursive: true });
  writeFileSync(
    manifest,
    [
      "// Written by `npm run photos` (scripts/photos.mjs). Do not edit by hand: change alt text in images.md and re-run.",
      'import type { GalleryCategorySlug } from "./gallery";',
      "",
      "export interface PhotoFile {",
      "  src: string;",
      "  alt: string;",
      "  width: number;",
      "  height: number;",
      "  /** The original this file came from (e.g. WA0064), so a page can avoid showing one photo twice. */",
      "  source: string;",
      "}",
      "",
      "export const photoManifest: { slots: Record<string, PhotoFile>; gallery: (PhotoFile & { category: GalleryCategorySlug; thumb: string })[] } = " +
        JSON.stringify(out, null, 2) +
        ";",
      "",
    ].join("\n"),
  );
  writeFileSync(md, renderImagesMd(rows));
  const live = Object.entries(counters).filter(([, n]) => n >= 3).map(([c]) => c);
  log(`\n${Object.keys(out.slots).length} slot photo(s), ${out.gallery.length} gallery photo(s); gallery categories live (3+): ${live.join(", ") || "none"}; skipped ${skipped.length}.`);
  return { slots: Object.keys(out.slots), gallery: out.gallery.length, skipped };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await runPhotos();
}
