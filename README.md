# Penelope Social

The penelopesocial.com website: **Astro**, with all content in **YAML files in
git**, hosted on **Cloudflare Workers**. It was ported off Webflow onto Sanity,
then moved off Sanity onto YAML content collections (see
[docs/sanity-to-yaml.md](docs/sanity-to-yaml.md)), the same setup as Penelope
Bakehouse.

```
penelope/
├─ web/      Astro static site + the Cloudflare Worker that handles forms
│  └─ src/content/   every page, menu and merch item, as YAML
├─ studio/   Legacy Sanity Studio. The site no longer reads it (see the migration doc)
└─ scripts/  migrate.js (Webflow → Sanity, legacy) and compare.js (parity check)
```

## Getting started

```bash
pnpm install
pnpm dev           # http://localhost:4380
```

The build needs `PUBLIC_TURNSTILE_SITE_KEY` to be present (empty is allowed
locally); see `.env.example`.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Astro dev server |
| `pnpm build` | Static build into `web/dist`. Fails on any content error |
| `pnpm compare` | Structural DOM diff of every route vs the Webflow original |
| `pnpm deploy:web` | Build and deploy the Worker (`deploy:web:dry` to validate only) |

## Editing content

See [AGENTS.md](AGENTS.md) for the full guide. In short: all copy, prices,
links and photos live in `web/src/content/` as YAML, validated at build time.

