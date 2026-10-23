// Usage: node scripts/probes/hidden.cjs [routes...]  - after a slow scroll to the bottom and a jump to the top, lists hidden on-screen nodes.
const { pw, BASE, ROUTES, slowScrollToBottom, hiddenOnScreen } = require("./lib.cjs");
(async () => {
  const routes = process.argv.slice(2).length ? process.argv.slice(2) : ROUTES;
  const b = await pw.chromium.launch();
  const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  let bad = 0;
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 120000 });
    await slowScrollToBottom(page);
    const h = await page.evaluate(hiddenOnScreen);
    console.log(r, "hidden at bottom:", h.length, h.slice(0, 5));
    bad += h.length;
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
