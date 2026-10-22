# PLAN — Tr. Revathi Phonics website (v1)

Status: **DRAFT for approval** · 2026-10-22 (rev. 3: §7 revised: design checkpoint, scaled-down tests, stop points)
Sources: `CLAUDE.md` (rules, stack, site map), `content.md` (all facts). Section references like **[FOUNDER]** point to `content.md` headings.

§7 holds the build phases (task-by-task implementation plan). No code yet.

---

## 0. Intent and the decisions behind this plan

**Who arrives and why.** Most parents arrive from a forwarded WhatsApp message or a friend's recommendation, so they already know the name. Google traffic will grow later. A referred parent is checking credibility and wants three answers fast:
1. *What is phonics, really?*
2. *Is it right for my child?*
3. *Where are the branches, and what are the timings?*

Every page section exists to answer one of these, or to show credibility, and then hands off to WhatsApp.

**Decisions (from the conversation)**
- **Branches.** All four branches are equal on the site. Each is named area first (how parents in Ambernath recognise locations), with a secondary line under the name:

  | # | Name (headline) | Secondary line |
  |---|---|---|
  | 1 | Ambernath East — Om Dubey Dham | above Shobha Hospital |
  | 2 | Ambernath West — Chinchpada | Navare Residency, next to Y-Cafe |
  | 3 | Ambernath East — Vadavali | at Little Champs Playschool, Shivaji Nagar |
  | 4 | Ambernath East — Nisarg Green | at Flying Bird Preschool, Phase 2E |

  Every branch card has the same layout and weight wherever it appears (Home, `/contact`, `/coaching`, footer): name, secondary line, full address, a "Get directions" Google Maps link, and a WhatsApp link that names the branch in the message. On `/contact`, each card also has a tap-to-load map. Cards are **grouped by side of town**: Ambernath East (1, 3, 4), then Ambernath West (2), so a parent can scan all four at a glance on a phone. Branches 3 and 4 are hosted at separate businesses; that difference exists only in structured data (C2).
- **Photos.** None exist yet beyond the low-resolution logo. Photos are coming: class photos, trainer with students, certificates and candid moments. Until each one arrives, its slot (§4) shows a labelled placeholder.

**Calls I made (check these)**
- **C1. Topic-specific WhatsApp links.** Every CTA opens WhatsApp with a message already filled in for that topic, e.g. "Hi, I'd like to know if phonics is suitable for my child (age __)." Tr. Revathi sees at once what a parent is asking about. The message wording lives in `src/content/`.
- **C2. Location schema (JSON-LD only).** In structured data, branches 1 and 2 are `LocalBusiness` entries; branches 3 and 4 are `Place` entries under the organisation's `location`, so they don't compete with the host preschools' own Google listings. This affects **only** the JSON-LD; visitors see no difference in how the four branches are presented. CLAUDE.md's SEO section is updated to match.
- **C3. Timings.** Anywhere timings would go, the site says "WhatsApp us for current batch timings". No fees are shown anywhere.
- **C4. Maps.** No embedded Google Map loads by default, because that would hurt the Lighthouse 95+ target. Each branch has a "Get directions" link; the contact page loads a map only when the visitor taps it.
- **C5. Hidden until content exists.** Testimonials stay hidden (CLAUDE.md rule). Social icons stay hidden until URLs exist. Gallery categories with no photos are hidden. In dev, each hidden item shows a `TODO:` marker instead.
- **C6. Logo.** The current PNG (≈570px wide, blurry) is used temporarily at small sizes. The plan assumes an SVG redraw that matches the current design, pending client approval (content.md Q10).
- **C7. Trademark line.** The footer on every page carries: "Jolly Phonics and Jolly Grammar are trademarks of Jolly Learning Ltd." No Jolly artwork appears anywhere.

---

## 1. Pages → sections → content.md sources

### `/` Home
Full order and reasoning in §2.

### `/about` — Trainer Revathi
| # | Section | content.md source |
|---|---|---|
| 1 | Page hero: name, "Known as Trainer Revathi", role, headline credential, portrait | [FOUNDER] |
| 2 | Bio | [FOUNDER] Bio |
| 3 | Belief quote | [FOUNDER] Belief |
| 4 | Key numbers strip | [BRAND] Key numbers |
| 5 | Qualifications | [FOUNDER] Qualifications |
| 6 | Certifications & training, with certificate photos | [FOUNDER] Certifications |
| 7 | Has worked with | [FOUNDER] Has worked with |
| 8 | Awards & recognition | [FOUNDER] Awards |
| 9 | Community & leadership (Inner Wheel timeline, Rotary) | [FOUNDER] Community |
| 10 | Vision, mission, core values | [VISION & MISSION] |
| 11 | CTA band | [CONTACT] Line |

### `/programs` — anchored sections
Sticky anchor nav: Phonics · Grammar · English · Handwriting · Special Classes.
| # | Section (anchor) | content.md source |
|---|---|---|
| 1 | Page intro + programs strip | [BRAND] Programs strip |
| 2 | `#phonics`: what it is, learning path (Hear → … → Write), what it covers, rules & patterns, who can join | [PROGRAMS] 1, [FOR PARENTS] |
| 3 | `#grammar`: Jolly Grammar topics and goal | [PROGRAMS] 2 |
| 4 | `#english`: Reading, Writing, Spoken English, Grammar, Spelling, Comprehension | [PROGRAMS] 3 |
| 5 | `#handwriting`: focus areas | [PROGRAMS] 5 |
| 6 | `#special-classes`: seasonal list ("Scholarship Drawing" flagged TODO) | [PROGRAMS] 6 |
| 7 | Teaching approach: Learn • Practise • Apply • Grow | [TEACHING APPROACH] |
| 8 | CTA band (program-specific WhatsApp message) | [CONTACT] |

Coaching sits on its own page (`/coaching`); `/programs` links to it.

### `/coaching` — Sr. KG to Std. 8
| # | Section | content.md source |
|---|---|---|
| 1 | Page hero: "Coaching & Tuition, Sr. KG to Std. 8", focus line | [PROGRAMS] 4 |
| 2 | Subjects grid (**TODO-flagged until confirmed**; boards TODO) | [PROGRAMS] 4 |
| 3 | Our approach: understanding concepts and confidence, not just finishing the syllabus | [PROGRAMS] 4, [TEACHING APPROACH] |
| 4 | Why Tr. Revathi (subset: experience, personal attention, holistic) | [WHY TR. REVATHI] |
| 5 | Branches: all 4 cards, grouped East / West + timings line (C3) | [CONTACT] Branches |
| 6 | FAQ subset ("Do you provide academic coaching?", "Where are classes held?") | [FAQ] |
| 7 | CTA band | [CONTACT] |

