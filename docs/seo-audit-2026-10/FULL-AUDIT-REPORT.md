# Full SEO audit: penelopesocial.com

**Date:** 2026-10-06 · **Scope:** all 20 sitemap URLs (full crawl, 24 URLs fetched) · **Business type:** local brick-and-mortar restaurant (Italian-leaning cafe and bar, 125 Hawkview Blvd, Woodbridge / Vaughan, ON) with a sister bakery on its own domain (penelopebakehouse.com, Scarborough)

**Data sources:** live crawl; Google Search Console (`sc-domain:penelopesocial.com`), URL Inspection, CrUX, PageSpeed Insights; Lighthouse 13.5; Playwright screenshots; Brave search for brand/AI-visibility checks; Common Crawl web graph. GA4 (access granted mid-audit). **Not available:** Moz/DataForSEO, live Google SERP and local-pack positions, direct Google Business Profile inspection.

This is also the **re-measure** of the 2026-09-19 audit (`docs/seo-audit-2026-09.md`). Per-specialist detail is in `findings/*.md`; the PDF is `report.pdf`. Raw crawl data, API exports and screenshots were kept out of the repo. What shipped alongside this audit is listed at the top of `ACTION-PLAN.md`.

---

## Executive summary

### SEO Health Score: **72 / 100**

| Category | Weight | Score | Weighted |
| --- | --- | --- | --- |
| Technical SEO | 22% | 78 | 17.2 |
| Content Quality | 23% | 70 | 16.1 |
| On-Page SEO | 20% | 63 | 12.6 |
| Schema / Structured Data | 10% | 72 | 7.2 |
| Performance (CWV) | 10% | 82 | 8.2 |
| AI Search Readiness | 10% | 72 | 7.2 |
| Images | 5% | 80 | 4.0 |
| **Total** | | | **72.5** |

AI Search Readiness blends GEO (71) and agent readiness (74). Supporting scores, not weighted: Local SEO 65, SXO 61, Visual/mobile 86, Backlinks: not enough data to score.

**The short version.** The site is technically clean and fast for real users. It is server-rendered, every page is indexable, canonicals are self-referencing, there are no broken links, and field Core Web Vitals are excellent (LCP 485 ms, INP 62 ms, CLS 0). What holds it back is **positioning, not plumbing**:
- The homepage still calls the business a "cafe and bar in Woodbridge". It never says "restaurant" or "Vaughan" in the title, and "Italian" barely appears.
- Meanwhile it sits at position 4–5 for "restaurants in Vaughan", earning a 2–3% click-through rate.
- The business's identity is split across two Google place IDs, two Instagram handles and three names ("Penelope Social", "Penelope Focacceria", "micro sourdough bakery").

### Re-measure verdicts (vs 2026-09-19)

