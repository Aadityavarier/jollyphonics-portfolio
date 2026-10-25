# PHOTO-PLAN — client photos, 2026-10-25

> **Applied 2026-10-25 with the approved changes:**
> - H6 = 20260620-WA0008.
> - The Home preview (H10–H12) = 0012, 0093, 0069 (0064 is H3; no photo twice on one page; `npm run probe` checks this).
> - "Student activities" became "Drawing & art".
> - Children's names, the teacher-training certificates and "St. Anthony" are blurred.
> - Not done: the ~2° straightening (direction not reliable from WhatsApp copies).
> - Slot files are named `<slot>-<original>.jpg`.

Source: 116 files in `raw-images/inbox/` (moved from `raw-images/gallery/`, filenames unchanged). File names below drop the `IMG-` prefix and `.jpg`. Pixel sizes for every file are in `.screens/contact-sheets/sizes.txt`; the sheets are `.screens/contact-sheets/sheet-01…10.jpg`. **None of the originals carry GPS** (WhatsApp strips it). The outputs are re-checked in STEP 2 anyway.

## ⚠ Read first: the hero portraits

| Slot | Needed (short edge) | Best candidate | Actual usable short edge | Verdict |
|---|---|---|---|---|
| **H1** Home portrait (4:5) | ~1040px | `20260922-WA0095` cropped to Revathi alone | **≈420px** (she fills less than half of an 899px-wide frame) | **Not usable. Ask the client for an original.** |
| **A1** About hero portrait (4:5) | ~1040px | `20260918-WA0001` (on stage, mic, "Jolly Phonics in the Classroom") | **1010px** (crop 1010×1262 from 1010×1557) | **Usable**, 3% under target. It will look sharp at 1x and only marginally soft on 2x screens. |

**Ask the client for:** an original (not WhatsApp) **waist-up portrait smiling at the camera** for H1. If possible, also ask for the original of `20260918-WA0001`, which looks professionally shot. Until then **H1 stays empty**: Home already has a designed no-photo layout (the trainer seal alone), which looks better than an upscaled crop.

## Where the photos come from
The "22 Sep 2026" in 110 filenames is the date they were **forwarded on WhatsApp**, not one event. The whiteboard dates (24/07, 08/09, 17/09, 31/…) and Christmas decorations show they span many months. The groups are:

| Group | Looks like | Files (examples) |
|---|---|---|
| **G1** Certificate handovers, home-style branch room (TV wall, alphabet play-mat) | Course-completion ceremonies over several months | 0003, 0005, 0009, 0010, 0017, 0022, 0028, 0030, 0031, 0033, 0035, 0037, 0038, 0040, 0063, 0084, 0095, 0100, 0102, 0108, 0109, 0111 |
| **G2** Certificate photos in the classroom branch (gold "1 2 3" balloons, dated whiteboard) | The same ceremonies at the other branch | 0007, 0016, 0018, 0020, 0027, 0029, 0043, 0056, 0068, 0074 |
| **G3** Children holding storybooks | Reading-programme book handouts (classroom branch) | 0004, 0011, 0012, 0013, 0015, 0019, 0026; with Revathi at the home branch: 0083, 0092, 0096, 0098, 0099, 0101, 0104; group selfie 0088 |
| **G4** Wide classroom shots at the classroom branch (red/blue desks) | Regular phonics classes, many bursts | 0034, 0039, 0041, 0042, 0044, 0046, 0050, 0051, 0052, 0053, 0055, 0059, 0062, 0073 |
| **G5** Sessions at schools (uniformed children, murals, chalkboards) | School phonics sessions (at least 2 schools; uniforms read "St. Anthony") | 0045, 0047, 0054, 0070 (red uniforms); 0064, 0069, 0076, 0082, 0085 (another class); 0048, 0080 |
| **G6** Christmas | Christmas celebration(s): classroom + home branch | 0049, 0065, 0067, 0086, 0087, 0089, 0090, 0091, 0093, 0094, 0097, 0110 |
| **G7** Drawing / painting | Art activity at the home branch | 0014, 0023, 0032 |
| **G8** Small-group tutoring at a desk | Coaching (2 Sep 2026, per the OnePlus stamp) | 0008, 0021 |
| **G9** Adults with certificates + one talk | Teacher-training certificates (Mar–Jun 2026) and a teacher talk (18 Sep 2026) | 20260918-WA0001, 20260610-WA0005, 20260620-WA0008, 20260620-WA0011, Screenshot |

