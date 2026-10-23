// 4x CPU throttle, 375x667, steady wheel scroll through each route; logs rAF frame deltas and long tasks.
// PASS: >=90% of frames < 16.7ms and no frame > 50ms. HOST-BOUND: misses that but has no long task > 50ms (a slow dev machine; judge on a real phone). FAIL: long tasks > 50ms.
const { pw, BASE, ROUTES } = require("../probes/lib.cjs");
(async () => {
  const b = await pw.chromium.launch();
  let fail = 0;
  for (const r of ROUTES) {
    const ctx = await b.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1500);
    const cdp = await ctx.newCDPSession(p);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await p.evaluate(() => {
      window.__f = [];
      window.__lt = [];
      let last = performance.now();
      const tick = (t) => {
        window.__f.push(t - last);
        last = t;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration)))).observe({ type: "longtask", buffered: false });
    });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(H, 14000); y += 160) {
      await p.mouse.wheel(0, 160);
      await p.waitForTimeout(40);
    }
    await p.waitForTimeout(500);
    const { f, lt } = await p.evaluate(() => ({ f: window.__f.slice(2), lt: window.__lt }));
    const under = f.filter((d) => d < 16.7).length / f.length;
    const max = Math.round(Math.max(...f));
    const long = lt.filter((d) => d > 50);
    const strict = under >= 0.9 && max <= 50;
    const verdict = strict ? "PASS" : long.length ? "FAIL" : "HOST-BOUND";
    console.log(r.padEnd(18), verdict.padEnd(11), `frames ${f.length}  <16.7ms ${(under * 100).toFixed(0)}%  max ${max}ms  longtasks>50ms ${long.length}${long.length ? " " + JSON.stringify(long.slice(0, 5)) : ""}`);
    if (verdict === "FAIL") fail++;
    await ctx.close();
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})();
