/**
 * Lazy GSAP. Nothing imports gsap statically, so it never lands in the first-load bundle; callers
 * `await loadGsap()` from an effect (client only, never during SSR) once a scroll scene is near.
 */
type Gsap = typeof import("gsap").gsap;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let loading: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerType }> | undefined;

export function loadGsap() {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    // Recompute trigger positions once the web fonts have settled line heights.
    document.fonts?.ready.then(() => st.ScrollTrigger.refresh());
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loading;
}

/**
 * Runs `cb` once `el` is within one viewport of being seen, so GSAP loads just ahead of need.
 * Nothing is observed until the page is idle after load, and then only once the visitor scrolls
 * (or the section is already on screen, e.g. a reload mid-page): page load never pays for GSAP.
 */
export function whenNear(el: Element, cb: () => void): () => void {
  let io: IntersectionObserver | undefined;
  let idle = 0;
  const observe = () => {
    window.removeEventListener("scroll", observe);
    io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io?.disconnect();
        cb();
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(el);
  };
  const ready = () => {
    const onScreen = el.getBoundingClientRect().top < window.innerHeight;
    if (onScreen) observe();
    else window.addEventListener("scroll", observe, { passive: true, once: true });
  };
  const afterLoad = () => {
    // Safari has no requestIdleCallback.
    idle = typeof requestIdleCallback === "function" ? requestIdleCallback(ready, { timeout: 3000 }) : window.setTimeout(ready, 1500);
  };
  if (document.readyState === "complete") afterLoad();
  else window.addEventListener("load", afterLoad, { once: true });
  return () => {
    window.removeEventListener("load", afterLoad);
    window.removeEventListener("scroll", observe);
    if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle);
    clearTimeout(idle);
    io?.disconnect();
  };
}
