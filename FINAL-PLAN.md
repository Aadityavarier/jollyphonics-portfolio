# Final Stretch: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (the user chose native execution). Work through the tasks in order and commit after each one. Log every decision in `.superpowers/sdd/PLAN/progress.md`. Steps use checkbox (`- [ ]`) syntax. Run superpowers:verification-before-completion before the final STOP.

**Goal:**
- Make Home the strongest page on the site: a "showroom" where each section is a live preview of the best moment on the page it leads to.
- Fill the empty PageHero column.
- Close out the redesign with real skill audits, probes and the quality gate.
- Leave the repo ready to deploy (no push).

**Architecture:**
- Server HTML stays complete and readable. Motion attaches after hydration through the existing reveal engine (`armReveal`).
- New Home moments are CSS keyframes switched on by one shared play-in-view attribute (`data-play`). They are not more client components. The two exceptions are the hero word board and the final-CTA bubble: these are small client leaves.
- GSAP stays lazy (only the existing learning path uses it on Home). framer-motion stays lazy (only the existing audience selector uses it).

**Tech stack:** Next 16.4.2 (App Router, `cacheComponents`), React 19.3, Tailwind 4, gsap 3.15 (lazy), framer-motion 14.6 (lazy, `LazyMotion`), Vitest 5 + jsdom, playwright-core from the global `@playwright/cli` install.

**Spec:**
- The user's "Final stretch" message (Workstreams 1–5 + PROCESS).
- [REDESIGN-PLAN.md](REDESIGN-PLAN.md): constraints, toolkit, §(e) SEO.
- [PLAN.md](PLAN.md): Task 18 and §2 Home intent.
- [CLAUDE.md](CLAUDE.md), [content.md](content.md).