| To change | Edit |
|---|---|
| A menu item or price | `menus/<menu>.yaml`. Landing-page dish cards and Happy Hour's linked items update themselves |
| A new menu page | Add `menus/<slug>.yaml`. It routes at `/menus/<slug>` |
| A page (contact, catering, /menus, merch, the Vaughan landing pages) | `pages/<slug>.yaml`. A new file routes at `/<slug>` |
| The homepage | `pages/home.yaml` |
| Header, nav, Menus dropdown, footer, announcement bar, popup | `site.yaml` |
| Hours, address, phone, shared links (`@order`, …) | `site.yaml` |
| FAQs (Home, /about, /contact, /catering-events, /locations/*) | `faqs.yaml` |
| /about, /locations/* | `about.yaml`, `locations.yaml` |
| A merch product | `merch/<slug>.yaml` |

Photos go in `web/src/assets/images/` and are referenced by bare filename. Astro
turns them into responsive WebP at build time.

## How it fits together

**Page builder.** Pages hold a `sections:` list of typed blocks. Adding a
section type is three edits: one schema in `web/src/lib/content-schema.ts`
(added to `section`), one component in `web/src/components/sections/`, and one
entry in `web/src/components/PageBuilder.astro`.

**Content.** `web/src/content.config.ts` defines the collections: `site`
(links, address, hours, header, nav, footer, announcement, popup), `faqs`,
`about`, `locations`, `home`, `pages`, `menus` and `merch`. Schemas are strict (an unknown key fails the build). Components read
content only through `web/src/lib/content.ts`, which swaps image filenames for
optimised assets, renders Markdown links, and fails the build on cross-file
mistakes: a link to a page that doesn't exist, a dish card or Happy Hour item
naming a dish that isn't on its menu, a callout naming a missing menu.

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
bundle. GLightbox replaces Webflow's native lightbox.

**Forms.** Contact, events and the footer newsletter all POST to the Cloudflare
Worker in `web/worker/`, which verifies the Turnstile token and then either
emails the submission on or — for the newsletter — writes the subscriber to D1.
The widget is
`appearance="interaction-only"`, so it stays invisible for the visitors who never
get challenged — it still issues the token the Worker verifies. Because it is
invisible, its spacing is applied by `initTurnstileSpacing()` only once the
widget actually occupies space (measured, since hidden and visible widgets have
identical markup), and a failed submit calls `turnstile.reset()` so the retry
gets a fresh token instead of re-sending a spent one.

**Newsletter subscribers.** The footer signup used to post straight to a
Mailchimp list from the browser — an endpoint that 404s for this account (see
Known issues). Signups now go to `POST /api/newsletter` and land in the D1
database `penelope-social-subscribers`, which is Penelope's own: Arti runs the
same code against its own database and the two never share a row. The client
pulls the list from `GET /api/subscribers.csv`, behind HTTP Basic Auth.

The form carries a **required consent checkbox**, which the Webflow original did
not. Sending marketing email in Canada means being able to *prove* express
consent under CASL, so the row records consent, timestamp and IP, and a POST
without consent is rejected rather than stored — a subscriber the client can
never legally email is worse than no row at all.

**Contact and events submissions are deliberately not stored.** They are emailed
and nothing else — no database row, no export. That keeps the site holding only
data someone opted into, at the cost of the notification being the sole copy: if
a send fails, the only record is the `[forms] notification failed` line in the
Worker log, which is retained for days rather than forever. Storing them is a
small change (a table, a write before the send, a `notified` flag) if that
trade stops being the right one.

```bash
# Schema changes go in web/migrations/subscribers/ and apply with:
pnpm --filter web exec wrangler d1 migrations apply penelope-social-subscribers --remote
```

## Verifying parity

```bash
pnpm build && pnpm compare      # 14/14 routes structurally identical
```

`compare.js` diffs **tag nesting**, not class names — the port deliberately
changes class names, so what must match is the shape of the document. Styling is
verified separately with a computed-style diff (`scripts/style-probe.js`, run in
the browser against both the live page and the local one).

At the time of writing, all 14 routes are structurally identical and total page
height matches the Webflow original exactly at 1440 / 991 / 767 / 479px.

## Continuous deployment

Workers Builds builds `main` and deploys the Worker. The site is also
deployable by hand with `pnpm deploy:web`, which builds first — note that
`wrangler deploy` on its own does **not** build, so running it against a stale
`web/dist` republishes whatever that directory happens to hold.

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Build command | `pnpm build` |
| Deploy command | `pnpm --filter web exec wrangler deploy` |

The deploy command goes through the workspace rather than a bare
`npx wrangler deploy` for two reasons: `wrangler.jsonc` lives in `web/`, so a
bare invocation at the root fails on workspace detection, and `npx` would fetch
whatever wrangler version it resolves that day instead of the one in the
lockfile.

**Build variables must be set in Cloudflare.** There is no `.env` in CI — it is
gitignored, and rightly so, since it also holds the Turnstile secret. Anything
the build reads has to come from the build environment:

| Variable | Value | Omitted |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | the widget's sitekey | build fails, deliberately |

The `PUBLIC_SANITY_*` and `SANITY_*` variables are no longer read by anything
and can be deleted from the Workers Builds settings.

Every push to `main` rebuilds and deploys. A content edit is a commit, so it
ships the same way as a code change, and a content mistake fails that build
instead of reaching the live site.

## Go-live checklist

**The site is live.** Everything below is done; it is kept as the record of what
was set up and why, because most of it is invisible from the code — which
records are in the DNS zone, which values the build needs, and which of them
fail silently when they are missing. Items 1–3 and 5 describe the Sanity setup
the site has since moved off (see docs/sanity-to-yaml.md for the cutover).

1. ~~**Sanity project.**~~ *Legacy.* Already created: `wlwg9juj` ("Penelope Social"), and it is
   the `DEFAULT_PROJECT_ID` in `web/src/lib/data.ts`. Symlink the env into both
   workspaces — the Sanity CLI and Astro each resolve env from their own
   directory, not the repo root: `ln -sfn ../.env studio/.env && ln -sfn ../.env web/.env`.
2. ~~**Import the content.**~~ **Done.** The dataset holds 1 siteSettings,
   1 homepage, 6 pages, 4 menus, 3 merch products and 43 image assets, plus the
   two bakery video transcodes. `pnpm migrate` is re-runnable — it re-scrapes
   the Webflow original and uses deterministic ids, and Sanity dedupes assets by
   content hash. The token it needs was created with
   `sanity tokens create "content-migration" --role=editor`; revoke it with
   `sanity tokens delete` once the site no longer needs re-importing.
3. ~~**Deploy the Studio.**~~ **Done** — live at
   https://penelope-social.sanity.studio/ (`pnpm deploy:studio`). `studioHost`
   and the `deployment.appId` are pinned in `studio/sanity.cli.ts`, so a later
   deploy can neither prompt for a hostname nor quietly create a second
   application and strand the client on a Studio URL that stops updating.
4. ~~**Deploy the site.**~~ **Done** — live at https://penelopesocial.com and at
   https://penelope-social.web-disco.workers.dev (`pnpm deploy:web`, or
   `pnpm deploy:web:dry` to validate first).
5. ~~**Rebuild on publish.**~~ **Done.** A Workers Builds Deploy Hook is
   registered as a Sanity webhook on publish — see Continuous deployment above.
   The webhook filters drafts with `!(_id in path("drafts.**"))`; without that
   it fires on every draft autosave, so editing a page in the Studio would queue
   a build every few seconds. Verified end to end: publishing in the Studio
   produced a deployment whose output matched a local build of the same content.
6. ~~**Turnstile.**~~ **Done.** Widget "penelopesocial.com" (Managed), scoped to
   the apex, `www`, and the workers.dev host so it works on staging too. The
   site key is in `.env`; the secret is a Worker secret. Verified: a POST with
   no token is rejected on every form.
7. ~~**Decide where form submissions go.**~~ **Done** — Postmark.
   `EMAIL_PROVIDER=postmark` and `NOTIFY_EMAIL_TO` (comma-separated:
   `info@penelopesocial.com` and `penelopesocial23@gmail.com`) are in
   `web/wrangler.jsonc`; `POSTMARK_SERVER_TOKEN` is a Worker secret, and
   `penelopesocial.com` is verified in Postmark with its DKIM and Return-Path
   records in the Cloudflare zone. Verified by real submissions through both
   forms.

   Postmark rather than the Cloudflare Email Service binding because Email
   Service only delivers to destination addresses verified on the account,
   which makes a client-owned Gmail inbox a per-address opt-in dance. The
   `cloudflare` and `resend` paths are still in `web/worker/email.ts`.

   The Return-Path CNAME must stay **DNS-only** in Cloudflare. Proxying it
   (the default for new CNAMEs) points it at Cloudflare's IPs instead of
   Postmark's and breaks bounce handling and SPF alignment.

   Do **not** touch the existing SPF record. The zone has one
   `v=spf1 include:_spf.google.com ~all` for the client's Google Workspace mail,
   a domain may only have one SPF record, and Postmark does not need a change to
   it — a custom Return-Path moves the SPF check onto Postmark's own bounce
   domain. Adding a second SPF record, or appending Postmark's include to this
   one, risks the client's outbound mail.
8. ~~**Set the subscriber export credentials.**~~ **Done.** `SUBSCRIBERS_USER`
   and `SUBSCRIBERS_PASSWORD` are Worker secrets; `/api/subscribers.csv` returns
   401 without them and 200 with. Basic Auth rather than a `?key=` token because
   the export is a list of customer email addresses, and a token in a URL ends
   up in browser history and leaks via `Referer`.
9. ~~**Point penelopesocial.com at the Worker.**~~ **Done.** The domain is on
   Cloudflare (`bethany`/`miguel` nameservers) and both the apex and `www` are
   attached to the Worker as custom domains. The Webflow A and `www` CNAME
   records are gone; the Google Workspace MX records, the SPF TXT and the
   `google._domainkey` DKIM record were left untouched and verified intact.

   **The apex is canonical.** A Cloudflare Redirect Rule 301s `https://www.*` to
   the root, so `site` in `web/astro.config.mjs` is the apex — canonical tags and
   the sitemap derive from it, and they must not name a host that redirects away
   from itself. The rule lives in Cloudflare rather than the Worker on purpose:
   redirect rules run before Workers, so a `www` hit never bills a Worker
   request.

   Never enable Cloudflare Email **Routing** on this zone. It rewrites the MX
   records and would take down the client's Google Workspace inbox. Email
   *Sending* is a different product and does not touch MX — but the site uses
   Postmark now, so neither is needed.
10. ~~**Send one test submission through each form.**~~ **Done** — submissions
   go through and the notifications arrive.

   Worth repeating after any change to the forms, the Worker, or the Postmark
   configuration, because most of this path fails silently. Contact and events
   submissions are not stored anywhere, so a send that the API accepts and
   something downstream drops leaves only a `[forms] notification failed` line
   in the Worker log, which is retained for days. For the newsletter the row is
   the receipt:

   ```bash
   wrangler d1 execute penelope-social-subscribers --remote --command "SELECT * FROM subscribers"
   ```

### If the forms ever go quiet

They did once, and nothing about the site looked wrong. The pages render
identically with or without Turnstile — the widget is `interaction-only` and so
invisible even when working — while `TURNSTILE_SECRET_KEY` is a Worker secret
that survives every deploy. So a build that drops `PUBLIC_TURNSTILE_SITE_KEY`
ships pages that send no token to a Worker that still demands one, and every
submission comes back "Captcha verification failed".

An absent sitekey now fails the build (`web/src/lib/turnstile.ts`), so this
particular version cannot recur. The general shape can. Check first:

```bash
curl -s https://penelopesocial.com/contact | grep -c data-sitekey   # expect 2
curl -s -X POST https://penelopesocial.com/api/contact -d x=1       # expect a 400
```

Two widgets on `/contact` (the form and the footer newsletter) and a rejected
tokenless POST together prove the client and server halves are still wired to
each other, which is the thing that broke.

### Known issues inherited from the Webflow site

- **The Mailchimp newsletter endpoint returned 404.** Every `subscribe/*` path
  on `penelopesocial.us7.list-manage.com` 404s for the `u`/`id` pair in the live
  form action, so signups were almost certainly not reaching the list on the
  Webflow site either. Rather than re-wire a dead third-party endpoint, the form
  now writes to D1 and the list is exported as CSV — the write happens inside
  the Worker that answers the visitor, so nothing can fail out of band while the
  page says it worked. If the client wants those addresses in an email platform,
  upload the export; there is no longer a form action to keep current.
- **The menu drawer listed the catering page twice** — "Events" pointing at
  `/catering-events`, and "Catering & Events" pointing at
  `/events?general-inquiry`, where `/events` is itself a 301 to
  `/catering-events`. So one label was wrong, the other took a redirect hop, and
  the menu offered two entries for one page. Collapsed to a single
  "Catering & Events" entry pointing straight at the page. `compare.js` records
  the dropped link as a deliberate omission (`IGNORE_HREFS`).
- **The homepage footer is stale** relative to the other thirteen pages: it
  still shows `Sun - 8-12 pm` and links the old `instagram.com/penelopesocial`
  handle. The migration takes the inner-page version (`Sun — 8am - 12pm`,
  `instagram.com/penelope.social`) for all pages and warns when it runs.
  (The handle has since been confirmed as `instagram.com/penelopesocial`; all
  links now use `site.yaml → links.instagram`.)
- **The enquiry-reason prefill never worked.** Links like
  `/catering-events?general-inquiry` are meant to preselect the dropdown, but
  the inline script targets `#Event-Type`, an id that doesn't exist (the select
  is `#Reason-For-Inquiry`). Repointed at the real select in
  `web/src/scripts/forms.ts`, so it now does what the links intend.
- **Dinner menu anchors were misnamed** — "Salads" sat at `#snacks` and
  "Handhelds" at `#desserts`. The links worked, but the ids read as mismatched.
  Anchors are now derived from the category title, which is a no-op on every
  other menu.
- **The quick links were a parallel list.** Each menu carried a `quickLinks`
  array beside its categories, repeating every category's label and anchor — in
  all four menus an exact duplicate, and one rename away from pointing at a
  section that no longer existed. They are derived from the categories now, so
  adding, renaming or dragging a category moves its quick link with it.
- **The Catering menu card's button pointed at the dinner menu** on `/menus`
  (the same card on `/` was correct). Nothing surfaced the mistake because
  `.menu-btn-wrap` is `display:none` at every breakpoint, so the link renders for
  nobody. The card's button label and URL are no longer editable fields at all —
  both are derived from the card's own `url`, which makes the mismatch
  unrepresentable rather than merely fixed.

### Workers gotchas

- **Trailing slashes.** Cloudflare's asset handler defaults to
  `auto-trailing-slash`, which 307s `/menus` -> `/menus/`. That adds a redirect
  hop to every internal link and changes the canonical URL of all 14 pages.
  `wrangler.jsonc` sets `html_handling: "drop-trailing-slash"` to match the
  Webflow site and Astro's `trailingSlash: 'never'`. It does not reproduce
  locally — `astro dev` and the static build both serve unslashed.

### Deliberate differences

- **Unstyled links inherit their colour** instead of falling back to the browser
  default blue. This affects no visible text — every anchor on the site is
  styled, and the ones that aren't wrap images only.
- **Swiper loads lazily.** The original bundle initialises a `.swiper.is-merch`
  slider, but no page renders that element. The call is kept for parity and the
  library is only fetched if such an element ever appears.
- **The newsletter pop-up is removed, not reproduced.** Webflow ships a
  `.newsletter` overlay on the homepage that never runs: `display:none` with no
  override anywhere, no trigger, and no close button in the markup. Carrying it
  meant shipping a `fixed inset-0 z-50` full-screen overlay whose only possible
  future was appearing by accident with no way to dismiss it. Removed along with
  the things it was the sole consumer of — the `modal` variant of
  `NewsletterForm`, the Webflow custom-checkbox CSS, and the
  `initCustomCheckboxes()` script. `compare.js` ignores the class so parity stays
  at 14/14.
- **The footer copyright row is not editable.** It was four Sanity fields —
  copyright line, credit prefix, credit label, credit URL — none of which anyone
  ever meaningfully changes, and the one that mattered had already drifted to
  “© 2024”. The year is now derived at build time in `America/Toronto` (CI
  builds in UTC, which turns over five hours before the restaurant does, so a 31
  December evening deploy would otherwise ship next year's footer) and the Web
  Disco credit is fixed in `Footer.astro`.
- **The contact column is right-aligned** at ≥992px. The four footer columns are
  equal width, so left-aligned contact text ended a quarter of the page short of
  the “Website by Web Disco” credit directly beneath it. Alignment is reverted
  below 992px, where the grid collapses to one column.
