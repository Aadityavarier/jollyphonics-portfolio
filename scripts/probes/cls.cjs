// Usage: node scripts/probes/cls.cjs [route] [selector]  - Cumulative layout shift while the page loads, then while a section plays (default: Home, #cta).
const { pw, BASE } = require("./lib.cjs");
(async () => {
  const [route = "/", sel = "#cta"] = process.argv.slice(2);
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 375, height: 667 } })).newPage();
  await p.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe({ type: "layout-shift", buffered: true });
  });
  await p.goto(BASE + route, { waitUntil: "load", timeout: 120000 });
  await p.waitForTimeout(2500);
  const load = await p.evaluate(() => window.__cls);
  await p.evaluate((s) => (window.__cls = 0, document.querySelector(s).scrollIntoView({ block: "center" })), sel);
  await p.waitForTimeout(4500);
  const play = await p.evaluate(() => window.__cls);
  console.log(`CLS on load ${load.toFixed(4)} | while ${sel} plays ${play.toFixed(4)}`);
  await b.close();
  process.exit(play < 0.01 ? 0 : 1);
})();
