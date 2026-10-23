// Home fold: h1, trust stats and the hero WhatsApp button must be fully visible without scrolling.
// 1366x610 is a real 1366x768 laptop's visible Chrome viewport (browser chrome + Windows taskbar).
const { pw, BASE } = require("./lib.cjs");
const VIEWPORTS = [[375, 667], [1366, 610], [1366, 768], [1440, 900]];
(async () => {
  const b = await pw.chromium.launch();
  let fail = 0;
  for (const [w, h] of VIEWPORTS) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(BASE + "/", { waitUntil: "load" });
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      const bottom = (sel) => document.querySelector(sel)?.getBoundingClientRect().bottom ?? null;
      const bar = document.querySelector(".sticky-bar");
      const barVisible = bar && getComputedStyle(bar).display !== "none" && bar.getBoundingClientRect().top < innerHeight;
      return {
        h1: bottom("#hero h1"),
        stats: bottom("#hero dl"),
        cta: bottom("[data-hero-cta] > *"),
        barTop: barVisible ? bar.getBoundingClientRect().top : null,
        scrollW: document.documentElement.scrollWidth,
      };
    });
    const limit = r.barTop ?? h;
    const ok = r.h1 && r.stats && r.cta && Math.max(r.h1, r.stats, r.cta) <= limit && r.scrollW <= w;
    console.log(`${w}x${h}`, ok ? "OK " : "FAIL", JSON.stringify(r));
    if (!ok) fail++;
    await p.close();
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})();
