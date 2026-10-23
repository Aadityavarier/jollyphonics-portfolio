# Final Fix Round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site work and animate properly on phones, fix the visual and accessibility bugs found, and prepare the repo so the client's copy, facts and photos drop in without code changes.

**Architecture:** Mostly small CSS and component fixes. Three things are new: a committed mobile probe (`npm run probe:mobile`, Playwright with real device emulation and taps), a photo pipeline script (`npm run photos`, sharp to WebP plus a generated manifest that `images.ts` and `gallery.ts` read), and three docs (CONTENT-GUIDE.md, CLIENT-QUESTIONS.md, DEPLOY.md launch switch).

**Tech Stack:** Next 16.4.2 App Router, React 19.3, Tailwind 4, GSAP 3.15 (lazy), Vitest 5, playwright-core (global `@playwright/cli`), sharp.

**Spec:** the "FINAL FIX ROUND" message (sections A to F) plus CLAUDE.md and content.md. Where this plan and that message disagree, the message wins.

## Global Constraints

- No new facts beyond content.md. Every gap is a `todo()` in `src/content/` and appears in TODO.md and CLIENT-QUESTIONS.md.
- Don't redesign pages, and don't remove visual effects to gain points.
- Everything must stay readable without JS and with reduced motion.
- Animate only transform, opacity, clip-path and stroke-dashoffset.
- Hover motion is gated by `(hover: hover) and (pointer: fine)`; anything hover or mouse-only must also work by tap.
- PageSpeed mobile (Vercel preview) must not drop below 95 on any page. Baseline: Home 95, Programs 100, Coaching 100, About 99, Contact 100.
- Commit after every task, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push only once, at the very end: `git push origin preview` (the current branch is `preview`, tracking `origin/preview`).
- Decisions go to the ledger `.superpowers/sdd/FIX-PLAN/progress.md` as `Ruling: … — why — cost if wrong`.

## Root causes found during investigation (2026-10-23, prod build on :4000, dev on :3001)

| # | Issue | Root cause (evidence) |
|---|---|---|
| A1 | The phone looked like the no-JS version: Menu dead, no animations, header see-through | **The dev server blocked the phone's origin.** The dev log shows `Blocked cross-origin request to Next.js dev resource /_next/hmr from "192.168.1.107"`. Reproduced from this PC: on `http://192.168.1.107:3001` with Pixel 7 emulation, buttons have no React props, `html[data-motion]` is never set, and the HMR websocket fails `ERR_INVALID_HTTP_RESPONSE`. The dev client never hydrates. `next.config.ts` has no `allowedDevOrigins`. On localhost the same page hydrates. |
| A2 | Production on phones | Hydrates on Pixel 7 and iPhone 13 on all 8 routes, 0 console errors. The menu opens by tap and Escape closes it. **Missing:** scroll lock (`body` overflow stays `visible`) and a focus trap (Tab leaves the open menu). See `src/components/layout/MobileNav.tsx:20-31`: only Escape is handled. |
| B3 | Header transparent over content | `src/app/motion.css:337-349`: the paper background and shadow live on `.site-header::before` with `opacity: 0`, and become visible only once JS sets `[data-scrolled]` (`MotionRoot.tsx:23-29`). With no JS, a dead dev client or a top-of-page position, the header is see-through (computed bg `rgba(0,0,0,0)` on both dev and prod). |
| B4 | `/programs` heading clipped ("rograms") | `src/components/motion/FxHeading.tsx:58` sets `--sp: (i - mid) * 0.32em`, so letters spread symmetrically about the middle. The first letter of "Programs" starts about 1.1em left of its resting place, past the 20px gutter. Captured frames on Pixel 7 show the P at x≈13px, and at 375px it crosses 0 and is clipped by the page's `overflow-x: clip`. The same effect is used on every Programs section heading and on WhyChooseUs. |
| B5 | For Schools track cards look empty | `src/app/fx.css:1037-1046`: `.frame` has `align-content: space-between; gap: 2.25rem; min-height: 9.5rem`, and flex items stretch to the tallest. The colour bar sits at the top and the text is pushed to the bottom of a mostly white card. |
| B6 | Dark circle next to the phone icon | **The Next.js dev indicator** (the "N" badge in `<nextjs-portal>`, bottom-left). On phones it sits over the sticky bar's WhatsApp button, next to its icon. A captured frame (dev, Pixel 7) shows it; the production DOM has 0 `nextjs-portal` elements. It isn't ours. |
| D14a | Home "3 non-composited animations" | `src/components/home/WordBoard.tsx:116-131`: each slot `span` has a CSS `transition-transform` (the blend shift) **and** receives a WAAPI FLIP `transform` animation (`:62`) at the same time. Lighthouse says "Target has another animation which is incompatible". |
| D14b | Home "forced reflow" (≈111 ms attributed to the React scheduler, 444 ms unattributed, local 4× run) | `src/components/motion/MotionRoot.tsx:11-19`: effect 1 writes `html[data-motion]`, which invalidates every style, then effect 2 synchronously reads `header.offsetHeight` and writes `--header-h` on `<html>` (another root-wide recalc). The WordBoard FLIP also reads two rects in a layout effect during the demo. |
| D15 | 14 KiB legacy JS | `Array.prototype.at/flat/flatMap`, `Object.fromEntries/hasOwn`, `String.prototype.trimStart/trimEnd` in the framework chunk `2abgvfcolnmqq.js`. Next's default targets (Chrome 111, Safari 16.4) already exceed all of these, so the code is probably Next's own bundled polyfills, not our transpile target. A browserslist may not remove it. |
| D16 | Accessibility 96 on Programs, Coaching, About | (a) Programs `.conveyor > li` rests at `opacity: 0.2` before it scrolls in (`fx.css:851-855`), contrast 1.52. (b) Coaching `.stair-label` opacity is scrubbed continuously (`Staircase.tsx:65`), so labels sit at partial opacity (contrast 1.37 and 4.15). (c) Coaching and About `FlipCard` buttons have `aria-label` that doesn't contain their visible text (`FlipCard.tsx:49`, `label-content-name-mismatch`). (d) Coaching flip back-face text has no background of its own, so it is measured against the blue front tile (1.84). (e) About award year `text-red` (#e3001b) on surface (#eef5f2) is 4.43, below 4.5. |
| E | Testimonials | No testimonials component or content file exists yet (grep finds none), so "appears automatically" has to be built. |

