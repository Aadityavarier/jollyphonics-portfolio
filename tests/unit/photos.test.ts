import { mkdtempSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { galleryFromPath, parseImagesMd, renderImagesMd, slotFromName } from "../../scripts/photos-lib.mjs";
import { runPhotos } from "../../scripts/photos.mjs";
import { visibleCategories, galleryHasPhotos, type GalleryPhoto } from "@/content/gallery";
import { sitemapPages } from "@/app/sitemap";

const SLOTS = ["H1", "H10", "A2", "B4"];
const SLUGS = ["summer-camps", "events"];

describe("photo naming", () => {
  it("maps a file to its slot by the leading slot ID, any case, with any suffix", () => {
    expect(slotFromName("H1-anything.jpg", SLOTS)).toBe("H1");
    expect(slotFromName("h1 portrait.JPG", SLOTS)).toBe("H1");
    expect(slotFromName("H1.png", SLOTS)).toBe("H1");
    expect(slotFromName("H10.png", SLOTS)).toBe("H10");
    expect(slotFromName("H10-x.webp", SLOTS)).toBe("H10");
  });
  it("ignores files that do not start with a known slot ID", () => {
    expect(slotFromName("random.jpg", SLOTS)).toBeNull();
    expect(slotFromName("H2-x.jpg", SLOTS)).toBeNull();
    expect(slotFromName("H1x.jpg", SLOTS)).toBeNull();
  });
  it("puts gallery/<category>/file in that category, only for known categories", () => {
    expect(galleryFromPath("gallery/summer-camps/x.jpg", SLUGS)).toBe("summer-camps");
    expect(galleryFromPath("gallery/Summer-Camps/x.jpg", SLUGS)).toBe("summer-camps");
    expect(galleryFromPath("gallery/unknown/x.jpg", SLUGS)).toBeNull();
    expect(galleryFromPath("H1.jpg", SLUGS)).toBeNull();
  });
  it("keeps alt text edited by hand in images.md when the table is rewritten", () => {
    const md = renderImagesMd([{ key: "H1", file: "/images/home/H1.webp", alt: "Trainer Revathi in her classroom", description: "portrait" }]);
    const parsed = parseImagesMd(md);
    expect(parsed.get("H1")).toBe("Trainer Revathi in her classroom");
    expect(renderImagesMd([{ key: "H1", file: "/images/home/H1.webp", alt: parsed.get("H1")!, description: "portrait" }])).toBe(md);
  });
});

describe("npm run photos (end to end, temporary folders)", () => {
  async function jpg(path: string, w: number, h: number) {
    await sharp({ create: { width: w, height: h, channels: 3, background: { r: 200, g: 40, b: 40 } } }).jpeg().toFile(path);
  }

  it("converts, resizes to 2000px max, names by slot, writes the manifest and images.md, skips the rest", async () => {
    const root = mkdtempSync(join(tmpdir(), "photos-"));
    const raw = join(root, "raw");
    mkdirSync(join(raw, "gallery", "summer-camps"), { recursive: true });
    await jpg(join(raw, "H1-portrait.jpg"), 3000, 3750);
    await jpg(join(raw, "notes.jpg"), 400, 300);
    for (const n of [1, 2, 3]) await jpg(join(raw, "gallery", "summer-camps", `${n}.jpg`), 800, 800);

    const out = join(root, "public");
    const manifest = join(root, "photos.generated.ts");
    const md = join(root, "images.md");
    const report = await runPhotos({ raw, publicDir: out, manifest, md, quiet: true });

    expect(report.skipped).toEqual(["notes.jpg"]);
    const meta = await sharp(join(out, "images", "home", "H1.webp")).metadata();
    expect(meta.format).toBe("webp");
    expect(Math.max(meta.width!, meta.height!)).toBe(2000);
    expect(existsSync(join(out, "images", "gallery", "summer-camps", "3.webp"))).toBe(true);

    const ts = readFileSync(manifest, "utf8");
    expect(ts).toContain('"src": "/images/home/H1.webp"');
    expect(ts).toContain("Trainer Revathi, warm, waist-up portrait, smiling at camera"); // default alt = slot description
    expect(ts).toContain('"category": "summer-camps"');
    expect(readFileSync(md, "utf8")).toContain("| H1 |");
  }, 60000);
});

describe("npm run photos: gallery thumbnails, inbox and metadata", () => {
  it("writes a ~640px thumbnail next to each gallery photo, ignores raw-images/inbox, and strips EXIF/GPS", async () => {
    const root = mkdtempSync(join(tmpdir(), "photos-"));
    const raw = join(root, "raw");
    mkdirSync(join(raw, "gallery", "events"), { recursive: true });
    mkdirSync(join(raw, "inbox"), { recursive: true });
    const gps = { IFD0: { Make: "TestCam" }, IFD3: { GPSLatitudeRef: "N", GPSLatitude: "19/1 12/1 0/1" } };
    await sharp({ create: { width: 1600, height: 1200, channels: 3, background: { r: 10, g: 120, b: 90 } } })
      .withExif(gps)
      .jpeg()
      .toFile(join(raw, "gallery", "events", "01-WA0093.jpg"));
    await sharp({ create: { width: 900, height: 1600, channels: 3, background: "#888" } }).withExif(gps).jpeg().toFile(join(raw, "H3-x.jpg"));
    await sharp({ create: { width: 400, height: 300, channels: 3, background: "#888" } }).jpeg().toFile(join(raw, "inbox", "IMG-1.jpg"));
    expect((await sharp(join(raw, "H3-x.jpg")).metadata()).exif).toBeDefined();

    const out = join(root, "public");
    const manifest = join(root, "photos.generated.ts");
    const report = await runPhotos({ raw, publicDir: out, manifest, md: join(root, "images.md"), quiet: true });

    expect(report.skipped).toEqual([]);
    const thumb = await sharp(join(out, "images", "gallery", "events", "1-thumb.webp")).metadata();
    expect(Math.max(thumb.width!, thumb.height!)).toBe(640);
    for (const f of ["gallery/events/1.webp", "gallery/events/1-thumb.webp", "home/H3.webp"]) {
      const m = await sharp(join(out, "images", f)).metadata();
      expect(m.exif, f).toBeUndefined();
      expect(m.xmp, f).toBeUndefined();
      expect(m.iptc, f).toBeUndefined();
    }
    const ts = readFileSync(manifest, "utf8");
    expect(ts).toContain('"thumb": "/images/gallery/events/1-thumb.webp"');
    expect(ts).toContain('"source": "WA0093"');
    expect(ts).toContain('"source": "x"');
  }, 60000);

  it("skips a photo for a slot that no page renders", async () => {
    const root = mkdtempSync(join(tmpdir(), "photos-"));
    const raw = join(root, "raw");
    mkdirSync(raw, { recursive: true });
    await sharp({ create: { width: 900, height: 600, channels: 3, background: "#888" } }).jpeg().toFile(join(raw, "P2-WA0053.jpg"));
    const report = await runPhotos({ raw, publicDir: join(root, "public"), manifest: join(root, "m.ts"), md: join(root, "i.md"), quiet: true });
    expect(report.slots).toEqual([]);
    expect(report.skipped).toEqual(["P2-WA0053.jpg"]);
    expect(existsSync(join(root, "public", "images", "programs", "P2.webp"))).toBe(false);
  }, 60000);
});

describe("gallery goes live at 3 photos per category", () => {
  const photos = (n: number): GalleryPhoto[] => Array.from({ length: n }, (_, i) => ({ category: "events", src: `/images/gallery/events/${i}.webp`, thumb: `/images/gallery/events/${i}-thumb.webp`, alt: "An event", width: 1600, height: 1200, source: `WA${i}` }));
  it("2 photos: hidden; 3 photos: the category shows", () => {
    expect(visibleCategories(photos(2))).toEqual([]);
    expect(galleryHasPhotos(photos(2))).toBe(false);
    expect(visibleCategories(photos(3))).toEqual(["events"]);
    expect(galleryHasPhotos(photos(3))).toBe(true);
  });
  it("the sitemap lists /gallery exactly when a category is live", () => {
    expect(sitemapPages().includes("gallery")).toBe(galleryHasPhotos());
  });
});
