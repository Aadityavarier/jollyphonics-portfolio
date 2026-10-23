// Lighthouse accessibility (mobile defaults) per route; prints the score and every failing audit.
// Usage: BASE=http://localhost:4000 node scripts/perf/a11y.cjs [/route ...]
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const BASE = process.env.BASE || "http://localhost:4000";
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/about", "/programs", "/coaching", "/teacher-training", "/for-schools", "/contact", "/gallery"];
const cats = process.env.CATS || "accessibility";
let worst = 1;
for (const r of routes) {
  const out = path.join(os.tmpdir(), `lh-${r.replace(/\W/g, "_") || "home"}.json`);
  try {
    execFileSync("npx", ["-y", "lighthouse@12", BASE + r, `--only-categories=${cats}`, "--output=json", `--output-path=${out}`, "--chrome-flags=--headless=new", "--quiet"], { stdio: "ignore", shell: true });
  } catch {}
  const j = JSON.parse(fs.readFileSync(out, "utf8"));
  for (const c of cats.split(",")) {
    const s = j.categories[c].score;
    worst = Math.min(worst, s);
    console.log(`${r.padEnd(18)} ${c} ${Math.round(s * 100)}`);
  }
  for (const a of Object.values(j.audits)) {
    if (a.score !== 0 || a.scoreDisplayMode === "informative") continue;
    const items = (a.details?.items || []).slice(0, 3).map((i) => (i.node ? `${i.node.selector} (${(i.node.explanation || "").split("\n")[1]?.trim() || ""})` : ""));
    console.log(`   - ${a.id}: ${items.join(" | ")}`);
  }
}
process.exitCode = worst >= 1 ? 0 : 1;