## Decisions I need from you (the defaults apply if you just approve)

1. **Dev indicator:** hide it with `devIndicators: false` in `next.config.ts` (dev only; error overlays still show). *Default: hide it.*
2. **Testimonials:** add `src/content/testimonials.ts` (empty array) and a Home section placed **before the FAQ** that renders nothing until the array has at least one entry. *Default: as described.*
3. **Default alt text for new photos:** the slot's description from `images.ts` (for example "Trainer Revathi, warm, waist-up portrait, smiling at camera"), editable in `images.md`. It is never "TODO". *Default: as described.*
4. **Three small visual changes for accessibility 100:**
   - Programs conveyor chips fade from 0 instead of 0.2.
   - Coaching stair labels switch on (160 ms fade) once their step is 60% built, instead of a continuous fade.
   - The award year uses a slightly deeper red (a new `--color-red-ink: #c4001a`, 5.6:1 on surface) for small text only.

   *Default: all three.*
5. **Legacy JS:** if a `browserslist` doesn't remove it, I log it as Next's framework code and leave it. *Default: as described.*

## Review Focus

1. **Menu on an iPhone with the page scrolled halfway:** opening it must not jump the page to the top, and closing it must restore the exact scroll position.
2. **Tapping a word-board tile while the demo is still running:** the demo stops cleanly and the FLIP still starts from the tapped tile (no double transform after the compositing split).
3. **A photo dropped in raw-images/ with a slot ID in lower case or with spaces** (`h1 portrait.JPG`, `H1-me.HEIC`): it maps to H1 or is skipped with a clear message, never a crash.
4. **A gallery category with exactly 2 photos:** it stays hidden; adding a 3rd puts `/gallery` in the nav and sitemap and drops noindex.
5. **Reduced motion after the catch-all change:** no element moves (no transform animation or transition runs), while opacity and colour changes still fade.

Each of these gets a test in the task that owns it (Tasks 3, 9, 12, 12 and 7).

---

### Task 1: Phone testing over Wi-Fi works in dev

**Files:** Modify `next.config.ts`; Test `scripts/probes/lan.cjs` (new).

