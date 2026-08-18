# Evolve Psychiatry — Provider Pages (Static, SEO-first)

This replaces the old client-side JavaScript widget for individual
provider pages. Instead of the browser fetching Google Sheets and
building the page after load, this project fetches the sheet **on the
server, at build time**, and generates real, complete HTML — bio text
and all — before anyone (including Google) ever requests the page.

Everything else on evolvepsychiatry.com (homepage, blog, services, your
existing `/prescribers` and `/therapists` directory pages) stays exactly
as-is on Squarespace. Only individual provider pages are handled by this
project, via the Cloudflare Worker described below.

---

## 1. Get a Google Sheets API key

1. Go to https://console.cloud.google.com/ and create a new project (or
   use an existing one).
2. In the search bar, find and enable the **Google Sheets API**.
3. Go to **APIs & Services -> Credentials -> Create Credentials -> API key**.
4. Copy the key. For safety, click into the key and restrict it to only
   the Google Sheets API (under "API restrictions").
5. Your spreadsheet must be shared as **"Anyone with the link can
   view"** (same as it already is for the current widget) — this API
   key approach only works for publicly-viewable sheets, it does not
   need or use any login.

## 2. Local setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your `GOOGLE_SHEET_ID` (already set to your
real sheet ID by default), your new `GOOGLE_SHEETS_API_KEY`, and make up
a `REVALIDATE_SECRET` (any random string).

```bash
npm run dev
```

Visit http://localhost:3000/priyadarshan-bajpayi (or any other real
provider slug) to test locally.

## 3. Deploy to Vercel

1. Push this project to a new GitHub repository.
2. Go to https://vercel.com, sign in, and **Import** that repository.
3. Under the project's **Environment Variables**, add the same three
   values from your `.env.local`.
4. Deploy. Vercel gives you a URL like
   `https://evolve-providers.vercel.app` — you'll need this for the next
   step.

## 4. Set up the Cloudflare Worker

This is what lets these pages live at `evolvepsychiatry.com/provider-name`
instead of a separate Vercel subdomain, while leaving every other page
on your site untouched on Squarespace.

1. In `cloudflare-worker.js`, replace `YOUR-VERCEL-DEPLOYMENT` with your
   real Vercel URL from step 3.
2. In the Cloudflare dashboard: **Workers & Pages -> Create -> Create
   Worker**, paste in the contents of `cloudflare-worker.js`, and deploy.
3. Under the Worker's **Settings -> Triggers -> Routes**, add:
   ```
   evolvepsychiatry.com/*
   ```
4. That's it — requests to real provider slugs now get the static page
   from Vercel; every other request passes through to Squarespace
   exactly as before.

(This step assumes your domain's DNS is already, or about to be, managed
through Cloudflare — see the earlier conversation for that migration.)

## 5. Publishing updates after editing the spreadsheet

Two ways changes show up:

- **Automatic:** every page and the slugs list refresh themselves at
  most once an hour (see `revalidate` values in the code) — no action
  needed, just wait.
- **Immediate:** bookmark this URL and visit it any time you want a
  change to go live right away instead of waiting:
  ```
  https://your-vercel-deployment.vercel.app/api/revalidate?secret=YOUR_REVALIDATE_SECRET
  ```

## 6. Adding a new provider

Add their row to the spreadsheet, same as always. Within an hour (or
immediately, via the revalidate URL above), their page automatically
exists at `evolvepsychiatry.com/first-last-name` — nothing to build,
deploy, or configure per provider. If they were added to a totally new
Location not seen before, the "View [Location]" button on their page
will simply be a lowercase-hyphenated guess at that location's page URL
(e.g. "New City" -> `/new-city`) — double check that page actually
exists at that path.

## What changed vs. the old widget

- Bio, name, credentials, location — all real HTML in the initial page
  load. Nothing requires JavaScript to be visible, including to search
  engines.
- SEO title and meta description are generated automatically from the
  sheet for every provider, instead of being manually typed into
  Squarespace's Page Settings one page at a time.
- Structured data (`Physician` + `BreadcrumbList`) is still included,
  same as before.
- No more fighting Squarespace's global CSS with `!important` — this is
  a fully independent page, so none of that defensive styling is needed
  anymore.
  
8/18/26 - this is a test. i renamed the github repo to: evolve-psychiatry-official-website
