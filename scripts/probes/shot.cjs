// Usage: node scripts/probes/shot.cjs <route> <width> <height> <out.png> [full]  - one screenshot after load (and a settle wait).
const { pw, BASE, slowScrollToBottom } = require("./lib.cjs");
(async () => {
  const [route, w, h, out, full] = process.argv.slice(2);
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage();
  await p.goto(BASE + route, { waitUntil: "load" });
  await p.waitForTimeout(3000);
  if (full) {
    await slowScrollToBottom(p);
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(500);
  }
  await p.screenshot({ path: out, fullPage: !!full });
  await b.close();
})();