### `/teacher-training`
| # | Section | content.md source |
|---|---|---|
| 1 | Page hero: "Training for teachers and aspiring teachers", trainer credential | [TEACHER TRAINING], [FOUNDER] |
| 2 | Phonics Teacher Training: for whom, what it covers | [TEACHER TRAINING] Phonics TT |
| 3 | ECCEd Teacher Training: for whom, topics | [TEACHER TRAINING] ECCEd |
| 4 | Montessori Teacher Training | [TEACHER TRAINING] Montessori |
| 5 | ARPAN Training & Child Safety: calm tone, no alarming visuals, no children's photos | [TEACHER TRAINING] ARPAN |
| 6 | Trainer qualifications (compact) | [FOUNDER] Qualifications, Certifications |
| 7 | CTA band (TT-specific WhatsApp message) | [CONTACT] |

### `/for-schools`
| # | Section | content.md source |
|---|---|---|
| 1 | Page hero: "Phonics workshops and teacher training for schools" | [FOR SCHOOLS] |
| 2 | Three tracks: For teachers / For students / For parents | [FOR SCHOOLS] |
| 3 | Why Tr. Revathi (credential, 20+ years, 4,500+ students, teacher empowerment) | [WHY TR. REVATHI] |
| 4 | CTA band ("Book a school workshop" WhatsApp message) | [CONTACT] |

### `/gallery`
| # | Section | content.md source |
|---|---|---|
| 1 | Page intro | — (short UI copy only) |
| 2 | Category filter + photo grid + lightbox (empty categories hidden, C5) | [GALLERY CATEGORIES] |
| 3 | CTA band | [CONTACT] |

Until photos exist, this page shows a dev TODO and is **excluded from the sitemap and nav** (see §5).

### `/contact`
| # | Section | content.md source |
|---|---|---|
| 1 | Page hero: "Admissions & Enquiries Open", contact line, big WhatsApp + Call | [CONTACT] Status, Line |
| 2 | Branch cards ×4, grouped East / West: address, directions, branch-specific WhatsApp, tap-to-load map (C4) | [CONTACT] Branches |
| 3 | Enquiry form → prefilled WhatsApp message ("Preferred branch" lists all 4 by area-first name) | [CONTACT] Enquire about, Branches |
| 4 | FAQ (full) | [FAQ] |
| 5 | Social links (hidden until URLs) | [CONTACT] Social |

### Global (every page)
Header (logo, nav, Call icon on mobile) · sticky mobile WhatsApp/Call bar · breadcrumbs on inner pages · footer (taglines, all 4 branch cards grouped East / West, quick links, phone, trademark line).

---

## 2. Homepage section order (a parent on a phone, 10 seconds)

Viewport assumed: 375×667. Header ≈56px, sticky contact bar ≈64px, which leaves ≈547px for the fold.

| # | Section | Answers | Content | Source |
|---|---|---|---|---|
| 1 | **Hero** (above the fold) | Credibility | Status chip "Admissions & Enquiries Open" → h1 → small round portrait + "Trainer Revathi, Internationally Certified Jolly Phonics Trainer (CPD College UK, London)" → stat row **20+ years · 4,500+ students · Since 2001** → full-width **WhatsApp us** button (+ secondary Call link) | [BRAND], [FOUNDER], [CONTACT] |
| 2 | **"My child knows the alphabet. Why is reading still difficult?"** | Q1 What is phonics? | Short answer, c – a – t → cat visual, learning path strip, link to `#phonics` | [FOR PARENTS], [PROGRAMS] 1 |
| 3 | **Is it right for my child?** | Q2 | Cards by learner: young children (phonics, grammar, handwriting) · school students Sr. KG–Std. 8 (coaching) · adults & homemakers (English, spoken English) · teachers (training). Age line = TODO until confirmed. Each card links to its page and has a WhatsApp link | [PROGRAMS], [WHY] Who we serve |
| 4 | **Branches** | Q3 Where / when | All 4 branch cards, grouped Ambernath East (3) / Ambernath West (1), plus "WhatsApp us for current batch timings" | [CONTACT] Branches |
| 5 | **Meet Trainer Revathi** | Credibility, deeper | Landscape teaching photo, 2–3 line bio, belief quote, qualifications chips, 3 awards, link to `/about` | [FOUNDER] |
| 6 | **Why parents choose Tr. Revathi** | Credibility | 8 points from [WHY TR. REVATHI], laid out compactly | [WHY TR. REVATHI] |
| 7 | **For teachers and schools** | Secondary audiences | Two cards → `/teacher-training`, `/for-schools` | [TEACHER TRAINING], [FOR SCHOOLS] |
| 8 | **Gallery preview** | Social proof | 6 photos → `/gallery` (hidden until photos exist) | [GALLERY CATEGORIES] |
| 9 | **FAQ** (5 most-asked) | Q1–Q3 again | Age, "only for small children?", adults, where, coaching | [FAQ] |
| 10 | **Final CTA band** | Convert | Tagline "Teach • Guide • Transform" + WhatsApp + Call | [BRAND], [CONTACT] |
| — | Testimonials | — | **Hidden** until real testimonials exist | [TESTIMONIALS] |

**Proposed h1** (my call): "Phonics, English & coaching classes in Ambernath". The brand name appears in the logo and the trainer line right beside it, so the h1 can target the local search phrase.

Branches come before "Meet Trainer Revathi". A referred parent already trusts her name, so "where" is more urgent than a fuller bio, and the hero already carries the key trust signals.

---

## 3. Components

All copy comes from typed data in `src/content/`; components only render it.

### Shared
| Component | Purpose |
|---|---|
| `SiteHeader` / `MobileNav` | Logo, nav, Call icon; slide-down menu on mobile |
| `SiteFooter` | Taglines, branches, quick links, phone, social (when URLs exist), trademark line |
| `StickyContactBar` | Mobile-only bottom bar: WhatsApp + Call |
| `WhatsAppLink` | Builds `wa.me/919022582988?text=…` from a message prop (C1); button and inline variants |
| `CallLink` | `tel:+919022582988` |
| `Container`, `Section`, `SectionHeading` | Layout and heading-level discipline (one h1 per page) |
| `PageHero` | Inner-page hero: h1, intro, optional image slot, CTA |
| `Breadcrumbs` | Visual breadcrumbs plus `BreadcrumbList` JSON-LD |
| `TrustStats` | 20+ years / 4,500+ students / since 2001 |
| `CredentialLine` | "Internationally Certified Jolly Phonics Trainer, CPD College UK, London" |
| `ProgramCard` | Title, short line, link, optional image |
| `BranchCard` / `BranchList` | One card layout everywhere (no compact variant): area-first name, secondary line, full address, directions link, branch-specific WhatsApp; optional tap-to-load map (used on `/contact`). `BranchList` groups cards under "Ambernath East" and "Ambernath West" |
| `FaqAccordion` | Accessible accordion plus `FAQPage` JSON-LD |
| `CtaBand` | Closing CTA with a topic-specific message |
| `ImageSlot` | Wraps `next/image`; if the photo is missing, renders a labelled placeholder in dev (slot ID + description from §4) |
| `Todo` | Visible `TODO:` marker in dev, renders nothing in prod |
| `JsonLd` | Injects structured data |
| `PhonicsAccent` | The sparing multicolour-letter treatment from the logo (e.g. one word in a heading) |
| `ChipList` | Topic lists (covers, rules, subjects, qualifications) |

