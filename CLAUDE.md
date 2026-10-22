# Tr. Revathi Phonics — Project Rules

## What this is
Marketing website for **Tr. Revathi Phonics & Coaching Classes**, a phonics, English, coaching and teacher-training centre in Ambernath (East & West), Maharashtra. It is founder-led: Trainer Revathi's 20+ years, her certification and 4,500+ students are the core trust signals.

**Audiences, in priority order:**
1. Parents of children aged roughly 3–14 (phonics, coaching, handwriting)
2. Teachers and aspiring teachers (phonics TT, ECCEd, Montessori)
3. Schools (workshops)
4. Adults and homemakers (English, spoken English)

**Primary conversion:** WhatsApp enquiry (`https://wa.me/919022582988`) or a call (`tel:+919022582988`). Secondary conversion: the enquiry form.

## Content rules (non-negotiable)
- `content.md` is the ONLY source of facts. Do not invent numbers, testimonials, fees, timings, ages, reviews, ratings, awards or quotes.
- If something is missing, render a visible `TODO:` placeholder in dev and list it in `TODO.md`. Never fill gaps with plausible-sounding text.
- Hide the testimonials section until real testimonials exist.
- Do not use Jolly Learning's logo, characters or artwork. Describe programs as "taught by an Internationally Certified Jolly Phonics Trainer".
- Treat the ARPAN / child-safety content calmly and respectfully, with no alarming visuals.
- Children's photos: use only images in `public/images/`. Never use stock photos of children unless asked.

## Stack
- Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui where it helps
- Deploy target: Vercel
- No database for v1. The enquiry form builds a prefilled WhatsApp message (no backend).
- framer-motion for small interactions only. GSAP only if a section clearly benefits.
- `next/image` for every image; `next/font` for fonts.

## Design direction
- Bright, warm and playful, but credible. It should feel like an expert educator's institute, not a toy store.
- Derive the palette from the logo: bold red, plus the multicolour "Phonics" letters (orange, blue, green, purple, cyan) on white with a yellow-green accent. Use the multicolour treatment sparingly as an accent; base the UI on a calm, readable foundation.
- Rounded, friendly display font for headings, highly readable body font.
- Mobile-first: most parents arrive on phones. A sticky WhatsApp/Call bar on mobile.
- No generic AI-template look: no gradient blobs, no glassmorphism cards, no emoji as icons.

## Site map
- `/` Home
- `/about` Trainer Revathi (bio, qualifications, awards, community)
- `/programs` Phonics, Grammar, English, Handwriting, Special Classes (anchored sections)
- `/coaching` Sr. KG to Std. 8
- `/teacher-training` Phonics TT, ECCEd, Montessori, ARPAN
- `/for-schools`
- `/gallery`
- `/contact` with all 4 branches, maps, form and FAQ

## SEO requirements
- Unique title and meta description per page, targeting local intent (e.g. "phonics classes in Ambernath", "Jolly Phonics trainer Ambernath", "teacher training Ambernath", "tuition classes Ambernath East").
- JSON-LD: `EducationalOrganization`, `Person` for Trainer Revathi, `FAQPage` on the FAQ, and `BreadcrumbList`. LocalBusiness JSON-LD for the two own branches; the two branches hosted at partner preschools are listed as Place under the organisation's location. All four branches are presented identically on the site.
- `sitemap.ts`, `robots.ts`, Open Graph image, canonical URLs.
- Descriptive alt text on every image, and semantic headings (one h1 per page).
- Lighthouse target: 95+ on Performance, Accessibility, Best Practices and SEO on mobile.

## Working rules
- Plan before building. Confirm the plan, then build in phases.
- After each phase, run the dev server and check at 375px and 1440px with playwright-cli.
- Keep components small and content-driven. All copy lives in `src/content/` (typed data from `content.md`), not hardcoded in JSX.
