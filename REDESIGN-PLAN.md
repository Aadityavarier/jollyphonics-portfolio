# Motion Redesign + Bug Fixes — Implementation Plan

> **For agentic workers:** execute with superpowers:executing-plans, task by task, in order. **Approved by the user, including all proposed alternatives.** See "Approved decisions" below.

## Approved decisions (override the open questions at the bottom)
1. 42 sound tiles: NO letters. Plain coloured tiles, counter lands on "42 sounds" (the list is Jolly Learning material, not in content.md).
2. Sample text "The dog runs fast" and the letter "a": approved as illustrative examples.
3. No-JS enquiry form: a single message field submitting GET to `https://wa.me/919022582988` with `?text=`. JS users get the conversational form.
4. 60fps gate: "no long frames / no freezes at 4x throttle" is a pass on this host. Real numbers come from PageSpeed on Vercel.
5. All alternatives approved (CSS hero, scroll-scrubbed conveyor, no desktop expand in TT stack, letter-sound coaching cards, takeaways strip, crawlable audience selector).
6. context7 is now authorised: confirm View Transitions support in Next 16.4 before Task 3. Skip high-end-visual-design.
7. `metadataBase`: `NEXT_PUBLIC_SITE_URL`, else `https://${VERCEL_PROJECT_PRODUCTION_URL}`, else localhost. Note in MORNING-REPORT.md that `NEXT_PUBLIC_SITE_URL` is only needed once a custom domain exists.

**Goal:** Fix the three reveal/hydration/counter bugs, then replace the site's repeated fade-up reveals with a phonics-based motion language: one distinct signature moment per page, varied heading treatments, and full static content under reduced motion.

**Architecture:** Server-rendered content stays complete and visible in HTML. Motion attaches only after a node has hydrated and JS confirms it can run. Each page's signature moment is one small client component that loads its own engine: CSS / WAAPI first, GSAP (+ScrollTrigger) only for scroll-scrubbed scenes, and framer-motion (`LazyMotion` + `m`) only for the two shared-layout morphs.

**Tech stack (installed, read from node_modules):** Next 16.4.2 (`cacheComponents`, `partialPrefetching` on), React 19.3.0 (exports a stable `ViewTransition`), gsap 3.15.0 (all plugins free and bundled), framer-motion 14.6.0, Tailwind 4, Vitest 5 + jsdom, Playwright via the global `playwright-cli` install.

**Spec:** the user's review message ("Review of the overnight build", Parts A/B + PROCESS), [CLAUDE.md](CLAUDE.md), [content.md](content.md), [PLAN.md](PLAN.md).

**Skills used for this plan:** brainstorming, find-animation-opportunities, animation-vocabulary, design-taste-frontend, emil-design-eng, writing-plans.
- **Unavailable:** `high-end-visual-design` is "disable-model-invocation". The user must run `/high-end-visual-design` themselves if they want it.
- **Unavailable:** context7 needs OAuth, which this non-interactive session can't run. Library facts below come from `node_modules` (package versions, `dist/*.min.js` sizes, React exports) instead, and are marked "verify against docs" where it matters.

## Global constraints (apply to every task)
- content.md is the only source of facts. No invented dates, numbers, quotes or session formats. Gaps render the existing dev-only `<Todo>` and go in TODO.md.
- No Jolly Learning artwork or characters. Letters, tiles and strokes are drawn by us.
- Animate only `transform`, `opacity`, `clip-path` and SVG `stroke-dashoffset`. No `width`/`height`/`top`/`left` tweens; the one existing exception is the FAQ `::details-content` height.
- Every moment needs:
  - a designed mobile version (no pinning below 1024px; tap instead of hover);
  - a reduced-motion version that shows everything statically;
  - a no-JS state where everything is visible.
- No custom cursors, confetti, autoplaying sound, or infinite loops in reading areas. Idle motion stops in under 5s (WCAG 2.2.2).
- The plain `Reveal`/`Stagger` is allowed only for body paragraphs and small lists. Never on headings, heroes or a page's main feature.
- The Home learning path (`LearningPathScene`) is not touched.
- Per page while building: one 375px screenshot plus one short GIF of the signature moment, from the running dev server. Everything else waits for the end batch (Task 13).
- Commits are local only, with the attribution line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Never push.

## Review focus (failure modes no single task's tests naturally hit)
1. **Content hidden after a jump.** End key, anchor link, find-in-page, print or full-page capture must show everything. Pinned by `tests/unit/reveal.test.tsx` "reveals elements already scrolled past" and the Task 13 "no-scroll full-page capture has zero hidden nodes" probe.
2. **Hydration under PPR.** Any client effect that writes attributes outside its own subtree re-creates bug A1. Pinned by the Task 13 clean-profile console probe on all 8 pages, and a lint-style test that `MotionRoot` no longer calls `querySelectorAll`.
3. **Resize across 1024px mid-scene.** Pinned scenes (About journey, Coaching stairs, TT stack) must revert cleanly via `gsap.matchMedia`. Checked by a Task 13 resize step in the probe.
4. **Keyboard-only use** of the audience selector, tabs, flip cards and form steps: focus order, arrow keys, Enter/Space. Each component's unit test covers it.
5. **Back/forward navigation with view transitions** must not double-run entrances or leave `data-shown` stuck off. Checked by a Task 12 probe: navigate A→B→back, assert no hidden nodes.