## Global constraints
- `content.md` is the only source of facts. Illustrative UI words (the board's words, "hello", the letter-name demo) are listed in (f) for approval. Nothing else is new.
- No Jolly Learning artwork or characters, and no letters on the 42-sound tiles. Every tile, stamp and stroke is our own drawing.
- Animate only `transform`, `opacity`, `clip-path` and `stroke-dashoffset`.
- Idle motion stops within 5s. No infinite loops in reading areas, no autoplaying sound, no custom cursors.
- Every moment has three versions, all fully readable:
  - mobile (no pinning below 1024px; tap, not hover);
  - reduced motion: static, complete;
  - no JS: static, complete, and the WhatsApp/Call links work.
- Home h1 text is the LCP element. It paints on the first frame with no opacity, clip or offset animation. No JS runs before first paint, and no GSAP or framer loads above the fold.
- Home's eager JS grows by at most ~8KB gz in total. Everything below the fold is lazy, off-screen animation pauses, and CLS stays ~0 (every moment animates inside a reserved box).
- No two neighbouring Home sections share a background (paper / surface / red / teal / ink / calm).
- Home previews are smaller and lighter than the originals: CSS-only miniatures, not imports of the full demo components.
- Don't redesign other pages beyond Task 11 (PageHero) and audit fixes.
- Commits are local only, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push.
- Use the running dev server (`http://localhost:3001`). Run exactly one production build, in Task 14.
- Probe scripts live in `scripts/probes/` and are committed. Screenshots and GIFs go to `.screens/` (gitignored, see decision D5).

## Review focus
These are the failure modes most likely to reach a real visitor without any single task's test catching them:
1. **The Home fold at 375×667 and 1366×768.** The h1, the trust line (20+ / 4,500+ / 2001) and the WhatsApp CTA must be fully visible without scrolling, with the sticky bar showing on mobile. This is pinned by a fold probe in Task 3 and re-run in Task 14.
2. **The hero word board on touch and keyboard.** A double tap, a tap during the auto-demo, or Tab/Enter/Backspace must not leave a half-built word or a stuck animation. Pinned by the `word-board` unit tests in Task 3: tapping during the demo cancels it, and Backspace removes the last tile.
3. **Previews off-screen.** A bento preview scrolled away mid-animation must pause, and must not leave tiles mid-transform when it comes back. Pinned by the `play-in-view` tests in Task 2 and the jump-to-bottom probe in Task 13.
4. **Reduced motion on new Home moments.** Board, names-vs-sounds, stamp, bento and hello-to-bubble must all show their end state. Pinned by a reduced-motion snapshot test per component (Tasks 3–9) and the probe in Task 13.
5. **JS off on Home.** The final CTA bubble must show the full message, the board must show its "cat" example, the selector's four panels must stack, and the bento tiles must stay plain links. Pinned by the no-JS probe in Task 14.

---

## (a) Workstream 1 results so far (read-only, 2026-10-23, dev server :3001)

| Check | Result | Evidence | Action |
|---|---|---|---|
| `/styleguide` shows each toolkit primitive | **Partial** | It shows `FxHeading` (all 6 fx), `FlipCard`, `TypeOut`, `StrokeDraw` and `LayoutTabs` ([styleguide/page.tsx:266-300](src/app/styleguide/page.tsx#L266-L300)). Missing: `CountUp`, `FanPile`, `ReadAloud`, `SharedMorph`, `TileProgress`. | Task 1 adds them. Tasks 2–9 add the new Home primitives. |
| Programs special-classes conveyor matches `ScrollConveyor` | **Matches intent, one gap** | CSS `animation-timeline: view()` moves alternating chips ±4.5rem and then they rest ([fx.css:834-852](src/app/fx.css#L834-L852)). It moves only while scrolling, and the list is a real `<ul>`. Gap: there is no GSAP scrub fallback, so browsers without scroll timelines show a static list. | Decision D6: accept the static fallback. Task 1 checks it is inside `@supports`. |
| For Schools "takeaways strip" | **Pass** | `Tracks.tsx`: each track's topics are frames in content order, with no times or sequence arrows. Without JS all three panels stack. | None |
| ARPAN has no transform animations | **Pass** | Computed check on `#arpan` and all its descendants: no animation or transition on transform, translate, scale or rotate. Reveal variant is `calm` (opacity only). | None |
| All 4 audience panels are in Home's server HTML | **Pass** | `curl /`: 4 `role="tabpanel"` elements, 3 of them `hidden=""`. The `noscript` CSS shows them stacked. | None |
| SEO endpoints return 200 | **Pass** | `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/opengraph-image`, `/about/opengraph-image` and `/teacher-training/opengraph-image` all return 200 with the right content type. `robots.txt` is `Disallow: /` in dev, which is by design for non-production. The sitemap uses `http://localhost:3000` (the `SITE_URL` fallback). | Task 14 re-checks on the production build. |
| JSON-LD matches §(e) | **Pass, validator pending** | Every page has `EducationalOrganization` `#org` with 4 location refs (2 `LocalBusiness` + 2 `Place`) and no `sameAs`. `/about` has `Person` `#revathi` (3 awards, 2 `memberOf`, 5 credentials). `/contact` has `FAQPage` (7 items, and it's the only one). Inner pages have `BreadcrumbList`. No TODO strings. | Task 1: paste into validator.schema.org (needs network). |
| Page transitions: back/forward hidden-node probe | **Pass** | In Chromium, Home → About (nav click) → back → forward leaves 0 hidden on-screen nodes and 0 console errors. | None |
| Page transitions: no-support fallback | **Not testable as written** | Firefox now has `document.startViewTransition` (`typeof` returns `function`), so a Firefox run no longer exercises the fallback. Firefox nav to /programs works with 0 errors. | Task 1: Chromium probe with `startViewTransition` deleted via `addInitScript`. |
| *(extra)* TODO.md vs `todo()` ids | **Correction (Task 14): no mismatch** | `photo-consent` is declared across several lines in `gallery.ts`, which my one-line grep missed. TODO.md already matched all 10 ids. | None |
| *(extra)* False alarm, recorded so it isn't re-chased | — | A first probe reported Home's and Programs' final CTA as hidden. The cause was the pinned learning path growing the page while my script scrolled, so it never reached the CTA. With the corrected probe, everything is visible. The only "hidden" nodes are the learning path's inactive steps, which is by design. | Probe scripts re-measure height on each step (`scripts/probes/`). |

## (b) Home diagnosis

Sources: `.screens`-style captures in the session scratchpad (`diag/home-375-full.png`, `home-1440-full.png`, `about-1440-full.png`, `programs-1440-full.png`, `teacher-training-1440-full.png`, plus fold shots).

1. **Seven of ten sections share one template:** heading + paragraph + a list or cards. Why-reading, who, branches, founder, why-us, teachers & schools and FAQ all read as "text block, then stuff". About, Programs and Teacher Training instead each give every section its own shape (path, pile, flip cards, sound wall, stack).
2. **The hero's right half is mostly empty at 1440.** The red "Phonics" box is about 290px tall in a column next to about 720px of text. Its only content is a decorative tile row plus a TODO marker. The tiles say "phonics" but don't *do* phonics. At 375 the same tile row costs about 50px of fold for decoration.
3. **The one real phonics interaction is buried.** The c–a–t blend is a small card with a button, in section 2. The Contact and Programs demos are richer than Home's.
4. **It goes flat after the learning path.** On mobile, from "Is it right…" through the FAQ (about 5,500px at 375), there is no moment. On both the 1440 and 375 captures, Founder is a text column with two lists, and Why-us is a long list of 8 small items with tiny tile dots (at 375 it is the longest flat stretch on the site).
5. **Neighbouring sections share a background.** Who (paper) and Branches (paper, `pt-0`) merge into one long paper block, so the page loses its rhythm right where a parent is deciding.
6. **Nothing on Home previews the other pages.** The sound wall, sentence builder, staircase, TT stack and Contact bubble exist only on their own pages. The only routes onward are the "Teachers and schools" ink band (two plain cards) and nav links.
7. **The FAQ wastes its column.** At 1440 it uses a `1fr/2fr` grid with a sticky heading, which leaves a tall empty left column. The final CTA band is a generic band shared with every other page, so it isn't memorable.
8. **Density is uneven.** The page is 10,221px tall at 375: the longest on the site, but with the fewest moments.

## (c) Home: section-by-section plan

### Section order and backgrounds

| # | Section | Background | Kind |
|---|---|---|---|
| 1 | Hero | paper | interactive (the site's best moment) |
| 2 | "My child knows the alphabet…" | red | one small explaining moment, mostly reading |
| 3 | Learning path (untouched) | surface | scroll scene, the benchmark |
| 4 | Trainer Revathi | teal | breathing, plus one stamp moment |
| 5 | "Is it right for my child?" | paper | decision tool |
| 6 | Inside the classes (bento) | ink | live previews, the busiest section |
| 7 | Branches | paper | breathing (the railway draws once) |
| 8 | Why parents choose us | surface | typographic, scannable |
| 9 | FAQ | paper | breathing |
| 10 | Final CTA | red | closing moment |

No neighbours share a background. The gallery preview stays hidden until photos exist; when it appears it goes between 8 and 9 on `ink`.

**Why this order:**
- **1–3 answer Q1, "what is phonics?"** The hero lets you *do* it, red *explains* it, the path shows the *method*.
- **The Trainer moves up, right after the path.** A referred parent has just seen the method, so "who teaches it" is the natural next question. Putting a calm section here means the learning path has quiet neighbours (the user's "must not compete" rule).
- **5 is Q2, the decision tool.** It comes before the showroom, so the bento previews read as "here's what your child would do".
- **6 is the showroom.** It replaces the old "Teachers and schools" band: TT and Schools become bento tiles.
- **7 is Q3, "where?"** 8–10 summarise, answer doubts and convert.
- **Pacing:** every interactive section is followed by a calmer one (1→2 small, 3→4 calm, 5→6 busy, 6→7 calm), and there is one moment per screen height.

### Section specs
"Engine" names the technique. "Cost" is the extra JS gz over today.

**1. Hero (paper).** Purpose: first impression, credibility and conversion in one screen.
- **Source:** `home.hero`, `founder.knownAs`, `founder.credential`, `brand.numbers`, `contact.status`, `messages.general`.
- **Layout:** left column as today: h1, sub-line, Trainer line with credential, `TrustStats`, WhatsApp + Call. The h1's first word "Phonics" is set as 7 sound tiles *inside* the h1. The plain word is in an `sr-only` span and the tiles are `aria-hidden`. This removes the separate decorative tile row.
- **Right column (≥1024px): the `WordBoard`.**
  - A card with 3 empty slots and a tray of 7 letter tiles (c a t s p n i).
  - Tapping a tile (or Tab+Enter) sends it to the next slot. When the 3 slots spell a word on the list, the tiles slide together (the blend) and the word appears beneath as "c – a – t → cat".
  - Backspace or tapping a placed tile returns it. "Clear" resets the board.
  - Once, about 1.2s after load, it plays one auto-demo (c, a, t fly in and blend) followed by the prompt "Your turn: tap a sound". Any tap cancels the demo.
  - It's a client leaf hydrated after paint. Its markup is server-rendered, with the "cat" example already in the slots.
- **Mobile:** the h1 tiles are the moment. The fold is unchanged apart from about 50px freed. The board sits directly below the status line, just under the fold, as a compact card.
- **Engine:**
  - h1 tiles: a CSS sound-out from first paint. Tiles start spread apart (`translateX` gaps, always opacity 1), then close up over 700ms. Tap hop and pointer lean are reused from `HeroTiles`.
  - Board: React state, plus WAAPI transforms (FLIP from tray to slot).
- **Reduced motion:** h1 tiles at rest; the board works with instant moves and no demo.
- **No JS:** the board shows its static "cat" example plus the line "c – a – t → cat"; tray tiles are inert.
- **Cost:** board about 3KB. h1 tiles are CSS only.
- **Fold checks:**
  - 375×667: h1, credential, three stats and WhatsApp visible above the sticky bar.
  - 1366×768: h1, stats and both CTAs visible. Tighten the h1 clamp if needed.

**2. "My child knows the alphabet. Why is reading still difficult?" (red).** Purpose: answer Q1 by showing the difference parents feel but can't name.
- **Source:** `parents.question`, `parents.answer`, `parents.example` (`c`, `a`, `t` → `cat`), `messages.phonicsSuitability`.
- **Layout:** question and answer on the left. On the right, a two-state demo with a segmented toggle, **Letter names | Letter sounds**:
  - *Names:* the tiles show `C` `A` `T`, spaced apart with a dotted gap. The line beneath reads "C · A · T … ?" and the tiles don't join.
  - *Sounds:* the tiles turn lowercase `c` `a` `t`, slide together, and the line reads "c – a – t → cat".
- **Behaviour:** it auto-plays names → sounds once on view, then waits for taps. It replaces the current "Blend the sounds" button card.
- **Engine:** CSS state on `data-mode`, with `transform` transitions (letter-case swap is a cross-fade of two stacked glyphs).
- **Mobile:** the same, stacked under the text.
- **Reduced motion:** both states shown side by side, statically.
- **No JS:** the sounds state, plus the toggle hidden.
- **Cost:** about 1KB; it replaces `SoundBlend`.

**3. Learning path (surface).** Untouched (`LearningPathScene`).

**4. Trainer Revathi (teal).** Purpose: a high-trust moment.
- **Source:** `founder` (knownAs, credential, belief, awards ×3, qualifications titles), `journey` (7 milestones, all from content.md).
- **Layout (desktop two columns):**
  - **Left:** a circular **seal**, an SVG `textPath` ring reading "INTERNATIONALLY CERTIFIED JOLLY PHONICS TRAINER • CPD COLLEGE UK, LONDON •" around a centre "Trainer Revathi" with "since 2001". It is our own typographic stamp: no Jolly or CPD logo. Below it, the belief quote.
  - **Right:** a **journey teaser**, a ruled horizontal line 2001 → 2017 → 2023 → 2025. Four dated dots with one-line titles, taken from `journey` (first, Inner Wheel join, first award, final). Then the 3 awards as compact year-badged rows, the qualification titles as one chip line (M.A. · M.Com · D.El.Ed · ECCEd · CTET), and the "Her full journey" link to `/about`.
- **Engine:**
  - Seal: a stamp press on entry (scale 1.12→1, rotate −10°→−4°, opacity 0→1, 420ms spring-ish ease, then rest).
  - Journey line: `StrokeDraw` once, with the dots popping in at their offsets.
- **Mobile:** the seal (about 180px) sits above the text; the journey becomes a vertical 4-row list with the same draw.
- **Reduced motion:** seal at rest; line fully drawn.
- **No JS:** static.
- **Cost:** CSS plus the existing `StrokeDraw` (about 0.5KB).
- **Photo slot:** see decision D2.

**5. "Is it right for my child?" (paper).** Purpose: the parent's main decision tool.
- **Source:** as today (`WhoIsItFor` LEARNERS, `faq[0]`).
- **Layout:**
  - The heading is followed by a sentence-style prompt: "Who is learning?", with the four tabs as large choice chips. Tabs are thumb-sized on mobile and scrollable.
  - The card becomes a two-part answer: on the left, what they'd learn (title + text + program chips from content); on the right, a primary WhatsApp button with the audience's own message ("Ask about this on WhatsApp") and the page link.
  - Image slot H3–H6 only when its photo exists; no dev placeholder box on Home (the TODO marker stays).
- **Engine:** the existing `AudienceSelector` (framer layout morph, lazy) and direction-aware panel slide.
- **Mobile, reduced motion, no JS:** as today (stacked panels with no JS, instant under reduced motion).
- **Cost:** 0 new.

**6. Inside the classes: programs showcase bento (ink).** Purpose: let parents feel each page's quality, and click through.
- **Source:** `programs.*.title`, `coaching.range`, `teacherTraining` course titles, `schools.intro` (titles only, plus one short line each from content).
- **Layout:**
  - Desktop: a 4-column bento.
    - **Phonics, 2×2:** a mini 42-tile ripple (7×6 small tiles, no letters) with "42 sounds", linking to `/programs#phonics`.
    - **Grammar, 2×1:** 4 word tiles drop jumbled and snap into "The dog runs fast", linking to `/programs#grammar`.
    - **English, 1×1:** a bubble types "Reading · Writing · Speaking", linking to `/programs#english`.
    - **Handwriting, 1×1:** an "a" pens itself on 3 guide lines, linking to `/programs#handwriting`.
    - **Coaching, 1×1:** 9 mini steps rise with a tile hopping up three of them, labelled "Sr. KG → Std. 8", linking to `/coaching`.
    - **Teacher training, 1×1:** 3 mini cards stack, each scaling back, labelled Phonics TT / ECCEd / Montessori, linking to `/teacher-training`.
    - **For schools, 2×1:** 3 tabs (Teachers / Students / Parents) with the indicator sliding across once, linking to `/for-schools`.
  - Mobile: 2 columns. Phonics spans 2, Grammar and Schools span 2, the rest are 1.
  - Each tile is one `<a>`. Its accessible name is the title; the preview is `aria-hidden`.
- **Engine:**
  - Pure CSS keyframes under `[data-play]`. The attribute is set by a shared `usePlayInView` (IO at ≥50% visible) and removed when off-screen, which resets the tile.
  - Each preview runs once per entry (under 3.5s). Hover or focus replays it on fine pointers.
  - Off-screen tiles have no running animations (`animation: none` without `data-play`).
- **Mobile:** same previews, smaller.
- **Reduced motion:** every preview is shown at its end frame.
- **No JS:** end frames, plus links.
- **Cost:** about 1KB (one hook, one observer). Previews are CSS.
- **Removes:** the `AudienceTeasers` section.

**7. Branches (paper).** Purpose: Q3.
- **Source:** `branches`, `contact.timingsLine`.
- **Layout:**
  - The header shrinks to one line plus the timings line.
  - East and West become two columns divided by the existing railway line. West sits in the right column with its own marker; on mobile it is stacked.
  - Cards stay identical (the `BranchCard` parity test stays green).
- **Engine:** existing (railway stroke + marker drop).
- **Cost:** 0.

**8. Why parents choose us (surface).** Purpose: scannable credibility without a card grid.
- **Source:** `why.points` (8).
- **Layout:** an "exercise book" ruled list.
  - Each point is one row on a faint ruled guide line: a numbered sound tile (1–8), the title set large in display type, and the detail on the right. On mobile the detail sits under the title.
  - Where the detail holds a number (20+, 4,500+), the number is set large inline.
  - Two columns of four rows at ≥1024px; one column on mobile, at about half the current height thanks to tighter rows.
- **Engine:** the ruled lines draw left to right as the list enters (`scaleX` from the left, staggered 60ms); titles keep `SoundOut`.
- **Reduced motion and no JS:** static.
- **Cost:** 0 (CSS + existing FxHeading).

**9. FAQ (paper).**
- **Source:** the existing 5 questions.
- **Layout:** single column, `max-w-[48rem]`, heading above (no sticky 1fr/2fr). A "More answers" link to `/contact#faq`.
- **Engine:** the existing accordion.
- **Cost:** 0.

**10. Final CTA (red).** Purpose: a memorable close.
- **Source:** `messages.general`, `contact.line`, `brand.tagline`.
- **Layout:** five tiles spell "hello". On view, they gather into the bottom-left corner of a WhatsApp-style chat bubble, which grows from that corner. The bubble types the prefilled `messages.general`. Below it sit "Send on WhatsApp" (primary) and Call.
- **Bubble styling:** reuses the Contact bubble (`enq-bubble` + `TypeOut`, speed 22, maxMs 1400).
- **Engine:** tiles use WAAPI transforms toward a measured point (one measure, then transforms); the bubble uses `scale` from `transform-origin: bottom left`; then `TypeOut`. The bubble's box is reserved, so CLS is 0. Tap skips the animation.
- **Mobile:** same.
- **Reduced motion:** tiles and the full bubble shown statically.
- **No JS:** full bubble text, plus links.
- **Cost:** about 1.5KB. `TypeOut` is already in the Contact chunk; Home gains it.

### Home JS budget
- **Today:** eager = layout shell + `HeroTiles` + `AudienceSelector` shell + `SoundBlend` + reveal leaves. Lazy = GSAP+ScrollTrigger about 46KB (learning path, near) + framer domMax about 30KB (selector, near).
- **After:**
  - Adds `WordBoard` about 3KB, `usePlayInView` about 1KB, `ChatHello` about 1.5KB, names-vs-sounds about 1KB.
  - Removes `SoundBlend` (about 1KB).
  - Net eager change: **about +5.5KB gz, inside the 8KB cap.**
- **Lazy:** unchanged.
- **Verification:** `next build` route output in Task 14, compared against the sizes logged at the start of Task 2. The baseline comes from `.next` dev chunk sizes, so it is indicative only, given one-build-at-end. If Home exceeds the cap, cut in the order from (f).

## (d) PageHero fix

- **Component:** `<HeroTileArt word="read" />`. It renders a loose cluster of sound tiles spelling the word.
  - Tiles reuse `PHONICS_TILES` colours and the `HeroTiles` resting angles.
  - They sit in a soft `surface` rounded field (`--radius-panel`) the height of the hero's text column, with 2–3 faint oversized tiles in the background for depth.
  - It is `aria-hidden` and purely decorative.
- **Words:** Programs "read", Teacher Training "teach", Contact "hello" (D3).
- **Entrance:** a CSS tile drop from first paint (translateY −0.6em + rotate, staggered 60ms, opacity always 1), then rest. No idle loop. Tiles hop on tap.
- **Reduced motion and no JS:** at rest.
- **Wiring:** a new prop on `PageHero`, `art?: string`, rendered only when `!slot`. If both are set, `slot` wins.
- **Mobile (<768px):** not rendered (`hidden md:grid`). It adds no height above the content (D7).
- **Adjacency:** a tile *drop* is distinct from every page's heading fx and from Home's sound-out.

## (e) Tasks (execution order)

### Task 1: Workstream 1 fixes and probe scripts
**Files:**
- Create: `scripts/probes/{lib.cjs,hidden.cjs,ws1.cjs}`. `lib.cjs` exports `launch()`, `slowScrollToBottom(page)` (re-measures `scrollHeight` each step) and `hiddenOnScreen(page)` (excludes `.path-word`, `.path-detail` and `[hidden]`).
- Modify: `src/app/styleguide/page.tsx` (add `CountUp`, `FanPile`, `ReadAloud`, `SharedMorph` via a 2-tab mini selector, and `TileProgress`).
- Possibly modify: `src/app/fx.css` (wrap `.conveyor` in `@supports (animation-timeline: view())` if it isn't already).

- [ ] **Step 1:** Add the probes. Run `node scripts/probes/ws1.cjs`. Expected: ARPAN "none"; back/forward 0 hidden; with `startViewTransition` deleted via `addInitScript`, nav Home → Programs changes URL with 0 errors and 0 hidden.
- [ ] **Step 2:** Add the missing styleguide primitives. Screenshot `/styleguide` at 375.
- [ ] **Step 3:** In Firefox, check `/programs#special-classes` renders all chips at full opacity (static fallback).
- [ ] **Step 4:** Paste the `/`, `/about` and `/contact` JSON-LD into validator.schema.org (and the Rich Results Test if reachable). Expected: 0 errors. Log warnings in progress.md.
- [ ] **Step 5:** `npm test`, `npm run typecheck` and `npm run lint` green. **Commit** `chore: ws1 probes, styleguide primitives, view-transition fallback check`.

### Task 2: Home foundations (play-in-view, tile word, section tones)
Skills: design-taste-frontend, emil-design-eng, animation-vocabulary (load before designing Tasks 2–10).

**Files:**
- Create:
  - `src/components/motion/usePlayInView.ts`
  - `src/components/blocks/TileWord.tsx`, extracted from `HeroTiles`: `{ text, angles?, scatter?, interactive?, className }`.
  - `src/content/home-sections.ts`, exporting `HOME_SECTIONS: { id: string; tone: SectionTone }[]` in the (c) order.
  - `tests/unit/home.test.tsx`
- Modify: `HeroTiles.tsx` (becomes a thin wrapper over `TileWord`).

**Interfaces:** `usePlayInView(ref: RefObject<Element>, opts?: { threshold?: number }): void`. It sets `data-play` when ≥ threshold visible (default 0.5) and removes it when fully out of view. It never sets `data-play` under reduced motion; instead it sets `data-static`.

- [ ] **Step 1: Failing tests:**
  - `usePlayInView` sets `data-play` on intersect, removes it on exit, and sets `data-static` (not `data-play`) under reduced motion. Uses a mocked IO.
  - `HOME_SECTIONS` has no two neighbouring entries with the same `tone`.
  - `TileWord` renders one `sr-only` text plus N `aria-hidden` tiles.
- [ ] **Step 2:** Run `npx vitest run tests/unit/home.test.tsx`. Expected: FAIL.
- [ ] **Step 3:** Implement. Record baseline Home chunk sizes from the dev server's network panel in progress.md.
- [ ] **Step 4:** PASS. **Commit** `feat(home): play-in-view hook, shared TileWord, section tone map`.

### Task 3: Home hero (tiles in the h1, WordBoard)
**Files:**
- Create: `src/components/home/WordBoard.tsx`, `src/lib/word-board.ts`, `scripts/probes/fold.cjs`
- Modify: `HomeHero.tsx`, `src/content/home.ts`, which adds:
  - `board: { letters: ["c","a","t","s","p","n","i"], words: [...], example: "cat", prompt: "Your turn: tap a sound" }`, with the words subject to D1;
  - the hero-word split (`titleTileWord: "Phonics"`).
- Test: `tests/unit/word-board.test.ts(x)`

**Interfaces:**
- `matchWord(slots: readonly string[], words: readonly string[]): string | null`
- `nextSlot(slots: readonly (string|null)[]): number` (−1 when full)

- [ ] **Step 1: Failing tests:**
  - `matchWord(["c","a","t"], words)` returns `"cat"`; `["t","c","a"]` returns `null`; partial slots return `null`.
  - The component's server render shows the "cat" example and the "c – a – t → cat" line.
  - Clicking a tray tile fills the next slot.
  - Backspace removes the last tile.
  - A click during the demo cancels it, leaving no leftover demo tile.
  - Under reduced motion there is no demo, and moves are instant (no `.animate` calls).
- [ ] **Step 2:** FAIL.
- [ ] **Step 3:** Implement.
  - h1: plain text words with "Phonics" as `TileWord`. No `enter-word` mask on the h1 (LCP).
  - Board: client leaf, demo at 1.2s after `load`.
- [ ] **Step 4:** Tests pass. `node scripts/probes/fold.cjs` passes at 375×667 (stats and WhatsApp bottom ≤ viewport − sticky bar) and at 1366×768 (WhatsApp bottom ≤ 768). A Chrome trace shows the LCP element is the h1.
- [ ] **Step 5:** 375 screenshot and hero GIF (`.screens/gifs/home-hero-v2.gif`). **Commit** `feat(home): phonics tiles in the headline and a tap-to-build word board`.

### Task 4: "My child knows the alphabet…": names vs sounds
**Files:**
- Create: `src/components/home/NamesVsSounds.tsx`
- Modify: `WhyPhonics.tsx`
- Delete: `SoundBlend.tsx` (after a `rg` for usages)
- Test: add to `home.test.tsx`

- [ ] **Step 1: Failing tests:** the toggle is a 2-button group with `aria-pressed`; the server render is the sounds state; reduced motion renders both states; the no-JS markup contains "c – a – t → cat".
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS, plus a 375 screenshot. **Commit** `feat(home): letter names vs letter sounds demo`.

### Task 5: Trainer Revathi (seal, journey teaser, awards)
**Files:**
- Create: `src/components/home/TrainerSeal.tsx` (SVG `textPath`, `aria-hidden`; visible credential text stays in the DOM nearby), `src/components/home/JourneyTeaser.tsx`
- Modify: `FounderIntro.tsx`
- Test: `home.test.tsx`

- [ ] **Step 1: Failing tests:**
  - The teaser picks exactly 4 milestones from `journey`: index 0, the Inner Wheel join, the first award, and the last.
  - Every year shown appears in `journey`.
  - The section contains `founder.credential` as text.
  - 3 award rows.
- [ ] **Steps 2–4:** FAIL, implement, PASS. Screenshots at 375 and 1440. **Commit** `feat(home): trainer seal, journey teaser and awards`.

### Task 6: "Is it right for my child?" as the decision tool
Skill: cro. Run it on the selector and the Task 9 final CTA before building Task 6, and log the findings. Use context7 for framer-motion and gsap API questions in any task.

**Files:** modify `WhoIsItFor.tsx` (card layout, primary WhatsApp per audience) and `AudienceSelector.tsx` (chip sizing only).
- [ ] **Step 1:** Extend the existing tests (or add one): each panel has a primary `wa.me` link whose `text` param equals that audience's message; there are still 4 panels in the server HTML.
- [ ] **Steps 2–4:** FAIL, implement, PASS. Keyboard check: arrows, Home/End. `curl /` shows 4 `role="tabpanel"`. **Commit** `feat(home): audience selector as the main decision tool`.

### Task 7: Inside the classes: programs showcase bento
Skill: find-animation-opportunities (to gate which previews earn motion) before building.

**Files:**
- Create: `src/components/home/Showcase.tsx` (server), `src/components/home/showcase/{PlayTile.tsx (client: usePlayInView + <a>), previews.tsx (server markup for the 7 previews)}`, `src/app/home-showcase.css` (keyframes, imported in `globals.css`)
- Delete: `AudienceTeasers.tsx`
- Modify: `src/app/page.tsx`
- Test: `home.test.tsx`

- [ ] **Step 1: Failing tests:**
  - 7 tiles with hrefs `/programs#phonics`, `/programs#grammar`, `/programs#english`, `/programs#handwriting`, `/coaching`, `/teacher-training` and `/for-schools`.
  - Every preview is `aria-hidden`; each link's accessible name equals its title.
  - The phonics preview has 42 tiles and no text characters inside them.
- [ ] **Steps 2–4:** FAIL, implement, PASS. Then probe: scroll the bento into view, wait 4s, confirm `document.getAnimations().filter(a => a.playState === "running")` inside `#showcase` is 0. Scroll away mid-play and back: no tile is left mid-transform.
- [ ] **Step 5:** Showcase GIF (`.screens/gifs/home-showcase.gif`). **Commit** `feat(home): programs showcase bento with live previews`.

### Task 8: Branches tightened, Why-us ruled list, compact FAQ
**Files:** modify `HomeBranches.tsx`, `BranchList.tsx` (two-column railway variant), `WhyChooseUs.tsx`, `src/app/page.tsx` (FAQ block), `fx.css` (ruled-line draw).
- [ ] **Step 1:** The existing branch parity test stays green. New test: the Why list has 8 `<li>` with numbered tiles 1–8, in the same order as `why.points`.
- [ ] **Steps 2–4:** Implement and PASS. 375 + 1440 screenshots. **Commit** `feat(home): two-column railway, ruled why-us list, compact FAQ`.

### Task 9: Final CTA: "hello" turns into a WhatsApp bubble
**Files:** create `src/components/home/HelloCta.tsx` (client leaf inside a server section); modify `src/app/page.tsx`.

- [ ] **Step 1: Failing tests:**
  - The server render contains the full `messages.general` text and a `wa.me` link whose `text` param equals `messages.general`.
  - Reduced motion shows the bubble at its end state with no `.animate` calls.
  - Tap during the sequence skips to the end.
- [ ] **Steps 2–4:** FAIL, implement, PASS. CLS probe: the layout-shift sum while the CTA plays is < 0.01.
- [ ] **Step 5:** GIF (`.screens/gifs/home-cta.gif`). **Commit** `feat(home): hello tiles become the WhatsApp message`.

### Task 10: Home pacing pass
- [ ] **Step 1:**
  - Screenshot Home at 375 and 1440, full and fold.
  - Re-read the (b) diagnosis and confirm each point is resolved. Note the before and after page height.
  - Fix spacing and rhythm only (no new features).
  - Confirm the background sequence matches `HOME_SECTIONS`, with a DOM probe reading each section's computed background.
- [ ] **Step 2:** **Commit** `style(home): pacing and rhythm pass`.

### Task 11: PageHero tile art (Workstream 3)
**Files:** create `src/components/blocks/HeroTileArt.tsx`; modify `PageHero.tsx` (`art?: string`), `programs/page.tsx` ("read"), `teacher-training/page.tsx` ("teach"), `contact/page.tsx` ("hello"); test `tests/unit/dev-prod.test.tsx` or a new `pagehero.test.tsx`.
- [ ] **Step 1: Failing tests:** with `art` and no `slot`, the hero renders an `aria-hidden` tile cluster with N tiles; with both, only the slot renders; the h1 count is still 1.
- [ ] **Steps 2–4:** FAIL, implement, PASS. Screenshots at 1440 (column filled) and 375 (no added height: hero height unchanged ±2px against the pre-change probe). **Commit** `feat: sound-tile art fills PageHero when there is no photo`.

### Task 12: Skill audits across all 8 pages (Workstream 4)
- [ ] **Step 1:** Invoke each skill and run it on the whole site: **review-animations**, **improve-animations**, **impeccable** (audit + polish), **animation-performance** and **gsap-performance**. Write their findings into `.superpowers/sdd/PLAN/audit-findings.md` as a table: skill, page, finding, severity, fix or "won't fix" with reason.
- [ ] **Step 2:** Fix every high or medium finding inside the constraints. Commit per skill: `fix(motion): <skill> findings`. Low findings are listed, and fixed only if cheap.

### Task 13: Probes on all pages
**Files:** create `scripts/probes/{hydration.cjs,reduced-motion.cjs,resize.cjs,jump.cjs}` and `scripts/perf/throttle.cjs`; add `"probe": "node scripts/probes/run-all.cjs"` to `package.json`.
- [ ] **Step 1:** Run all 8 routes:
  - hydration: clean profile, 3 cold loads each, 0 console errors;
  - reduced motion: 0 nodes with opacity < 0.5 and no mask offset;
  - resize 1440 → 900 → 1440 across the pinned scenes: 0 errors, no stuck pin spacers;
  - jump: 0 hidden on-screen nodes after the End key and an anchor jump;
  - throttle: CDP CPU 4×, 375px, wheel through each signature scene.
- [ ] **Step 2:** Pass criteria are as in REDESIGN-PLAN (d): ≥90% of frames < 16.7ms and no frame > 50ms. "Host-bound with no long tasks" counts as a pass (approved decision 4). Fix failures.
- [ ] **Step 3:** **Commit** `test: site-wide probes and 4x throttle script` (plus any fixes).

### Task 14: Production build and Task 18 sweep
- [ ] **Step 1:** `npm test && npm run typecheck && npm run lint && npm run build`, all green. Log Home's first-load JS against the budget.
- [ ] **Step 2:** `npm run start -- -p 4000`. Run `scripts/probes/prod-sweep.cjs` on every route at 375:
  - no `/TODO/` text, `[data-placeholder]` or `[data-todo]`;
  - `scrollWidth <= clientWidth`;
  - every `img` has non-empty `alt` or `alt=""` with `aria-hidden`;
  - exactly one h1;
  - with JS disabled, the WhatsApp/Call CTAs are present with valid hrefs, the FAQ `details` open, and Home's selector panels show.
- [ ] **Step 3:** Production checks:
  - `curl` sitemap, robots, llms and OG return 200 on :4000;
  - re-run the fold probe;
  - Lighthouse mobile per route (caveated host).
- [ ] **Step 4:** Sync TODO.md with the `todo()` ids. Either add `todo("photo-consent")` where the photo slots read it, or move photo consent to TODO.md's "not code TODOs" list. Decision logged.
- [ ] **Step 5:** Full-page 375 + 1440 screenshots of all 8 routes to `.screens/final/`. **Commit** `chore: production quality gate` with the scores in the message.

### Task 15: Deploy readiness and report (Workstream 5)
- [ ] **Step 1:** Confirm `package.json` is at the repo root and `git ls-files` includes `src/`, `public/`, `next.config.ts`, `package-lock.json` and `tsconfig.json`. Confirm `.gitignore` doesn't exclude anything the build needs (today it ignores `.next`, `.env*`, `.vercel`, `.screens/`, `.superpowers/`, which is fine).
- [ ] **Step 2:** Write `DEPLOY.md`:
  - the push commands (`git remote -v`; `git push origin main`);
  - Vercel import (New Project, import the repo, Framework Next.js auto-detected, no Root Directory, no env vars);
  - `NEXT_PUBLIC_SITE_URL` only once a custom domain exists;
  - previews are noindexed by design;
  - PageSpeed Insights steps for all 8 routes, mobile, and how to read the preview SEO `is-crawlable` failure.
- [ ] **Step 3:** Rewrite `MORNING-REPORT.md` for the final state:
  - per page: its signature moment;
  - GIF paths;
  - skill findings summary with a link to `audit-findings.md`;
  - probe and Lighthouse numbers with the host caveat;
  - what's waiting on the client (TODO.md).
- [ ] **Step 4:** superpowers:verification-before-completion. **Commit** `docs: deploy guide and final report`. **STOP.** No push.

## (f) Risks, cuts and decisions

**Risks**
1. **The 1366×768 fold is tight.** Today the WhatsApp button sits at y≈712–764 on a 900px viewport. Removing the separate tile row helps on mobile but not on desktop. The fix is a smaller desktop h1 clamp. If that still fails, the status line moves below the fold (it's the only non-required item).
2. **The LCP element could change.** If tiles inside the h1 make Chrome choose the board or a tile as LCP, the h1 tiles become an inline accent after the h1 text instead. This is checked in Task 3.
3. **Performance cost of the bento previews on this AMD A6 host.** Seven CSS previews are cheap individually. They play only while visible and stop within 3.5s.
4. **framer and GSAP both load near the top half** (the selector and the path). They're already lazy and near-gated; nothing new is added.
5. **Skill passes can find a lot.** Task 12 fixes high and medium findings only, and lists the rest.

**Cut first if the budget or time runs short (in order)**
1. The For Schools bento tile.
2. The hop in the Coaching mini-staircase (keep the steps).
3. The board's auto-demo (keep the board).
4. The journey-teaser dot pops (keep the line draw).

**Decisions I need from you**
- **D1: Illustrative copy.**
  - Board letters `c a t s p n i`, 3 slots. Accepted words: cat, sat, pat, tap, sap, nap, pan, can, tan, ant, pin, tin, sip, nip, tip, pit, sit, spa.
  - The final CTA word "hello".
  - The letter-names line "C · A · T … ?".

  OK as is, or will Tr. Revathi supply her own words?
- **D2: Hero portrait (slot H1).** The hero's right column becomes the word board. When the real portrait arrives, I propose it goes in the Trainer section (the seal overlaps its corner), with the small round portrait in the hero's Trainer line. Or should the portrait take back the hero's right column and the board move to section 2?
- **D3: PageHero words.** "read" (Programs), "teach" (Teacher Training), "hello" (Contact). "hello" also appears in Home's final CTA. OK, or "ask" for Contact?
- **D4: Drop the "Teachers and schools" ink band.** Its two doors become bento tiles (TT stack, Schools tabs). OK?
- **D5: GIFs and screenshots stay in gitignored `.screens/`** (local only, linked from MORNING-REPORT). Or should I commit the final GIFs to `docs/media/`?
- **D6: Conveyor fallback.** Accept the static chip list in browsers without scroll timelines (no GSAP fallback)?
- **D7: PageHero art hidden below 768px.** OK, or do you want a small accent?
