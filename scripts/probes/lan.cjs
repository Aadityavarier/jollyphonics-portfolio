// Phone testing over Wi-Fi: loads the dev server through this machine's LAN address (as a phone would) and
// checks the page hydrates. Usage: node scripts/probes/lan.cjs [port=3001]
const os = require("node:os");
const { pw } = require("./lib.cjs");

const port = process.argv[2] || "3001";
const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((n) => n && n.family === "IPv4" && !n.internal && /^(192\.168|10)\./.test(n.address))?.address;

(async () => {
  if (!ip) {
    console.log("SKIP no private IPv4 address");
    return;
  }
  const browser = await pw.chromium.launch();
  const page = await (await browser.newContext({ ...pw.devices["Pixel 7"] })).newPage();
  await page.goto(`http://${ip}:${port}/`, { waitUntil: "load", timeout: 180000 });
  await page.waitForTimeout(6000);
  const r = await page.evaluate(() => ({
    hydrated: !!Object.keys(document.querySelector("header button") || {}).find((k) => k.startsWith("__react")),
    motion: document.documentElement.hasAttribute("data-motion"),
  }));
  await browser.close();
  const ok = r.hydrated && r.motion;
  console.log(`${ok ? "PASS" : "FAIL"} lan http://${ip}:${port}/ hydrated=${r.hydrated} data-motion=${r.motion}`);
  process.exitCode = ok ? 0 : 1;
})();
