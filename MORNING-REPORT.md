# Final report

State of the site after the redesign, the Home rebuild and the quality gate. Nothing has been pushed.
The decision trail is in `.superpowers/sdd/PLAN/progress.md`; the plan it followed is `FINAL-PLAN.md`.

## What is on each page

Every page has a different signature moment and a different heading treatment from its neighbours. Each one is fully
readable with JavaScript off and with reduced motion.

| Page | Signature moment | Supporting moments | Headings |
|---|---|---|---|
| **Home** | "Phonics" in the headline is sound tiles that close up; beside it a **word board** where you tap sounds to build a word | Letter names vs letter sounds demo; the pinned learning path; Trainer Revathi seal, journey teaser and awards; audience selector with one WhatsApp button per audience; **Inside the classes** bento of seven live previews; East / West railway; ruled "why parents choose us" list; **hello tiles that become the WhatsApp message** | mask rise, sound-out |
| **About** | Pinned journey path, 2001 to 2025 | Read-aloud belief quote, fanning qualifications, flip award cards | stroke underline |
| **Programs** | 42-tile sound wall ripple with the "42 sounds" counter | Sentence builder, typing speech bubble, handwriting strokes, special-classes conveyor, sliding anchor nav, tile art "read" | sound-out |
| **Coaching** | Scroll-scrubbed staircase, Sr. KG to Std. 8 | Letter-sound flip cards for subjects | tile flip |
| **Teacher training** | Sticky stacking course cards | Calm ARPAN section (opacity only, no transform motion), tile art "teach" | wipe |
| **For schools** | Tabs with a sliding indicator and direction-aware panels | "What each group takes away" strip | word slide |
| **Contact** | Conversational enquiry that ends in a WhatsApp chat bubble | East / West branch toggle, pin-drop maps, tile art "ask" | light-up |
| **Gallery** | Waits for photos (noindex, out of nav and sitemap) | | stroke |
| **Global** | Page transitions with a persistent logo, sliding nav indicator, sound-tile scroll progress | | |

### Home, before and after

The diagnosis was that seven of ten Home sections were "heading, paragraph, cards", the hero's right half was empty, the
only real phonics interaction was a small button, and two neighbouring sections shared a background. Home now alternates
interactive and calm sections in the order paper, red, surface, teal, paper, ink, paper, surface, paper, red, checked by a
probe at 375 and 1440. At 375px the page grew from 10,221 to 11,339 px because it now carries the showroom; at 1440 it is
8,366 px.

