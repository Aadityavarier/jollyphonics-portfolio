// Lighthouse performance on one route (mobile defaults), N runs: score, LCP, SI, and the two audits the
// fix round targets (non-composited animations, forced reflow). Usage: BASE=… node scripts/perf/home-audits.cjs [route] [runs]
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const BASE = process.env.BASE || "http://localhost:4000";
const route = process.argv[2] || "/";
const runs = Number(process.argv[3] || 3);
for (let i = 0; i < runs; i++) {
  const out = path.join(os.tmpdir(), `lh-perf-${i}.json`);
  try {
    execFileSync("npx", ["-y", "lighthouse@12", BASE + route, "--only-categories=performance", "--output=json", `--output-path=${out}`, "--chrome-flags=--headless=new", "--quiet"], { stdio: "ignore", shell: true });
  } catch {}
  const j = JSON.parse(fs.readFileSync(out, "utf8"));
  const A = j.audits;
  const nc = A["non-composited-animations"];
  const ncItems = (nc.details?.items || []).map((it) => `${it.node?.selector}: ${(it.subItems?.items || []).map((s) => s.failureReason).join("/")}`);
  const fr = A["forced-reflow-insight"];
  const frTop = JSON.stringify(fr?.details?.items?.[0]?.items || []).slice(0, 300);
  console.log(`run ${i + 1}: perf ${Math.round(j.categories.performance.score * 100)} LCP ${A["largest-contentful-paint"].displayValue} SI ${A["speed-index"].displayValue} TBT ${A["total-blocking-time"].displayValue}`);
  console.log(`   non-composited: ${nc.displayValue || "none"} ${ncItems.join(" | ")}`);
  console.log(`   forced reflow top: ${frTop}`);
}