### Page-specific
| Page | Components |
|---|---|
| Home | `HomeHero`, `WhyPhonics` (with `SoundBlend` c–a–t visual), `LearningPath`, `WhoIsItFor`, `FounderIntro`, `WhyChooseUs`, `AudienceTeasers`, `GalleryPreview` |
| About | `AboutHero`, `BeliefQuote`, `QualificationList`, `CertificationList`, `AwardList`, `CommunityTimeline`, `VisionMission`, `CoreValues` |
| Programs | `ProgramAnchorNav`, `ProgramSection`, `LearningPath` (shared with Home), `AudienceList`, `SpecialClassesList`, `TeachingApproach` |
| Coaching | `SubjectGrid`, `CoachingApproach` |
| Teacher training | `TrainingCourse` (for whom / covers), `ArpanSection` (calm variant: muted colours, no imagery of children) |
| For schools | `WorkshopTracks` (teachers / students / parents) |
| Gallery | `GalleryFilter`, `GalleryGrid`, `Lightbox` |
| Contact | `ContactHero`, `BranchMap` (tap-to-load map, C4), `EnquiryForm` |

**Enquiry form fields** (my call): Name · I am a (Parent / Teacher / School / Adult learner) · Program (dropdown from [CONTACT] Enquire about) · Preferred branch (all 4, area-first names, grouped East / West, plus "Not sure yet") · Child's age or class (shown only for Parent) · Message. Submit opens WhatsApp with these fields formatted into the message. No backend.

---

## 4. Image slots

Every slot ID maps to a file at `public/images/<page>/<slot-id>.jpg`, so you can drop photos in by name. "Faces" means children's faces may be visible, which needs parent consent (content.md Q11). Slots marked *no faces needed* work before consent is confirmed.

### Brand
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| LOGO | Header, footer, favicon, OG | High-res logo or approval for an SVG redraw | — |
| OG | Social share preview | Built from logo + portrait + text (generated, not a photo) | 1200×630 |

### Home
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| H1 | Hero portrait (round crop on mobile, larger on desktop) | **Trainer Revathi, warm, waist-up**, smiling at camera, plain light background or softly blurred classroom; professional but approachable clothing | 4:5 portrait |
| H2 | "Why is reading difficult?" | Close-up of a child's hand on letter-sound cards or tracing letters, *no faces needed* | 4:3 |
| H3 | "Is it right for my child?": young children | Small group of young children in a phonics activity, bright, candid | 3:2 |
| H4 | "Is it right…": school students | Older primary student working with tutor at a desk | 3:2 |
| H5 | "Is it right…": adults & homemakers | Adult learner reading or practising with Tr. Revathi | 3:2 |
| H6 | "Is it right…": teachers | Tr. Revathi training a group of teachers | 3:2 |
| H7 | Meet Trainer Revathi | **Candid: Tr. Revathi teaching a small group of children**, her face visible, warm light | 3:2 landscape |
| H8–H9 | Teachers / schools teaser cards | Can reuse T1 and S1 | 3:2 |
| H10–H15 | Gallery preview | 6 best photos across categories | 1:1 |

### About
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| A1 | Hero portrait | **A second portrait of Tr. Revathi**, different from H1: in her classroom, standing or seated, three-quarter length | 4:5 |
| A2 | Certifications | **Jolly Phonics Trainer certificate (CPD College UK)**, photographed flat, straight-on, even light | 4:3 |
| A3 | Certifications | **ARPAN Trainer certificate**, same treatment | 4:3 |
| A4 | Awards | Receiving the **Business Entrepreneur Award** (India News Index, 2023) | 3:2 |
| A5 | Awards | Receiving the **ROVEX Award – SHAKTI** (2025) | 3:2 |
| A6 | Awards | Receiving the **Nation Builder Award** (Rotary Club of Ambernath North, 2025) | 3:2 |
| A7 | Community | Tr. Revathi at an Inner Wheel or Rotary event | 3:2 |
| A8 | Vision / values | **Little moment: Tr. Revathi with one child**, candid (e.g. high-five, reading together) | 1:1 |

### Programs
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| P1 | `#phonics` | Children doing phonics sound actions or sound cards in class | 3:2 |
| P2 | `#grammar` | Children writing sentences or doing a grammar worksheet | 3:2 |
| P3 | `#english` | Older student or adult reading aloud or speaking | 3:2 |
| P4 | `#handwriting` | Close-up of pencil grip on a practice sheet, *no faces needed* | 4:3 |
| P5 | `#special-classes` | Summer camp, drawing or art activity | 3:2 |

### Coaching
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| C1 | Hero | Tutor helping a primary-school student at a desk | 3:2 |
| C2 | Approach | Small group studying together, notebooks open | 3:2 |

### Teacher training
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| T1 | Hero | **Tr. Revathi leading a teacher-training session**, adults, presenting | 3:2 |
| T2 | Phonics TT | Teachers practising phonics activities or games | 3:2 |
| T3 | ECCEd | Teachers doing a hands-on early-childhood activity | 3:2 |
| T4 | Montessori | Montessori-style learning materials on a table, *no faces needed* | 4:3 |
| T5 | ARPAN | Optional. **Adults only**: Tr. Revathi speaking calmly to a seated group of educators or parents. **No children.** If there's no suitable photo, use none. | 3:2 |

### For schools
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| S1 | Hero | Phonics workshop in a school classroom or hall | 3:2 |
| S2 | Tracks | Tr. Revathi with a school's teachers | 3:2 |

### Gallery
Grouped by the 12 categories in [GALLERY CATEGORIES]. Each category needs about **3 photos minimum** to be shown. Files go in `public/images/gallery/<category-slug>/`.

### Contact / branches
| ID | Where | Photo needed | Shape |
|---|---|---|---|
| B1 | Ambernath East — Om Dubey Dham | Building entrance or signage, so parents recognise it ("above Shobha Hospital") | 3:2 |
| B2 | Ambernath West — Chinchpada | Navare Residency entrance or signage | 3:2 |
| B3 | Ambernath East — Vadavali | Little Champs Playschool entrance | 3:2 |
| B4 | Ambernath East — Nisarg Green | Flying Bird Preschool entrance | 3:2 |

Branch photos are all-or-nothing: cards show a photo only when all four exist, so the cards stay identical.

**Photo tips:** daylight, landscape unless noted, at least 1600px on the long edge, no heavy filters. On certificate photos, blur any personal ID numbers.

---