## a) Slot assignments

Displayed sizes: 3:2 slots render up to ~640px wide on desktop and full width (~375–430px) on phones; 4:3 the same; 1:1 previews ~400px. For 3:2 slots a pick is fine at ≥1200px wide. **Crop** means cut to the slot's ratio in STEP 2.

| Slot | Pick | Alternates | Why | Resolution after crop |
|---|---|---|---|---|
| **H1** portrait | — (empty) | 20260922-WA0095, 0084 | See the warning above; only usable as a background-cluttered crop at ≈420px | — |
| **A1** About portrait | **20260918-WA0001** | — | Only full-length shot of her teaching; sharp, good light, credentials on screen behind her | 1010×1262 ✓ (slightly under 1040) |
| H2 child's hand on cards (no faces) | — | — | Nothing suitable | — |
| **H3** young children, phonics activity | **20260922-WA0064** | 0069 | Happy class with raised hands; bright | crop 1600×900 → 1350×900 ✓ |
| **H4** older student + tutor at desk | **20260922-WA0021** | 0008 | Students at the desk with Revathi; the OnePlus stamp gets cropped | 1200×800 ✓ |
| H5 adult learner | — | — | Nothing suitable | — |
| **H6** Revathi training teachers | **20260918-WA0001** (landscape crop) | — | Teachers' heads in the foreground, her at the front | 1010×673 ⚠ fine on phones, slightly soft at 640px on 2x desktop |
| **H7** candid, small group of children | **20260922-WA0047** | 0045 | Revathi teaching with a phonics card, children engaged | crop 900×1600 → 900×600 ✓ |
| H8 teachers teaser | = T1 | | Reuse, as the slot allows | |
| H9 schools teaser | = S1 | | Reuse | |
| **H10–H12** gallery preview (1:1) | **0012, 0093, 0064** | 0019, 0110 | One per strongest category: reading, events, school | ≥900 ✓ |
| **P1** phonics sound actions/cards | **20260922-WA0047** | — | She holds a sound card; the closest match. Reuses H7 | 900×600 ✓ |
| **P2** writing / worksheet | **20260922-WA0053** | 0073 | Children writing at desks, teacher helping | 1350×900 ✓ |
| P3 older student/adult reading aloud | — | 0011 (holding, not reading) | No real reading-aloud shot | — |
| P4 pencil grip close-up | — | — | Nothing suitable | — |
| **P5** drawing / art | **20260922-WA0023** | 0014, 0032 | Clear drawing close-up, no face issues | 1600×1067 ✓ |
| **C1** tutor helping at desk | **20260922-WA0008** | 0021 | Revathi explaining at a desk to a small group | 1200×800 ✓ (crop out the stamp) |
| **C2** small group, notebooks open | **20260922-WA0053** | 0073 | Group at desks with notebooks. Reuses P2 (different page) | 1350×900 ✓ |
| **T1** Revathi leading teacher training | **20260918-WA0001** | — | Exactly this slot | 1010×673 ⚠ (see H6) |
| T2 teachers practising activities | — | — | Nothing | — |
| T3 hands-on ECCE activity | — | — | Nothing | — |
| T4 Montessori materials | — | — | Nothing | — |
| T5 educators/parents (adults only) | — | 20260620-WA0008 | Group with a certificate, not speaking; weak fit | — |
| **S1** phonics workshop in a school | **20260922-WA0045** | 0054, 0070 | School classroom, children in uniform, her at the board | 1350×900 ✓ |
| **S2** Revathi with a school's teachers | **20260922-WA0048** | — | With a teacher in a school classroom; acceptable, not strong | crop 1200×800 ✓ |
| **A8** with one child, candid | **20260922-WA0010** | 0030 | Both smiling on a sofa with the certificate; warm | crop 899×1599 → 899×899 (1:1) ✓ |
| A2–A7, A9 (certificates, awards, Inner Wheel) | — | — | Not in this batch | — |
| **B1–B4** branch entrances | — (all empty) | — | **No building or signage photos in the batch.** Branch photos only appear once all four exist | — |