- [ ] Write `scripts/probes/lan.cjs`. It loads `http://<first private IPv4>:<PORT>/` with Pixel 7 emulation and asserts that a header button carries React props (`__react*` key) and that `html[data-motion]` is set. Run it against the current dev server. Expected: FAIL (props missing).
- [ ] Add `allowedDevOrigins: ["192.168.*.*", "10.*.*.*"]` (dev-only by nature) and `devIndicators: false` (Decision 1). Restart dev on :3001.
- [ ] Re-run `lan.cjs`. Expected: PASS. If the `*` label wildcard does not match an IP, fall back to building the list from `os.networkInterfaces()` in `next.config.ts` and ledger it.
- [ ] Commit `fix(dev): allow LAN origins so phones can test over Wi-Fi`.

### Task 2: The mobile probe (written first, red)

**Files:** Create `scripts/probes/mobile.cjs`; modify `package.json` (`"probe:mobile": "node scripts/probes/mobile.cjs"`), `scripts/probes/lib.cjs` (export `devices`).

It runs against `BASE` (default `http://localhost:4000`, the production server) for each of `Pixel 7` and `iPhone 13` (`isMobile`, `hasTouch`), using only `locator.tap()`. It checks:
- **Every route:** 0 `pageerror`/console errors, 0 hydration warnings, no horizontal scroll, the header's computed background is opaque, and every `a[href^="https://wa.me/"]` matches `^https://wa\.me/919022582988(\?text=.+)?$` and every `a[href^="tel:"]` equals `tel:+919022582988`.
- **The menu on every route:**
  - tap opens it (`aria-expanded=true`, panel visible);
  - scroll is locked (`document.documentElement` overflow `hidden` or a body position lock), and the scroll position is restored after closing;
  - Tab ×15 keeps focus inside the header;
  - Escape closes it and returns focus to the toggle;
  - tapping a link navigates and the menu is closed on the new route.
- **Interactions by tap:**
  - Home:
    - word board: tap c, a, t gives slots "c a t" and the live line contains "cat"; Clear empties it;
    - names-vs-sounds toggle flips `data-mode`;
    - each audience tab changes the visible panel;
    - every bento tile is an `a` whose tap navigates;
    - FAQ: tapping a `summary` opens its `details`.
  - Programs: anchor nav tap scrolls to its section.
  - Coaching and About: a flip card toggles `aria-pressed`.
  - Teacher Training: the stack cards are present and visible.
  - For Schools: each tab shows its panel.
  - Contact:
    - stepper chips advance to the WhatsApp bubble, whose link is a valid wa.me href;
    - the East/West toggle switches the visible branches;
    - "Show map" reveals an iframe.
- **The signature animation plays on every route:** scroll the moment's selector into view, then sample twice 120 ms apart and assert `document.getAnimations()` scoped to it has a `running` entry, **or** that the computed `transform` changed between samples (GSAP scrubs).
  - **Selectors:** Home `[data-testid=board-slots]` after a tile tap, About `.journey`, Programs `.sound-wall`, Coaching `.stair`, Teacher Training `.stack`, For Schools `.tabs-panel`, Contact `.enq`, and Gallery: page CTA band only.
  - The executor confirms each class name in the code and ledgers any substitution.
- Output is one PASS/FAIL line per check and a non-zero exit on any failure.

- [ ] Write it, build (`npm run build`), start `next start -p 4000`, run it. Expected: FAIL on menu scroll lock and focus trap (seen in investigation) and the header background. Record every other failure in the ledger; they become fixes in Task 10.
- [ ] Commit `test: mobile tap probe (npm run probe:mobile)`.

### Task 3: Menu: scroll lock, focus trap, route close

**Files:** Modify `src/components/layout/MobileNav.tsx`; Test `tests/unit/mobile-nav.test.tsx` (new).

- [ ] Write tests (RTL):
  - opening sets `document.documentElement.style.overflow === "hidden"`;
  - closing restores it;
  - Tab from the last panel link moves focus to the toggle, and Shift+Tab from the toggle moves to the last link;
  - Escape closes and focuses the toggle;
  - re-render with a new `usePathname` value closes (mock `next/navigation`).

  Run. Expected: FAIL on lock and trap.
- [ ] Implement it inside the existing `open` effect:
  - **Scroll lock:** save `scrollY`, set `html.style.overflow = "hidden"` and `scrollbarGutter`-safe padding, and restore both in the cleanup (no `position: fixed`, so iOS does not jump; covers Review Focus 1).
  - **Focus trap:** a keydown handler on the header container cycling `[toggle, ...panel links]`.
  - **Route change:** keep the existing `openOn === pathname` mechanism.
