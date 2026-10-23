// Home pacing: each section's rendered background, in page order; no two neighbours may match. Also reports page height.
const { pw, BASE } = require("./lib.cjs");
const IDS = ["hero", "why-phonics", "learning-path", "founder", "who", "showcase", "branches", "why-us", "faq", "cta"];
(async () => {
  const b = await pw.chromium.launch();
  let fail = 0;
  for (const [w, h] of [[375, 667], [1440, 900]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(BASE + "/", { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1500);
    const r = await p.evaluate((ids) => {
      const bg = (el) => {
        const own = getComputedStyle(el).backgroundColor;
        if (own !== "rgba(0, 0, 0, 0)") return own;
        const g = el.querySelector(":scope > .grain");
        return g ? getComputedStyle(g).backgroundColor : own;
      };
      return { rows: ids.map((id) => [id, bg(document.getElementById(id))]), height: document.documentElement.scrollHeight };
    }, IDS);
    r.rows.forEach(([id, c], i) => {
      const same = i > 0 && r.rows[i - 1][1] === c;
      if (same) fail++;
      console.log(`${w}`.padEnd(5), id.padEnd(14), c, same ? "  <-- SAME AS PREVIOUS" : "");
    });
    console.log(w, "page height", r.height);
  }
  await b.close();
  process.exit(fail ? 1 : 0);
})();
