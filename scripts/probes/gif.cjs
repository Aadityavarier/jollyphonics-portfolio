// Usage: node scripts/probes/gif.cjs <route> <width> <height> <out.gif> <steps.json> [frames] [intervalMs]
// steps.json: array of {at: frameIndex, click?: selector, text?: ..., scroll?: y, hover?: selector}. Captures frames with Playwright and joins them with sharp.
const fs = require("node:fs");
const { pw, BASE } = require("./lib.cjs");
const sharp = require("sharp");
(async () => {
  const [route, w, h, out, stepsFile, frames = "36", interval = "110"] = process.argv.slice(2);
  const steps = stepsFile && fs.existsSync(stepsFile) ? JSON.parse(fs.readFileSync(stepsFile, "utf8")) : [];
  const b = await pw.chromium.launch();
  const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage();
  await p.goto(BASE + route, { waitUntil: "load" });
  const bufs = [];
  for (let i = 0; i < +frames; i++) {
    for (const s of steps.filter((s) => s.at === i)) {
      if (s.scroll !== undefined) await p.evaluate((y) => scrollTo(0, y), s.scroll);
      if (s.scrollTo) await p.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: "center" }), s.scrollTo);
      if (s.click) await p.click(s.click, { timeout: 2000 }).catch(() => {});
      if (s.hover) await p.hover(s.hover, { timeout: 2000 }).catch(() => {});
    }
    bufs.push(await p.screenshot({ type: "png" }));
    await p.waitForTimeout(+interval);
  }
  await b.close();
  const raws = await Promise.all(bufs.map((buf) => sharp(buf).resize(Math.round(+w / (+w > 800 ? 2 : 1))).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  const { width, height } = raws[0].info;
  await sharp(Buffer.concat(raws.map((r) => r.data)), { raw: { width, height: height * raws.length, channels: 4, pageHeight: height } })
    .gif({ delay: raws.map(() => +interval + 60), loop: 0 })
    .toFile(out);
  console.log("wrote", out, raws.length, "frames", width + "x" + height);
})();