**Filled: 19 slots** (A1, H3, H4, H6, H7, H8, H9, H10, H11, H12, P1, P2, P5, C1, C2, T1, S1, S2, A8). **Still empty:** H1, H2, H5, P3, P4, T2–T5, A2–A7, A9, B1–B4.

## b) Gallery — fewer, strong categories, 8–10 each

| Category | Live? | Photos (published) | Group |
|---|---|---|---|
| **Reading activities** | ✅ 8 | 0004, 0011, 0012, 0013, 0015, 0019, 0026, 0088 | G3 |
| **Certificate distribution** | ✅ 10 | 0007, 0010, 0016, 0022, 0027, 0031, 0043, 0068, 0084, 0095 | G1 + G2 |
| **Phonics classes** | ✅ 6 | 0044, 0046, 0051, 0052, 0053, 0073 | G4 |
| **School sessions** | ✅ 8 | 0045, 0047, 0048, 0054, 0064, 0069, 0076, 0080 | G5 |
| **Events** (Christmas) | ✅ 8 | 0049, 0065, 0086, 0087, 0089, 0093, 0097, 0110 | G6 |
| **Teacher training** | ✅ 4 | 20260918-WA0001, 20260610-WA0005, 20260620-WA0008, 20260620-WA0011 | G9 |
| Student activities | ✅ 3 | 0014, 0023, 0032 (all drawing/painting) | G7 |
| Workshops, Summer camps, Student achievements, Phonics games, Trainer Revathi sessions | ✗ | — | not enough distinct photos; not forced |

**7 categories live, 47 photos.**
- **Suggestion:** G7 is all drawing/painting, so a **"Drawing & art"** category (matching the Special Classes list) would describe it better than "Student activities". Adding it is a one-line change in `gallery.ts`; your call.
- "Trainer Revathi sessions" could be made from 0001, 0008, 0021 and 0047, but those are already used in slots and other categories, so I left it out rather than duplicate them.

**Reserve (good, kept unpublished in inbox):** 0003, 0005, 0006, 0009, 0017, 0018, 0020, 0028, 0029, 0030, 0033, 0035, 0037, 0038, 0040, 0063, 0081, 0083, 0092, 0096, 0098, 0099, 0100, 0101, 0102, 0104, 0108, 0109, 0111 (certificate/book photos); 0034, 0062 (classes); 0070, 0082 (school); 0067, 0090, 0091 (Christmas); 0103 (group selfie).

## c) Rejects

