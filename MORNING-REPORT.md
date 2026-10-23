# Morning report: final fix round

Everything in FIX-PLAN.md is done, tested on a production build and pushed to `preview` (`aa445d4..16e8c82`).
The decision log is `.superpowers/sdd/FIX-PLAN/progress.md`. The final review was a **self-review**; no second
reviewer looked at it.

## Why your phone looked broken

Your phone was fine, and so was the site. **The development server refused your phone.** Next.js 16 blocks dev
resources for any address other than `localhost` unless you allow it. The log said
`Blocked cross-origin request … from "192.168.1.107"`. The page's JavaScript never started, so you saw the no-JS
version: the Menu did nothing, nothing animated, and the header was see-through.

I reproduced it from this PC with phone emulation on `http://192.168.1.107:3001`, added `allowedDevOrigins` for
`192.168.*.*` and `10.*.*.*` (dev only), and the same check now passes. **Phone testing over Wi-Fi works again:**
run `npm run dev -- -p 3001` and open `http://<this PC's IP>:3001` on the phone.

## What was broken, why, and what changed

| Problem | Cause | Fix |
|---|---|---|
| **Menu:** the page scrolled behind it, Tab escaped it | Only Escape was handled | Scroll is locked while the menu is open and focus stays in the menu. The probe also found that tabbing jumped the page to the top (focusing inside a sticky header does that); focus now moves without scrolling. |
| **Header see-through** | Its paper background was hidden until JavaScript saw a scroll | Solid paper with a light shadow from the first paint, with or without JS; the shadow deepens once you scroll. |
| **"rograms"** | The sound-out effect spread letters out from the middle, so the first ones started off screen on phones | Below 640px each letter rises into place one after another instead; wider screens keep the spread. Checked frame by frame at 375 and 412. |
| **Empty-looking school cards** | Their CSS pushed the text to the bottom of a tall card | Cards hug their text: colour bar, then the words. |
| **Dark circle near the phone icon** | Next.js's own dev badge (the "N"). Production never has it. | Hidden in dev too. |
| **Teacher Training had no motion on phones** | The stacking cards exist only from 1024px | The course cards now rise into place as you scroll, on phones and tablets. |
| **Accessibility 96–98 on four pages** | Flip cards named by a hidden label rather than what they show; text read against the wrong face; one red slightly too light; a half-faded stage caught mid-animation; one skipped heading level | **100 on all 8 pages** (Lighthouse, production build). |
| **Home "non-composited animations"** | Two transform animations on the same word-board tile | Split across two elements: **none left**. |
| Animation polish (your `/review-animations` list) | | Hover colour gated to mouse, reduced motion fades gently instead of cutting, pop starts at 0.9, names/sounds 450ms with a 40ms stagger and a soft blur, press scale 0.97, overshoot only on one-off moments. |

## Checks on the final production build

| Check | Result |
|---|---|
| `npm test` / typecheck / lint / build | 137 tests pass, all clean |
| **`npm run probe:mobile`** (new: Pixel 7 + iPhone 13, real taps, 8 pages) | **226 / 226 pass.** Covers menu, every tap target, each page's moment actually playing, valid WhatsApp/call links, no errors, no sideways scroll, solid header. |
| `npm run probe` | hydration, reduced motion (nothing moves, fades kept), resize, anchor jumps, showcase, fold, pacing: **pass** |
| Production sweep at 375, JS on and off | no TODO text, alt on every image, one h1 per page, no sideways scroll: **pass** |
| Lighthouse accessibility / best practices | **100 / 100** on all 8 pages |
| 4× CPU throttle script | **Not a pass.** See below. |

**Still open:**
- **4× CPU throttle:** Home and Programs still show long tasks under the 4× slowdown, as before. **About now shows one 80–120ms task (about 20–30ms on a real phone) on every run.** I couldn't pin it to a cause. Its PageSpeed score is the one to watch.
- **Forced reflow:** the remaining reflow on Home is the scroll-reveal engine's single batched position read. I left it, because changing it would alter how 7 components appear.
- **14 KiB of old-browser code:** it is Next.js's own built-in polyfill code. A browser-target setting doesn't change it (I checked: byte-identical), so it stays.

## PageSpeed: your 8 preview URLs

