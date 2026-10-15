# Action plan: penelopesocial.com (2026-10-06)

SEO Health Score **72/100**. Nothing is blocking indexing, so there are no Critical items. The list is ordered by expected return within each tier.

Owner key:
- **Dev:** repo change
- **Client:** decision, or access to an account
- **Listings:** GBP, Apple, Yelp and other third-party profiles

## Shipped with this audit (2026-10-06)

- **#1 Homepage title and meta.** `Penelope Social | Italian Restaurant in Woodbridge, Vaughan` (59 characters). This keeps Woodbridge as the place, per the August positioning rule in `seo.ts`, and adds Vaughan. Sanity still holds the old copy; `EXACT_REPLACEMENTS` in `copy.ts` maps it to the new copy.
  - The H1 lives in Sanity and is not changed.
- **#3 Social links.** `sameAs` Instagram now uses `@penelope.social`, matching the footer and TikTok, with tracking params stripped.
- **#5 `web/public/_headers`.** Security headers (HSTS without `includeSubDomains`, nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors 'self'`).
  - Immutable caching for `/_astro/*`; 30-day caching for `/fonts/*` and `/icons/*`.
  - No full CSP yet.
- **#13 `llms.txt`.** Rewritten as Markdown links with a summary line; internal notes removed; the four Vaughan pages added.
- **#14 Catering form.** `aria-label` on the select and the textarea.
- **#6 GA4 access granted.** Unmarking the five engagement key events is still open.
  - `popup_click` and `announcement_click` should stay key events. They are clicks through to `/catering-events?event`, and they don't double-fire `catering_click`.

## High: this week

| # | Action | Owner | Effort | Why |
| --- | --- | --- | --- | --- |
| 1 | Rewrite the homepage title, meta and H1 to say "Italian restaurant & bar in Vaughan" (`web/src/data/seo.ts:10`, `copy.ts:118`, the Sanity homepage `metaTitle`) | Dev | 30 min | About 4,600 impressions at position 4.9 convert at 2.8%; expect 6–9%. Recommended on 09-19, not shipped |
| 2 | Resolve the **two Google place IDs**. Confirm the canonical Business Profile, report or merge the duplicate, and use one place ID for directions, reviews and the map embed | Client/Listings + Dev | 1 h + Google turnaround | Entity fragmentation splits reviews and ranking signals |
| 3 | Pick the correct Instagram handle and use it everywhere (`site.ts:44` vs footer); strip `?hl=`/`?_t=` from social URLs | Client + Dev | 15 min | `sameAs` points at a different account from the one the site links |
| 4 | Expand `/catering-events` (see the first sub-list below) | Client (facts) + Dev | 1 day | Christmas booking season; the page has about 190 words |
| 5 | Add `web/public/_headers` (see the second sub-list below) | Dev | 1 h | One file fixes both the security and caching findings |
| 6 | GA4 Admin → Events: unmark `popup_view`, `popup_dismiss`, `nav_menu_click`, `faq_open` and `announcement_dismiss` as key events (service-account access: **done**) | Client | 5 min | About 80% of organic "conversions" are these engagement events, so conversion rates read about 5× too high |
| 7 | Business Profile: add the "Italian restaurant" category and replace the "enigma" description with 750 useful characters | Client/Listings | 30 min | Italian cluster stuck at position 19.6 |
| 8 | Correct Apple Maps (unit number, hours, category) and Yelp (hours); claim TripAdvisor | Listings | 1–2 h | Wrong hours on maps lose real visits |

**Item 4, `/catering-events` contents:**
- Capacity.
- A "feeds 10 / 20 / 40" per-person table.
- The December corporate-party packages in page copy, not only in the popup.
- Room photos.
- One notice rule that matches `/menus/catering`.
- New title: `Catering & Private Events in Vaughan | Penelope Social`.

**Item 5, `web/public/_headers` contents:**
- HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors.
- A CSP in report-only mode.
- `/_astro/*` one-year immutable; `/fonts/*` 30 days.

## Medium: this month

