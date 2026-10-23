/**
 * One shared engine for every scroll reveal. A node arms itself from its own effect (so it has hydrated),
 * and is shown when it scrolls into view, when it is already in view or above the viewport on arm, when a
 * scroll/resize sweep finds it past the fold (jumps, anchors, find-in-page), when the page is printed or
 * hidden, or 1.5s after it was triggered (data-failsafe overrides, for sequences that are longer by design). Server HTML and no-JS state are fully visible.
 */
const WATCHDOG_MS = 1500;
const LIMIT = 0.9;

const pending = new Set<Element>();
const callbacks = new WeakMap<Element, () => void>();
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
  window.setTimeout(() => el.setAttribute("data-done", ""), Number(el.getAttribute("data-failsafe")) || WATCHDOG_MS);
  callbacks.get(el)?.();
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

interface ArmOptions {
  /** false: observe and mark data-shown without ever hiding the node (data-armed is not set). */
  hide?: boolean;
  /** Runs when the node is shown, including at once when it is already in view or reduced motion is on. */
  onShow?: () => void;
}

interface Waiting {
  el: Element;
  hide: boolean;
  onShow?: () => void;
  cancelled: boolean;
}
let waiting: Waiting[] = [];

/**
 * Many nodes arm in the same commit (all their effects run back to back). Reading each one's position right
 * after the previous one's attribute write would force a layout per node, so arming is queued to a microtask
 * (still before the next paint): every position is read first, then every attribute is written.
 */
function flushArming() {
  const batch = waiting;
  waiting = [];
  const limit = window.innerHeight * LIMIT;
  const tops = batch.map((w) => (w.cancelled ? 0 : w.el.getBoundingClientRect().top));
  batch.forEach((w, i) => {
    if (w.cancelled) return;
    if (tops[i] < limit) {
      w.el.setAttribute("data-shown", "");
      w.onShow?.();
      return;
    }
    if (w.hide) w.el.setAttribute("data-armed", "");
    if (w.onShow) callbacks.set(w.el, w.onShow);
    pending.add(w.el);
    io ??= new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting || e.boundingClientRect.top < 0) show(e.target);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(w.el);
    startListening();
  });
}

/** Arms `el`; returns a cleanup. In view, above the fold, or reduced motion: shown at once, never hidden. */
export function armReveal(el: Element, { hide = true, onShow }: ArmOptions = {}): () => void {
  if (el.hasAttribute("data-shown")) {
    // Already shown (e.g. StrictMode re-running the effect): still let the caller start its own sequence.
    onShow?.();
    return () => {};
  }
  if (reducedMotion()) {
    el.setAttribute("data-shown", "");
    onShow?.();
    return () => {};
  }
  const w: Waiting = { el, hide, onShow, cancelled: false };
  if (waiting.push(w) === 1) queueMicrotask(flushArming);
  return () => {
    w.cancelled = true;
    if (pending.delete(el)) io?.unobserve(el);
    if (pending.size === 0) stopListening();
  };
}
