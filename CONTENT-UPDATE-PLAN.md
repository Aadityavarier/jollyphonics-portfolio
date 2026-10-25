# CONTENT-UPDATE-PLAN — Trainer Revathi bio-data (client-input/2026-10-24-biodata.md)


## Context
The client sent Trainer Revathi's full bio-data and awards list. It adds: the institute's founding year (2023), Ulhasnagar, a title line, the ARPAN training dates, a new certification, the full Inner Wheel timeline (Centurion Secretary, IPP), more community roles, a 4th award (Innovative Teaching Award 2026), exact award dates, areas of expertise (including Jolly English), and a professional vision line. It also answers the open question Q13 (the cut-off intro). The goal is to apply exactly the confirmed facts, keep the excluded items out (Lata Mangeshkar honour, MIMAMSA, the duplicate RCAN entry), and make the award and milestone code fully data-driven, so a future award only needs a content edit.

**Decisions taken (from your answers):**
- **Journey = curated, 7 stops:** 2001 started Jolly Phonics · 2017 joined Inner Wheel · 2021 ARPAN · 2023 founded the institute + Business Entrepreneur Award (one stop) · 2024–25 Inner Wheel President · 2025 ROVEX SHAKTI + Nation Builder (one stop) · 2026 Innovative Teaching Award. IPP 2025–26, Centurion Secretary, Correspondent and ARPAN 2023 appear only in their own About sections.
- **Areas of expertise = a chip list on /about**, next to "Has worked with". "Rapid Teacher's Training" is left out (RTTI rule).

**Approved with changes (2026-10-25), these override anything below:**
1. Trademark line stays exactly as it is. Jolly English is **not** added (to content.md or brand.ts).
2. Task 1 adds `client-input/` to `.gitignore`.
3. Award flip-card **front** = year + award name (e.g. "2025 · ROVEX Award – SHAKTI"); **back** = detail, date and note. Flip behaviour and the no-JS/reduced-motion view are unchanged.

**Defaults (approved):**
- Award names are stored without the year (`"Innovative Teaching Award"`, `year: "2026"`), the same as the existing entries. JSON-LD `award` strings become `"<name> (<year>)"`.
- The Jolly Grammar program keeps its short `title: "Jolly Grammar"` for tiles, chips, the dropdown and WhatsApp messages. A new `heading: "Jolly Grammar & Jolly English"` is used as the /programs section heading and in llms.txt. This avoids awkward cascades like "Jolly Phonics, Jolly Grammar & Jolly English and handwriting" on Home.
- The trademark note gains Jolly English: "Jolly Phonics, Jolly Grammar and Jolly English are trademarks of Jolly Learning Ltd."
- `client-input/` stays **uncommitted**: it is a raw WhatsApp export with personal details. `content.md` becomes the record.
- Nothing about Phonics TT or Montessori TT is open in `TODO.md` or `CLIENT-QUESTIONS.md` today (I checked), so the confirmation is recorded in content.md only. Q13 *is* answered, so it gets closed in all three docs.

---

## a) Changes, by file and field

