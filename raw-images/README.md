# Photo inbox

Drop original photos here, then run `npm run photos`.

- **A photo for a page slot:** start the file name with the slot ID from CLIENT-QUESTIONS.md / `src/content/images.ts`,
  e.g. `H1-portrait.jpg` (Home hero portrait), `A2 certificate.png`, `b3-vadavali.jpeg`. Case and the rest of the
  name do not matter.
- **Gallery photos:** put them in `gallery/<category>/`, e.g. `gallery/summer-camps/`. A category appears on the
  site once it has 3 or more photos; the Gallery page then joins the menu and the sitemap.
- JPG, PNG, WebP, TIFF and AVIF work. iPhone HEIC photos must be exported as JPG first.

The script makes a WebP copy (long edge at most 2000px) in `public/images/`, updates `src/content/photos.generated.ts`
and `images.md`. Describe each photo in the **Alt text** column of `images.md`, then run `npm run photos` again.
Only children whose parents have agreed may appear in photos.

Files in this folder are not committed to git (only this README is).
