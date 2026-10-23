// Jump-to-bottom hidden-node check: the End key and anchor loads must leave nothing hidden on screen.
const { pw, BASE, ROUTES, hiddenOnScreen } = require("./lib.cjs");
const ANCHORS = ["/programs#special-classes", "/programs#handwriting", "/contact#faq", "/for-schools#cta", "/about#awards-title"];
(async () => {
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  let bad = 0;
  for (const r of ROUTES) {
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1200);
    await p.keyboard.press("End");
    await p.waitForTimeout(2200);
    const h = await p.evaluate(hiddenOnScreen);
    console.log("End  ", r.padEnd(18), h.length ? "FAIL " + JSON.stringify(h.slice(0, 3)) : "ok");
    bad += h.length;
  }
  for (const a of ANCHORS) {
    await p.goto(BASE + a, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(2200);
    const h = await p.evaluate(hiddenOnScreen);
    console.log("Jump ", a.padEnd(28), h.length ? "FAIL " + JSON.stringify(h.slice(0, 3)) : "ok");
    bad += h.length;
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