## 5. Content gaps that block sections

| content.md Q | Gap | Blocks | Until resolved |
|---|---|---|---|
| 5 | Phonics starting age | Home "Is it right for my child?" age line; FAQ "What age can children start?" | Show content.md's general answer; dev TODO on the exact age |
| 4 | Timings, days, fees, mode (online/offline) | Branch cards; coaching page; FAQ | "WhatsApp us for current batch timings" (C3); no fees; mode not mentioned |
| 3 | Programs per branch | Branch cards can't list programs | Cards say "Ask about programs at this branch" with a branch-specific WhatsApp link |
| 6 | Coaching subjects and boards | `/coaching` subjects grid | Show the draft subject list with a dev TODO; no boards mentioned |
| 7 | Real testimonials | Testimonials section | **Hidden** |
| 8 | Social URLs | Footer and contact social links; `sameAs` in schema | Hidden; dev TODO |
| 10 | High-res logo / SVG approval | Crisp header logo, favicon, OG image | Low-res PNG at small sizes (C6) |
| 11 | Photo consent | All slots with children's faces; whole gallery | Labelled placeholders; *no faces needed* slots can go first |
| 12 | "Scholarship Drawing" meaning | One item in Special Classes | Listed as written, dev TODO |
| — | Pincodes and map pins | Directions links; `postalCode` and `geo` in LocalBusiness schema | Directions use address text search; schema omits pincode and coordinates |
| — | Photos (none yet) | Every §4 slot; `/gallery` page | Placeholders; `/gallery` left out of nav and sitemap until it has photos |
| 1 | Brand-name confirmation | — (low risk) | Proceed with "Tr. Revathi Phonics" / full name as assumed |
| 9 | Email | — | Omitted |
| 13 | Truncated intro | — | Nothing |
| 2 | Branches 3 & 4 | — | **Answered**: area-first names recorded in content.md; presented identically to branches 1 & 2 |

All open TODOs are mirrored in `TODO.md` when building starts.

---

## 6. SEO map

Title pattern: `<page title> | Tr. Revathi Phonics`, except the home page. Titles stay at or under ~60 characters and descriptions at or under ~155. Every fact used comes from content.md. All pages get canonical URLs and Open Graph tags.

| Page | Title | Meta description | Primary keyword |
|---|---|---|---|
| `/` | Phonics Classes in Ambernath \| Tr. Revathi Phonics | Phonics, English and coaching classes in Ambernath East & West with an Internationally Certified Jolly Phonics Trainer. 20+ years, 4,500+ students. | phonics classes in Ambernath |
| `/about` | Trainer Revathi, Jolly Phonics Trainer in Ambernath | Meet Trainer Revathi Varier: Internationally Certified Jolly Phonics Trainer (CPD College UK), M.A. English, D.El.Ed, CTET, teaching phonics since 2001. | Jolly Phonics trainer Ambernath |
| `/programs` | Jolly Phonics, Grammar & English Classes \| Tr. Revathi Phonics | Jolly Phonics, Jolly Grammar, reading, spoken English and handwriting classes in Ambernath, taught by an Internationally Certified Jolly Phonics Trainer. | Jolly Phonics classes Ambernath |
| `/coaching` | Tuition Classes in Ambernath, Sr. KG to Std. 8 | Coaching and tuition for Sr. KG to Std. 8 in Ambernath East & West, focused on understanding concepts and building confidence. | tuition classes Ambernath East |
| `/teacher-training` | Phonics, ECCEd & Montessori Teacher Training, Ambernath | Phonics teacher training, ECCEd and Montessori teacher training in Ambernath with an Internationally Certified Jolly Phonics Trainer and certified ARPAN trainer. | teacher training Ambernath |
| `/for-schools` | Phonics Workshops for Schools \| Tr. Revathi Phonics | Phonics workshops and teacher-training sessions for schools: sessions for teachers, students and parents, by an Internationally Certified Jolly Phonics Trainer. | phonics workshop for schools Ambernath |
| `/gallery` | Gallery \| Tr. Revathi Phonics | Phonics classes, teacher training, workshops and student activities at Tr. Revathi Phonics, Ambernath. | Tr. Revathi Phonics Ambernath |
| `/contact` | Contact & Branches in Ambernath \| Tr. Revathi Phonics | Call or WhatsApp 9022582988. Branches in Ambernath East and Ambernath West. Admissions and enquiries open. | phonics classes near me Ambernath |

**Structured data**
- Root layout: `EducationalOrganization` (name, alternateName, telephone, `location` with branches 1–2 as `LocalBusiness` and branches 3–4 as `Place`, founder → `Person`).
- `/about`: `Person` (Revathi Raghunath Varier, alternateName "Trainer Revathi", `hasCredential` from qualifications, `award` from awards).
- `/contact`: `LocalBusiness` ×2 (C2) and `FAQPage`.
- Any page with an FAQ block: `FAQPage`.
- Inner pages: `BreadcrumbList`.
- Also: `sitemap.ts` (gallery excluded until it has photos), `robots.ts`, and the OG image (§4 OG).

---

## 7. Build phases — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (chosen: **Native**). Steps use checkbox (`- [ ]`) syntax for tracking. Use superpowers:verification-before-completion before reporting any phase done.

**Goal:** Build the v1 marketing site described in §0–§6, with every fact sourced from `content.md` and every conversion path ending in WhatsApp or a call.

**Architecture:** Next.js App Router, statically rendered. All copy and facts live as typed data in `src/content/`. Pure helpers in `src/lib/` turn that data into URLs, messages and JSON-LD; this is where the unit tests are. Components only render. Pages and layout are verified visually with playwright-cli screenshots, not tests.

**Tech Stack:** Next.js (latest, App Router, TypeScript, `src/` dir), Tailwind CSS v4, `next/font`, `next/image`, framer-motion (small interactions only), Vitest + Testing Library (unit tests for logic only), playwright-cli (visual verification), Lighthouse CLI. shadcn/ui is not used in v1: native `<details>` and `<select>` cover the FAQ and form. Deploy: Vercel.

**Spec:** §0–§6 of this file, plus `CLAUDE.md` and `content.md`.

### Testing scope
Unit tests cover **only** logic that can break:
1. WhatsApp link and message builders
2. Branch-card parity
3. JSON-LD output (Place vs LocalBusiness)
4. Enquiry form message formatting
5. `Todo` / `ImageSlot` dev-vs-prod behaviour

Everything else (pages, layout, nav, styling) is verified with **playwright-cli screenshots at 375px and 1440px**: run `npm run dev`, capture each touched page at both widths, look at them, and fix issues before committing.

### Stop points
- **STOP A**, after Task 6 (design checkpoint): show `/styleguide` and wait for approval before any page task.
- **STOP B**, after Task 8 (Home): wait for review before the remaining pages.

