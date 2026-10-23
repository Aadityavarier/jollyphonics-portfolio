// Shared helpers for the local probe scripts. Needs a running server (BASE, default http://localhost:3001).
const path = require("node:path");
function loadPlaywright() {
  const candidates = ["playwright-core", path.join(process.env.APPDATA || "", "npm/node_modules/@playwright/cli/node_modules/playwright-core")];
  for (const c of candidates) {
    try {
      return require(c);
    } catch {}
  }
  throw new Error("playwright-core not found; install @playwright/cli globally or add playwright-core");
}
const pw = loadPlaywright();
const BASE = process.env.BASE || "http://localhost:3001";
const ROUTES = ["/", "/about", "/programs", "/coaching", "/teacher-training", "/for-schools", "/contact", "/gallery"];

/** Scrolls to the bottom in steps, re-measuring the page height each step (pinned scenes grow it). */
async function slowScrollToBottom(page, step = 450, wait = 150) {
  for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += step) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(wait);
  }
  await page.waitForTimeout(1800);
}

/** Visible text nodes still effectively hidden (opacity < 0.5) that are on screen. Learning-path steps are hidden by design. */
function hiddenOnScreen() {
  return [...document.querySelectorAll("main *, footer *")]
    .filter((el) => {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false;
      if (el.closest(".path-word,.path-detail,[hidden]")) return false;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || r.width === 0) return false;
      let n = el,
        op = 1;
      while (n && n !== document.body) {
        op *= parseFloat(getComputedStyle(n).opacity);
        n = n.parentElement;
      }
      return op < 0.5;
    })
    .map((el) => `${el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
}

module.exports = { pw, BASE, ROUTES, slowScrollToBottom, hiddenOnScreen };
