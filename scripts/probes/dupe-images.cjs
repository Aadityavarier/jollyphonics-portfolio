// No page may show the same photo twice. Every <img> outside the lightbox is mapped back to the original it came
// from (photos.generated.ts records it), so a slot photo and the gallery thumbnail of the same original count as one.
const fs = require("node:fs");
const path = require("node:path");
const { pw, BASE, ROUTES } = require("./lib.cjs");

const ts = fs.readFileSync(path.join(__dirname, "../../src/content/photos.generated.ts"), "utf8");
const manifest = JSON.parse(ts.slice(ts.indexOf("= {") + 2, ts.lastIndexOf(";")));
const sourceOf = new Map();
for (const p of Object.values(manifest.slots)) sourceOf.set(p.src, p.source);
for (const p of manifest.gallery) sourceOf.set(p.src, p.source), sourceOf.set(p.thumb, p.source);

/** "/_next/image?url=%2Fimages%2Fhome%2FH3.webp&w=640&q=75" → "/images/home/H3.webp" */
function fileOf(src) {
  const u = new URL(src, BASE);
  return u.pathname === "/_next/image" ? decodeURIComponent(u.searchParams.get("url")) : u.pathname;
}

(async () => {
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  let bad = 0;
  for (const r of ROUTES) {
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    const srcs = await p.evaluate(() => [...document.querySelectorAll("img")].filter((i) => !i.closest("dialog")).map((i) => i.getAttribute("src")));
    const seen = new Map();
    const dupes = [];
    for (const s of srcs.filter(Boolean)) {
      const file = fileOf(s);
      const key = sourceOf.get(file);
      if (!key) continue; // not a photo (the logo, icons)
      if (seen.has(key)) dupes.push(`${key} (${seen.get(key)} and ${file})`);
      else seen.set(key, file);
    }
    console.log(r.padEnd(18), dupes.length ? "FAIL " + dupes.join("; ") : `ok (${seen.size} photos)`);
    bad += dupes.length;
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
