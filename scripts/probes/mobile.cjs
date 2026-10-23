// Real-phone checks on the production build: Pixel 7 and iPhone 13 emulation (isMobile, hasTouch), taps only.
// Usage: npm run build && npx next start -p 4000, then BASE=http://localhost:4000 npm run probe:mobile
const { pw, BASE, ROUTES } = require("./lib.cjs");

const DEVICES = ["Pixel 7", "iPhone 13"];
const WA = /^https:\/\/wa\.me\/919022582988(\?text=.+)?$/;
const TEL = "tel:+919022582988";

/** Each page's signature moment: what to scroll to, and an optional tap that starts it. */
const MOMENTS = {
  "/": { sel: "[data-testid=board-slots]", tap: "button[aria-label='Add sound s']" },
  "/about": { sel: ".journey" },
  "/programs": { sel: ".sound-wall" },
  "/coaching": { sel: ".stair" },
  "/teacher-training": { sel: ".stack" },
  "/for-schools": { sel: ".tabs-panel", tap: "[role=tab]:nth-child(2)" },
  "/contact": { sel: ".enq", tap: ".enq-step .enq-chip" },
  "/gallery": null,
};

let failures = 0;
const line = (ok, dev, route, name, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} [${dev}] ${route} ${name}${detail ? " — " + detail : ""}`);
};

/** Running animations under `sel`, plus a fingerprint of every descendant's computed transform and opacity. */
function snapshot(sel) {
  const root = document.querySelector(sel);
  if (!root) return null;
  const running = document
    .getAnimations()
    .filter((a) => a.playState === "running" && a.effect && a.effect.target && root.contains(a.effect.target)).length;
  const els = [root, ...root.querySelectorAll("*")].slice(0, 400);
  const print = els.map((e) => {
    const s = getComputedStyle(e);
    return s.transform + "|" + s.opacity + "|" + s.clipPath;
  });
  return { running, print: print.join(";") };
}

async function signature(page, dev, route) {
  const m = MOMENTS[route];
  if (!m) return line(true, dev, route, "signature moment", "none on this page (CTA band only)");
  const loc = page.locator(m.sel).first();
  if (!(await loc.count())) return line(false, dev, route, "signature moment", `${m.sel} not found`);
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  if (m.tap) await page.locator(m.tap).first().tap();
  const a = await page.evaluate(snapshot, m.sel);
  await page.evaluate(() => scrollBy(0, 140));
  await page.waitForTimeout(160);
  const b = await page.evaluate(snapshot, m.sel);
  await page.evaluate(() => scrollBy(0, 140));
  await page.waitForTimeout(160);
  const c = await page.evaluate(snapshot, m.sel);
  const plays = a.running + b.running + c.running > 0 || a.print !== b.print || b.print !== c.print;
  line(plays, dev, route, "signature moment plays", `running=${a.running}/${b.running}/${c.running}`);
}

async function menu(page, dev, route) {
  await page.evaluate(() => scrollTo(0, 600));
  await page.waitForTimeout(150);
  const before = await page.evaluate(() => scrollY);
  const toggle = page.locator("header button[aria-controls]");
  await toggle.tap();
  await page.waitForTimeout(250);
  line((await toggle.getAttribute("aria-expanded")) === "true", dev, route, "menu opens by tap");
  const locked = await page.evaluate(
    () => getComputedStyle(document.documentElement).overflow === "hidden" || getComputedStyle(document.body).overflow === "hidden",
  );
  line(locked, dev, route, "page scroll locked while menu open");
  for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
  line(await page.evaluate(() => !!document.activeElement?.closest("header")), dev, route, "focus trapped in menu");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const closed = (await toggle.getAttribute("aria-expanded")) === "false";
  const focused = await page.evaluate(() => document.activeElement?.matches("header button[aria-controls]"));
  line(closed && focused, dev, route, "Escape closes and refocuses toggle");
  line(Math.abs((await page.evaluate(() => scrollY)) - before) < 4, dev, route, "scroll position kept after close");
}

async function interactions(page, dev, route) {
  const tap = (sel) => page.locator(sel).first().tap();
  if (route === "/") {
    await page.locator("[data-testid=board-slots]").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2600); // let the demo finish
    for (const l of ["c", "a", "t"]) await tap(`button[aria-label='Add sound ${l}']`);
    await page.waitForTimeout(400);
    const live = await page.locator("[data-testid=board-slots] + p").textContent();
    line(/cat/.test(live || ""), dev, route, "word board builds 'cat' by tap", live);
    await page.getByRole("button", { name: "Clear", exact: true }).tap();
    await page.waitForTimeout(200);
    const filled = await page.locator("[data-testid=board-slots] > span span").count();
    line(filled === 0, dev, route, "word board Clear empties the slots");

    const nvs = page.locator(".nvs");
    await nvs.scrollIntoViewIfNeeded();
    const m0 = await nvs.getAttribute("data-mode");
    await page.locator(".nvs-toggle button[aria-pressed=false]").first().tap();
    await page.waitForTimeout(200);
    line((await nvs.getAttribute("data-mode")) !== m0, dev, route, "names-vs-sounds toggle by tap");

    const tabs = page.locator("#who [role=tab], [aria-label] [role=tablist] [role=tab]");
    const n = await page.locator(".aud-list [role=tab]").count();
    let ok = n > 1;
    for (let i = 0; i < n; i++) {
      const t = page.locator(".aud-list [role=tab]").nth(i);
      await t.scrollIntoViewIfNeeded();
      await t.tap();
      await page.waitForTimeout(150);
      const id = await t.getAttribute("aria-controls");
      ok = ok && (await t.getAttribute("aria-selected")) === "true" && (await page.locator(`[id="${id}"]`).isVisible());
    }
    void tabs;
    line(ok, dev, route, "audience selector: every tab shows its panel", `${n} tabs`);

    const tiles = page.locator(".sc-tile");
    const hrefs = await tiles.evaluateAll((els) => els.map((e) => (e.tagName === "A" ? e.getAttribute("href") : null)));
    line(hrefs.length === 7 && hrefs.every(Boolean), dev, route, "bento tiles are links", hrefs.join(" "));
    await tiles.first().scrollIntoViewIfNeeded();
    await tiles.first().tap();
    await page.waitForURL(/\/programs/, { timeout: 15000 }).catch(() => {});
    line(page.url().includes("/programs"), dev, route, "bento tile tap navigates");
    await page.goto(BASE + "/", { waitUntil: "load" });

    const sum = page.locator("details.faq summary").first();
    await sum.scrollIntoViewIfNeeded();
    await sum.tap();
    await page.waitForTimeout(250);
    line(await page.locator("details.faq").first().evaluate((d) => d.open), dev, route, "FAQ opens by tap");
  }
  if (route === "/programs") {
    const link = page.locator("nav[aria-label=Programs] a").nth(2);
    const href = await link.getAttribute("href");
    await link.tap();
    await page.waitForTimeout(1200);
    const top = await page.evaluate((h) => document.querySelector(h.slice(h.indexOf("#")))?.getBoundingClientRect().top, href);
    line(top !== undefined && top < 400, dev, route, "anchor nav tap scrolls to its section", `${href} top=${Math.round(top)}`);
  }
  if (route === "/coaching" || route === "/about") {
    const b = page.locator(".flip-btn").first();
    await b.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const p0 = await b.getAttribute("aria-pressed");
    await b.tap();
    await page.waitForTimeout(200);
    line((await b.getAttribute("aria-pressed")) !== p0, dev, route, "flip card turns by tap");
  }
  if (route === "/teacher-training") {
    const cards = page.locator(".stack-card");
    const n = await cards.count();
    let visible = n > 0;
    for (let i = 0; i < n; i++) {
      await cards.nth(i).scrollIntoViewIfNeeded();
      visible = visible && (await cards.nth(i).isVisible());
    }
    line(visible, dev, route, "course cards present and visible", `${n} cards`);
  }
  if (route === "/for-schools") {
    const tabs = page.locator(".tabs-list [role=tab]");
    const n = await tabs.count();
    let ok = n > 1;
    for (let i = 0; i < n; i++) {
      await tabs.nth(i).tap();
      await page.waitForTimeout(250);
      const id = await tabs.nth(i).getAttribute("aria-controls");
      ok = ok && (await page.locator(`[id="${id}"]`).isVisible());
    }
    line(ok, dev, route, "school tabs: every tab shows its panel", `${n} tabs`);
  }
  if (route === "/contact") {
    const form = page.locator(".enq");
    await form.scrollIntoViewIfNeeded();
    for (let s = 0; s < 4; s++) {
      const chip = page.locator(".enq-step .enq-chip").first();
      if (await chip.count()) await chip.tap();
      await page.locator(".enq button[type=submit]").tap();
      await page.waitForTimeout(450);
    }
    const bubble = await page.locator(".enq-bubble").isVisible().catch(() => false);
    const wa = await page.locator(".enq a[href^='https://wa.me/']").first().getAttribute("href").catch(() => null);
    line(bubble && WA.test(wa || ""), dev, route, "stepper ends in a WhatsApp bubble with a valid link");

    const side = page.locator("button.enq-chip[aria-pressed]");
    if (await side.count()) {
      const vis0 = await page.locator(".branch-card:visible").count();
      await side.nth(1).scrollIntoViewIfNeeded();
      await side.nth(1).tap();
      await page.waitForTimeout(500);
      const pressed = await side.nth(1).getAttribute("aria-pressed");
      line(pressed === "true", dev, route, "East/West toggle by tap", `visible cards ${vis0} → ${await page.locator(".branch-card:visible").count()}`);
    } else line(false, dev, route, "East/West toggle by tap", "toggle not found");

    const map = page.getByRole("button", { name: "Show map" }).first();
    await map.scrollIntoViewIfNeeded();
    await map.tap();
    await page.waitForTimeout(400);
    line((await page.locator(".branch-map iframe").count()) > 0, dev, route, "Show map loads a map by tap");
  }
}

(async () => {
  const browser = await pw.chromium.launch();
  const only = process.env.ROUTE ? [process.env.ROUTE] : ROUTES;
  for (const dev of DEVICES) {
    for (const route of only) {
      const ctx = await browser.newContext({ ...pw.devices[dev] });
      const page = await ctx.newPage();
      const errors = [];
      page.on("console", (m) => (m.type() === "error" || /hydrat/i.test(m.text())) && errors.push(m.text().slice(0, 140)));
      page.on("pageerror", (e) => errors.push(e.message.slice(0, 140)));
      try {
        await page.goto(BASE + route, { waitUntil: "load", timeout: 120000 });
        await page.waitForTimeout(1200);

        const base = await page.evaluate(() => {
          const h = document.querySelector(".site-header");
          const alpha = (c) => {
            const m = c.match(/rgba?\(([^)]+)\)/);
            if (!m) return 0;
            const p = m[1].split(",").map(Number);
            return p.length === 4 ? p[3] : 1;
          };
          const hs = getComputedStyle(h);
          const bs = getComputedStyle(h, "::before");
          const opaque = alpha(hs.backgroundColor) === 1 || (alpha(bs.backgroundColor) === 1 && Number(bs.opacity) === 1);
          return {
            opaque,
            hscroll: document.documentElement.scrollWidth > innerWidth,
            wa: [...document.querySelectorAll("a[href^='https://wa.me/']")].map((a) => a.getAttribute("href")),
            tel: [...document.querySelectorAll("a[href^='tel:']")].map((a) => a.getAttribute("href")),
          };
        });
        line(base.opaque, dev, route, "header background opaque");
        line(!base.hscroll, dev, route, "no horizontal scroll");
        line(base.wa.length > 0 && base.wa.every((h) => WA.test(h)), dev, route, "WhatsApp links valid", `${base.wa.length} links`);
        line(base.tel.length > 0 && base.tel.every((h) => h === TEL), dev, route, "call links valid", `${base.tel.length} links`);

        await signature(page, dev, route);
        await page.goto(BASE + route, { waitUntil: "load" });
        await page.waitForTimeout(800);
        await interactions(page, dev, route);
        await page.goto(BASE + route, { waitUntil: "load" });
        await page.waitForTimeout(800);
        await menu(page, dev, route);

        // A menu link navigates and the menu is closed on the new page.
        const t = page.locator("header button[aria-controls]");
        await t.tap();
        const panel = await t.getAttribute("aria-controls");
        const target = route === "/about" ? "/contact" : "/about";
        await page.locator(`[id="${panel}"] a[href='${target}']`).tap();
        await page.waitForURL((u) => u.pathname === target, { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(400);
        const closed = (await page.locator("header button[aria-controls]").getAttribute("aria-expanded")) === "false";
        line(new URL(page.url()).pathname === target && closed, dev, route, "menu link navigates and menu closes", page.url());
      } catch (e) {
        line(false, dev, route, "probe run", e.message.split("\n")[0]);
      }
      line(errors.length === 0, dev, route, "no console or hydration errors", errors.slice(0, 3).join(" | "));
      await ctx.close();
    }
  }
  await browser.close();
  console.log(failures ? `\n${failures} FAILED` : "\nALL PASS");
  process.exitCode = failures ? 1 : 0;
})();