### 1. `content.md` (source of truth, first)
- OPEN QUESTIONS: mark Q13 ANSWERED (2026-10-24): "With over 20 years of experience in education, she has been teaching Jolly Phonics since 2001 across Ambernath and Ulhasnagar and has trained more than 4,500 students." Note under it that both Phonics TT and Montessori TT are still offered (confirmed 2026-10-24).
- BRAND › Key numbers: add "Institute founded: 2023". Trademark NOTE: add Jolly English.
- FOUNDER: add **Title line**; Role "Founder, Tr. Revathi Phonics & Coaching Classes (established 2023)"; Bio sentence 2 becomes "Teaching Jolly Phonics since 2001 across Ambernath and Ulhasnagar, …"; add a bio sentence about the founding.
- Qualifications: ECCEd → "ECCEd / DECCED — …" (rest unchanged).
- Certifications: ARPAN gets "— trained April 2021 and April 2023"; add "Rapid Teacher's Training for ECCEd (certification)"; add the RTTI rule as a note (separate organisation, not a program).
- New **Areas of expertise** list (bio-data list minus Rapid Teacher's Training). Jolly English is listed separately.
- Awards: replace with exactly the 4, newest first, with dates and venues as confirmed. Add an **EXCLUDED** note: Lata Mangeshkar honour, MIMAMSA, duplicate RCAN (never publish).
- Community: full Inner Wheel timeline (+ Centurion Secretary, + IPP 2025–26); Rotarian; Project Coordinator, Medical Project Jeevan Shakti (Zone 6); Zone 6 Coordinator, MindShield Yagna.
- VISION: add the professional vision line. The motto is unchanged.
- PROGRAMS › Jolly Grammar: "Taught together with Jolly English."

### 2. `src/content/` (typed data)
| File | Field | Change |
|---|---|---|
| `founder.ts` | `titleLine` (new) | `["Educationist","Entrepreneur","Internationally Certified Jolly Phonics Trainer","Community Leader"]` |
| | `founded` (new) | `"2023"` |
| | `role` | founding-year wording per content.md |
| | `bio` | Ulhasnagar + founding sentence |
| | `qualifications[3].title` | `"ECCEd / DECCED"` |
| | `certifications` | becomes `{ id, name, detail?, trained?: string[] }[]`: `jolly-phonics`, `arpan` (`trained: ["April 2021","April 2023"]`), `rapid-ecced`, `cpd` (existing third line kept) |
| | `expertise` (new) | 12 items |
| | `awards` | `{ id, name, detail, year, date?, note?, journey?: true }[]`, newest first: `innovative-teaching` (2026, date 8 October 2026, venue detail, note), `rovex` (2025, 9 October 2025), `nation-builder` (2025, "Rotary Club of Ambernath North (RCAN)", note), `business` (2023). All flagged `journey: true` |
| | `community.innerWheel.roles` | `{ id, role, period, journey?: true }`: member (journey), correspondent, centurion-secretary ("Centurion Secretary"), president (journey), ipp ("IPP (Immediate Past President)", "2025–26") |
| | `community.rotary` | becomes `{ role: "Rotarian", org: "Rotary Club of Ambernath East" }` (no more regex in jsonld) |
| | `community.roles` (new) | Jeevan Shakti, MindShield Yagna `{ role, org }` |
| `journey.ts` | `Milestone` | becomes `{ when; lines: { id; title; detail? }[] }`. It is built from: the start (`brand.numbers.since`), the `journey`-flagged Inner Wheel roles, the ARPAN `trained[0]` year, `founder.founded`, and the `journey`-flagged awards. Items are sorted by numeric start year (stable, so the founding comes before the 2023 award) and grouped by the same `when` into one stop. No name-substring lookups. |
| `vision.ts` | `professional` (new) | the vision line |
| `programs.ts` | `grammar.heading` (new), `grammar.intro` | "Jolly Grammar & Jolly English"; "From phonics to structured grammar, taught together with Jolly English." |
| `teacher-training.ts` | `arpan.credential` | built from `founder.certifications` arpan: "…, trained April 2021 and April 2023" |
| `why.ts` | Qualifications text | built from `founder.qualifications.map(q=>q.title)` (picks up "ECCEd / DECCED") |
| `brand.ts` | `trademarkNote` | + Jolly English |
| `labels.ts` | `pages.about` | + `expertise: "Areas of expertise"`, `otherRoles: "Other community roles"`; `"Awards & recognition"` and `"Community & leadership"` move from JSX literals into labels |
| `images.ts` | `A9` (new) | "Receiving the Innovative Teaching Award (2026)" |

### 3. Code (rendering / derived)
- `src/lib/journey.ts` `teaserMilestones`: picks the stops containing line ids `start`, `iw-member` and `founded`, plus the **last** stop. It dedupes and keeps the order. With today's data that gives 2001, 2017, 2023, 2026.
- `src/lib/jsonld.ts` `personNode`: `award` built from data; `hasCredential` = qualifications **+ certifications** (`credentialCategory: "degree"/"certification"`); `memberOf` = Inner Wheel as an `OrganizationRole` (roleName = latest role, startDate "2017") + Rotary Club of Ambernath East; `knowsAbout` = expertise; `description` = the title line joined with " | ". `organizationNode` gets `foundingDate: founder.founded`.
- `src/lib/llms.ts`: the founder sentence adds "founded the institute in 2023" and Ulhasnagar; adds an "Awards" line built from data; uses `programs.grammar.heading`. `seo.ts` has no award mentions, so no change.

## b) Where it appears on the site
| Page | What changes | Component |
|---|---|---|
| /about hero | Title line (small, under the name, above CredentialLine) | `app/about/page.tsx` |
| /about bio | Ulhasnagar + founding sentence | page (data) |
| /about journey | 7 curated stops; grouped stops show each line | `about/PathJourney.tsx` (render `lines`) |
| /about certifications | 4 entries; ARPAN shows its training dates | page |
| /about expertise | New ChipList beside "Has worked with" (same section, two columns at lg) | page |
| /about awards | 4 flip cards, newest first; back shows name, detail, date (or year) and note | page + `FlipCard` |
| /about community | Inner Wheel 5-role line; right column "Other community roles" list + initiatives | page |
| /about vision | Professional vision line as the first paragraph | page |
| Home founder panel | Seal unchanged (credential + "since 2001"); teaser 2001/2017/2023/2026; 4 award rows, newest first; "ECCEd / DECCED" chip | `FounderIntro`, `JourneyTeaser` |
| Home why | Qualifications line from data | `why.ts` |
| /programs | Section heading "Jolly Grammar & Jolly English" + intro | `app/programs/page.tsx` |
| /teacher-training | ARPAN credential line with dates; trainer qualification chips show "ECCEd / DECCED" | data |
| Person JSON-LD | award ×4, hasCredential ×9, memberOf, knowsAbout | `jsonld.ts` |
| llms.txt, footer trademark | as above | `llms.ts`, `brand.ts` |

## c) Hardcoded assumptions to remove
- `content/journey.ts`: `award("Business")`, `award("ROVEX")`, `role("Secretary")` name lookups and the hand-merged ROVEX+Nation stop → flags + group-by-year.
- `lib/journey.ts`: "first award" via `/Award/` regex → id-based picks; the latest stop stays last.
- `app/about/page.tsx`: `sm:grid-cols-3` (assumes 3 awards) → `sm:grid-cols-2 lg:grid-cols-4`. 5+ awards wrap without code changes.
- `JourneyTeaser`/`PathJourney` keys use `when` → `when + first line id` (two stops could share a year in future).
- `jsonld.ts`: the `rotary.replace(/^Rotarian…/)` regex → structured field.
- Comments/tests saying "three awards" (`FounderIntro.tsx` doc comment, `founder-home.test.tsx`), CLIENT-QUESTIONS "your three awards" → count-free wording.
- PathJourney already sizes itself from `milestones.length` (n is data-driven). Leave it.

## d) Layout risks
- **Awards 4-up:** at 1440 the 4 columns are about 270px wide. The longest back face (Innovative Teaching: venue + date + note) may exceed `min-height: 9.5rem`. Check that the faces grow, not overflow. If they overflow, the note moves to `text-small` and the venue stays on the back only. At 375 it's 1 column (unchanged); at 640–1023, 2×2.
- **Two "2025" fronts** (ROVEX, Nation Builder) look identical before flipping. Acceptable, because the back and the no-JS/reduced-motion view show both faces. Flag it if the screenshots look odd.
- **Journey:** still 7 stops, so the desktop pin distance is unchanged. Grouped stops (2023, 2025) have 2 lines. Check that the card height above/below its dot fits inside `min(30rem, 62svh)` at 1440×900. On mobile the vertical list just gets taller.
- **Teaser:** the 2023 stop shows its first line, "Founded the institute" (short title), at 375 inside the 4-column `.jt` rule. Check the wrapping.
- **/programs heading** `fx="soundout"` with the longer "Jolly Grammar & Jolly English": check the "&" splitting and wrapping at 375.
- **Community line** with 5 roles: still one paragraph, about 3 lines on mobile. Fine.
- No-JS / reduced motion: everything is plain text lists; FlipCard shows both faces. No new motion.

## e) Tasks (one commit each, on `preview`)
0. **Save plan** to this file. *Done.*
1. **content.md**: all edits in §a.1, with the EXCLUDED and RTTI notes. *Done:* `grep -n "Lata\|MIMAMSA" content.md` hits only the EXCLUDED note; exactly 4 award bullets.
2. **founder.ts + vision.ts + brand.ts + images.ts + labels.ts** data shapes (§a.2). Update consumers so typecheck passes (about page, FounderIntro, jsonld rotary). *Done:* `npm run typecheck` green.
3. **Data-driven journey**: new `journey.ts` builder + `lib/journey.ts` teaser + PathJourney/JourneyTeaser render `lines`. Tests first (TDD): journey has 7 stops in this order; 2023 and 2025 are grouped; teaser = 2001/2017/2023/2026; adding a fake `journey:true` award in the test produces a new last stop. *Done:* `npm test` green.
4. **/about rendering**: title line, certifications, expertise chips, awards grid + back-face fields, community roles, vision line, labels instead of literals. *Done:* SSR test asserts every award name, the expertise items, "IPP" and the vision line are in the HTML; excluded names absent.
5. **Programs + teacher training + why**: grammar heading/intro, ARPAN credential, why qualifications. *Done:* tests: /programs HTML contains "Jolly Grammar &amp; Jolly English"; "Rapid Teacher" absent from programs and teacher-training content and present only in founder certifications.
6. **JSON-LD + llms**: personNode/organizationNode/llms changes; update `seo.test.ts` (award, hasCredential incl. certifications, memberOf, knowsAbout, foundingDate; no "Lata|MIMAMSA|RCAN Nation"). Validate structurally with the seo-schema skill on the rendered `/about` JSON-LD. *Done:* tests green + schema check clean.
7. **Docs**: TODO.md (Q13 removed from the not-code list), CLIENT-QUESTIONS.md (remove #11, renumber, "your awards" count-free, + Innovative Teaching photo), CONTENT-GUIDE.md if it names the 3 awards. *Done:* `grep -rn "three awards\|With over 20 years" *.md` only hits content.md's answered note.
8. **Verify**: `npm test`, `typecheck`, `lint`, `build`, `probe`, `probe:mobile` all green; playwright-cli screenshots at 375 + 1440 of `/`, `/about`, `/programs`, `/teacher-training` (plus a reduced-motion and a JS-off /about pass); the mobile GIF of the About journey (`scripts/probes/gifs-mobile.cjs`); fix any §d issue (separate `fix:` commits). Then superpowers:verification-before-completion, `git push origin preview`, and a summary of what changed and what's still open (Q1, Q3–Q12 unchanged).

## Verification (end-to-end)
- Commands: `npm test && npm run typecheck && npm run lint && npm run build && npm run probe && npm run probe:mobile`.
- `curl` the built `/about` → extract `application/ld+json` → check it parses and the types/props are valid (seo-schema).
- `grep -rn "Lata\|MIMAMSA\|RCAN Nation Builder" src public .next/server` → no hits.
- Screenshots and the GIF are reviewed by eye against the §d risks before pushing.