### Global Constraints
- Facts come **only** from `content.md`. A missing fact is a `todo()` value; it renders a visible `TODO:` in dev, renders nothing in prod, and is listed in `TODO.md`.
- WhatsApp: `https://wa.me/919022582988`. Call: `tel:+919022582988`. Displayed number: `9022582988`.
- Key numbers exactly: `20+` years, `4,500+` students, teaching Jolly Phonics `since 2001`.
- Credential line exactly: "Internationally Certified Jolly Phonics Trainer — CPD College UK, London".
- Footer trademark line on every page: "Jolly Phonics and Jolly Grammar are trademarks of Jolly Learning Ltd." No Jolly Learning logos, characters or artwork.
- Testimonials section is not built.
- ARPAN section: calm tone, muted palette, no imagery of children.
- Images only from `public/images/`, always via `next/image`, always with descriptive `alt`.
- One `<h1>` per page. No gradient blobs, no glassmorphism, no emoji as icons (inline SVG icons).
- All four branches render through the same `BranchCard`; the `LocalBusiness`/`Place` split (C2) exists only in `src/lib/jsonld.ts`.
- Mobile-first; no horizontal scroll at 375px. Lighthouse mobile ≥ 95 on Performance, Accessibility, Best Practices and SEO.
- Site URL from `NEXT_PUBLIC_SITE_URL`, falling back to `https://${VERCEL_PROJECT_PRODUCTION_URL}`, then `http://localhost:3000`.
- Logo: `public/images/logo/logo.svg` (redraw, client approval pending), with `logo-original.png` kept as a fallback, switchable with one constant (`LOGO_SRC` in `src/content/brand.ts`).

### Review Focus
1. **Production with no photos yet.** Every `ImageSlot` is empty at launch; pages must look intentional, with no empty boxes and no "TODO" text in prod. → unit test in Task 5; prod-build check in Task 18.
2. **Special characters in WhatsApp text** (`&`, `#`, `?`, newlines, Devanagari). → round-trip unit test in Task 3; enquiry test in Task 14.
3. **Long content at 375px** (branch 4 address, long names). → `overflow-wrap` in `BranchCard` (Task 4); `scrollWidth` check per route in Task 18.
4. **JavaScript off or not yet loaded** (in-app browsers on slow phones). CTAs, the sticky bar and the FAQ must work as plain HTML. → playwright-cli check with JS disabled in Task 8 and Task 18.
5. **Form submitted with only the required fields.** Empty optional fields are omitted; submit navigates in the same tab (`location.href`). → unit tests in Task 14.

### File map
```
src/
  content/   types.ts todo.ts brand.ts contact.ts branches.ts founder.ts vision.ts programs.ts coaching.ts
             teacher-training.ts schools.ts parents.ts why.ts faq.ts gallery.ts messages.ts seo.ts images.ts nav.ts
  lib/       site.ts contact.ts branches.ts enquiry.ts metadata.ts jsonld.ts env.ts
  components/
    layout/  SiteHeader MobileNav SiteFooter StickyContactBar Container Section SectionHeading Breadcrumbs Logo
    contact/ WhatsAppLink CallLink BranchCard BranchList BranchMap EnquiryForm
    blocks/  ImageSlot Todo PageHero TrustStats CredentialLine ChipList ProgramCard FaqAccordion CtaBand
             PhonicsAccent LearningPath JsonLd Button
    home/ about/ programs/ coaching/ teacher-training/ schools/ gallery/   (page-specific, §3)
  app/       layout.tsx page.tsx styleguide/ about/ programs/ coaching/ teacher-training/ for-schools/
             gallery/ contact/ sitemap.ts robots.ts opengraph-image.tsx icon.svg
tests/unit/*.test.ts(x)
TODO.md
```

---

### Phase 1 — Foundation

### Task 1: Repo, scaffold, tooling

