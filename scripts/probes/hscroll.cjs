// No horizontal scroll at 375px, even after scrolling through every scene (scroll-triggered offsets must never widen the page).
const { pw, BASE, ROUTES } = require("./lib.cjs");
(async () => {
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 375, height: 667 } })).newPage();
  let bad = 0;
  for (const r of ROUTES) {
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1200);
    let max = 0;
    for (let y = 0; y < (await p.evaluate(() => document.documentElement.scrollHeight)); y += 300) {
      await p.evaluate((y) => scrollTo(0, y), y);
      await p.waitForTimeout(120);
      max = Math.max(max, await p.evaluate(() => document.documentElement.scrollWidth));
    }
    console.log(r.padEnd(18), max <= 375 ? "ok" : "FAIL", "max scrollWidth", max);
    if (max > 375) bad++;
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