| # | Action | Owner | Effort |
| --- | --- | --- | --- |
| 9 | **Decide brunch and happy hour.** If the offers exist, build `/happy-hour` and a brunch or Sunday-morning page. If not, add an honest happy-hour FAQ to `/menus/bar` and a Sunday-morning section to `/cafe-in-vaughan` | Client → Dev | 0.5–1 day |
| 10 | Load Turnstile lazily, only on pages with forms, on focus or intersection (`BaseLayout.astro:77-81`, `scripts/forms.ts`, `lib/turnstile.ts`) | Dev | 2 h |
| 11 | Hero and banner `srcset` with a width cap (`Hero.astro`, `BannerHero.astro`); lazy-load the two below-fold eager images and the duplicated menu thumbnails | Dev | 2 h |
| 12 | Convert SweetSansPro `.otf` to subset woff2 (`global.css:101-128`, preloads) | Dev | 1 h |
| 13 | Rewrite `/llms.txt`: Markdown links, a `>` summary, all landing pages; remove internal notes | Dev | 30 min |
| 14 | Add `aria-label` to the catering form's select and textarea (`ContactFormSection.astro` ~L50-70) | Dev | 15 min |
| 15 | Decide the AI-crawler policy: allow GPTBot, ClaudeBot and CCBot in Cloudflare AI Crawl Control, or keep blocking and declare it in robots.txt. Also restores Common Crawl coverage | Client → Dev | 15 min |
| 16 | `/locations/scarborough`: noindex it and remove it from the sitemap; keep a short sister card linking to penelopebakehouse.com. Point "Bakehouse" anchors on home, cafe, pizza and about to penelopebakehouse.com | Dev | 1 h |
| 17 | Schema: Product/Offer on merch pages; always define the Bakehouse node or drop `supplier`; a real `image` and logo; WebSite node; `priceRange`, `hasMap`, a reservation URL | Dev | 2 h |
| 18 | Sitemap `<lastmod>` from Sanity `_updatedAt` (`astro.config.mjs:19-27`) | Dev | 1 h |
| 19a | Reserve and Order CTAs at the top of `/menus/dinner` and `/menus/lunch` (39% and 47% organic engagement, mostly brand-sitelink landings) | Dev | 1 h |
| 19 | Wrap content in `<main>` (16 of 20 pages lack it); add a sticky mobile action bar with Order, Reserve, Directions and Call on inner pages | Dev | 2–3 h |
| 20 | Review strip with real quotes, a "Leave a review" link and press mentions; add an "open since" year to `/about` | Client + Dev | 2 h |
| 21 | Grow `/locations` and `/locations/woodbridge`: parking, transit, entrance photo, Place-ID map embed | Dev | 2 h |
| 22 | Align the brand story ("Penelope Focacceria", "micro bakery" vs baked in Scarborough) across listings and `/about` | Client | — |

## Low: backlog

- Fix on-page tags:
  - Merch H1s should be the product names, with longer titles.
  - Trim the menu titles (71, 67 and 62 characters) and metas (tote 305, catering menu 201).
  - Change the menu H1s to "Lunch menu" and similar.
- Make the Christmas-modal heading a non-heading element (it causes H2→H4 skips sitewide).
- Fix trailing-slash 307 → 301/308. Collapse `http://www` to a single hop.
- Change `/reservations` from 301 to 302. Use `lang="en-CA"`. Enable Cloudflare Crawler Hints (IndexNow).
- Fix copy:
  - The bakery counter vs 24 h-notice conflict.
  - "Beer" listed with none on the menu.
  - Back up the "Best" pizza claim or drop it.
- Make tap targets at least 44 px: logo, breadcrumbs, announcement dismiss, popup close.
- Add speculation rules; set image dimensions on the footer logo and icons; drop the redundant Cloudflare Web Analytics beacon.
- Add Bing Webmaster Tools or a Moz key so backlinks can be scored.

## Re-measure on about 2026-10-27

- **Homepage:** CTR on "restaurants (in) Vaughan" after item 1 ships.
- **`/sourdough-bakery`:** whether `/bakery-vaughan` inherits its Bakehouse-brand impressions at about 1% CTR. If it does, retitle it, or noindex it in favour of penelopebakehouse.com.
- **Italian cluster:** position after items 1 and 7.
- **New landing pages:** non-brand rankings for the bakery, cafe, pizza and sandwich pages, once they have 4–6 weeks of age.
- **GA4:** clean key-event counts once item 6 is done. Baseline since 09-19: 390 reservation, 311 order, 132 catering clicks.
- **Confounder:** whether the September 2026 Spam Update finished on about 10-08.
