# Deploying to Vercel

Nothing has been pushed. This is what to do when you are ready.

## 1. Check what you are about to push

```bash
git status                # should be clean
git log --oneline origin/main..HEAD   # the local commits that will go up
git remote -v             # origin → https://github.com/Aadityavarier/jollyphonics-portfolio.git
```

`origin` already points at a GitHub repository named `jollyphonics-portfolio`. Confirm that is the repository you
want this site in. If it is not, change it first: `git remote set-url origin <the-right-url>`.

## 2. Push

```bash
git push origin main
```

Do not force-push. If GitHub rejects the push because `origin/main` has commits this branch lacks, stop and look at
them (`git fetch && git log origin/main --oneline`) before merging or rebasing.

## 3. Import the repository in Vercel

1. vercel.com → **Add New… → Project** → pick the repository.
2. **Framework Preset:** Next.js (detected from `package.json`; no changes).
3. **Root Directory:** leave empty. `package.json` is at the repository root.
4. **Build and output settings:** the defaults (`npm run build`).
5. **Environment variables:** none are needed now.
6. **Deploy.**

`.gitignore` excludes only `node_modules`, `.next`, `.vercel`, `.env*`, local screenshots and tool scratch folders.
Everything the build needs (`src/`, `public/`, `next.config.ts`, `package-lock.json`, `tsconfig.json`) is tracked.

### Custom domain, later

When a domain exists, add it in Vercel (Project → Settings → Domains) and set one environment variable:

```
NEXT_PUBLIC_SITE_URL=https://your-domain
```

It is only used for canonical links, Open Graph URLs, `sitemap.xml` and `llms.txt`. Until then the site falls back to the
Vercel production URL (`VERCEL_PROJECT_PRODUCTION_URL`), then to `http://localhost:3000` in local builds.

### Search engines

- **Preview deployments** send `X-Robots-Tag: noindex, nofollow` and `robots.txt` disallows everything, on purpose.
- **Production** (`VERCEL_ENV=production`) is indexable. `robots.txt` then allows everything except `/styleguide` and points to `sitemap.xml`.
- `/gallery` is `noindex` and left out of the sitemap until it has photos.

## 4. Measure on PageSpeed Insights

The local Lighthouse numbers in the final report come from a very slow development machine and are not the gate. The
gate is real mobile scores from <https://pagespeed.web.dev>:

1. Open pagespeed.web.dev and paste each URL below (use the production URL once it exists).
2. Choose the **Mobile** tab and read Performance, Accessibility, Best Practices and SEO. The target is 95+ on all four.
3. Run each URL two or three times; lab scores vary by a few points.

| Route | Path |
|---|---|
| Home | `/` |
| About | `/about` |
| Programs | `/programs` |
| Coaching | `/coaching` |
| Teacher training | `/teacher-training` |
| For schools | `/for-schools` |
| Contact | `/contact` |
| Gallery | `/gallery` (noindex until it has photos) |

**Reading SEO on a preview URL:** a preview deployment fails the "Page is blocked from indexing" audit
(`is-crawlable`) because previews are noindex by design. That one audit is expected. Judge SEO on the production URL.

## 5. After the first deploy

- Open `/sitemap.xml`, `/robots.txt`, `/llms.txt` and `/opengraph-image` on the live URL.
- Paste the live `/`, `/about` and `/contact` URLs into <https://validator.schema.org> and the Google Rich Results Test
  (the JSON-LD has only been checked locally).
- Add real photos by setting `photo: { src, alt }` on the slots in `src/content/images.ts` and putting the files in
  `public/images/`. Gallery photos go in `galleryPhotos` (`src/content/gallery.ts`).