- [ ] Run the tests. Expected: PASS. Commit `fix(nav): lock scroll and trap focus while the mobile menu is open`.

### Task 4: Header is solid by default

**Files:** Modify `src/app/motion.css:337-356`, `src/components/layout/SiteHeader.tsx` (comment), `src/components/motion/MotionRoot.tsx`.

- [ ] Change `.site-header::before`:
  - default `opacity: 1` with `box-shadow: 0 1px 0 rgba(22,32,74,0.06), 0 4px 14px rgba(22,32,74,0.06)`;
  - `[data-scrolled]` keeps the logo shrink and swaps to the stronger existing shadow, with the transition on `box-shadow` replaced by an opacity crossfade of a second pseudo (`::after`) so only opacity animates.
- [ ] D14b fix in the same file: replace the synchronous `offsetHeight` read with a `ResizeObserver` whose callback uses `entry.borderBoxSize[0].blockSize` (no forced layout), and set a CSS default for `--header-h` (`4.25rem`, `lg: 5rem`) in `motion.css` so first paint is right without JS.
- [ ] Check: the probe's header-opaque check passes on 8 routes with JS on, and the no-JS sweep (`prod-sweep.cjs`) shows the opaque header. Commit `fix(header): solid paper header by default, no forced reflow`.

### Task 5: Sound-out headings never leave the screen

**Files:** Modify `src/components/motion/FxHeading.tsx:52-60`, `src/app/fx.css:65-73`, `@keyframes fx-snap`; Test `scripts/probes/soundout.cjs` (new, folded into `probe:mobile`).

- [ ] Write a probe that at 375×667 loads `/programs` and samples every `.fx-p` rect in the h1 each 60 ms for 1.5 s. Assert `left >= 0 && right <= innerWidth` in every frame. Also sample the first section heading after scrolling to it. Expected: FAIL (P at negative x).
- [ ] (Approved change) Below 640px the sound-out becomes a vertical letter-by-letter rise: each `.fx-p` goes `translateY(0.4em)` with opacity 0 → none/1, staggered by `--i × --step`, with the same easing (`--ease-out`), so nothing moves horizontally. At 640px and up the existing horizontal spread is unchanged.
- [ ] Probe passes at 375 and 412. Commit `fix(fx): sound-out headings stay on screen on phones`.

### Task 6: For Schools track cards: content height, text at the top

**Files:** Modify `src/app/fx.css:1027-1063`.

- [ ] Below 1024px:
  - `.frames { align-items: flex-start }`;
  - `.frame { align-content: start; gap: 0.75rem; min-height: 0 }`.

  At 1024px and up, keep equal heights but change `align-content: start`.
- [ ] Check: a screenshot of `/for-schools` at 375 shows the bar then the text with no empty band; frame height is at most the text height plus 3.5rem. Commit `fix(schools): track cards hug their content`.

### Task 7: Animation polish (review-animations findings)

