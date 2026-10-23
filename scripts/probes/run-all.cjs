// Runs every probe in turn against BASE (default http://localhost:3001) and prints a verdict per probe.
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const probes = ["hydration", "reduced-motion", "resize", "jump", "showcase", "fold", "pacing"]
  .map((n) => path.join(__dirname, n + ".cjs"))
  .concat(path.join(__dirname, "../perf/throttle.cjs"));
let failed = 0;
for (const f of probes) {
  const r = spawnSync("node", [f], { stdio: "inherit", env: process.env });
  console.log(`== ${path.basename(f)}: ${r.status === 0 ? "PASS" : "FAIL"}\n`);
  if (r.status) failed++;
}
process.exit(failed ? 1 : 0);