| Item | Verdict |
| --- | --- |
| Bakehouse-brand cannibalization | **Partly fixed.** Impressions on Social for Bakehouse-brand queries fell from 6,661 to 3,257 per 28 days, and weekly from 3,494 to 543. Part of the drop started on 08-26, before the retitle. What's left sits almost entirely on `/sourdough-bakery`, which Google processed as a 301 to `/bakery-vaughan` on 10-06. Watch whether `/bakery-vaughan` inherits those impressions at ~1% CTR. |
| Homepage title/meta rewrite (prior priority #5) | **Not shipped.** `web/src/data/seo.ts:10` still reads "Penelope Social \| Cafe and bar in Woodbridge". The ~4,600 impressions at position 4.9 still convert at 2.8%. |
| `/catering-events` CTR | 0.53% → 1.15% on 871 impressions. Most of those are brand sitelinks; real catering-query demand is only 46 impressions. |
| Italian cluster | Unchanged: 982 impressions at position 19.6. No page targets it. |
| Brunch | Slightly worse: 704 impressions at position 9.6, still no page. |
| New Vaughan landing pages (bakery, cafe, pizza, sandwiches) | All indexed with self-canonicals. They are 1–3 weeks old and not yet ranking for non-brand targets. Too early to judge. |
| GA4 key events | Firing. Organic since 09-19: 390 reservation clicks, 311 order clicks, 132 catering clicks. But five engagement events (`popup_view`, `popup_dismiss`, `nav_menu_click`, `faq_open`, `announcement_dismiss`) are also marked as key events, which inflates the totals about 5×. |
| Overall traffic | Clicks −14.5% (5,283 → 4,517), impressions −16.7%. CTR improved (9.83% → 10.08%). Most of the drop is the Bakehouse impressions leaving plus softer "penelope social" brand demand (8,668 → 7,836). Non-brand clicks are roughly flat. **Confounder:** the September 2026 Spam Update rolled out from 09-24 through roughly 10-08, overlapping this window. The overlap is a hypothesis, not a cause. |

### Top 5 issues

1. **Homepage targets "cafe and bar", not "restaurant" (High).** "Restaurant" appears 0 times in visible homepage copy, and the title has no "Vaughan" or "Italian". About 4,600 impressions on "restaurants (in) Vaughan" at position 4.9 earn 2.8% CTR, against an expected 6–9%. The rewrite was recommended on 09-19 and not shipped.
2. **The business identity is fragmented (High).**
   - The directions link and the review link point to **two different Google place IDs** (`0x…:0xd9f3c33a869788c9` vs `0x…:0x3e54ffff5191a9bd`), which could mean a duplicate Business Profile.
   - The footer links Instagram `@penelope.social`, but schema `sameAs` uses `@penelopesocial` (`web/src/data/site.ts:44`).
   - Apple Maps has a wrong unit number, wrong hours and category "Pizza Restaurant".
   - Yelp hours look stale, and blogTO calls the business "Penelope Focacceria".
3. **Nobody owns "Italian restaurant Vaughan" (High).** 982 impressions sit at position 19.6. "Italian restaurant" appears nowhere on the site, and the Business Profile has no Italian category.
4. **`/catering-events` is thin, and the Christmas packages are invisible to Google (High, time-sensitive).**
   - Main copy is about 190 words, with no capacity, per-person pricing, packages or room photos.
   - The corporate Christmas-party offer lives only in a popup.
   - It contradicts `/menus/catering` on notice (24 h vs 72 h for full pizzas).
   - It is peak booking season.
5. **No security headers and no long-lived asset caching (High, one-file fix).** There is no HSTS, X-Content-Type-Options, Referrer-Policy or framing protection. Hashed `/_astro/*` files and fonts are served `max-age=0, must-revalidate`. A single `web/public/_headers` file fixes both.

### Top 5 quick wins (each under an hour)

1. Rewrite the homepage title, meta and H1 (copy in §3).
2. In GA4 Admin → Events, unmark `popup_view`, `popup_dismiss`, `nav_menu_click`, `faq_open` and `announcement_dismiss` as key events. They are about 80% of organic "conversions".
3. Fix the schema `sameAs` Instagram handle and strip tracking parameters from the Instagram and TikTok URLs (`web/src/data/site.ts:44-45`).
4. Add `aria-label`s to the catering form's select and textarea (`ContactFormSection.astro` ~L50-70). This turns Lighthouse's agentic accessibility-tree audit green on `/catering-events`.
5. Add `web/public/_headers` with security headers plus immutable caching for `/_astro/*` and `/fonts/*`.

---

## 1. Technical SEO (78)

Full detail: `findings/technical.md`.

**What works**
- All 20 sitemap URLs return 200, with self-referencing canonicals and no noindex.
- robots.txt is valid and points at the sitemap index.
- Redirects take one 301 hop: http → https, www → apex, `/sourdough-bakery` → `/bakery-vaughan`, `/events` → `/catering-events`.
- The 404 page returns a real 404 with noindex.
- Pages are fully server-rendered HTML with brotli compression and a viewport meta tag.
- Search Console shows the sitemap resubmitted on 09-30 with 20 URLs and 0 errors.
- Most www duplicates have consolidated. `www/contact` still shows 487 impressions, which should fade.

| Severity | Finding | Fix |
| --- | --- | --- |
| High | No security headers (HSTS, XCTO, Referrer-Policy, Permissions-Policy, XFO/CSP) | Add `web/public/_headers`, with CSP in report-only mode first |
| Medium-High | `/_astro/*` (content-hashed) and `/fonts/*` served `max-age=0, must-revalidate` | Same `_headers` file: `/_astro/*` one-year immutable; `/fonts/*` 30 days |
| Medium | Sitemap has no `<lastmod>` | `@astrojs/sitemap` `serialize` in `web/astro.config.mjs:19-27`, ideally from Sanity `_updatedAt` |
| Medium | `/locations/scarborough` is "Discovered – currently not indexed" and has never been crawled, yet is in the sitemap | Decide its role (§4): drop it from the sitemap, or noindex it and point it at penelopebakehouse.com |
| Medium | Trailing-slash URLs return **307** (temporary), e.g. `/about/` → `/about` | Cloudflare Redirect Rule with 301/308. No internal links use the slash form, so urgency is low |
| Medium | `http://www` takes 2 hops to the apex | Single rule to `https://penelopesocial.com` |
| Low | Turnstile script loads on every page, including pages with no form (`BaseLayout.astro:77-81`) | Load it only where a form renders (see Performance) |
| Low | `/reservations` is a permanent 301 to a Toast URL that could change (`_redirects:5`) | Use a 302 |
| Low | `lang="en"`; IndexNow not configured | `en-CA`; enable Cloudflare Crawler Hints |

## 2. Content quality (70)

Full detail: `findings/content.md`. E-E-A-T weighted 71: Experience 78, Expertise 72, Authoritativeness 55, Trust 80. Readability: Flesch 52–80.

**What works.**
- The four Vaughan landing pages are real pages, not doorways: each has 535–660 unique words with real prices, items and FAQs.
- They don't cannibalize each other, and they cross-link to menu anchors.
- Templated-phrase risk is low (`templated_ratio` 0.0).
- The Stalteri family story is told consistently.

| Severity | Finding | Fix |
| --- | --- | --- |
| High | No brunch or happy-hour content anywhere. Both words appear 0 times; `/brunch` and `/happy-hour` return 404. Brunch: 704 impressions at position 9.6. "penelope social happy hour": 24–28% CTR, no page | **Client decision first.** If the offers exist, build `/happy-hour` and a brunch or Sunday-morning page. If not, add an honest "Do you have a happy hour?" FAQ to `/menus/bar` and a "Sunday mornings" section to `/cafe-in-vaughan` |
| High | `/catering-events` has about 190 words of main copy: no capacity, packages, per-person pricing or room photos. Christmas-party packages exist only in the popup. Notice-period conflict with `/menus/catering` | Expand the page: capacity, a "feeds 10/20/40" table, December packages in page copy, room photos, one consistent notice rule. SXO suggests splitting catering from private events later |
| Medium | Bakehouse "brand" internal anchors on home, cafe, pizza and about link to the internal `/locations/scarborough` rather than penelopebakehouse.com. That page's FAQs speak as the Bakehouse | Point Bakehouse anchors off-site; rewrite the Scarborough FAQs in Social's voice or remove them |
| Medium | The starter story is repeated near-verbatim on three landing pages and twice on `/about`. The "X vs regular" tables are generic | Replace with first-hand detail and real review quotes per page |
| Medium | Authority is the weakest E-E-A-T signal: no press mentions, no quoted reviews, no opening year | Add a review strip (quotes plus a link to the Google profile), press links, and "Open since 20XX" |
| Low | Factual nits: bakery page says "come by the counter" but loaves need 24 h notice; bar page says "beer" but lists none; pizza title says "Best" with nothing to support it | Align copy |

## 3. On-page SEO (63)

| Severity | Finding | Fix |
| --- | --- | --- |
| High | **Homepage title, meta and H1** don't target the queries the page ranks for | Title (shipped, adjusted for the Woodbridge rule): `Penelope Social \| Italian Restaurant in Woodbridge, Vaughan` (59). H1: `Italian restaurant, cafe and bar in Woodbridge, Vaughan`. Meta: lead with restaurant, Vaughan, focaccia and sourdough pizza, cocktails, and the 4.7★ rating (full copy in `findings/content.md`). Source: `web/src/data/seo.ts:10`, `copy.ts:118`, plus the Sanity homepage `metaTitle` |
| High | `/catering-events` title/meta | `Catering & Private Events in Vaughan \| Penelope Social`; meta mentions capacity, trays and Christmas parties |
| Medium | The three merch product pages all have H1 "Merch"; titles are 23–26 characters | H1 = product name; title like `Penelope Social Hoodie – Woodbridge Cafe Merch` |
| Medium | Long titles: `/menus/lunch` 71, `/menus/dinner` 67, `/menus/catering` 62. Long metas: tote 305, catering menu 201. Menu H1s are one word | Trim to 60/155; H1s like "Lunch menu" |
| Medium | `/locations` has 48–63 words; `/locations/woodbridge` 155–211 and overlaps `/about` and `/contact` | Add parking, transit and directions detail, a photo of the entrance, an embedded Place map |
| Medium | No `<main>` landmark on 16 of 20 pages, and no `<header>`/`<footer>` elements on any page | Wrap the page-builder output in `<main>` in the layout |
| Low | The Christmas-modal H2 is injected on every page and causes H2→H4 heading skips | Render the modal heading as a non-heading or a `<dialog>` label |
| Low | `/contact` is linked only from merch product pages (4 inbound) | Link it from the footer and nav drawer |

## 4. Local SEO (65)

Full detail: `findings/local.md`. Dimensions: GBP 15/25, reviews 13/20, local on-page 15/20, NAP and citations 9/15, local schema 7/10, local links 6/10.

**What works.**
- NAP is identical across every page, the footer, JSON-LD and the Bakehouse site: 125 Hawkview Blvd, Woodbridge, ON L4H 2E2, (905) 607-0606.
- Visible hours match schema on every page checked.
- The Woodbridge (core pages) vs Vaughan (landing pages) geo split is deliberate and sound.

| Severity | Finding | Fix |
| --- | --- | --- |
| High | **Two Google place IDs** linked from the site (directions vs reviews). Verified in live HTML | In Business Profile, confirm which listing is canonical. Report or merge the duplicate. Use one place ID everywhere |
| High | Apple Maps: "12-125 Hawkview Blvd", Sun–Tue closed, 10am open, category "Pizza Restaurant", description "micro sourdough bakery" | Claim it in Apple Business Connect and correct it |
| High | Yelp shows only daytime hours (search snippet), with only 14 reviews | Claim Yelp and fix hours. Yelp holds positions 1–4 on many "near me" SERPs |
| Medium | Inconsistent names and story: "Penelope Focacceria" (blogTO, Instagram bio), "micro bakery" (Apple, Tourism Vaughan) vs "baked in Scarborough" (site). MapQuest has postal code L4H 3T7 | Choose one story and align listings. Add a line to `/about` explaining the Focacceria name if it's a former or alternate name |
| Medium | GBP: no "Italian restaurant" category; description is "an enigma, don't try and classify it" (carried over from the prior audit, not re-verified) | Add the category; write a 750-character description |
| Medium | The "4.7 · 600+ on Google" badge is text only; no review quotes; the map embed is an address search, not a Place embed, and appears only on location pages | Review strip with a "Leave a review" link; Place-ID embed on `/contact` |
| Low | TripAdvisor listing unclaimed (1 rating); Facebook and Bing Places unconfirmed | Claim them |

**Scarborough page decision.** Search Console says `/locations/scarborough` is not indexed and never ranked, so it was never the source of the cannibalization; `/sourdough-bakery` was. It also isn't earning anything. The recommendation is to **remove it from the sitemap and noindex it**. Keep it as a short sister-brand card for users, and link to penelopebakehouse.com.

## 5. Schema and structured data (72)

Full detail with corrected snippets: `findings/schema.md`.

**What works.**
- One valid `@graph` per page.
- The Bakehouse is correctly modelled as a separate entity (`https://penelopebakehouse.com/#bakery`).
- Hours match visible text.
- Breadcrumbs are correct.
- Menu Offers are numeric CAD.
- FAQ markup matches visible FAQs and differs per page.
- No self-serving `aggregateRating`.

| Severity | Finding | Fix |
| --- | --- | --- |
| Medium | No Product/Offer on the three merch pages (`merchandise/[slug].astro:39`) | Product with Offer: CAD, `availability: InStoreOnly`, restaurant as seller |
| Medium | `supplier` references `https://penelopebakehouse.com/#bakery`, but merch pages never define that node (`schema.ts:90`) | Always include `bakehouseSchema()` (`schema.ts:155`), or drop `supplier` where it isn't needed |
| Medium | Restaurant `image` is `favicon-192.png` (`schema.ts:81`); no WebSite node | Real storefront and food photos plus a logo; add a WebSite node on `/` |
| Low | `sameAs` has the wrong Instagram handle, tracking params, and no GBP or Yelp links; `hasMenu` uses plain strings; no `priceRange`, `hasMap`, `acceptsReservations` URL, `founder` or `foundingDate` | See schema.md §5 |
| Info | FAQ rich results were retired for non-gov/health sites; the markup is harmless | Leave it; don't expand it |

## 6. Performance (82)

Full detail: `findings/performance.md`.

**Field data (CrUX, p75, 28 days to 10-04): all good.**

| Scope | LCP | INP | CLS | TTFB |
| --- | --- | --- | --- | --- |
| Origin | 480–485 ms | 62 ms | 0 | 134 ms |
| Homepage, mobile | 680 ms | 72 ms | 0 | |
| Homepage, desktop | 602 ms | 57 ms | 0 | |

98–99% of visits are rated good, and history is flat.

**Lab data (Lighthouse mobile, throttled) is weak:**

| Page | Mobile score | Mobile LCP | TBT | Desktop score |
| --- | --- | --- | --- | --- |
| Homepage | 67–68 | 10.1 s | | 99 |
| /menus/lunch | 57 | 9.5 s | 490 ms | 99 |
| /pizza-vaughan | 75 | 7.4 s | | 92 |
| /catering-events | 68 | 12.6 s | | 99 |

Real users don't experience the lab LCP, but slow-network visitors on mid-range phones are closer to it than CrUX's median audience.

| Severity | Finding | Fix |
| --- | --- | --- |
| High | Turnstile loads in `<head>` on every page and pulls about 600–700 KB of challenge payload on the homepage. It is the likely cause of the 10 s lab LCP (hypothesis) | Load it lazily on form focus or intersection with explicit render (`BaseLayout.astro:78-80`, `scripts/forms.ts`, `lib/turnstile.ts`) |
| High | No long-lived caching (shared with Technical #2) | `_headers` |
| Medium | Hero and banner images have no width cap or `srcset` (`Hero.astro`, `BannerHero.astro`). The `/pizza-vaughan` banner is a 575 KB AVIF from a 3840 px source; at `w=1200` it is about 126 KB | Use `imageSrcset` with a width cap |
| Medium | Fonts are `.otf` (about 145 KB for 2 faces) | Subset woff2; update `global.css:101-128` and the preloads |
| Medium | 4 render-blocking stylesheets; Swiper CSS loads everywhere | Inline critical CSS; load Swiper CSS per page |
| Medium | `/menus/lunch` TBT is 490 ms (GSAP, timeline scripts, GTM) | Load on demand |
| Low | No speculation rules; some images lack dimensions; the Cloudflare Web Analytics beacon duplicates GA4 | |

## 7. Images (80)

- **The alt text is fine.** The crawl's "~21 images without alt per page" is a false positive. Those images all carry a deliberate `alt=""`: mega-menu thumbnails inside text links, which are rendered twice (desktop and drawer), social icons inside `aria-label`led links, and an `aria-hidden` illustration. The meaningful images have descriptive alt text.
- **Formats are good.** Sanity CDN with `auto=format` serves AVIF or WebP.
- **Hero.** It is a single 1920 px image (67 KB) served to 390 px phones; an 800 px version is 28 KB.
- **Lazy loading.** Two below-fold images are `loading=eager` on mobile ("Event at Penelope", "Loaves of Sourdough Bread"), and the duplicated menu thumbnails are `loading=auto`.
- **Dimensions.** About 5–7 images per page lack `width`/`height` (footer logo, social icons).

## 8. AI search readiness (72)

Full detail: `findings/geo.md` and `findings/agentic.md`.

**What works.**
- Server-rendered pages.
- Search and retrieval bots get 200: OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Googlebot, bingbot, Applebot.
- The landing pages have quotable FAQ answers with prices and address.
- Clean accessibility tree on the homepage: labelled dropdown and drawer, a native `<dialog>` popup.
- Brave ranks the homepage #1 for "focaccia sandwich Vaughan".

| Severity | Finding | Fix |
| --- | --- | --- |
| High | Same positioning gap as §3: Penelope isn't in the top 20 (Brave) for "best Italian restaurant Vaughan" or "brunch Vaughan" | Add a homepage and `/about` definition passage and an "Is Penelope an Italian restaurant?" FAQ |
| Medium | **Cloudflare blocks AI training crawlers with 403 while robots.txt says `Allow: /`.** Verified: GPTBot, ClaudeBot and CCBot get 403; OAI-SearchBot, PerplexityBot and Googlebot get 200. meta-externalagent is not blocked, so the policy is inconsistent. **This is also why neither Penelope domain appears in Common Crawl**, which left the backlink analysis without data | Business decision: either allow them in Cloudflare AI Crawl Control, or keep blocking and make robots.txt say so explicitly. Confirm in Cloudflare Security Events |
| Medium | `/llms.txt` fails the Lighthouse audit: plain "Label: URL" lines, no `>` summary line. It contains internal operator notes ("Do not rename catering-events…", Search Console instructions), omits the pizza, sandwiches and cafe pages, and calls Woodbridge "the city" | Rewrite `web/public/llms.txt` as Markdown links with a summary; remove the internal notes |
| Medium | Catering form `select#Reason-For-Inquiry` has no accessible name, and the textarea has only a placeholder. Lighthouse Agentic Browsing scores **1/3** on `/catering-events` (homepage 2/3) | `aria-label` or visible `<label>` in `ContactFormSection.astro` |
| Medium | Thin third-party footprint: Yelp, Visit Vaughan, one r/Vaughan thread, Streets of Toronto, blogTO. No TripAdvisor presence, no Wikidata, no video | Local PR and listings (§4) |
| Low | No Markdown alternate (`Accept: text/markdown` returns HTML); no WebMCP | Optional |

## 9. Measurement

- **GA4 (granted mid-audit; full detail in `findings/google.md` §5).**
  - Organic: 5,881 sessions, 69.6% engaged, 28 days. Mobile accounts for 79% of sessions.
  - Real organic conversions since 09-19: 390 reservation, 311 order and 132 catering clicks, plus 8 form leads.
  - **Five engagement events are marked as key events** and make up about 80% of organic key events. Unmark them.
  - The Christmas popup gets 1% clicks and 81% dismissals.
  - `/menus/dinner` (39% engaged) and `/menus/lunch` (47%) lose most of their brand-sitelink landings. Put Reserve and Order CTAs at the top of the menu pages.
  - 59 sessions came from the "AI Assistant" channel.
- **Backlinks: not enough data to score.** Neither domain is in Common Crawl, most likely because CCBot is blocked (§8). The reciprocal Social ↔ Bakehouse homepage links are fine.
  - Add Bing Webmaster Tools or a free Moz key for referring-domain counts.
  - Local link targets: Vaughan Chamber of Commerce, blogTO / Vaughan Today pitches, Tourism Vaughan's brunch list, catering partners.

## 10. Search experience / SXO (61)

Full detail: `findings/sxo.md`. WebSearch is not a live google.ca SERP, so the SERP mixes in this section are estimates.

| Query | SERP shape | Page | Verdict |
| --- | --- | --- | --- |
| restaurants in vaughan | About 75% directories, plus the local pack | Homepage | Right page type, wrong snippet |
| italian restaurant vaughan | Italian restaurants' homepages, plus OpenTable and Yelp | None | Gap |
| brunch vaughan | Directories, Tourism Vaughan list | None | Gap (client decision) |
| happy hour vaughan | Pages listing times and prices | `/menus/bar` never says "happy hour" | Gap |
| catering / private events | Caterers with per-person pricing, private-dining pages | `/catering-events` serves both with one form | Mismatch |
| pizza / Italian sandwich / cafe in Vaughan | Directories and lists | Specialty pages | Aligned |
| bakery vaughan | Stand-alone bakeries and cake shops | `/bakery-vaughan` | Partial |

**Persona scores, weakest first:**

| Persona | Score |
| --- | --- |
| Brunch seeker | 34 |
| Christmas-party planner | 39 |
| Office catering organizer | 46 |
| Italian-dinner searcher | 61 |
| Tonight's diner | 68 |
| Coffee seeker | 77 |

Trust is the weakest dimension for every persona: no quoted reviews and no press.

**Mobile.** Inner pages (`/menus`, `/pizza-vaughan`) have no Order, Reserve or Directions button above the fold, and the header CTAs are hidden in the hamburger menu. A sticky mobile action bar would fix this sitewide.

---

## Limitations

- **Google data:** local-pack and live google.ca SERP positions were not measured. The Business Profile was not inspected directly.
- **Third-party sites:** Yelp, TripAdvisor and Toast returned 403 to automated fetches, so their details come from search snippets.
- **Bot testing:** the AI-bot 403 tests used spoofed user agents. Confirm them in Cloudflare Security Events.
- **Confounder:** the September 2026 Spam Update overlaps the before/after window.
- **Tooling:** the Lighthouse lab LCP element was not in the PSI payload, so the Turnstile cause is a hypothesis.
