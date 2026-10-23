// Clean-profile hydration probe: every route, 3 cold loads each (fresh context), 0 console errors / hydration warnings allowed.
const { pw, BASE, ROUTES } = require("./lib.cjs");
(async () => {
  const b = await pw.chromium.launch();
  let bad = 0;
  for (const r of ROUTES) {
    const problems = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
      const p = await ctx.newPage();
      p.on("console", (m) => (m.type() === "error" || /hydrat/i.test(m.text())) && problems.push(m.text().slice(0, 140)));
      p.on("pageerror", (e) => problems.push(String(e).slice(0, 140)));
      await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
      await p.waitForTimeout(1800);
      await ctx.close();
    }
    console.log(r.padEnd(18), problems.length ? "FAIL " + JSON.stringify(problems.slice(0, 3)) : "ok (0 errors x 3 loads)");
    bad += problems.length;
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