Git didn't print the preview address and I couldn't log in to Vercel from here. Open **vercel.com → the project → Deployments**: the newest `preview` deployment (commit `16e8c82`) is the one. Then test these paths on it at <https://pagespeed.web.dev> (Mobile):

| Page | URL |
|---|---|
| Home | `<preview-url>/` |
| About | `<preview-url>/about` |
| Programs | `<preview-url>/programs` |
| Coaching | `<preview-url>/coaching` |
| Teacher training | `<preview-url>/teacher-training` |
| For schools | `<preview-url>/for-schools` |
| Contact | `<preview-url>/contact` |
| Gallery | `<preview-url>/gallery` |

Your bar: no page below 95 (it was Home 95, Programs 100, Coaching 100, About 99, Contact 100). The one SEO
warning about being blocked from indexing is expected on previews.

## Tap these on your phone

1. Menu: open it, scroll the page behind it (it shouldn't move), tap a link, then confirm the menu has closed on the new page.
2. Home: tap the sounds on the red board, tap "Clear", flip "Letter names / Letter sounds", tap each audience tab and a tile under "Inside the classes".
3. Programs: watch the big heading's letters rise in; tap the section links under it.
4. Coaching: scroll through the staircase, tap a subject card.
5. Teacher Training: scroll; each course card rises in; tap one to open it.
6. For Schools: tap each workshop tab (the cards are now compact).
7. Contact: answer the steps; your message types into the green bubble; tap East / West; tap "Show map".
8. Any page: the header stays solid white over content, and there's no dark circle near the phone icon.

## Ready for the client's changes

- **[CONTENT-GUIDE.md](CONTENT-GUIDE.md):** where every page's words live, how each missing fact is filled in (and its TODO disappears), testimonials, social links, timings, ages, pincodes and map pins, photos. All copy now lives in `src/content/`, and a test enforces it.
- **[CLIENT-QUESTIONS.md](CLIENT-QUESTIONS.md):** ready to forward. Thirteen plain questions, the photo list by priority, the parent-consent note and how to send photos.
- **Photos:** drop them in `raw-images/` named by slot (`H1-anything.jpg`) or in `raw-images/gallery/<topic>/`, then run `npm run photos`. They're converted to WebP, placeholders disappear, and a gallery topic goes live at 3 photos (menu and sitemap included). Alt text is edited in `images.md`.
- **Testimonials:** the "What parents say" section appears on Home before the FAQ as soon as `src/content/testimonials.ts` has one real entry.
- **[DEPLOY.md](DEPLOY.md):** the "Going live" steps: merge preview into main, set the domain, turn preview protection back on, submit the sitemap in Search Console.

## Rulings I made

- **Dev server:** started detached from PowerShell. Turbopack's CSS worker crashed (Windows 0xc0000142) when started from my shell. This affects only how I run dev here, not the product.
- **Header height:** removed an old `--header-h: 4.75rem` that overrode the new exact height (68/80px).
- **`scale(1)` in the showcase card keyframes:** kept. The cards rest at a smaller scale, so the keyframes need the same function list.
- **Framer springs on tabs and branch cards:** left as is. They're interruptible and critically damped, with no overshoot.
- **Reduced motion:** the 160ms press scale on buttons stays, as tap feedback.
- **Award year colour:** used the existing `--color-red-deep` instead of a new `--color-red-ink` (same value). Only the small year uses it.
- **Old-browser code:** browserslist reverted, because the chunk was byte-identical.
- **Reveal engine:** not rewritten for the remaining reflow, as above.
- **Tray rects:** not cached. The FLIP reads only two rects per placement.
- **Teacher Training on phones:** got its own scroll-linked card rise. It is transform only, so contrast checks can't catch a half-faded card.
- **Labels:** all interface words live in one `labels.ts`. "What parents say" is new UI wording.
- **Photo script:**
  - It reads slot IDs from `images.ts` and gallery topics from `gallery.ts`.
  - HEIC files are skipped with "export as JPG".
  - A photo set by hand in `images.ts` still wins over the script.
- **Branches:** optional `postalCode` and `geo` fields, so pincodes and pins are data-only for the client.
- **Client photo list:** follows what the site shows today. Certificates, awards and P/T slots are under "for later".
- **Home example words:** added as a question for the client.
- **4× throttle:** left failing as described above.

## Deferred minors

- The `labels` import sits after the relative imports in a few files (style only).
- The press scale still runs under reduced motion (see the rulings).
