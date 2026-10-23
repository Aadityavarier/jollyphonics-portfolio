// prefers-reduced-motion: reduce, every route.
// 1. After a scroll to the bottom nothing may stay faded or masked.
// 2. Nothing moves: no animation or transition longer than 20ms touches transform / translate / scale / rotate.
// 3. Gentler, not zero: across the routes at least one opacity or colour change still fades (>= 100ms).
const { pw, BASE, ROUTES, slowScrollToBottom } = require("./lib.cjs");

const MOVE = /^(transform|translate|scale|rotate)$/;

function watch() {
  window.__motion = { moved: [], faded: 0 };
  const ms = (v) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
  const record = (e) => {
    const t = e.target;
    const pseudo = e.pseudoElement || null;
    let props = [];
    let d = 0;
    if (e.type === "transitionrun") {
      const s = getComputedStyle(t, pseudo);
      const names = s.transitionProperty.split(",").map((x) => x.trim());
      const durs = s.transitionDuration.split(",").map((x) => ms(x.trim()));
      const i = Math.max(names.indexOf(e.propertyName), names.indexOf("all"));
      d = durs[i >= 0 ? i % durs.length : 0] || 0;
      props = [e.propertyName];
    } else {
      const a = t.getAnimations({ subtree: true }).find((x) => x.animationName === e.animationName);
      if (!a) return;
      d = a.effect.getComputedTiming().duration || 0;
      try {
        props = [...new Set(a.effect.getKeyframes().flatMap((k) => Object.keys(k)))];
      } catch {}
    }
    if (d < 20) return;
    if (props.some((x) => /^(transform|translate|scale|rotate)$/.test(x))) {
      const id = (t.className?.baseVal ?? t.className ?? "").toString().split(" ").slice(0, 2).join(".");
      window.__motion.moved.push(`${t.tagName.toLowerCase()}.${id}${pseudo || ""} ${e.animationName || props.join("/")} ${Math.round(d)}ms`);
    }
    if (d >= 100 && props.some((x) => /^(opacity|color|background-color|filter|box-shadow)$/.test(x))) window.__motion.faded++;
  };
  for (const ev of ["animationstart", "transitionrun"]) document.addEventListener(ev, record, true);
}

(async () => {
  const b = await pw.chromium.launch();
  let bad = 0;
  let faded = 0;
  for (const r of ROUTES) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await ctx.addInitScript(watch);
    const p = await ctx.newPage();
    await p.goto(BASE + r, { waitUntil: "load", timeout: 120000 });
    await p.waitForTimeout(1200);
    await slowScrollToBottom(p, 600, 80);
    // Interact a little: open the first FAQ and the first tab-like control, so their transitions run.
    await p.evaluate(() => {
      document.querySelector("details summary")?.click();
      document.querySelector("[role=tab][aria-selected=false]")?.click();
      document.querySelector(".nvs-toggle button[aria-pressed=false]")?.click();
    });
    await p.waitForTimeout(600);
    const res = await p.evaluate(() => {
      const faded = [];
      const masked = [];
      for (const el of document.querySelectorAll("main *, footer *")) {
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        if (el.closest("[hidden]") || el.getBoundingClientRect().width === 0) continue;
        if (el.closest("[aria-hidden=true]")?.closest(".nvs")) continue; // the names/sounds layer not chosen
        let n = el;
        let op = 1;
        while (n && n !== document.body) {
          op *= parseFloat(getComputedStyle(n).opacity);
          n = n.parentElement;
        }
        if (op < 0.5) faded.push(el.tagName + ":" + el.textContent.trim().slice(0, 24));
      }
      document.querySelectorAll(".reveal-line").forEach((l) => getComputedStyle(l).transform !== "none" && masked.push(l.textContent.trim().slice(0, 24)));
      return { faded, masked, moved: [...new Set(window.__motion.moved)], fades: window.__motion.faded };
    });
    faded += res.fades;
    const ok = !res.faded.length && !res.masked.length && !res.moved.length;
    console.log(r.padEnd(18), ok ? "ok" : "FAIL", JSON.stringify({ faded: res.faded.slice(0, 4), masked: res.masked.slice(0, 4), moved: res.moved.slice(0, 6), fades: res.fades }));
    if (!ok) bad++;
    await ctx.close();
  }
  console.log(faded > 0 ? "ok   gentle fades kept" : "FAIL no opacity/colour fade ran anywhere (reduced motion should be gentler, not zero)", faded);
  if (!faded) bad++;
  await b.close();
  process.exit(bad ? 1 : 0);
})();
