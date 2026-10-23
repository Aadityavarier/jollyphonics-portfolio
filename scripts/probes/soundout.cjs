// Sound-out headings on phones: every letter stays inside the viewport in every frame of the effect
// (the /programs h1 on load, then the first section heading as it scrolls in), at 375 and 412 wide.
const { pw, BASE } = require("./lib.cjs");

async function sample(page, sel, ms = 1500) {
  let worst = null;
  for (let t = 0; t < ms; t += 60) {
    const bad = await page.evaluate((sel) => {
      const vw = document.documentElement.clientWidth;
      return [...document.querySelectorAll(`${sel} .fx-p`)]
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.left < -0.5 || r.right > vw + 0.5)
        .map((r) => `${Math.round(r.left)}..${Math.round(r.right)}`);
    }, sel);
    if (bad.length && !worst) worst = `t=${t}ms ${bad.join(",")}`;
    await page.waitForTimeout(60);
  }
  return worst;
}

(async () => {
  const browser = await pw.chromium.launch();
  let failed = 0;
  for (const width of [375, 412]) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(BASE + "/programs", { waitUntil: "commit", timeout: 120000 });
    await page.waitForSelector("h1 .fx-p");
    const h1 = await sample(page, "h1");
    await page.waitForLoadState("load");
    await page.locator("#phonics-title").evaluate((e) => e.scrollIntoView({ block: "end" }));
    const h2 = await sample(page, "#phonics-title");
    for (const [name, bad] of [["h1", h1], ["#phonics-title", h2]]) {
      if (bad) failed++;
      console.log(`${bad ? "FAIL" : "PASS"} soundout ${width}px ${name}${bad ? " — off screen at " + bad : ""}`);
    }
    await ctx.close();
  }
  await browser.close();
  process.exitCode = failed ? 1 : 0;
})();
