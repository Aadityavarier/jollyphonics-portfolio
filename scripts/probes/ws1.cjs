// WS1 checks: ARPAN has no transform motion; back/forward leaves nothing hidden; page transitions without startViewTransition.
const { pw, BASE, hiddenOnScreen } = require("./lib.cjs");
(async () => {
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 140)));
  let fail = 0;

  await p.goto(BASE + "/teacher-training", { waitUntil: "networkidle" });
  await p.evaluate(() => document.querySelector("#arpan").scrollIntoView());
  await p.waitForTimeout(300);
  const arpan = await p.evaluate(() => {
    const out = [];
    for (const el of [document.querySelector("#arpan"), ...document.querySelectorAll("#arpan *")]) {
      const s = getComputedStyle(el);
      const anims = el.getAnimations().map((a) => (a.effect?.getKeyframes?.() || []).flatMap((k) => Object.keys(k)).join("|"));
      if (anims.some((a) => /transform|translate|scale|rotate/.test(a)) || (/transform|translate|scale|rotate|all/.test(s.transitionProperty) && s.transitionDuration !== "0s"))
        out.push(el.tagName + "." + String(el.className).slice(0, 30));
    }
    return out;
  });
  console.log("ARPAN transform motion:", arpan.length ? arpan : "none");
  fail += arpan.length;

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
