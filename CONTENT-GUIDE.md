# Content guide

How to change the words, facts and photos on the site. Every word on the site lives in `src/content/`. Components
only arrange it; a test (`tests/unit/content-only.test.ts`) fails if anyone writes copy straight into a component.

**The one rule:** facts come from `content.md`. Add or confirm the fact there first, then copy it into the content
file. Never type a number, fee, timing, age, review or quote that the client has not given you.

After any change, run:

```bash
npm test && npm run build
npx next start -p 4000      # in a second terminal
npm run probe:mobile        # taps through all 8 pages on two phone profiles
```

## Where each page's text lives

| Page | Facts | Headings, buttons, labels |
|---|---|---|
| Home `/` | `home.ts` (hero, word board), `parents.ts` (why phonics, "is it right for my child"), `founder.ts`, `journey.ts`, `programs.ts`, `why.ts`, `faq.ts`, `contact.ts`, `brand.ts` (20+ / 4,500+ / 2001) | `labels.ts` → `home` |
| About `/about` | `founder.ts` (bio, qualifications, certifications, awards, expertise, community, vision line, worked-with), `journey.ts` (curated: set `journey: true` on an award or Inner Wheel role to add a stop; same-year events share one stop), `vision.ts` | `labels.ts` → `pages.about` |
| Programs `/programs` | `programs.ts` (every program, the learning path, special classes), `brand.ts` (the program chips) | `labels.ts` → `pages.programs` |
| Coaching `/coaching` | `coaching.ts` (range, subjects, boards, approach), `why.ts`, `faq.ts` | `labels.ts` → `pages.coaching` |
| Teacher training `/teacher-training` | `teacher-training.ts` (Phonics TT, ECCEd, Montessori, ARPAN), `founder.ts` (trainer qualifications) | `labels.ts` → `pages.teacherTraining` |
| For schools `/for-schools` | `schools.ts` (intro, the three workshop tracks), `why.ts` | `labels.ts` → `pages.schools` |
| Contact `/contact` | `contact.ts` (phone, WhatsApp, enquiry topics, timings line, social links), `branches.ts`, `faq.ts` | `labels.ts` → `pages.contact`, `enquiry` |
| Gallery `/gallery` | `gallery.ts` (categories), photos via `npm run photos` | `labels.ts` → `pages.gallery` |
| Every page | `brand.ts` (name, taglines), `nav.ts` (menu), `branches.ts` (footer), `seo.ts` (page titles and descriptions for Google) | `labels.ts` → `common`, `header`, `footer`, `crumbs` |
| WhatsApp messages | `messages.ts`: the text each WhatsApp button pre-fills | |

## Changing a fact

1. Update `content.md`.
2. Find the value in the file from the table above (search for the old wording) and replace it. Keep the quotes
   and the trailing comma.
3. Numbers that appear in several places (20+, 4,500+, 2001) live once, in `brand.ts` → `numbers`.

## How the TODO placeholders work

A missing fact is written as `todo("id", "what is missing")` in a content file. In `npm run dev` it shows on the page
as a visible `TODO:` note; in production it renders nothing (the page still reads correctly). It disappears for
good as soon as you replace the `todo(...)` with the real value, or delete the line that holds it. Then remove its
row from `TODO.md`. The production sweep (`node scripts/probes/prod-sweep.cjs`) fails if any `TODO:` text reaches
a production page.

| TODO id | File and field | What to do when the answer arrives |
|---|---|---|
| `phonics-age` | `faq.ts`, first question | Put the age in the answer (`a: "…"`), then delete its `todo: todo(...)` line. |
| `batch-timings` | `contact.ts` → `timingsLine`, `timingsTodo` | Change `timingsLine` to the real timings sentence; delete the `timingsTodo` line and the two `<Todo value={contact.timingsTodo} />` lines it leaves (Contact page, `HomeBranches.tsx`). |
| `programs-per-branch` | `contact.ts` → `programsPerBranchTodo` | Tell the developer: branch cards need a programs list (a new field on each branch in `branches.ts`). |
| `coaching-subjects-confirm`, `coaching-boards` | `coaching.ts` → `subjects`, `subjectsTodo`, `boardsTodo` | Edit the `subjects` list; delete the two todo lines. Boards can be added to `focus` or as a new line. |
| `social-urls` | `contact.ts` → `social.instagram` / `facebook` / `youtube` | Replace each `todo(...)` with the full link in quotes, e.g. `instagram: "https://www.instagram.com/…",`. It appears in the footer automatically. |
| `pincodes` | `branches.ts`, each branch | Add `postalCode: "421501",` and `geo: { lat: 19.2, lng: 73.19 },` (from Google Maps: right-click the pin, copy the two numbers). Directions, the map and Google's structured data then use the exact pin. Delete `branchesTodo` once all four have them. |
| `scholarship-drawing` | `programs.ts` → special classes | Add the confirmed description; delete `scholarshipTodo`. |
| `logo-approval` | `brand.ts` → `logoTodo` | Replace `public/images/logo/logo.svg` if a new logo arrives; delete the todo line. |
| `photo-consent` | `gallery.ts` → `photoConsentTodo` | Once parents have agreed, delete the todo line. Never publish a child's face before that. |

## Testimonials

Real ones only: the parent's own words, with permission. Add an entry to `src/content/testimonials.ts`:

```ts
export const testimonials: Testimonial[] = [
  { quote: "My daughter now reads story books on her own.", name: "Priya S.", context: "Parent, Jolly Phonics, Ambernath East" },
];
```

The "What parents say" section appears on Home, just before the FAQ, as soon as the list has one entry. Leave the
list empty and the section stays hidden.

## Photos

1. Drop the original photos in `raw-images/`. Name each one starting with its slot ID (the list is in
   `CLIENT-QUESTIONS.md` and `src/content/images.ts`), e.g. `H1-portrait.jpg`. Case and the rest of the name do not
   matter. Gallery photos go in `raw-images/gallery/<category>/` (category names are in `gallery.ts`, e.g.
   `summer-camps`).
2. Run `npm run photos`. It makes a WebP copy (long edge at most 2000px) in `public/images/`, writes
   `src/content/photos.generated.ts`, and lists every photo in `images.md`. Files it cannot place are listed as
   skipped (iPhone HEIC: export as JPG first).
3. Open `images.md` and rewrite the **Alt text** for each photo to describe what is actually in it ("Trainer Revathi
   reading with three children at a table"). Run `npm run photos` again; your alt text is kept.
4. Each photo replaces its placeholder automatically. A gallery category goes live at 3 photos; the Gallery page
   then joins the menu, the footer and the sitemap, and stops being hidden from Google.
5. Commit `public/images/`, `src/content/photos.generated.ts` and `images.md`. The originals in `raw-images/` are
   not committed.

## Wording that is not a fact

Headings, button labels, form labels and the screen-reader names are in `src/content/labels.ts`, grouped by page.
The pre-filled WhatsApp messages are in `messages.ts`. Change them freely; keep them short, they are mostly read
on phones.
