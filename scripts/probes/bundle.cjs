// First-load JavaScript for a route (gzip), measured from the scripts its HTML references. Usage: node scripts/probes/bundle.cjs [route] (BASE default http://localhost:4000, a production server).
const zlib = require("node:zlib");
const BASE = process.env.BASE || "http://localhost:4000";
(async () => {
  const route = process.argv[2] || "/";
  const html = await (await fetch(BASE + route)).text();
  const srcs = [...new Set([...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]))];
  const preloads = [...new Set([...html.matchAll(/<link[^>]*rel="preload"[^>]*href="([^"]+\.js)"/g)].map((m) => m[1]))];
  const all = [...new Set([...srcs, ...preloads])];
  let total = 0;
  const rows = [];
  for (const s of all) {
    const buf = Buffer.from(await (await fetch(BASE + s)).arrayBuffer());
    const gz = zlib.gzipSync(buf).length;
    total += gz;
    rows.push([gz, s.split("/").pop().slice(0, 44), /gsap|ScrollTrigger/i.test(buf.toString("utf8", 0, Math.min(buf.length, 200000))) && buf.toString().includes("registerPlugin")]);
  }
  rows.sort((a, b) => b[0] - a[0]);
  console.log(`${route}: ${all.length} scripts, ${(total / 1024).toFixed(1)} KB gzip first load`);
  rows.slice(0, 8).forEach((r) => console.log("  ", (r[0] / 1024).toFixed(1).padStart(6), "KB", r[1], r[2] ? "  <- contains gsap" : ""));
})();