---

## (a) Part A diagnosis

Reproduced with a clean Playwright Chromium (no extensions, fresh context) against the dev server at `localhost:3001`. The scripts are in the session scratchpad (`probe.cjs`, `probe2.cjs`, `probe3.cjs`).

### A1. Hydration mismatch: our own code, not an extension
- **Observed:** "A tree hydrated but some attributes … didn't match" on **/programs, /coaching, /for-schools, /contact, /gallery**. /, /about and /teacher-training were clean in this run, which points to a race. The diff names our nodes, for example `<h2 id="branches-title" data-reveal="mask" … - data-shown="">` and the Panel layer `<span aria-hidden="true" data-reveal="panel">`.
- **Root cause:**
  - [MotionRoot.tsx:68-73](src/components/motion/MotionRoot.tsx#L68-L73) runs `document.querySelectorAll("[data-reveal]…")` and does `setAttribute("data-shown", "")` on every match, page-wide, from the root layout's effect.
  - With `cacheComponents` + `partialPrefetching` ([next.config.ts:7-8](next.config.ts#L7-L8)), the page segment streams and hydrates **after** the layout, so MotionRoot's effect mutates server DOM React has not hydrated yet.
  - React then sees an extra `data-shown` on [Section.tsx:45](src/components/layout/Section.tsx#L45) headings and [Panel.tsx:29](src/components/layout/Panel.tsx#L29) layers, and refuses to patch.
- **Fix:**
  - Stop page-wide DOM writes. `Reveal`, `Stagger`, `SectionHeading` and `Panel`'s layer become thin client leaves that call `useReveal(ref, variant)`.
  - `useReveal` registers **its own node** with one shared module-level `IntersectionObserver` inside `useEffect`. The effect only runs after that node has hydrated, so there is never a pre-hydration write.
  - Markup stays server-rendered and identical.
  - `MotionRoot` keeps only the header scrolled-state and sets `html[data-motion]`. `<html>` belongs to the layout, which is already hydrated by then; add `suppressHydrationWarning` on `<html>` as a belt-and-braces measure.
  - **Done-check:** 0 hydration errors on all 8 pages, 3 cold loads each, in a clean profile.

### A2. Content left hidden (/contact form + FAQ blank, /about award card faded)
- **Observed:** after load with **no scrolling**, a full-page capture has 2 hidden headings on /contact ("Send an enquiry", "Frequently asked questions"; masked at `translateY(105%)`, so the section reads as blank above the footer) and **27** hidden nodes on /about, including the award cards.
  - Jump-scrolls (`scrollTo` near the bottom) leave everything already scrolled past at opacity 0 on /about and /coaching.
  - A slow wheel-scroll reveals everything, which is why the overnight run missed it.
- **Root cause:**
  - The hidden state ([motion.css:86-110](src/app/motion.css#L86-L110)) is cleared **only** by an IntersectionObserver "isIntersecting" event ([MotionRoot.tsx:57-66](src/components/motion/MotionRoot.tsx#L57-L66)).
  - That event never fires for elements that are:
    - scrolled past within a single frame (End key, anchor, find-in-page, fast fling);
    - captured full-page or printed;
    - on a tab that was backgrounded at the time.
  - The `-12%` bottom rootMargin widens the gap.
  - The /about award cards and qualification chips are `Stagger` children ([about/page.tsx:42-76](src/app/about/page.tsx#L42-L76)), so they inherit the same failure.
- **Fix contract (shared by `useReveal` and every new primitive):**
  1. Server HTML is fully visible. Hidden "before" states exist only under `html[data-motion]`, which is set after hydration.
  2. When a node arms, if `rect.top < innerHeight` (in view **or already above the viewport**), it is shown immediately with no transition.
  3. A shared, passive, rAF-throttled `scroll`/`resize` sweep shows any pending node whose `rect.top < innerHeight`. This covers jumps and skipped frames.
  4. A watchdog: once a reveal is triggered, the node is forced to its end state after **1500ms** (`transitionend`/`finish`, or a timeout fallback).
  5. `beforeprint`, `visibilitychange→hidden` and `pagehide` reveal everything still pending.
  6. `@media print` overrides all hidden states.
- **Done-check:** a no-scroll full-page capture and a jump-to-bottom capture of every page report 0 nodes with opacity < 0.5 or a mask still offset.

### A3. CountUp can stop short of 20+ / 4,500+
- **Root causes** in [CountUp.tsx](src/components/motion/CountUp.tsx):
  1. Lines 150-161 write `"0+"` and wait for an IO `isIntersecting`. A jump or fling that carries the figure from below to above the viewport in one frame never intersects, so it stays at **"0+"**.
  2. Cleanup (lines 147, 158-160) cancels the rAF **without writing the final value**. Route change mid-count, Fast Refresh and the dev StrictMode double-effect all leave a partial number.
  3. A backgrounded tab pauses rAF and IO, so the figure freezes mid-count until the tab returns.
  - My jump probe happened to land on final values, so this is code-path analysis, not a reproduced failure. Each path is pinned by a unit test below.
- **Fix:**
  - Progress is computed from `performance.now()` against the start, never from frame counts.
  - The final write is **always the verbatim `value` string** (not `toLocaleString`). It happens:
    - when progress ≥ 1;
    - in cleanup;
    - on `visibilitychange`;
    - when IO reports the node passed (`boundingClientRect.top < 0`);
    - from the shared reveal sweep;
    - from a watchdog `setTimeout(delay + DURATION.count + 100)`.
- **Done-check:** Vitest with fake timers: "unmount mid-count shows final", "hidden tab shows final", "passed-without-intersecting shows final". Probe: jump, fling and background the tab on / and /about, and read `20+` / `4,500+` exactly.

---

## (b) Motion plan

**Nav order** (from [nav.ts](src/content/nav.ts)): Home → About → Programs → Coaching → Teacher Training → For Schools → (Gallery, hidden from nav while there are no photos) → Contact. Adjacent pairs checked: Home–About, About–Programs, Programs–Coaching, Coaching–TT, TT–Schools, Schools–Contact (and Gallery–Contact when it un-hides).

**Content grounding check (content.md):**
- About journey: all seven dates exist.
  - 2001 — "Teaching Jolly Phonics since 2001", l.37/81.
  - 2017, 2022–23, 2023–24, 2024–25 — Inner Wheel, l.104.
  - 2023 — Business Entrepreneur Award, l.99.
  - 2025 — ROVEX SHAKTI and Nation Builder, l.100-101.
- The belief quote exists (l.79). Coaching range "Sr. KG to Std. 8" exists, and the subjects are marked "(confirm)". The Schools tracks exist. Nothing below needs a new fact.
- Flagged items are in **(f) open questions**.

| Page | Signature moment | Technique | Supporting moments (2–3) | Heading treatment | Mobile version | Reduced-motion version | Perf risk |
|---|---|---|---|---|---|---|---|
| **Home** | Hero tiles assemble into "Phonics", then a short idle bob (bob already exists, 3 iterations). Desktop: tiles lean toward the cursor (spring, exists). Tap: the tile hops. | **Scatter-to-place assembly**: CSS keyframes from per-tile `--x/--y/--r` scatter vars to rest, starting at first paint. **Proposed instead of GSAP Flip**: the final positions *are* the layout positions, so FLIP measurement adds 9.7KB gz and waits for hydration for nothing; CSS starts before JS and protects LCP. | 1) Audience selector, "Is it right for my child?": one shared card morphs between 4 audiences (`LayoutTabs` + framer `layoutId` on the card frame). 2) Branches: a vertical "railway line" divider draws in (stroke-dashoffset), East and West markers drop with a soft spring, then cards rise. 3) Why-choose-us: each of the 8 titles is **sounded out** (`SoundOut`). | Existing word-rise mask on the h1; section h2s use the **mask rise** (kept as Home's baseline). | Assembly is identical (CSS). No lean. Tap hop. Selector is a horizontally scrollable tab row. Railway is a short horizontal rule between "East" and "West" stacks. | Tiles at rest from the first frame. All 4 audience panels shown stacked. Railway line static. Titles whole. | Low. CSS only on load; framer `domMax` lazy-loaded when the selector is near (~25KB gz, verify against docs). |
| **About** | **Journey path**: 2001 → 2017 → 2022–23 → 2023 → 2023–24 → 2024–25 → 2025. Desktop pins and scrolls horizontally while an SVG path draws, and each milestone pops in as the pen reaches it. | ScrollTrigger pin + scrubbed horizontal `x` on the track + `stroke-dashoffset` on a `pathLength="1"` path (no DrawSVG plugin needed). Milestones use a scale 0.9→1 pop at path progress points. | 1) Belief quote read **word by word** with a moving "reading pointer" highlight (`ReadAloud`; a scroll-scrubbed underline bar translates under the active word). 2) Qualifications: certificate cards **stacked like a pile** that **fan out** on entry (rotate/translate from a shared origin). 3) Awards: **flip cards**, year on the front, details on the back, flipped by entry (once) and by tap/Enter. | **Stroke-drawn underline**: a hand-drawn SVG line pens itself under each h2. | Vertical path down the left with the same draw, scrubbed by native scroll (no pin). Milestones pop as reached. Pile fans into a vertical list. Flips on tap and on entry. | Full journey shown as a static vertical list with the path fully drawn. Quote fully highlighted (normal text). Awards show both faces side by side (year + details), no 3D. | Medium. The pinned horizontal track is the heaviest scene; it must be one composited layer. Paused off-screen by ScrollTrigger. |
| **Programs** (should feel like a lesson; one micro-demo per section) | **Sound wall**: 42 small tiles **ripple in from the centre** (distance-based stagger) while a counter lands on "42 sounds". | WAAPI per tile with `delay = distance × 18ms`, scale 0.8→1 + opacity. `CountUp` reused for 42. Grid-distance stagger with no GSAP. | #grammar **SentenceBuilder**: jumbled word tiles drop, snap into order, then get coloured by part of speech with a small label (Flip-style: measure, then WAAPI transform). #english **TypeOut** bubble, then three "listening" wave bars pulse for exactly 3 cycles and stop. #handwriting **StrokeDraw**: a letter is written on ruled guide lines, once on view. #special-classes: see alternative ↓. The pinned learning path is reused as-is. Sticky anchor nav with a **sliding underline indicator**. | **SoundOut**: letters appear spaced apart, one by one, then snap together into the word (`letter-spacing` is *not* animated; per-letter `translateX` closes the gaps). | Ripple runs on a 6-column grid (same order). Sentence builder runs the same. Bubble the same. Stroke draw the same. Anchor nav is a horizontally scrolling chip row whose indicator slides and the active chip scrolls into view. | 42 tiles and the counter static at "42 sounds". Sentence shown already ordered and labelled. Bubble text complete, no waves. Letter shown fully drawn. Chips static. | Medium-high (most moments on one page). Each demo arms independently via `whenNear` and runs once. The 42 tiles are one WAAPI batch (transform/opacity only). |
| **Coaching** | **Staircase**, Sr. KG → Std. 8 (9 steps). Steps rise as you scroll and a small tile **climbs** them: growth. | ScrollTrigger scrub, **not pinned** (Programs and About both pin; this one varies). Steps `scaleY` from the base (transform-origin bottom). The climbing tile moves along a precomputed polyline of step tops via a GSAP keyframes array (no MotionPath plugin). | 1) Subjects as **flash cards** that flip from a letter-sound front ("M m") to the subject name, once on entry, re-flippable by tap. 2) The focus line ("understanding concepts…") is set as a chalk-style clip-path **wipe** paragraph reveal. | **Tile flip**: each letter starts as a blank coloured tile (rotateX 90°) and flips to show the letter, left to right. | Staircase drawn as a vertical ladder (steps stacked; the tile steps down rung by rung on scroll). Cards flip on entry and tap. | All 9 steps at full height, tile on the top step. Cards show letter and name together, unflipped. | Low-medium. 9 transforms plus 1 tile, scrubbed. |
| **Teacher Training** | **Stacking cards**: Phonics TT, ECCEd and Montessori stick and stack while scrolling; each covered card scales back slightly (0.96, 0.92). | CSS `position: sticky` + scroll-driven `animation-timeline: view()` for the scale-back (compositor, 0KB JS). Browsers without scroll-timeline get the stack with no scale-back. | 1) **Expand for details**: see alternative ↓. 2) ARPAN: one slow opacity fade (900ms, no transform), muted surface, nothing playful. 3) "For whom" chips: a plain small-list `Stagger` (allowed). | **Clip-path wipe**: calm, one direction, left to right. | No sticky stack (short viewports trap the reader). Cards in a plain column, each with a disclosure. | Cards in a plain column, everything expanded. | Low. CSS only. |
| **For Schools** | **Three tracks as tabs** (Teachers / Students / Parents) with a **sliding indicator**; the content cross-fades with a **direction-aware slide** (left or right by tab order). | `LayoutTabs`: indicator is a single element moved by WAAPI `transform` to the measured tab rect (no framer). Panels animate translateX ±24px + opacity in 220ms `--ease-out`. ARIA tabs with arrow-key nav. | **Workshop flow strip**: see alternative ↓. A CTA band with a magnetic button (existing). | **Side slide by word**: words slide in from the left with a 40ms stagger (direction echoes the tabs). | Tabs become a full-width segmented control (thumb-sized). Same direction-aware slide. Strip scrolls horizontally with snap. | All three panels shown stacked with their own headings. Strip static. | Low. |
| **Contact** (CRO) | **Conversational enquiry**: one question per step. Progress = sound tiles lighting up (one per step). On finish, the answers fly into a WhatsApp-style **chat bubble** that types out the prefilled message, then "Send on WhatsApp" opens `wa.me`. "Show all fields" toggles to the full form. | Step transitions: outgoing −16px/opacity, incoming +16px (220ms). Tile light-up is a background-colour step (not animated colour on large areas). Answers → bubble uses a FLIP transform from each answer chip to the bubble. **TypeOut** for the message (fast: about 18ms/char, capped at 1.2s total; skippable by tap). | 1) Branches: **East/West toggle**; cards rearrange with a framer layout animation (`layout` on cards). 2) Tap-to-load maps: the iframe fades in and a **pin drops** (translateY −12px + spring settle) once loaded. 3) FAQ: the existing accordion, unchanged. | **Tile light-up**: letters of the h2 start ink and light up in the phonics colours one by one, then settle to ink (matches the form's tiles). | The same stepper (it is mobile-first). Keyboard opens naturally. The sticky bar hides while the form has focus. | Full form shown (no steps). Message preview shown complete. Maps load on tap with no pin animation. | Low-medium. framer `domMax` lazy, only for the branch toggle. |
| **Global** | **Page transitions** with the logo persisting. | React 19.3 `<ViewTransition>` with `view-transition-name: site-logo` on the logo. **Risk:** no `viewTransition` flag was found in Next 16.4's config types (verify against docs). Fallback: a `TransitionLink` that wraps `router.push` in `document.startViewTransition`; if neither exists, navigation is instant. | Header **active-page indicator** slides between links (`LayoutTabs` indicator logic, 200ms). **Sound-tile scroll progress**: a 3px bar of tiny tile segments under the header on About and Programs (a scroll-driven `scaleX` per segment group). Magnetic/press buttons and drawn link underlines kept as-is. | n/a | No view transition on browsers without support. Indicator works. Progress bar shown. | No view transitions, no indicator slide (it jumps), progress bar hidden. | Low. Scroll-timeline is compositor-driven; the JS fallback is skipped. |

### Proposed alternatives (the user's idea vs. mine)
1. **Home hero: GSAP Flip → CSS scatter-to-place.** Same visual, starts at first paint, 0KB, no hydration dependency. (Flip is for when the end layout differs from the DOM; here it doesn't.)
2. **Special classes: "wheel of the year" / looping conveyor → scroll-scrubbed conveyor (no autoplay).**
   - content.md says only "seasonal". It gives no months, so a year wheel would imply timings we don't have, and rotated chip text is hard to read on a phone.
   - An autoplay conveyor is an infinite loop in a reading area, which breaks the user's own global rule.
   - Instead the chip row translates with scroll position (moves only while the reader scrolls), then rests. The full list is always present as a real `<ul>`.
3. **Teacher Training: "expand on tap" inside a sticky stack → no expansion on desktop.** Expanding a card that is stuck inside a stack changes its height under the sticky offset and makes the stack jump.
   - Each stacked card already shows "For" plus all "Covers" chips (content is short enough).
   - On mobile (no stack) each card has a disclosure.
   - If the user wants an expansion on desktop, the alternative is "tap opens a details sheet over the stack", which is a modal with focus trap.
4. **Coaching flash cards: front = letter-sound ("M m"), not a bare initial.** "E" would repeat for English, English Grammar and EVS. Showing the grapheme in both cases is how phonics cards actually look, and it is more on-brand.
5. **For Schools "workshop flow storyboard" → "what each group takes away" strip.** content.md lists topics per audience but no session order or format. A storyboard implying "first X, then Y" would invent a session format. The strip plays the teacher-track topics in content order as frames ("Understanding phonics → 42 sounds → Blending → …"), with no times or sequence claims. User decision in (f).
6. **Audience selector (Home): must stay crawlable and accessible.** All four panels are in the server HTML. The selector is ARIA tabs; non-active panels use `hidden` but stay in the DOM, and the no-JS / reduced-motion view shows all four stacked. Only the card *frame* uses `layoutId`, so text isn't scaled or distorted during the morph.

### Adjacency check
Confirmed in writing: **no signature technique and no heading treatment repeats between adjacent pages.**

| Pair | Signature technique | Heading treatment |
|---|---|---|
| Home → About | scatter-to-place (CSS) vs pinned horizontal path draw | mask rise vs stroke underline |
| About → Programs | pinned path draw vs grid ripple (WAAPI) | stroke underline vs SoundOut |
| Programs → Coaching | grid ripple vs unpinned scrubbed staircase | SoundOut vs tile flip |
| Coaching → TT | staircase vs sticky stacking cards (scroll-timeline) | tile flip vs clip-path wipe |
| TT → For Schools | stacking cards vs direction-aware tabs | clip-path wipe vs side word slide |
| For Schools → Contact | tabs vs conversational stepper + chat typing | side word slide vs tile light-up |

Pinning appears on Home (learning path, untouched) and About, but About's is horizontal with a path draw, not a step-state machine. Home's *signature* is the hero assembly.

### Rejected candidates (gate: find-animation-opportunities)
- **Mega-menu / mobile nav open animation:** high frequency. Keep the existing quick fade only.
- **Animated FAQ answer text:** functional reading content. Height-only (exists) is enough.
- **Breadcrumbs, footer links, sticky contact bar:** seen on every page and every scroll. Press feedback only.
- **Parallax on more sections:** decoration with no explanation. Kept only where it already exists.
- **Counter "ticking" on the 42 tiles on every revisit:** runs once per page view, never again.

---

## (c) Shared motion toolkit

All files live in `src/components/motion/`.
- Every primitive renders complete server HTML.
- Each arms itself post-hydration via `useReveal`'s contract (A2: in-view/passed → instant, 1.5s watchdog, print/visibility).
- Each honours `prefersReducedMotion()` and exposes `data-motion-done` for tests.

| Primitive | What it does | Engine | Used on |
|---|---|---|---|
| `useReveal` (hook) + `Reveal`/`Stagger` (client leaves) | Shared IO + sweep + watchdog. Fixes A1/A2. | IO + CSS | all |
| `CountUp` (fixed) | Time-based count, guaranteed exact final string | rAF + timers | Home, About, Programs (42) |
| `SoundOut` | Per-letter spans (server-split, `aria-label` on the parent, letters `aria-hidden`); letters appear spaced, then close up | WAAPI | Programs h2s, Home why-choose titles |
| `TileFlip` | Letters flip from blank coloured tiles | CSS `rotateX` + WAAPI | Coaching h2s |
| `StrokeUnderline` | Hand-drawn SVG line pens under the heading | stroke-dashoffset | About h2s |
| `WipeHeading` | `clip-path: inset(0 100% 0 0)` → `inset(0)` | CSS transition | TT h2s, Coaching focus line |
| `WordSlide` | Words slide from a side with a stagger | CSS | For Schools h2s |
| `TileLightUp` | Letters light up in phonics colours, then settle | CSS (colour step on small text only) | Contact h2s |
| `StrokeDraw` | Draws an SVG path once on view (`pathLength="1"`) | CSS/WAAPI | Programs #handwriting, Home railway, About path (with GSAP scrub) |
| `FlipCard` | Two faces with `backface-visibility`; flips on entry once and on tap/Enter; `aria-pressed` toggle; reduced motion shows both faces | CSS 3D | About awards, Coaching subjects |
| `FanPile` | Stacked cards fan out to the list layout | WAAPI from computed offsets | About qualifications |
| `TileRipple` | Grid items enter by distance from the centre | WAAPI | Programs #phonics |
| `SentenceBuilder` | Jumbled tiles → ordered (measure, then transform) → POS colour + label | WAAPI | Programs #grammar |
| `TypeOut` | Types text into a live region; skippable; final text in the server HTML | rAF + timers | Programs #english, Contact bubble |
| `LayoutTabs` | ARIA tabs + sliding indicator (measured transform) + optional direction-aware panel slide | WAAPI | For Schools, Programs anchor nav, header nav, Home selector (tabs only) |
| `SharedMorph` | `LazyMotion` (domMax, async import) + `m.div layoutId` wrapper | framer-motion | Home selector card, Contact branch toggle |
| `PathJourney` | Pinned horizontal (desktop) / vertical (mobile) scrubbed path with milestone pops | GSAP + ScrollTrigger (`matchMedia`) | About |
| `Staircase` | Scrubbed steps + climbing tile | GSAP + ScrollTrigger | Coaching |
| `StackCards` | Sticky stack + scroll-timeline scale-back | CSS | Teacher Training |
| `ScrollConveyor` | Scroll-linked translateX of a chip row, then rest | CSS scroll-timeline, GSAP scrub fallback | Programs #special-classes |
| `TileProgress` | Sound-tile segments as a scroll progress bar | CSS scroll-timeline | About, Programs |
| `Stepper` | One-question-per-step form, tile progress, "show all fields" | React state + CSS | Contact |
| `PageTransition` / `TransitionLink` | View transitions, persistent logo | React `ViewTransition` / `startViewTransition` | Global |

---

## (d) Bundle & performance budget

**Measured from `node_modules/gsap/dist/*.min.js`, gzipped:**

| Module | Size (gz) |
|---|---|
| gsap core | 28.3KB |
| ScrollTrigger | 18.0KB |
| Flip (not used) | 9.7KB |
| MotionPathPlugin (not used) | 9.7KB |
| SplitText (not used; we split on the server) | 3.7KB |
| DrawSVG (not used; we use `pathLength`) | 2.2KB |

framer-motion: `LazyMotion` + `m` about 5KB, async `domMax` about 25KB. These are typical published figures; **verify against docs/bundle analyzer in Task 13.**

| Route | Loads at first paint | Loads lazily (near the scene) | Est. extra JS (gz) |
|---|---|---|---|
| Home | CSS (assembly, bob) | gsap+ST (learning path, exists) ~46KB; framer domMax for selector ~30KB | ~76KB lazy, 0 eager |
| About | CSS | gsap+ST ~46KB (journey) | ~46KB lazy |
| Programs | CSS | gsap+ST ~46KB (learning path); toolkit WAAPI bits <6KB | ~52KB lazy |
| Coaching | CSS | gsap+ST ~46KB (stairs) | ~46KB lazy |
| Teacher Training | CSS only | none | ~2KB |
| For Schools | CSS | none (WAAPI tabs) | ~3KB |
| Contact | CSS | framer domMax ~30KB (branch toggle, on near); Stepper ~4KB | ~34KB lazy |

**Rules:**
- GSAP and framer are never imported statically. They load via the existing `loadGsap()`/`whenNear()` and `LazyMotion features={() => import(...)}`. They are idle-gated, so page load never pays for them.
- No layout reads inside animation frames. Measure once, then animate transforms.
- ScrollTrigger `fastScrollEnd`, and `invalidateOnRefresh` only where needed.
- `will-change` only during an active scene, removed on complete.
- Grain overlays are never promoted on mobile (an existing lesson from the Home pass).

**60fps at 375px, 4× CPU:** a Playwright script uses the CDP `Emulation.setCPUThrottlingRate {rate: 4}`, scrolls each signature scene by wheel at a steady rate, and records frame deltas with an rAF logger.
- **Pass:** ≥ 90% of frames < 16.7ms, and no single frame > 50ms during the scene.
- **Host caveat:** this host is an AMD A6 (benchmark ~640), so 4× here is roughly 10–12× a mid-range phone. A scene that fails here is simplified only if it also shows long tasks > 50ms in the trace. Otherwise it is noted as host-bound.
- Anything that genuinely drops frames is simplified, for example the About pin falling back to the vertical version.

**Lighthouse 95+ (mobile):**
- Eager JS doesn't grow: every engine is lazy.
- LCP stays the hero h1 (painted on the first frame; the assembly tiles are not the LCP element).
- CLS is 0: all moments animate transforms over reserved boxes.
- Local runs are indicative only. **The real gate is PageSpeed Insights on a Vercel preview.**
- Note: preview deploys are noindexed (Fix 4), so PSI's SEO category will fail `is-crawlable` on any preview. Judge SEO on the production deploy, or ignore that single audit on preview.

---

## (e) SEO phase plan

**Base:**
- `metadataBase` already comes from `SITE_URL` ([site.ts](src/lib/site.ts)): `NEXT_PUBLIC_SITE_URL`, else `VERCEL_PROJECT_PRODUCTION_URL`, else localhost.
- Recommend setting `NEXT_PUBLIC_SITE_URL` in Vercel once the domain is decided (this corrects the earlier "no env vars needed" answer: it's optional, but canonicals and OG URLs depend on it).
- Canonical per page via the existing `pageMetadata()`.

**JSON-LD** (existing `JsonLd` component; one `@graph`, stable `@id`s):

| Where | Types |
|---|---|
| Root layout (every page) | `EducationalOrganization` (`#org`): name, logo, telephone, `sameAs` (TODO: socials), `founder` → `#revathi`, `location`: [`LocalBusiness` Om Dubey Dham (East), `LocalBusiness` Chinchpada (West), `Place` Vadavali at Little Champs Playschool, `Place` Nisarg Green at Flying Bird Preschool]. Addresses from branches.ts; pincodes are TODO, so omit `postalCode` until they're known. |
| /about | `Person` (`#revathi`): `jobTitle`, `hasCredential` (the qualifications), `award` (3 awards, verbatim), `memberOf` (Inner Wheel Club of Ambernath, Rotary Club of Ambernath East), `worksFor` `#org` |
| /contact | `FAQPage` (the full FAQ rendered there; one FAQPage per site, to avoid duplicates on /coaching's subset) |
| Every non-home page | `BreadcrumbList`, from the same `trail` the visible `Breadcrumbs` uses |

**Sitemap and robots:**
- `src/app/sitemap.ts`: `/`, /about, /programs, /coaching, /teacher-training, /for-schools, /contact.
- `/gallery` is included only when `galleryHasPhotos()`.
- `/styleguide` is never included, and gets `robots: { index: false }` metadata.
- `robots.ts` points to the sitemap in production; it stays disallow-all on previews (exists).

**OG image:** `src/app/opengraph-image.tsx` (`next/og`, 1200×630): brand red/teal field, the phonics-colour tiles spelling "Phonics" (our own drawing), name and "Ambernath". Per-page `opengraph-image` only for /about and /teacher-training (the most-shared), with page title text.

**llms.txt:** `src/app/llms.txt/route.ts` (static GET) generated from `src/content/`. It contains the name, what's taught, the four branches, the WhatsApp/phone and links to each page, with no TODO strings. It is served on previews too (harmless, since previews are noindexed).

**Tests:**
- `tests/unit/sitemap.test.ts`: gallery excluded when there are no photos, styleguide never present.
- `tests/unit/jsonld.test.ts`: the graph has 2 `LocalBusiness` + 2 `Place`, Person awards equal content, and there are no TODO strings in JSON-LD.

---

## (f) Build order

Each task ends with its done-check and a local commit.

1. **Part A fixes.**
   - Steps:
     - Add `useReveal` (shared IO + sweep + watchdog + print/visibility); make `Reveal`/`Stagger`/`SectionHeading`/`Panel` layer client leaves.
     - Strip `MotionRoot`'s page-wide query.
     - Rewrite `CountUp`'s final-value paths.
     - `@media print` reveal.
   - Tests (`tests/unit/reveal.test.tsx`, `tests/unit/countup.test.tsx`): "shows in-view and scrolled-past nodes on arm", "watchdog forces end state at 1500ms", "beforeprint reveals all", "unmount/hidden/passed → exact `4,500+`".
   - **Done:**
     - Vitest green.
     - Clean-profile probe on all 8 pages: 0 hydration errors × 3 loads.
     - No-scroll and jump captures: 0 hidden nodes.
     - Counters exact after jump, fling and background.
   - **Commit:** `fix: reveal hydration race, hidden-content failsafe, exact CountUp`.
2. **Toolkit core.** `LayoutTabs`, `FlipCard`, `TypeOut`, `StrokeDraw`, `SoundOut`, plus the heading treatments (`StrokeUnderline`, `TileFlip`, `WipeHeading`, `WordSlide`, `TileLightUp`).
   - Unit tests for keyboard behaviour (tabs: arrows, Home/End; flip: Enter/Space, `aria-pressed`) and for reduced-motion output (both faces / full text present).
   - Styleguide page shows each primitive.
   - **Done:** tests green; styleguide 375px screenshot.
3. **Global.** `TransitionLink`/`ViewTransition` with the persistent logo, header active indicator, `TileProgress` (About, Programs).
   - **Done:** a back/forward probe leaves no hidden nodes; the logo stays fixed during the transition (GIF); no errors in browsers without View Transitions (Firefox Playwright run).
4. **Home.**
   - Moments: scatter-to-place hero (+ tap hop) and SoundOut why-titles.
   - Audience selector: `LayoutTabs` + `SharedMorph`.
   - Railway branches.
   - Learning path untouched.
   - **Done:** 375px screenshot + hero/selector GIF; all 4 audience texts present in the server HTML (curl grep).
5. **About.**
   - Moments: `PathJourney`, `ReadAloud` quote, `FanPile` qualifications, `FlipCard` awards, `StrokeUnderline` h2s.
   - **Done:** 375 screenshot + journey GIF; reduced motion shows all 7 milestones and both award faces.
6. **Programs.**
   - Moments: `TileRipple` + 42 `CountUp`, `SentenceBuilder`, `TypeOut` bubble, `StrokeDraw` handwriting, `ScrollConveyor`, `LayoutTabs` anchor nav, `SoundOut` h2s, `TileProgress`.
   - **Done:** 375 screenshot + one GIF per demo (5 short); the anchor indicator tracks the section in view.
7. **Coaching.**
   - Moments: `Staircase`, `FlipCard` subjects (letter-sound front), `TileFlip` h2s, `WipeHeading` focus line.
   - **Done:** 375 + stairs GIF; reduced motion shows 9 steps.
8. **Teacher Training.**
   - Moments: `StackCards` with no desktop expansion (per alternative 3), a disclosure on mobile, the calm ARPAN fade, `WipeHeading` h2s.
   - **Done:** 375 + stack GIF (1440 recorded here because the stack is desktop-only); ARPAN has no transform animations (computed-style check).
9. **For Schools.**
   - Moments: `LayoutTabs` with direction-aware panels, the takeaways strip, `WordSlide` h2s.
   - **Done:** 375 + tabs GIF; keyboard arrows switch tabs and focus follows.
10. **Contact.**
    - Run `cro` first and fold its findings into the stepper copy and order.
    - Moments:
      - `Stepper` + tile progress + chat bubble `TypeOut` + Send.
      - "Show all fields".
      - No-JS plain form (see Q4).
      - East/West branch toggle (`SharedMorph`), pin-drop maps, `TileLightUp` h2s.
    - **Done:**
      - 375 + stepper GIF.
      - With JS disabled the form submits to a working `wa.me` URL.
      - The opened URL text matches the answers (unit test on the message builder).
11. **Gallery.** Shared reveals only, with `StrokeUnderline` h2s. In nav order it sits between For Schools (`WordSlide`) and Contact (`TileLightUp`), so neither neighbour is repeated. It stays out of nav and sitemap.
    - **Done:** 375 screenshot.
12. **SEO phase** per (e).
    - **Done:** sitemap/JSON-LD tests green; each page's JSON-LD parses and has the required fields per type (unit test); `curl /sitemap.xml`, `/robots.txt`, `/llms.txt`, `/opengraph-image` → 200.
13. **End batch (STEP 3, once for all pages):**
    - review-animations + improve-animations + impeccable passes (fix, and list the findings), animation-performance + gsap-performance check (4× throttle script).
    - Reduced-motion audit, 1440px screenshots, the clean-profile hydration probe on all 8 pages, a resize-across-1024px probe.
    - One `npm run build`, `npm test`, `npm run typecheck`, `npm run lint`, mobile Lighthouse per page (caveated).
    - Update MORNING-REPORT.md with GIF paths and findings, run verification-before-completion, commit, **STOP**. No push.

## Open questions & risks (need the user's decision)
1. **42 sound tiles: show letters or not?** content.md states "42 letter sounds" but doesn't list them. Default: the 42 tiles show only the graphemes already named in content.md (s, a, t, ck, digraph examples…), and the rest are blank phonics-colour tiles. Alternative: Tr. Revathi supplies the list of 42 to show.
2. **Illustrative example text** in the Programs demos is not a "fact", but it is new copy. Approve, or supply her own examples:
   - grammar sentence: "The dog runs fast";
   - English bubble: the four skills from content.md typed as "Reading · Writing · Speaking · Comprehension";
   - handwriting letter: "a".
3. **For Schools storyboard → "takeaways strip"** (alternative 5). OK to drop the session-format storyboard?
4. **No-JS enquiry fallback.** Default: a GET form posting a single prefilled `text` textarea to `https://wa.me/919022582988` (zero backend). Alternative: a stateless `/enquire` route handler that 303-redirects with all fields composed. That route is technically a serverless function; CLAUDE.md says "no backend".
5. **View transitions risk:** React 19.3 `ViewTransition` is present, but no Next 16.4 config flag was found (context7 was unavailable to confirm). If Next doesn't trigger it on client navigation, we use the `startViewTransition` link wrapper. Firefox gets instant navigation.
6. **Teacher Training expand-on-tap dropped on desktop** (alternative 3). OK?
7. **Hero via CSS instead of GSAP Flip** (alternative 1). OK?
8. **Frame-rate gate on this host** is pessimistic (AMD A6). OK to treat "host-bound with no long tasks" as a pass?
9. **`high-end-visual-design`** can't be model-invoked. Run `/high-end-visual-design` yourself if you want its pass included.
10. **`NEXT_PUBLIC_SITE_URL`**: set it in Vercel when the domain is chosen. Until then, canonicals and the sitemap use `VERCEL_PROJECT_PRODUCTION_URL`.
