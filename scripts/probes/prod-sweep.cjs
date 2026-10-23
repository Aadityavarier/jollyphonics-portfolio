// Production sweep (run against `npm run start`, BASE default http://localhost:4000): every route at 375px.
// With JavaScript on: no TODO / placeholder markers, no sideways scroll, alt text on every image, exactly one h1.
// With JavaScript off: WhatsApp and Call links are real links, FAQ details exist, and Home shows its static states.
const { pw, ROUTES } = require("./lib.cjs");
const BASE = process.env.BASE || "http://localhost:4000";

(async () => {
  const b = await pw.chromium.launch();
  let bad = 0;
  const report = (route, label, problems) => {
    console.log(route.padEnd(18), label.padEnd(8), problems.length ? "FAIL " + JSON.stringify(problems) : "ok");
    bad += problems.length;
  };

  for (const r of ROUTES) {
    const ctx = await b.newContext({ viewport: { width: 375, height: 667 } });
    const p = await ctx.newPage();
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1200);
    const problems = await p.evaluate(() => {
      const out = [];
      if (/\bTODO\b/.test(document.body.innerText)) out.push("TODO text");
      if (document.querySelector("[data-placeholder],[data-todo]")) out.push("placeholder/todo marker");
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) out.push("sideways scroll " + document.documentElement.scrollWidth);
      const noAlt = [...document.querySelectorAll("img")].filter((i) => i.getAttribute("alt") === null);
      if (noAlt.length) out.push(noAlt.length + " img without alt");
      const h1 = document.querySelectorAll("h1").length;
      if (h1 !== 1) out.push(h1 + " h1");
      return out;
    });
    report(r, "js on", problems);
    await ctx.close();

    const nojs = await b.newContext({ viewport: { width: 375, height: 667 }, javaScriptEnabled: false });
    const q = await nojs.newPage();
    await q.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    const np = await q.evaluate(() => {
      const out = [];
      const wa = [...document.querySelectorAll('a[href^="https://wa.me/919022582988"]')];
      const tel = [...document.querySelectorAll('a[href="tel:+919022582988"]')];
      if (!wa.length) out.push("no WhatsApp link");
      if (!tel.length) out.push("no Call link");
      const bar = document.querySelector(".sticky-bar");
      if (bar && !bar.querySelector('a[href^="https://wa.me"]')) out.push("sticky bar without WhatsApp");
      // Tab panels (Home audiences, For Schools tracks) must all show stacked without JavaScript.
      const hiddenPanels = [...document.querySelectorAll("[role=tabpanel]")].filter((el) => getComputedStyle(el).display === "none");
      if (hiddenPanels.length) out.push(hiddenPanels.length + " tab panels hidden without JS");
      return out;
    });
    report(r, "js off", np);
    await nojs.close();
  }

  // Home static states with JavaScript off.
  const ctx = await b.newContext({ viewport: { width: 375, height: 667 }, javaScriptEnabled: false });
  const h = await ctx.newPage();
  await h.goto(BASE + "/", { waitUntil: "load", timeout: 120000 });
  const home = await h.evaluate(() => {
    const out = [];
    const shown = (el) => el && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden";
    const panels = [...document.querySelectorAll('[role="tabpanel"]')];
    if (panels.length !== 4 || !panels.every((el) => shown(el))) out.push("audience panels not all visible");
    if (!document.body.innerText.includes("c – a – t → cat")) out.push("word board example missing");
    if (!document.body.innerText.includes("Hi, I'd like to know more about your classes.")) out.push("hello message missing");
    if (document.querySelectorAll("a[data-showcase-tile]").length !== 7) out.push("showcase tiles");
    const details = [...document.querySelectorAll(".path-card-detail")];
    if (details.length !== 6 || !details.every((el) => shown(el))) out.push("learning-path descriptions not visible");
    if (!document.querySelectorAll("#faq details").length) out.push("faq details missing");
    return out;
  });
  report("/", "static", home);
  await b.close();
  process.exit(bad ? 1 : 0);
})();
