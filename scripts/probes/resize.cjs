// Resize across 1024px mid-scene on the pinned pages: pin spacers appear at 1440, are gone at 900, come back at 1440; no console errors.
const { pw, BASE } = require("./lib.cjs");
(async () => {
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  let bad = 0;
  const spacers = () => p.evaluate(() => document.querySelectorAll(".pin-spacer").length);
  // [route, scene selector, whether the scene pins (Coaching's staircase scrubs without pinning)]
  for (const [r, scene, pins] of [["/", "#learning-path", true], ["/about", ".journey", true], ["/coaching", ".stair", false], ["/programs", "#learning-path", true]]) {
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1500);
    await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: "center" }), scene);
    await p.waitForTimeout(2500);
    const a = await spacers();
    await p.setViewportSize({ width: 900, height: 900 });
    await p.waitForTimeout(1200);
    const mid = await spacers();
    const noHScroll = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.waitForTimeout(1500);
    const c = await spacers();
    const ok = (pins ? a > 0 && c > 0 : true) && mid === 0 && noHScroll;
    console.log(r.padEnd(8), ok ? "ok" : "FAIL", `spacers 1440:${a} 900:${mid} 1440:${c} noHScroll@900:${noHScroll}`);
    if (!ok) bad++;
  }
  console.log("console errors:", errs.length, errs.slice(0, 3));
  await b.close();
  process.exit(bad || errs.length ? 1 : 0);
})();
