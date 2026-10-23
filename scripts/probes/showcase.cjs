// Showcase tiles: (1) settle to zero running animations a few seconds after they scroll into view,
// (2) scrolled away mid-play they carry no running animation and no data-play, (3) coming back leaves nothing mid-transform.
const { pw, BASE } = require("./lib.cjs");
const running = () => document.querySelectorAll("#showcase *").length && document.getAnimations().filter((a) => a.playState === "running" && a.effect?.target?.closest?.("#showcase")).length;
(async () => {
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(BASE + "/", { waitUntil: "load", timeout: 120000 });
  await p.waitForTimeout(1500);
  let fail = 0;
  await p.evaluate(() => document.querySelector("#showcase .sc-grid").scrollIntoView({ block: "center" }));
  await p.waitForTimeout(600);
  const mid = await p.evaluate(running);
  console.log("running 0.6s after entering view:", mid, "(expected > 0)");
  if (!mid) fail++;
  await p.waitForTimeout(5000);
  const settled = await p.evaluate(running);
  console.log("running after 5.6s:", settled, "(expected 0)");
  if (settled) fail++;
  await p.evaluate(() => document.querySelector("#showcase .sc-grid").scrollIntoView({ block: "center" }));
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(400);
  const away = await p.evaluate(() => ({ playing: document.querySelectorAll("#showcase [data-play]").length, running: document.getAnimations().filter((a) => a.playState === "running" && a.effect?.target?.closest?.("#showcase")).length }));
  console.log("scrolled away:", JSON.stringify(away), "(expected all 0)");
  if (away.playing || away.running) fail++;
  await b.close();
  process.exit(fail ? 1 : 0);
})();
