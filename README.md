# Penelope Social

The penelopesocial.com website, ported off Webflow to **Astro + Sanity**, hosted
on **Cloudflare Workers**.

```
penelope/
├─ web/      Astro static site + the Cloudflare Worker that handles forms
├─ studio/   Sanity Studio (content editing)
└─ scripts/  migrate.js (scrape Webflow → Sanity) and compare.js (parity check)
```

## Getting started

```bash
pnpm install
pnpm migrate:dry   # scrape the live site into scripts/output/*.json
pnpm dev           # http://localhost:4380
```

The site builds with **no Sanity project configured**. `web/src/lib/data.ts`
reads from Sanity when `PUBLIC_SANITY_PROJECT_ID` is set and otherwise falls
back to the scraped JSON in `scripts/output/`, which is committed. That is what
lets the whole thing be reviewed before any accounts exist.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Astro dev server |
| `pnpm build` | Static build into `web/dist` |
| `pnpm studio` | Sanity Studio on :3333 |
| `pnpm migrate:dry` | Scrape the live site → `scripts/output/*.json` |
| `pnpm migrate` | Upload assets and import into Sanity (needs a write token) |
| `pnpm compare` | Structural DOM diff of every route vs the live site |

## How it fits together

**Page builder.** Static pages are `page` documents whose `sections` array holds
typed blocks. Each block is one Sanity schema (`studio/schemaTypes/blocks/`) +
one component (`web/src/components/blocks/`) + one entry in
`web/src/components/PageBuilder.astro`. Adding a section is those three edits and
nothing else.

**Content types.** `siteSettings` (a pinned singleton: header, drawer, footer,
newsletter, SEO), `page`, `menu` (the four menus, each with its categories and
items inline), and `merchProduct`.

**Styling.** The design is re-expressed in Tailwind v4, with every value read
from Webflow's compiled stylesheet rather than eyeballed.
`web/src/styles/webflow-base.css` carries Webflow's normalize, base typography
and the handful of `w-*` component rules the site uses — the design sits on top
of those defaults, so they are reproduced exactly. `web/src/lib/ui.ts` holds the
translated class sets for anything that appears on many elements; read the notes
at the top of that file before editing it.

**JavaScript.** `web/src/scripts/` is the site's Slater bundle rewritten as ES
modules: Lenis smooth scroll, the navbar hide/reveal, the drawer, the
scroll-triggered animations, and the page loader — all transcribed from the live
bundle. GLightbox replaces Webflow's native lightbox, and a small script
replaces the custom-checkbox behaviour webflow.js used to provide.

## Verifying parity

```bash
pnpm build && pnpm compare      # 14/14 routes structurally identical
```

`compare.js` diffs **tag nesting**, not class names — the port deliberately
changes class names, so what must match is the shape of the document. Styling is
verified separately with a computed-style diff (`scripts/style-probe.js`, run in
the browser against both the live page and the local one).

At the time of writing, all 14 routes are structurally identical and total page
height matches the live site exactly at 1440 / 991 / 767 / 479px.

## Go-live checklist

These need a human — none of them block development.

1. **Create the Sanity project.** `pnpm dlx sanity@latest login`, create the
   project, put the ids in `.env` (see `.env.example`).
2. **Import the content.** Create an editor token, set `SANITY_WRITE_TOKEN`, run
   `pnpm migrate`. This uploads every image to Sanity and replaces the
   `_migrationSrc` markers. Re-runnable — documents use deterministic ids.
3. **Deploy the Studio:** `pnpm studio:deploy`.
4. **Deploy the site:** `cd web && pnpm wrangler deploy` (validate first with
   `pnpm wrangler deploy --dry-run --outdir /tmp/check`). Then point the domain
   at the Worker.
5. **Rebuild on publish.** Create a Cloudflare deploy hook and add it as a Sanity
   webhook on publish.
6. **Turnstile.** Create a widget, set `PUBLIC_TURNSTILE_SITE_KEY` and
   `wrangler secret put TURNSTILE_SECRET_KEY`. Until then the forms work but
   aren't bot-protected.
7. **Decide where form submissions go.** Set `EMAIL_PROVIDER` to `resend` or
   `cloudflare` plus `NOTIFY_EMAIL_TO`/`NOTIFY_EMAIL_FROM` (see
   `web/worker/email.ts`). Unset means submissions succeed but nobody is
   emailed — don't ship it that way.
8. **Send one test submission through each form** (contact, events, newsletter)
   before switching DNS.

### Known issues inherited from the Webflow site

- **The Mailchimp newsletter endpoint returns 404.** Every `subscribe/*` path on
  `penelopesocial.us7.list-manage.com` 404s for the `u`/`id` pair in the form
  action, so signups are almost certainly not reaching the list today either.
  The form is wired to the URL as supplied; grab the current embed code from
  Mailchimp and update `siteSettings → Footer → Newsletter → form action`.
  (Note the live site's markup double-escapes the URL — its action contains
  `&amp;id=`, which would send Mailchimp a parameter literally named `amp;id`.
  That is corrected here.)
- **The homepage footer is stale** relative to the other thirteen pages: it
  still shows `Sun - 8-12 pm` and links the old `instagram.com/penelopesocial`
  handle. The migration takes the inner-page version (`Sun — 8am - 12pm`,
  `instagram.com/penelope.social`) for all pages and warns when it runs.
- **The enquiry-reason prefill never worked.** Links like
  `/catering-events?general-inquiry` are meant to preselect the dropdown, but
  the inline script targets `#Event-Type`, an id that doesn't exist (the select
  is `#Reason-For-Inquiry`). Repointed at the real select in
  `web/src/scripts/forms.ts`, so it now does what the links intend.
- **Dinner menu anchors were misnamed** — "Salads" sat at `#snacks` and
  "Handhelds" at `#desserts`. The links worked, but the ids read as mismatched.
  Anchors are now derived from the button label, which is a no-op on every other
  menu.

### Deliberate differences

- **Unstyled links inherit their colour** instead of falling back to the browser
  default blue. This affects no visible text — every anchor on the site is
  styled, and the ones that aren't wrap images only.
- **Swiper loads lazily.** The original bundle initialises a `.swiper.is-merch`
  slider, but no page renders that element. The call is kept for parity and the
  library is only fetched if such an element ever appears.
- **The newsletter pop-up is reproduced but stays hidden**, exactly as on the
  live site, where `.newsletter { display: none }` has no override anywhere.