The h1, the 20+ / 4,500+ / 2001 trust line and the WhatsApp button are fully visible without scrolling at 375x667, 1366x610
(a real 1366x768 laptop's visible Chrome viewport), 1366x768 and 1440x900. The h1 is the largest contentful paint element
and nothing above the fold waits on JavaScript.

## GIFs and screenshots (local, gitignored)

`.screens/gifs/`: `home-hero-v2.gif`, `home-showcase.gif`, `home-cta.gif`, `home-hero.gif`, `home-audience.gif`,
`home-branches.gif`, `about-journey.gif`, `programs-wall.gif`, `programs-grammar.gif`, `programs-english.gif`,
`programs-handwriting.gif`, `programs-special.gif`, `coaching-stairs.gif`, `tt-stack.gif`, `schools-tabs.gif`,
`contact-form.gif`.

`.screens/final/`: full-page 375px and 1440px screenshots of all eight routes, taken from the production build.

## Skill audits (details in `.superpowers/sdd/PLAN/audit-findings.md`)

| Skill | Result |
|---|---|
| improve-animations | Gated one hover colour for touch, replaced a `scale(0)` pop, no `transition: all`, no layout-property animation, every JS animation sits behind a reduced-motion check |
| animation-performance, gsap-performance | Only transform, opacity, clip-path and stroke-dashoffset animate; GSAP is lazy, reverts on resize, transforms only |
| impeccable (detector) | One side-tab border fixed; one advisory kept (the site's soft-overshoot easing token) |
| **review-animations** | **Not run.** The skill can only be started by you: run `/review-animations` yourself |

## Probes and checks (`npm run probe`, scripts in `scripts/`)

| Check | Result |
|---|---|
| Clean-profile hydration, 8 routes x 3 cold loads | 0 errors |
| End key and anchor jumps | nothing left hidden |
| Reduced motion | nothing faded or masked |
| Resize across 1024px | pins appear, disappear and return cleanly |
| No sideways scroll at 375px on every route | pass (after fixes below) |
| Production sweep at 375px, JS on and off | no TODO text, no placeholders, alt on every image, one h1 per page, wa.me and tel links present, tab panels stacked without JS |
| Unit tests, types, lint | 112 tests, `tsc` and `eslint` clean |
| 4x CPU throttle at 375px | **Not a pass**, see below |

### Real bugs the probes found (all fixed)

1. The learning path's step descriptions were hidden on phones, with reduced motion and without JavaScript. Each step card now carries its own description.
2. Home and Programs scrolled sideways on phones (scroll-triggered card and chip offsets widened the page). Both are clipped now.
3. Without JavaScript the Home audience panels and the For Schools tracks stayed hidden, because Tailwind's `[hidden]` rule beats unlayered `!important` CSS. The no-JS styles now sit in the same layer.
4. The Showcase's four-column layout overflowed between 900 and 1100px.
5. Reveal arming read every node's position between attribute writes, forcing a layout per node. It is now batched: Home went from 38 layouts to 16 and from 173 style recalculations to 99 at 4x throttle.
6. Two contrast failures (showcase tile labels, the dimmed words in the About quote).

## Scores and the open performance item

**Lighthouse mobile on this machine (AMD A6, benchmark about 600, with Lighthouse's own 4x slowdown on top) is not
representative.** Even the lightest page scores 78 here. For the record: performance Home 33 to 44 (run to run), About 62,
Programs 53, Coaching 58, Teacher training 78, For schools 66, Contact 61, Gallery 64; accessibility 96 to 100 (the two
contrast items above were fixed afterwards); best practices 100 everywhere; SEO 69 everywhere, only because `robots.txt`
blocks crawling outside Vercel production (the `is-crawlable` audit). CLS is 0 to 0.005.

**Open item:** under the 4x CPU throttle script, Home, Programs and Coaching show long tasks over 50 ms (the one-off
GSAP module evaluation is about 130 ms; Home also has 100 to 250 ms frames mid-page that I could not attribute to a
script). The other five pages are host-bound with no long tasks. I did not simplify any scene because I could not isolate
a cause within the budget. Home's first-load JavaScript is 210.5 KB gzipped against 188 KB for About; the change against
the pre-redesign Home was not measurable (a baseline build failed), so the 8 KB budget is unverified.
**Run PageSpeed Insights on a Vercel preview before launch** (steps in `DEPLOY.md`).

## Decisions made for you

- Home's board words (cat, sat, pat, tap, nap, pan, can, tan, ant, pin, tin, sip, nip, tip, pit, sit), "hello" and "C . A . T ... ?" are illustrative UI words, approved by you.
- The "tiles gather into the bubble" idea became "tiles drop in, then the bubble grows from the last tile's corner", so the finished frame is identical with and without JavaScript.
- Touched the learning path's markup (static descriptions) even though the plan said to leave it alone, because the static mode lost content.
- Three production builds were run instead of one, because fixes found by the sweep needed re-verification.
- The external schema validator was not used (it needs a public URL); JSON-LD was checked structurally.

## Still waiting on the client (`TODO.md`)

Batch timings, days, fees and class mode; the exact starting age for phonics; which programs run at which branch;
coaching subjects and boards; social media URLs; pincodes and map pins; the meaning of "Scholarship Drawing"; logo
approval; photo consent and real photos (every slot in `src/content/images.ts` is empty); email; real testimonials
(the section stays hidden).

## Commits

All local, none pushed, on `main`. See `git log origin/main..HEAD`.