**Files:**
- Create: Next.js app at the project root, `vitest.config.ts`, `.gitignore`, `C:\Projects\.gitignore` (new; it doesn't exist yet)
- Keep: `CLAUDE.md`, `content.md`, `PLAN.md`, `public/images/logo/logo-original.png`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `test` (`vitest run`). Path alias `@/*` → `src/*`.

- [ ] **Step 1:** Create `C:\Projects\.gitignore` containing `jolly-phonics-website/`, then confirm with `git -C C:\Projects status --short` that the folder no longer shows up.
- [ ] **Step 2:** Run `git init -b main` in `C:\Projects\jolly-phonics-website`.
- [ ] **Step 3:** `create-next-app` refuses non-empty folders that contain `CLAUDE.md` etc., so scaffold into a scratch folder: `npx create-next-app@latest <scratch>/app --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack-prompt` (accept defaults). Move its files into the project root, merging `public/`.
- [ ] **Step 4:** Install `framer-motion`. Install dev deps `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`. Add `vitest.config.ts` (jsdom, `@` alias, `tests/unit/**`).
- [ ] **Step 5:** Verify: `npm run build` succeeds and `npm test` runs (0 tests, exit 0 with `--passWithNoTests`).
- [ ] **Step 6: Commit** `chore: scaffold Next.js app with Vitest` (with `PLAN.md`, `CLAUDE.md`, `content.md`, logo).

### Task 2: Content layer

**Files:**
- Create: `src/content/*.ts` (file map), `TODO.md`

**Interfaces:**
- Produces:
  - `type Todo = { readonly kind: 'todo'; readonly id: string; readonly note: string }`; `todo(id, note): Todo`; `isTodo(v): v is Todo`
  - `type Side = 'east' | 'west'`
  - `interface Branch { id: 'om-dubey-dham' | 'chinchpada' | 'vadavali' | 'nisarg-green'; side: Side; name: string; secondary: string; address: string; schema: 'LocalBusiness' | 'Place'; hostBusiness?: string }`
  - `type PageKey = 'home' | 'about' | 'programs' | 'coaching' | 'teacher-training' | 'for-schools' | 'gallery' | 'contact'`; `interface PageSeo { path: string; title: string; description: string; keyword: string }`; `seo: Record<PageKey, PageSeo>`
  - `interface FaqItem { q: string; a: string | Todo }`; `faq: FaqItem[]`
  - `brand` (incl. `numbers: { years: '20+', students: '4,500+', since: '2001' }`, `LOGO_SRC`), `contact`, `branches: Branch[]` (content.md order), `founder` (incl. `credential`), `vision`, `programs`, `coaching`, `teacherTraining`, `schools`, `parents`, `why`, `nav`. Field names follow content.md headings.
  - `gallery.ts`: `galleryCategories` (12), `galleryPhotos: { category; src; alt }[]` (empty), `visibleCategories(photos)` (categories with ≥ 3 photos), `galleryHasPhotos(): boolean`

- [ ] **Step 1:** Transcribe content.md verbatim. Gaps become `todo()` with ids `phonics-age`, `batch-timings`, `programs-per-branch`, `coaching-subjects-confirm`, `coaching-boards`, `social-urls`, `scholarship-drawing`, `pincodes`, `logo-approval`, `photo-consent`. `seo.ts` = §6 verbatim. No testimonials data.
- [ ] **Step 2:** Write `TODO.md`: one line per id, written as `` `todo:<id>` ``, with its content.md question number and the section it affects.
- [ ] **Step 3:** Verify: `npx tsc --noEmit` passes; read through each content file against content.md to check no fact was added or changed.
- [ ] **Step 4: Commit** `feat: typed content layer from content.md`

### Task 3: WhatsApp and call links ✅ tested

**Files:**
- Create: `src/lib/contact.ts`, `src/content/messages.ts`, `src/components/contact/WhatsAppLink.tsx`, `src/components/contact/CallLink.tsx`, `tests/unit/contact.test.ts`

**Interfaces:**
- Consumes: `contact`, `Branch` (Task 2)
- Produces: `whatsappUrl(message?: string): string`; `telHref(): string`; `messages: Record<'general' | 'phonicsSuitability' | 'phonics' | 'grammar' | 'english' | 'handwriting' | 'specialClasses' | 'coaching' | 'teacherTraining' | 'schools' | 'about', string>`; `branchMessage(b: Branch): string`; `<WhatsAppLink message variant="primary" | "secondary" | "inline">`; `<CallLink variant=…>`. Both are plain `<a>` (no JS needed); WhatsApp gets `target="_blank" rel="noopener"`.

- [ ] **Step 1: Write failing tests:**
  - `whatsappUrl()` → `'https://wa.me/919022582988'`
  - `new URL(whatsappUrl('A & B #1?\nनमस्ते')).searchParams.get('text')` → `'A & B #1?\nनमस्ते'`
  - `telHref()` → `'tel:+919022582988'`
  - `branchMessage(<vadavali>)` contains `'Ambernath East — Vadavali'`
  - every `messages` value is non-empty and produces a valid URL.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement (`encodeURIComponent`). `branchMessage`: "Hi, I'm enquiring about the {name} branch." `phonicsSuitability`: "Hi, I'd like to know if phonics is suitable for my child (age __)."
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: WhatsApp and call link helpers`

### Task 4: Branch cards ✅ tested

**Files:**
- Create: `src/lib/branches.ts`, `src/components/contact/BranchCard.tsx`, `BranchList.tsx`, `BranchMap.tsx`, `tests/unit/branches.test.tsx`

**Interfaces:**
- Consumes: `branches`, `Branch` (Task 2); `WhatsAppLink`, `branchMessage` (Task 3)
- Produces:
  - `groupBranchesBySide(bs: Branch[]): { side: Side; label: 'Ambernath East' | 'Ambernath West'; branches: Branch[] }[]`. East first; content.md order within a side.
  - `directionsUrl(b)` → `https://www.google.com/maps/search/?api=1&query=<encoded address>`; `mapEmbedUrl(b)` → `https://www.google.com/maps?q=<encoded address>&output=embed`
  - `<BranchCard branch withMap? headingLevel={2|3|4} />`: `data-testid="branch-card"`, with child `data-part`s `name`, `secondary`, `address`, `directions`, `whatsapp` (+ `map` when `withMap`). `<BranchMap>` is a client component: "Show map" button → lazy iframe titled "Map of {name}".
  - `<BranchList withMap? headingLevel={2|3} />`: groups with side labels.

- [ ] **Step 1: Write failing tests:**
  - `groupBranchesBySide(branches)` → East `['om-dubey-dham', 'vadavali', 'nisarg-green']`, West `['chinchpada']`.
  - **Parity:** `<BranchList />` renders 4 `branch-card`s whose sorted `data-part` lists are identical, and whose class lists are identical. Same check with `withMap`.
  - The `nisarg-green` card contains its full content.md address.
  - `withMap`: no `iframe` until "Show map" is clicked, then exactly one.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement. Use `overflow-wrap: anywhere` on the address; no per-branch conditionals in markup or classes.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: identical branch cards grouped by side of town`

### Task 5: Todo and ImageSlot ✅ tested

**Files:**
- Create: `src/lib/env.ts`, `src/content/images.ts`, `src/components/blocks/Todo.tsx`, `src/components/blocks/ImageSlot.tsx`, `tests/unit/dev-prod.test.tsx`
- Modify: `src/lib/branches.ts`, `BranchCard.tsx` (branch photos), `tests/unit/branches.test.tsx`

**Interfaces:**
- Produces:
  - `showTodos: boolean` (`process.env.NODE_ENV !== 'production'`); tests mock `@/lib/env`.
  - `type SlotId` = every §4 ID except gallery (`'H1' … 'B4'`); `interface ImageSlotDef { id; description; ratio: '4:5' | '4:3' | '3:2' | '1:1'; photo?: { src: string; alt: string } }`; `imageSlots: Record<SlotId, ImageSlotDef>`
  - `<ImageSlot id sizes priority? className? />`: photo → `next/image`; no photo + dev → dashed box `data-placeholder` with the id + description at the slot ratio; no photo + prod → `null`
  - `<Todo value />`, `renderMaybeTodo(v: string | Todo)`: dev → visible `TODO: {note}` with `data-todo`; prod → `null`
  - `branchPhotosReady(): boolean` (true only if B1–B4 all have photos); `BranchCard` shows its B-slot only when it is true.

- [ ] **Step 1: Write failing tests:**
  - `ImageSlot` with no photo: dev renders `[data-placeholder]` containing `H1`; prod renders nothing. With a photo: an `img` with the given alt.
  - `Todo`: same dev/prod pair; `renderMaybeTodo('x')` → `'x'`.
  - Branch photos: with B1–B3 only, no card has an `img` or placeholder; with all four, every card has one; the parity test still passes.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: dev-only TODO and image placeholders`

Phase 1 done: run superpowers:verification-before-completion (`npm test`, `npm run build`, `npx tsc --noEmit`) before reporting.

---

### Phase 2 — Design checkpoint

### Task 6: Design system, SVG logo, `/styleguide` 🛑 STOP A

**Skills:** frontend-design:frontend-design, design-taste-frontend, ui-ux-pro-max (load all three before designing).

**Files:**
- Create: `public/images/logo/logo.svg`, `src/components/layout/Logo.tsx`, `src/components/blocks/Button.tsx`, `CtaBand.tsx`, `PhonicsAccent.tsx`, `src/components/layout/StickyContactBar.tsx`, `src/app/styleguide/page.tsx`, `src/app/icon.svg`
- Modify: `src/app/globals.css` (`@theme` tokens), `src/app/layout.tsx` (fonts), `src/content/brand.ts` (`LOGO_SRC`)

**Interfaces:**
- Produces:
  - Tokens in `@theme`:
    - colours: `--color-brand-red`, `--color-ink`, `--color-paper`, `--color-surface`, `--color-muted`, `--color-line`, `--color-accent-lime`, `--color-letter-{orange,blue,green,purple,cyan}`, plus a calm palette for ARPAN
    - type scale: `--text-*` (fluid, mobile-first)
    - spacing rhythm; radii `--radius-{sm,md,lg,pill}`
    - fonts: `--font-display`, `--font-body` via `next/font`
  - `<Logo className? />`: renders `LOGO_SRC` via `next/image`, alt "Tr. Revathi Phonics".
  - `<Button as="a" variant="whatsapp" | "call" | "primary" | "secondary">`; `WhatsAppLink` and `CallLink` (Task 3) are restyled to use it.
  - `<PhonicsAccent text />`: cycles the letter colours; its accessible name is the plain text.
  - `<CtaBand title? message />`; `<StickyContactBar />`: mobile only, WhatsApp + Call; the body gets matching bottom padding.

- [ ] **Step 1:** Load the three design skills. Sample the logo's red, letter colours and lime border from `logo-original.png` (pixel sampling). Derive tokens on a calm white/ink foundation, using the multicolour only as an accent. Text colours must reach ≥ 4.5:1 contrast (check with a contrast script and note the ratios in `globals.css` comments). Choose display and body fonts (rounded display font + highly readable body font, per CLAUDE.md).
- [ ] **Step 2:** Redraw the logo as `logo.svg`: red "TR. REVATHI" over multicolour "Phonics" inside the lime rounded border, matching the PNG's proportions. Text is converted to paths (no font dependency); `viewBox` only, no fixed size; `<title>` = "Tr. Revathi Phonics". Set `LOGO_SRC` to the SVG and keep the PNG in place as the one-line fallback. Derive `icon.svg` (favicon) from it.
- [ ] **Step 3:** Build the components above.
- [ ] **Step 4:** Build `/styleguide`. Sections:
  - colour tokens (swatch + hex + contrast ratio)
  - type scale
  - spacing and radii
  - logo (SVG and PNG side by side)
  - PhonicsAccent
  - buttons (all variants, focus state)
  - `BranchList` (all 4 cards)
  - CtaBand
  - ImageSlot placeholder (H1 and a 3:2 slot)
  - StickyContactBar

  Set `metadata.robots = { index: false, follow: false }`. Leave it out of nav and sitemap (Task 16 excludes it explicitly).
- [ ] **Step 5:** Verify with playwright-cli: `/styleguide` at 375px and 1440px; no horizontal scroll at 375px; keyboard focus visible on buttons; `npm run build` passes; `npm test` still passes.
- [ ] **Step 6: Commit** `feat: design tokens, SVG logo and styleguide`
- [ ] 🛑 **STOP A:** run superpowers:verification-before-completion, share the screenshots and token summary, and **wait for approval** before Task 7.

---

### Phase 3 — Shell and Home

### Task 7: Site shell and shared blocks

**Files:**
- Create: `src/components/layout/{SiteHeader,MobileNav,SiteFooter,Container,Section,SectionHeading,Breadcrumbs}.tsx`, `src/components/blocks/{PageHero,TrustStats,CredentialLine,ChipList,ProgramCard,FaqAccordion,LearningPath,JsonLd}.tsx`, `src/lib/site.ts`, `src/lib/metadata.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Tasks 2–6
- Produces:
  - `SITE_URL` (via `resolveSiteUrl(env)`)
  - `pageMetadata(key: PageKey): Metadata`: title (home uses `absolute`; otherwise the template `%s | Tr. Revathi Phonics`, unless the §6 title already contains the brand), description, `alternates.canonical`, `openGraph` (`locale: 'en_IN'`)
  - `<Breadcrumbs trail={{ name; path }[]} />`
  - `<PageHero title intro? slot? cta? />` (owns the page h1)
  - `<FaqAccordion items />` (native `<details>`)
  - `<LearningPath steps />` (ordered list)
  - `<JsonLd data />`
  - `<TrustStats />`, `<CredentialLine />`, `<ChipList items />`, `<ProgramCard title text href slot? message? />`

- [ ] **Step 1:** Implement the shell:
  - header: `Logo`, nav from `nav` (gallery only when `galleryHasPhotos()`), Call icon on mobile
  - mobile nav: Escape closes, focus returns to the toggle
  - footer: taglines, `<BranchList headingLevel={3} />`, quick links, phone, trademark line; social links only when URLs exist
  - `StickyContactBar` in the layout
- [ ] **Step 2:** Implement the shared blocks.
- [ ] **Step 3:** Verify with playwright-cli at 375px and 1440px on `/` and `/styleguide`:
  - header and mobile nav (open and closed)
  - the sticky bar doesn't cover the footer
  - the footer shows 4 identical branch cards grouped East / West
  - `npm run build` passes
- [ ] **Step 4: Commit** `feat: site shell and shared blocks`

### Task 8: Home (`/`) 🛑 STOP B

**Files:** `src/app/page.tsx`, `src/components/home/{HomeHero,WhyPhonics,SoundBlend,WhoIsItFor,FounderIntro,WhyChooseUs,AudienceTeasers,GalleryPreview}.tsx`

- [ ] **Step 1:** Build the sections in the §2 order, with `section` ids `hero, why-phonics, who, branches, founder, why-us, audiences, gallery-preview` (only when `galleryHasPhotos()`), `faq`, `cta`. `metadata = pageMetadata('home')`. Breadcrumbs are not used on Home.
- [ ] **Step 2:** Verify with playwright-cli:
  - 375×667: the h1, credential line, all three trust stats and the WhatsApp button are visible above the sticky bar without scrolling
  - 1440×900 full page
  - with JavaScript disabled: the hero WhatsApp link, sticky-bar links and FAQ `details` work
  - no horizontal scroll at 375px
  - exactly one h1
  - no testimonials
  - `npm run build` passes
- [ ] **Step 3: Commit** `feat: home page`
- [ ] 🛑 **STOP B:** run superpowers:verification-before-completion, share the 375px/1440px screenshots, and **wait for review** before Task 9.

---

### Phase 4 — Remaining pages

Each page task:
1. Build the §1 sections in order with the shared blocks and the §3 page-specific components. Set `metadata = pageMetadata(<key>)` and add `<Breadcrumbs>`.
2. Verify with playwright-cli at 375px and 1440px: exactly one h1, no horizontal scroll at 375px, page-specific checks below, `npm run build` passes.
3. Commit `feat: <page> page`.

### Task 9: About (`/about`)
`src/app/about/page.tsx`, `src/components/about/*`. Check: all 5 qualifications, 3 awards with years, Inner Wheel roles 2017–2025, belief quote in a `<blockquote>`.

### Task 10: Programs (`/programs`)
`src/app/programs/page.tsx`, `src/components/programs/*`. Anchor nav is sticky under the header and horizontally scrollable at 375px; sections get `scroll-margin-top`. Check: each anchor link lands correctly; the 6-step learning path; "Scholarship Drawing" shows a dev TODO; each CTA uses its own message; there is a link to `/coaching`.

### Task 11: Coaching (`/coaching`)
`src/app/coaching/page.tsx`, `src/components/coaching/*`. Check: subjects show the dev TODO (confirm + boards); 4 branch cards grouped East/West; timings line; FAQ subset of 2.

### Task 12: Teacher training (`/teacher-training`)
`src/app/teacher-training/page.tsx`, `src/components/teacher-training/*`. Check: Phonics TT, ECCEd, Montessori, ARPAN in order; `#arpan` uses the calm tone and has no image except optional slot T5.

### Task 13: For schools (`/for-schools`)
`src/app/for-schools/page.tsx`, `src/components/schools/*`. Check: three tracks with content.md items; CTA uses `messages.schools`.

### Task 14: Contact (`/contact`) and enquiry form ✅ tested

**Files:** `src/app/contact/page.tsx`, `src/lib/enquiry.ts`, `src/components/contact/EnquiryForm.tsx`, `tests/unit/enquiry.test.ts`

**Interfaces:**
- Produces: `interface EnquiryFields { name: string; role: 'Parent' | 'Teacher' | 'School' | 'Adult learner'; program: string; branchId: Branch['id'] | 'not-sure'; childAge?: string; message?: string }`; `buildEnquiryMessage(f: EnquiryFields): string`. Lines are `Name: …`, `I am a: …`, `Interested in: …`, `Preferred branch: <area-first name | Not sure yet>`, `Child's age/class: …`, `Message: …`, joined with `\n`.

- [ ] **Step 1: Write failing tests:**
  - empty or whitespace optional fields are omitted
  - `childAge` is omitted unless `role === 'Parent'`
  - `branchId: 'vadavali'` → line `Preferred branch: Ambernath East — Vadavali`
  - `'not-sure'` → `Preferred branch: Not sure yet`
  - a Devanagari name round-trips through `whatsappUrl(buildEnquiryMessage(f))`
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement `buildEnquiryMessage`, then the form:
  - visible `<label>`s
  - branch `<select>` with `<optgroup>` Ambernath East / Ambernath West + "Not sure yet"
  - program `<select>` with the 11 "Enquire about" items
  - child age shown only for Parent
  - errors announced via `aria-describedby`, focus moves to the first invalid field
  - submit sets `location.href = whatsappUrl(...)`

  Then the page: 4 `BranchCard`s with `withMap`, the full FAQ.
- [ ] **Step 4:** `npm test` → PASS. Verify with playwright-cli at 375px/1440px: the form, the optgroups, the Parent-only field, and that submit navigates to a `wa.me` URL.
- [ ] **Step 5: Commit** `feat: contact page with enquiry form`

### Task 15: Gallery (`/gallery`)
`src/app/gallery/page.tsx`, `src/components/gallery/{GalleryFilter,GalleryGrid,Lightbox}.tsx`. With no photos: intro + dev TODO, `robots: { index: false }`. Check with a temporary local fixture of 3 photos (not committed): filter chip, lightbox opens on Enter, Escape closes it and returns focus.

Phase 4 done: run superpowers:verification-before-completion before reporting.

---

### Phase 5 — SEO

### Task 16: Sitemap, robots, Open Graph image
`src/app/sitemap.ts` (every `seo` path except `/gallery` while `!galleryHasPhotos()`; never `/styleguide`; absolute `SITE_URL` URLs), `src/app/robots.ts` (allow `/`, disallow `/styleguide`, sitemap URL), `src/app/opengraph-image.tsx` (1200×630 `ImageResponse`: logo, name, credential line, three stats). Verify: open `/sitemap.xml`, `/robots.txt` and `/opengraph-image` in the dev server. Commit.

### Task 17: Structured data ✅ tested

**Files:** `src/lib/jsonld.ts`, `tests/unit/jsonld.test.ts`; Modify: `src/app/layout.tsx`, `about/page.tsx`, `contact/page.tsx`, FAQ-bearing pages, `Breadcrumbs.tsx`

**Interfaces:**
- Produces: `organizationJsonLd()` (`EducationalOrganization`, `@id: ${SITE_URL}/#org`, `founder` → `${SITE_URL}/about#revathi`, `location` = all 4 branches); `personJsonLd()`; `localBusinessJsonLd(b: Branch)`; `faqJsonLd(items: FaqItem[])`; `breadcrumbJsonLd(trail)`.

- [ ] **Step 1: Write failing tests:**
  - `organizationJsonLd().location` has 4 entries: `om-dubey-dham` and `chinchpada` are `'LocalBusiness'`; `vadavali` and `nisarg-green` are `'Place'`.
  - Every location has `telephone: '+919022582988'` and `address.streetAddress` equal to the content.md address; no `postalCode` or `geo` while those are TODO.
  - `localBusinessJsonLd` throws for a `Place` branch.
  - `faqJsonLd` skips items whose answer is a `Todo`.
  - `personJsonLd()` has `name: 'Revathi Raghunath Varier'`, `alternateName: 'Trainer Revathi'` and 3 `award`s.
  - No `sameAs` while social URLs are TODO.
- [ ] **Step 2:** `npm test` → FAIL. **Step 3:** Implement and wire in via `<JsonLd>`: org in layout, Person on `/about`, LocalBusiness ×2 on `/contact`, FAQPage wherever `FaqAccordion` renders, BreadcrumbList in `Breadcrumbs`. **Step 4:** `npm test` → PASS. Paste one page's JSON-LD into validator.schema.org. **Step 5: Commit** `feat: JSON-LD structured data`

---

### Phase 6 — Quality gate

### Task 18: Production checks
- [ ] `npm run build && npm run start`. With playwright-cli on every route at 375px:
  - no text matching `/TODO/`, and no `[data-placeholder]` or `[data-todo]` (Review Focus 1)
  - `scrollWidth <= clientWidth` (Review Focus 3)
  - every `img` has `alt`
  - exactly one h1
  - CTAs work with JS disabled (Review Focus 4)
- [ ] For each route, run `npx lighthouse <url> --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --quiet --output=json`. Every score must be ≥ 95; fix and re-run until it is.
- [ ] Final playwright-cli screenshots of every page at 375px and 1440px.
- [ ] Refresh `TODO.md` against the `todo()` ids in `src/content/`.
- [ ] superpowers:verification-before-completion, then **Commit** `chore: production quality gate` with the Lighthouse scores in the message.

### Not in this plan (waiting on answers)
- **Logo approval:** the SVG ships with the PNG fallback. Reverting is one line (`LOGO_SRC`).
- **Production domain:** set `NEXT_PUBLIC_SITE_URL` in Vercel. No code change needed.
- **Real photos:** set `photo: { src, alt }` on slots in `src/content/images.ts`; gallery photos go in `galleryPhotos`.
