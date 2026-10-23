// Special-classes chips must read fully (opacity 1) in Firefox (no/partial scroll-timeline support) after scrolling to them.
const { pw, BASE } = require("./lib.cjs");
(async () => {
  const b = await pw.firefox.launch();
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(BASE + "/programs", { waitUntil: "load" });
  await p.evaluate(() => document.querySelector("#special-classes").scrollIntoView({ block: "center" }));
  await p.waitForTimeout(1500);
  const ops = await p.evaluate(() => [...document.querySelectorAll(".conveyor > li")].map((l) => getComputedStyle(l).opacity));
  console.log("firefox chips:", ops.length, "min opacity", Math.min(...ops.map(Number)));
  await b.close();
  process.exit(Math.min(...ops.map(Number)) >= 0.99 ? 0 : 1);
})();
