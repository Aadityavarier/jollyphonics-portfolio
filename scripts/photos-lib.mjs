// Pure helpers for scripts/photos.mjs (tested in tests/unit/photos.test.ts).

/** The slot a file belongs to: its name starts with a known slot ID (any case), then a non-alphanumeric or the extension. */
export function slotFromName(name, slotIds) {
  const base = name.replace(/\.[^.]+$/, "");
  const m = /^([A-Za-z]+\d+)(?![A-Za-z0-9])/.exec(base);
  if (!m) return null;
  const id = m[1].toUpperCase();
  return slotIds.includes(id) ? id : null;
}

/** gallery/<category>/<file> → the category slug, when it is a known one. */
export function galleryFromPath(rel, slugs) {
  const parts = rel.replace(/\\/g, "/").split("/");
  if (parts.length < 3 || parts[0].toLowerCase() !== "gallery") return null;
  const slug = parts[1].toLowerCase();
  return slugs.includes(slug) ? slug : null;
}

const HEADER = [
  "# Photos on the site",
  "",
  "Written by `npm run photos`. Edit the **Alt text** column to describe what is actually in each photo; your",
  "edits are kept the next time the script runs. Everything else in this file is regenerated.",
  "",
  "| Slot | File | Alt text | What the slot is for |",
  "|---|---|---|---|",
];

const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

/** rows: { key, file, alt, description }[] → images.md text. */
export function renderImagesMd(rows) {
  return [...HEADER, ...rows.map((r) => `| ${cell(r.key)} | ${cell(r.file)} | ${cell(r.alt)} | ${cell(r.description)} |`), ""].join("\n");
}

/** images.md text → Map(key → alt), so hand-edited alt text survives a re-run. */
export function parseImagesMd(text) {
  const map = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("| ") || line.startsWith("| Slot ")) continue;
    const cells = line
      .slice(2, -2)
      .split(/ (?<!\\)\| /)
      .map((c) => c.replace(/\\\|/g, "|").trim());
    if (cells.length >= 3 && cells[0] && cells[2]) map.set(cells[0], cells[2]);
  }
  return map;
}
