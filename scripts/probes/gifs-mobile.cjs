// Records each page's signature moment with Pixel 7 emulation into .screens/gifs/mobile-<page>.gif.
// Usage: BASE=http://localhost:4000 node scripts/probes/gifs-mobile.cjs [page ...]
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const scrub = (sel, frames, dy, from = 2) => [{ at: 1, scrollTo: sel }, ...Array.from({ length: frames }, (_, i) => ({ at: from + i, scrollBy: dy }))];
const MOMENTS = {
  home: { route: "/", frames: 44, steps: [{ at: 22, click: "button[aria-label='Add sound p']" }, { at: 26, click: "button[aria-label='Add sound i']" }, { at: 30, click: "button[aria-label='Add sound n']" }] },
  about: { route: "/about", frames: 40, steps: scrub(".journey", 36, 70) },
  programs: { route: "/programs", frames: 36, steps: [{ at: 14, scrollTo: ".sound-wall" }] },
  coaching: { route: "/coaching", frames: 40, steps: scrub(".stair", 36, 45) },
  "teacher-training": { route: "/teacher-training", frames: 36, steps: scrub(".stack", 32, 60) },
  "for-schools": { route: "/for-schools", frames: 36, steps: [{ at: 2, scrollTo: ".tabs" }, { at: 8, click: ".tabs-list [role=tab] >> nth=1" }, { at: 20, click: ".tabs-list [role=tab] >> nth=2" }] },
  contact: {
    route: "/contact",
    frames: 48,
    steps: [
      { at: 2, scrollTo: ".enq" },
      { at: 6, click: ".enq-step .enq-chip" },
      { at: 9, click: ".enq button[type=submit]" },
      { at: 14, click: ".enq-step .enq-chip" },
      { at: 17, click: ".enq button[type=submit]" },
      { at: 21, click: ".enq button[type=submit]" },
      { at: 25, click: ".enq button[type=submit]" },
    ],
  },
};

const outDir = path.join(__dirname, "../../.screens/gifs");
fs.mkdirSync(outDir, { recursive: true });
const pages = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MOMENTS);
for (const name of pages) {
  const m = MOMENTS[name];
  const steps = path.join(os.tmpdir(), `gif-steps-${name}.json`);
  fs.writeFileSync(steps, JSON.stringify(m.steps));
  const out = path.join(outDir, `mobile-${name}.gif`);
  const r = spawnSync("node", [path.join(__dirname, "gif.cjs"), m.route, "0", "0", out, steps, String(m.frames), "110"], {
    env: { ...process.env, DEVICE: "Pixel 7" },
    encoding: "utf8",
  });
  console.log(name, r.status === 0 ? r.stdout.trim() : "FAILED " + (r.stderr || "").split("\n")[0]);
}
