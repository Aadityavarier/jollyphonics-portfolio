# Deploying to Vercel

Work happens on the `preview` branch. Every push to it builds a Vercel **preview** (noindex, for checking on
phones and PageSpeed). `main` is production. Going live is merging `preview` into `main`: see **Going live** below.

## 1. Check what you are about to push

```bash
git status                # should be clean
git log --oneline origin/preview..HEAD   # the local commits that will go up
git remote -v             # origin → https://github.com/Aadityavarier/jollyphonics-portfolio.git
```

`origin` already points at a GitHub repository named `jollyphonics-portfolio`. Confirm that is the repository you
want this site in. If it is not, change it first: `git remote set-url origin <the-right-url>`.

## 2. Push

```bash
git push origin preview
```

Do not force-push. If GitHub rejects the push because `origin/preview` has commits this branch lacks, stop and look
at them (`git fetch && git log origin/preview --oneline`) before merging or rebasing. The preview URL is on the
Vercel dashboard (Project → Deployments) and in the GitHub commit's status checks.

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

## Going live

Do these in order once the client has signed off the preview.

1. **Merge `preview` into `main`.** Either open a pull request on GitHub (`preview` → `main`) and merge it, or:

   ```bash
   git checkout main
   git pull origin main
   git merge --ff-only preview     # fails safely if main has commits preview lacks: stop and look
   git push origin main
   git checkout preview
   ```

   Vercel builds `main` as production. Production is indexable; previews stay noindex.
2. **Domain.** When a domain exists, add it in Vercel (Project → Settings → Domains), then set
   `NEXT_PUBLIC_SITE_URL=https://your-domain` (Settings → Environment Variables → Production) and **redeploy** so
   canonical links, Open Graph URLs, `sitemap.xml` and `llms.txt` use it.
3. **Protect previews again.** Settings → Deployment Protection → turn **Vercel Authentication** back on for Preview
   deployments (it was relaxed so the client and PageSpeed could open preview links). Production stays public.
4. **Google Search Console.** search.google.com/search-console → Add property → **Domain** (verify with the DNS TXT
   record your domain registrar shows you) → Sitemaps → submit `https://your-domain/sitemap.xml`. Then use
   **URL inspection** on the home page and request indexing.
5. **Re-check on production:** PageSpeed (mobile) for all eight pages, the Rich Results Test for `/`, `/about` and
   `/contact`, and tap through the site on a real phone (`MORNING-REPORT.md` has a checklist).
