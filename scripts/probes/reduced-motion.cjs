// prefers-reduced-motion: reduce, every route: after a scroll to the bottom nothing may stay faded or masked.
const { pw, BASE, ROUTES, slowScrollToBottom } = require("./lib.cjs");
(async () => {
  const b = await pw.chromium.launch();
  let bad = 0;
  for (const r of ROUTES) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1200);
    await slowScrollToBottom(p, 600, 80);
    const res = await p.evaluate(() => {
      const faded = [];
      const masked = [];
      for (const el of document.querySelectorAll("main *, footer *")) {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        if (el.closest("[hidden]") || el.getBoundingClientRect().width === 0) continue;
        let n = el;
        let op = 1;
        while (n && n !== document.body) {
          op *= parseFloat(getComputedStyle(n).opacity);
          n = n.parentElement;
        }
        if (op < 0.5) faded.push(el.tagName + ":" + el.textContent.trim().slice(0, 24));
      }
      document.querySelectorAll(".reveal-line").forEach((l) => getComputedStyle(l).transform !== "none" && masked.push(l.textContent.trim().slice(0, 24)));
      return { faded, masked };
    });
    const ok = !res.faded.length && !res.masked.length;
    console.log(r.padEnd(18), ok ? "ok" : "FAIL", JSON.stringify({ faded: res.faded.slice(0, 4), masked: res.masked.slice(0, 4) }));
    if (!ok) bad++;
    await ctx.close();
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
