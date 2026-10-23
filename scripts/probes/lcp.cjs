// Reports the Largest Contentful Paint element and time for a route (default Home) at 375x667 and 1366x610. Pass if the LCP element is inside the h1.
const { pw, BASE } = require("./lib.cjs");
(async () => {
  const route = process.argv[2] || "/";
  const b = await pw.chromium.launch();
  let fail = 0;
  for (const [w, h] of [[375, 667], [1366, 610]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.addInitScript(() => {
      window.__lcp = null;
      new PerformanceObserver((l) => {
        const e = l.getEntries().at(-1);
        window.__lcp = { t: Math.round(e.startTime), tag: e.element?.tagName, inH1: !!e.element?.closest("h1"), text: (e.element?.textContent || "").slice(0, 30) };
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await p.goto(BASE + route, { waitUntil: "load" });
    await p.waitForTimeout(3500);
    await p.mouse.click(5, 5); // LCP is finalised by input
    const r = await p.evaluate(() => window.__lcp);
    console.log(`${w}x${h}`, JSON.stringify(r));
    if (!r?.inH1) fail++;
    await p.close();
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})();
