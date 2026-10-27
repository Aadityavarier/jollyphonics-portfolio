// WS1 checks: back/forward leaves nothing hidden; page transitions without startViewTransition.
const { pw, BASE, hiddenOnScreen } = require("./lib.cjs");
(async () => {
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 140)));
  let fail = 0;

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.click('header a[href="/about"]');
  await p.waitForURL("**/about");
  await p.waitForTimeout(1500);
  const a1 = (await p.evaluate(hiddenOnScreen)).length;
  await p.goBack();
  await p.waitForTimeout(1500);
  const h1 = (await p.evaluate(hiddenOnScreen)).length;
  await p.goForward();
  await p.waitForTimeout(1500);
  const a2 = (await p.evaluate(hiddenOnScreen)).length;
  console.log("back/forward hidden: about", a1, "home", h1, "about", a2);
  fail += a1 + h1 + a2;

  const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx2.addInitScript(() => {
    delete Document.prototype.startViewTransition;
    delete document.startViewTransition;
  });
  const q = await ctx2.newPage();
  const qerrs = [];
  q.on("console", (m) => m.type() === "error" && qerrs.push(m.text().slice(0, 140)));
  q.on("pageerror", (e) => qerrs.push(String(e).slice(0, 140)));
  await q.goto(BASE + "/", { waitUntil: "networkidle" });
  const has = await q.evaluate(() => typeof document.startViewTransition);
  await q.click('header a[href="/programs"]');
  await q.waitForURL("**/programs");
  await q.waitForTimeout(1500);
  const qh = (await q.evaluate(hiddenOnScreen)).length;
  console.log("no-VT fallback: typeof startViewTransition =", has, "| url ok | hidden", qh, "| errors", qerrs);
  fail += qh + qerrs.length + (has === "undefined" ? 0 : 1);
  console.log("console errors (main):", errs.length);
  fail += errs.length;
  await b.close();
  process.exit(fail ? 1 : 0);
})();
