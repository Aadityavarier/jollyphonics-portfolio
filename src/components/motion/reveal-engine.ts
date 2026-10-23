/**
 * One shared engine for every scroll reveal. A node arms itself from its own effect (so it has hydrated),
 * and is shown when it scrolls into view, when it is already in view or above the viewport on arm, when a
 * scroll/resize sweep finds it past the fold (jumps, anchors, find-in-page), when the page is printed or
 * hidden, or 1.5s after it was triggered. Server HTML and no-JS state are fully visible.
 */
const WATCHDOG_MS = 1500;
const LIMIT = 0.9;

const pending = new Set<Element>();
let io: IntersectionObserver | null = null;
let listening = false;
let raf = 0;

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function show(el: Element) {
  if (!pending.delete(el)) return;
  io?.unobserve(el);
  el.setAttribute("data-shown", "");
  window.setTimeout(() => el.setAttribute("data-done", ""), WATCHDOG_MS);
  if (pending.size === 0) stopListening();
}

function showAll() {
  [...pending].forEach(show);
}

function sweep() {
  raf = 0;
  const limit = window.innerHeight * LIMIT;
  for (const el of [...pending]) if (el.getBoundingClientRect().top < limit) show(el);
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(sweep);
}

function onHide() {
  if (document.visibilityState === "hidden") showAll();
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("beforeprint", showAll);
  window.addEventListener("pagehide", showAll);
  document.addEventListener("visibilitychange", onHide);
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  window.removeEventListener("beforeprint", showAll);
  window.removeEventListener("pagehide", showAll);
  document.removeEventListener("visibilitychange", onHide);
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

/** Arms `el`; returns a cleanup. In view, above the fold, or reduced motion: shown at once, never hidden. */
export function armReveal(el: Element): () => void {
  if (el.hasAttribute("data-shown")) return () => {};
  if (reducedMotion() || el.getBoundingClientRect().top < window.innerHeight * LIMIT) {
    el.setAttribute("data-shown", "");
    return () => {};
  }
  el.setAttribute("data-armed", "");
  pending.add(el);
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting || e.boundingClientRect.top < 0) show(e.target);
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  io.observe(el);
  startListening();
  return () => {
    if (pending.delete(el)) io?.unobserve(el);
    if (pending.size === 0) stopListening();
  };
}