| File(s) | Reason |
|---|---|
| 20260315-WA0030 | Unrelated selfie of an unidentified man |
| 20260922-WA0002 | Snapchat screenshot: app UI overlay, low res |
| 0057, 0058, 0061, 0071, 0078 | Phone-gallery screenshots (status bar, toolbar), recompressed duplicates of handover photos |
| 0060, 0075, 0079 | Canva poster screenshots: app UI, and the poster shows a phone number |
| 0066, 0072 | Video frames with big black bars; tiny and soft |
| 0077 | Video-player screenshot (UI, filename overlay) |
| Screenshot_2026-06-20… | A screenshot (forward); also a near-duplicate of the teacher-training certificate set |
| 0036(1), 0037(1) | Exact duplicates of 0036 / 0037 |
| 0094 | Near-duplicate of 0093 (same selfie burst) |
| 0056, 0074, 0024 | Near-duplicates of 0043, 0068, 0022 |
| 0039, 0041, 0042, 0055, 0059 | Burst of the same classroom wide shot; 0051 kept |
| 0036, 0106 | Out-of-focus cushion covering the foreground |
| 0085 | Near-duplicate of 0082 |
| 0050 | Cluttered, back of an adult's head dominating the frame |
| 0025 | Unidentified adult man in the foreground; awkward selfie crop |

## d) Fixes (applied only to the copies in STEP 2)

| File | Fix |
|---|---|
| **Every certificate-handover photo** published (0007, 0010, 0016, 0022, 0027, 0031, 0043, 0068, 0084, 0095) | **Blur the child's name line** on the certificate (legible at full size in 0007, 0016, 0027, 0029-style close-ups; blur it in all of them for consistency) |
| 20260610-WA0005, 20260620-WA0008, 20260620-WA0011 | Blur the name and any certificate number on the held certificates |
| 0008, 0021 | Crop out the bottom "Shot on OnePlus · 2 September 2026" stamp |
| 0045, 0047, 0054, 0064, 0069 | School name on uniforms ("St. Anthony") is legible. **Decision for you:** blur it (protects the school/children's identity) or leave it (the school is a partner). Default: **blur** |
| 20260918-WA0001 | A1 crop 4:5 centred on her; T1/H6 crop 3:2 keeping the screen title. The screen shows her name/credential only (fine) |
| 0064, 0069, 0076 | Slight tilt: straighten ~2° |
| 0010 (A8) | Square crop on the two of them; blur the certificate name |

## e) Performance (PageSpeed mobile ≥95)
- **LCP:**
  - Home: H1 stays empty, so the LCP stays the text hero (unchanged, already ≥95).
  - About: A1 is the LCP. It is preloaded through `ImageSlot`'s existing `preload` with `sizes="(min-width:1024px) 36vw, 90vw"`. At that size next/image serves ~640–828px AVIF/WebP to phones, not the 1010px source.
  - Inner pages with a hero slot (C1, S1, T1): same rule, preload only the hero.
- **Everything else** uses next/image's default lazy loading, with `sizes` matching the layout (3:2 cards `(min-width:1024px) 40vw, 100vw`; 1:1 previews `(min-width:1024px) 22vw, 45vw`). Aspect boxes are fixed, so CLS stays 0.
- **Gallery (your addition 3):**
  - `scripts/photos.mjs` also writes `<n>-thumb.webp` (≈640px long edge, quality ~72, ~40–70KB) next to each gallery `<n>.webp` (2000px max; these sources are ≤1600 so they stay at their native size).
  - The grid shows thumbs with `next/image unoptimized`, `loading="lazy"`, and explicit width/height.
  - The full image loads only when the lightbox opens (also `unoptimized`). Each thumb is a plain `<a href>` to the full WebP, so it works without JS.
  - Only the first row's thumbs are eligible to load eagerly; the rest are lazy.
- **Vercel image-optimizer usage:**
  - Only page slots go through the optimizer: **~14 distinct source images** (A1/T1/H6 share one; P1/H7 share one; P2/C2 share one).
  - Each is requested at roughly 3–5 widths × 1–2 formats, so on the order of **50–100 transformations total**, cached after the first request and only redone after a deploy that changes the image.
  - Gallery and home-preview photos (47 + thumbs) use **zero** optimizer quota.
  - The H10–H12 home previews use the pre-built gallery thumbs (`unoptimized`) too.

## Coverage check
All 116 inbox files are accounted for exactly once across slots/gallery, reserve or rejects (verified by script before STEP 2; files used in both a slot and the gallery count as published).