**Files:**
- `src/app/fx.css` (`:1078-1084`, `:1239-1278`, `:539`, `:1141`)
- `src/app/home-showcase.css` (`:18-24`, `:321-326`, `:406-440`)
- `src/app/globals.css:225-233`
- `src/components/home/NamesVsSounds.tsx` (if the stagger index isn't already present)
- `tests/unit/` + `scripts/probes/reduced-motion.cjs`

- [ ] **(8)** `.cta-ink` gets `transition: background-color 160ms var(--ease-out)`, and `.cta-ink:hover` moves inside `@media (hover: hover) and (pointer: fine)`.
- [ ] **(9)** Extend `reduced-motion.cjs` first, under `reducedMotion: "reduce"`, on all 8 routes:
  - Scroll through each route and assert no running Animation or transition targets `transform`, `translate`, `scale` or `rotate` (inspect `getAnimations()` keyframes via `effect.getKeyframes()` and `transitionProperty`).
  - Assert the FAQ opacity still transitions.

  Run with the current catch-all. Expected: passes for movement, fails on "still fades".

  Then replace the `globals.css` catch-all:
  - keep `scroll-behavior: auto` and `animation-iteration-count: 1`;
  - drop the forced 0.01ms durations;
  - add `transition-duration: 150ms` only on the opacity and colour transitions that remain;
  - any rule the probe catches moving gets wrapped in `prefers-reduced-motion: no-preference`.

  Re-run. Expected: PASS.
- [ ] **(10)** `sc-pop` changes `from` to `opacity:0; transform: scale(0.9)`, and the `scale(1)` is removed from the `sc-card-1..3` keyframes.
- [ ] **(11)** The `.nvs-sounds .nvs-tile` transition becomes `transform 450ms var(--ease-in-out) calc(var(--i) * 40ms)`, and the fading layer gets `filter: blur(2px)` while hidden: `.nvs[data-mode=…] .nvs-<hidden>` adds `filter: blur(2px)` with `filter` in the transition list (reduced motion: no blur).
- [ ] **(12)** `.sc-tile:active { transform: scale(0.97) }`.
- [ ] **(13)** `--ease-spring` stays only on one-off moments: hero tiles and hero-art, the CTA `hc-tile`, `map-pin`, `stamp`, the `rail-dot`/`jt-dot` and the sound-wall ripple. The journey card and dot (`fx.css:539`, scroll-scrubbed and repeated) and `.enq-tile` (`fx.css:1141`, tap-triggered) move to `var(--ease-out)`. Grep `EASE.spring` in TS and apply the same rule there.
- [ ] Run `npm test`, `npm run probe` (reduced-motion part). Commit `polish(motion): review-animations findings`.

### Task 8: Accessibility 100 on Programs, Coaching, About

**Files:**
- `src/app/fx.css:851-855` (conveyor)
- `src/components/coaching/*Stair*.tsx:60-66` and `fx.css` (`.stair-label` transition)
- `src/components/motion/FlipCard.tsx`, `src/app/coaching/page.tsx:51-66`, `src/app/about/page.tsx:84-100`
- `src/app/globals.css` (`--color-red-ink`), `fx.css` flip faces

Tests: `tests/unit/flipcard.test.tsx`; Lighthouse a11y.

- [ ] Write a test: `FlipCard` renders a button whose accessible name contains each face's visible text (no `aria-label`). Expected: FAIL.
- [ ] Make the fixes (Decision 4):
  - **Conveyor:** `from { opacity: 0 }`.
  - **Stair labels:** `opacity = k >= 0.6 ? "1" : "0"` with a CSS `transition: opacity 160ms var(--ease-out)`.
  - **FlipCard:** drop `aria-label` and make `label` optional. In Coaching, mark the decorative "Ee" pair `aria-hidden`, so the name is the subject.
  - **Flip faces:** `.flip-face` gets `background: inherit` (the back face carries its own paper or surface).
  - **About:** the year in the back face and the front use `text-[var(--color-red-ink)]`.
- [ ] Rebuild, and run `npx lighthouse … --only-categories=accessibility` on `/programs /coaching /about /`. Expected: 1.0 each (Lighthouse at 375, unscrolled). Commit `fix(a11y): contrast and accessible names to reach 100`.

### Task 9: Home performance items

**Files:** `src/components/home/WordBoard.tsx`, `package.json` (browserslist trial); Test `tests/unit/word-board.test.tsx` (extend).

- [ ] **D14a:**
  - **Test:** after the demo finishes, a slot never has both a running WAAPI transform animation and an inline `transform` on the same element. Assert that the FLIP target is the inner `[data-face]`.
  - **Change:** the outer span keeps the blend `transform` and transition; a new inner `span[data-face]` carries the tile colours and receives the FLIP `animate()`. Review Focus 2: tapping mid-demo calls `clearTimers()` and starts FLIP on the inner element.
- [ ] Cache the tray rects: read both rects for all letters once per `slots` change, in a single read pass. Keep `useLayoutEffect`.
- [ ] **D15:** add `"browserslist": ["chrome >= 111", "safari >= 16.4", "firefox >= 111", "edge >= 111"]`, rebuild, and check whether the chunk's polyfills are gone (grep `Object.hasOwn` polyfill markers and compare gzip size). If unchanged, revert and ledger (Decision 5).
- [ ] Run Lighthouse performance on Home locally three times. Expected: "non-composited animations" 0 elements, and "forced reflow" with no entry attributed to our chunks. Record LCP and SI; the remote PSI gate happens after push. Commit `perf(home): composited word-board FLIP, no forced reflow`.

### Task 10: Mobile probe to green, and the 375px visual sweep

**Files:** whatever the probe and the sweep implicate.

- [ ] Run `npm run build && next start -p 4000` and `npm run probe:mobile`. Fix every remaining failure from Task 2. Each fix gets a unit test where the logic is in TS, or the probe line where it is CSS. Ledger each fix.
- [ ] Sweep: full-page screenshots at 375 for 8 routes (the existing `shot.cjs`). Look at every image and list everything overlapping, clipped, empty-looking or scrolling sideways in the ledger, then fix it. No redesigns: spacing, sizing and clipping only.
- [ ] Commit per fix group, for example `fix(mobile): …`.

### Task 11: All copy and facts live in src/content; testimonials appear automatically

**Files:** `src/components/**` (strings), `src/content/*.ts`, new `src/content/testimonials.ts`, new `src/components/home/Testimonials.tsx`, `src/app/page.tsx`; Tests `tests/unit/content-only.test.ts`, `tests/unit/testimonials.test.tsx`.

- [ ] Write `content-only.test.ts`, which scans `src/components/**/*.tsx` and `src/app/**/page.tsx`. It fails on any JSX text node of 3+ letters not coming from an import or expression, with an allow-list for sr-only boilerplate if needed. Run it. Expected: FAIL with a list. Showcase "Inside the classes", "A small taste of each class…", "English", "Handwriting" and "Coaching" are known.
- [ ] Move each string into the matching `src/content/*.ts` (no wording change) until the test passes.
- [ ] Write `testimonials.test.tsx`:
  - an empty `testimonials` renders nothing (no heading in the DOM);
  - one entry renders a quote, a name and context.

  Implement:
  - `export interface Testimonial { quote: string; name: string; context?: string }`;
  - `export const testimonials: Testimonial[] = []`;
  - `<Testimonials />` returns `null` when empty, and is placed before the FAQ on Home (Decision 2), on the next tone in `home-sections.ts` so the neighbour rule still holds.
- [ ] Commit `refactor(content): all copy in src/content; testimonials section ready`.

### Task 12: Photo pipeline (`npm run photos`)

**Files:** create `scripts/photos.mjs`, `images.md` (generated, committed), `src/content/photos.generated.ts`; modify `src/content/images.ts`, `src/content/gallery.ts`, `package.json`, `.gitignore` (`raw-images/*` with `!raw-images/README.md`). Create `raw-images/README.md`. Tests: `tests/unit/photos.test.ts`.

- [ ] **Tests** on the pure functions in `scripts/photos-lib.mjs`:
  - `slotFromName("H1-anything.jpg") === "H1"`;
  - `slotFromName("h1 portrait.JPG") === "H1"`;
  - `slotFromName("H10.png") === "H10"` (not H1);
  - `slotFromName("random.jpg") === null`;
  - `galleryFromPath("gallery/summer-camp/x.jpg")` returns that category only when it is a known `GalleryCategorySlug`;
  - `parseImagesMd` / `renderImagesMd` round-trip keeps edited alt text.

  Expected: FAIL.
- [ ] **Implement:**
  - **Slot photos:** for each file in `raw-images/` (jpg, jpeg, png, webp, heic where sharp supports it, otherwise skip with a message), sharp rotates it (EXIF), resizes so the long edge is at most 2000 (`withoutEnlargement`), and writes WebP q=78 to `public/images/<page>/<ID>.webp`. The page comes from the slot prefix: H=home, A=about, P=programs, C=coaching, T=teacher-training, S=for-schools, B=branches.
  - **Gallery:** `raw-images/gallery/<category>/*` go to `public/images/gallery/<category>/<n>.webp`.
  - **Manifest:** the script writes `photos.generated.ts` with `{ slots: Partial<Record<SlotId,{src,alt,width,height}>>, gallery: GalleryPhoto[] }`.
  - **images.md:** it writes or updates `images.md` as a table (slot, file, alt, description). Alt defaults to the slot description (Decision 3), and an existing alt is never overwritten.
  - **Wiring:** `images.ts` merges `photo` from the manifest, and `gallery.ts` reads `galleryPhotos` from it.
  - Unknown names are listed as "skipped" and the script exits 0.
- [ ] **Check with one fixture:** a script test copies `tests/fixtures/photo.jpg` to a temp `raw-images` with `H1-test.jpg` and runs it into a temp out dir. The manifest has H1 with width 2000 or less, and `ImageSlot` renders `img` with that alt (unit test with the manifest injected). Gallery with 2 vs 3 photos: `galleryCategories()` and `galleryHasPhotos()` flip at 3, and sitemap/nav/noindex follow (Review Focus 4: unit tests on `sitemap.ts` and `SiteHeader` items). The temp files are not committed; the real manifest stays empty.
- [ ] Commit `feat: photo pipeline (npm run photos)`.

### Task 13: CONTENT-GUIDE.md, CLIENT-QUESTIONS.md, DEPLOY.md launch switch

**Files:** create `CONTENT-GUIDE.md` and `CLIENT-QUESTIONS.md`; modify `DEPLOY.md`.

- [ ] **CONTENT-GUIDE.md** (for whoever edits the site), covering:
  - the page → file table (every route → its `src/content/*.ts` files);
  - how to change a fact;
  - how `todo()` works (in dev it shows a visible placeholder, in prod it renders nothing, and it disappears the moment the value is a real string);
  - testimonials (add an entry and the section appears);
  - social links, timings, ages, pincodes and map pins (exact file and field each);
  - photos (`npm run photos`, naming, images.md alt editing, gallery folders and the 3-photo rule);
  - after any edit: `npm test && npm run build && npm run probe:mobile`.
- [ ] **CLIENT-QUESTIONS.md** (plain language, forwardable, no file paths):
  - every open item in TODO.md rewritten as a question;
  - a **PHOTO LIST** from the `images.ts` slots, grouped into **Must-have for launch** (H1, A1, the B1–B4 branch photos, the A2/A3 certificates, P1, T1, S1) and **Nice to have** (the rest). Each row gives what the photo is, the page it appears on, orientation (from the ratio: 4:5 portrait, 3:2/4:3 landscape, 1:1 square) and a tip;
  - the parent-consent note for any photo showing children's faces, with "no faces needed" slots flagged as safe to send first.
- [ ] **DEPLOY.md, "Going live" section:**
  1. merge `preview` → `main` (PR or `git checkout main && git merge --ff-only preview && git push origin main`);
  2. set `NEXT_PUBLIC_SITE_URL` once a domain exists and redeploy;
  3. turn Vercel Deployment Protection back on for previews;
  4. Google Search Console: add the property, verify, and submit `/sitemap.xml`.
- [ ] Check that every TODO.md item appears in CLIENT-QUESTIONS.md. Commit `docs: content guide, client questions, launch switch`.

### Task 14: Final gate, assets, push, report

- [ ] `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`: all green.
- [ ] Production server, then `npm run probe` and `npm run probe:mobile`: all PASS. Includes the prod sweep at 375 (no TODO text, no horizontal scroll, alt on images, one h1), reduced motion, and no JS (content complete, `wa.me` and `tel:` links present).
- [ ] Lighthouse locally on all routes, for a11y and best practices only (performance is judged on PSI).
- [ ] Full-page 375 and 1440 screenshots of all 8 routes go to `.screens/final/`. GIFs of each page's signature moment, recorded with **Pixel 7 emulation**, go to `.screens/gifs/mobile-*.gif` (`gif.cjs` with a device option).
- [ ] Run superpowers:verification-before-completion and the final self-review (ledger it).
- [ ] `git push origin preview`. Capture the output; a Vercel URL appears only if the remote prints one, otherwise say so.
- [ ] Write MORNING-REPORT.md, then commit and push it as a docs-only follow-up. It covers:
  - what was broken and why (the root-cause table above);
  - what was fixed;
  - probe results;
  - the preview URL or how to find it;
  - a "tap these on your phone" checklist;
  - links to CONTENT-GUIDE.md, CLIENT-QUESTIONS.md and DEPLOY.md;
  - rulings and deferred items.

## Risks

- **Push:** pushing to `origin/preview` triggers a Vercel preview build. That is outward-facing but explicitly asked for, and it happens once at the end.
- **PSI regression** on Home from the testimonials section (it renders nothing while empty, so no cost now) or the header shadow (paint only). The real check is PSI after push, which I can't run unattended. MORNING-REPORT will list the URLs to test.
- **Content-only test:** it may flag legitimate UI micro-labels (for example "Clear", "Menu", "Close"). They move to `src/content/ui.ts` rather than being allow-listed.
- **HEIC:** sharp may lack HEIC support on Windows. Those files are skipped with a message and an instruction to export as JPG.
- **Local speed:** Lighthouse and probes on this machine are slow (performance numbers are unreliable). Timeouts are generous, and performance claims rest only on the specific audits (non-composited and reflow), not scores.
