# SEO audit & content plan — Penelope Social + Penelope Bakehouse

Date: 2026-09-19
Tooling: OpenSEO (site crawl, DataForSEO keyword + SERP data, Google Business Profile)
Market: Canada (loc 2124), English

OpenSEO projects created for this work:
- Penelope Social — `f47f5443-8964-4be5-949d-b03157c3d7ac`
- Penelope Bakehouse — `c9c689c3-cd37-41bc-8ac9-fec1411a8e55`

---

## 0. Blocker: no GSC or GA4 data

**Neither site has Google Search Console or Google Analytics connected to OpenSEO**, so
every number below comes from third-party SERP/keyword data and live crawls — not from
first-party click, impression, or session data.

The only Google property connected to this OpenSEO account is `sc-domain:henleystrategies.com`,
on the unrelated "Default" project. Connecting is an OAuth step that has to happen in the
browser; it cannot be done from here.

Connect at:
- Social — https://app.openseo.so/p/f47f5443-8964-4be5-949d-b03157c3d7ac/settings/integrations
- Bakehouse — https://app.openseo.so/p/c9c689c3-cd37-41bc-8ac9-fec1411a8e55/settings/integrations

Once connected, re-run this audit to get striking-distance queries (positions 4–20), real CTR
by page, and which landing pages actually convert. **Treat the article priorities below as
provisional until that data lands.**

---

## 1. Technical crawl

Both sites are technically clean. No broken links, no server errors, no missing or duplicate
titles/descriptions, no canonical conflicts, no redirect chains. The Astro builds are doing
their job. Everything below is a warning or an info-level nit.

### Penelope Social — 18 pages crawled

| Issue | Count | Detail |
| --- | --- | --- |
| Orphan page | 1 | `/sourdough-bakery` is in the sitemap but linked from nowhere |
| Thin content | 6 | `/menus` (99 words), `/merchandise` (94), `/merchandise/hoodie` (109), `/merchandise/t-shirt` (113), `/merchandise/tote-bag` (139), `/locations` (128) |
| Heading order skips | 17 | H1 → H3 on nearly every page |
| Title > 60 chars | 3 | `/menus/lunch` (67), `/menus/dinner` (63), `/menus/catering` (62) |
| Meta description > 160 chars | 3 | `/merchandise/tote-bag` (305), `/menus/catering` (201), `/sourdough-bakery` (166) |

**No blog exists.** No route, no Sanity schema, no collection. Zero informational content on
the whole domain.

`/sourdough-bakery` being orphaned is the most costly item here: it is the one page aimed at
the sourdough theme and nothing links to it.

### Penelope Bakehouse — 11 pages crawled

| Issue | Count | Detail |
| --- | --- | --- |
| Thin content | 3 | `/locations` (145 words), `/menus/pizza` (143), `/menus` (120) |
| Title > 60 chars | 7 | `/menus` (77), homepage (74), `/about` (74), `/menus/bakery` (73), and three more at 70 |

**`/blog` exists as a route but the crawler never reached it** — it is not in the nav, not in
the sitemap, and has no posts. It is currently invisible to Google.

**The retail/pantry business is entirely missing from the website.** The Google Business
Profile lists a full imported-goods range — extra virgin olive oil ($24), EVOO chili oil ($19),
balsamic of Modena ($11.99), four pasta shapes, five sauces, basil pesto, hot peppers in oil.
A grep of the repo finds no mention of any of it. That is revenue and keyword surface with no
page behind it.

---

## 2. Where each site actually stands

### Penelope Social — 114 ranking keywords, almost all brand

Real non-brand positions:

| Keyword | Position |
| --- | --- |
| sandwiches vaughan | 5 |
| sandwich vaughan | 6 |
| italian sandwich vaughan | 11 |
| patios vaughan | 25 |
| happy hour vaughan | 29 |

Everything else is `penelope social`, `penelope restaurant`, `penelope social menu` etc., plus
a long tail of accidental matches against other restaurants' names.

**The central finding: the site calls itself a "cafe and bar". The market searches "Italian
restaurant".**

| Keyword | Volume/mo | KD | Social's position |
| --- | --- | --- | --- |
| italian restaurant vaughan | 8,100 | 1 | not ranking |
| italian restaurants in woodbridge | 2,900 | 8 | not ranking |
| italian restaurant woodbridge | 2,900 | 6 | not ranking |
| best italian restaurants in vaughan | 1,600 | 0 | not ranking |
| restaurants in woodbridge | 5,400 | 6 | not ranking |
| kleinburg restaurants | 5,400 | 5 | not ranking |
| best restaurants in woodbridge ontario | 1,000 | 0 | **local pack #1**, no organic |
| bars in vaughan | 1,000 | 0 | not ranking |
| catering vaughan | 480 | 0 | not ranking |
| italian catering vaughan | 210 | 0 | not ranking |

These are low-difficulty terms in a suburban market. Nothing here needs authority — it needs
a page.

The `best restaurants in woodbridge ontario` SERP is worth reading closely: **Penelope Social
already holds local pack #1**, while organic 4–10 is TripAdvisor, visitvaughan.ca, OpenTable,
Toronto Life and competitors' homepages. The brand has the trust signal and none of the content.

### Penelope Bakehouse — zero ranking keywords

DataForSEO Labs returns an empty set for `penelopebakehouse.com`. The domain has no organic
footprint at all. Everything is greenfield.

The Google Business Profile, by contrast, is in good shape: claimed, 4.6★ from 74 reviews,
104 photos, full menu with prices synced.

**Two Business Profile problems:**

1. **Category is "Bakery" and nothing else.** No secondary categories. Given that the two
   best-selling products are focaccia sandwiches and pizza by the slice, missing
   `Sandwich shop`, `Pizza restaurant`, `Cafe` and `Italian restaurant` is capping local pack
   reach on exactly the queries with the most volume. This is a five-minute fix with more
   near-term upside than any article below.
2. Profile topics — what reviewers actually write — are: **sandwiches ×30, sourdough bread ×11,
   focaccia ×9, italian ×4**, then pepperoni pizza, crullers, mortadella, pistachio pesto.
   Customers describe this place in exactly the language the keyword data rewards. The website
   should use the same words.

---

## 3. Article plan

Four per site, ordered by expected return. Each is tied to a keyword the SERP shows is
winnable, and each has a conversion path back to an order/booking page.

### Penelope Social

**1. Italian food in Woodbridge: focaccia, sourdough pizza, and what to order**
Primary: `italian restaurant woodbridge` (2,900/mo, KD 6) · `italian restaurants in woodbridge` (2,900, KD 8)
Secondary: `italian restaurant vaughan` (8,100, KD 1) · `best italian restaurants in vaughan` (1,600, KD 0)

The highest-value gap on either site. ~11,000 monthly searches in this cluster and the site
does not use the word "Italian" as a positioning term anywhere. The article should do the
positioning work a homepage rewrite can't: the Stalteri family kitchen, why the bread comes
from the Bakehouse, what "Italian" means here versus the red-sauce trattorias the SERP is full
of. Links to `/menus/lunch` and `/menus/dinner`.
*Pairs with:* adding "Italian" to the homepage title/H1 and the Google Business Profile category.

**2. Catering in Woodbridge and Vaughan: tray sizes, prices, and how far ahead to order**
Primary: `catering vaughan` (480/mo, KD 0) · `italian catering vaughan` (210, KD 0) · `italian catering woodbridge` (90, KD 4)

The `italian catering woodbridge` SERP is local pack plus seven competitor homepages. **There
is no guide content ranking at all** — no one has written the "what does it cost, how much do
I order per person, how much notice do you need" page. Social already has the raw material on
`/menus/catering`: 24-slice pizzas, focaccia sandwiches with a six-minimum, salads for 8–10,
24 hours' notice. Highest commercial intent of anything on this list, and the easiest SERP.

**3. Happy hour and late night in Vaughan: where the bar is still open after 10**
Primary: `happy hour vaughan` (210/mo, KD 1 — currently position 29) · `bars in vaughan` (1,000, KD 0)
Secondary: `best bars in vaughan` (90) · `patios vaughan` (480 — currently position 25)

Social already ranks 29th and 25th for two of these with no dedicated content, so the topical
signal exists. The bar runs to 1am Friday and Saturday, which is a genuine differentiator
against the Earls / State & Main / Kelseys chains that own this SERP. Written as an honest
neighbourhood guide (including other bars) rather than a brochure, it can displace the
OpenTable listicle at #5.

**4. Best restaurants in Woodbridge: the spots locals actually go to**
Primary: `best restaurants in woodbridge ontario` (1,000/mo, KD 0) · `best restaurants in woodbridge` (1,000, KD 0)
Secondary: `restaurants in woodbridge` (5,400, KD 6) · `kleinburg restaurants` (5,400, KD 5)

Social holds local pack #1 here while organic is entirely aggregators. A generous, genuinely
useful neighbourhood guide is the standard way to take that slot.

*Tradeoff, stated plainly:* this means publishing a list that sends readers to competitors.
It works because generosity is what outranks TripAdvisor, and because the local pack #1 slot
means Penelope is the first thing the searcher sees anyway. If that is not acceptable, run
articles 1–3 and skip this one — it is the only one of the four with a real strategic cost.

### Penelope Bakehouse

**1. What a focaccia sandwich actually is — and the six we build in Scarborough**
Primary: `focaccia sandwich` (2,900/mo, KD 0)
Secondary: `focaccia sandwich near me` (720) · `focaccia sandwich recipes` (480, KD 2) · `best focaccia sandwich toronto`

KD 0 on 2,900 searches. The SERP is an AI overview, a recipes carousel, and five recipe blogs
(Smitten Kitchen, Pinch of Yum, Female Foodie) — **not one bakery, not one business**. A shop
that makes these every morning has material nobody else on that page has: the semolina vs
barese difference, why the crumb holds up to stracciatella, how to cut one. "Sandwiches" is
also the #1 topic in their Google reviews (30 mentions), so the customer language already
matches. Links to `/menus/sandwiches` and online ordering.

**2. Sourdough bread benefits: what a 24-hour ferment actually does**
Primary: `sourdough bread benefits` (1,300/mo, KD 24)
Secondary: `is sourdough bread healthy` (1,600, KD 28) · `why is sourdough bread bad for you` (140) · `sourdough bread near me` (3,600, KD 0)

The SERP looks intimidating — WebMD, University Hospitals, a PubMed systematic review — but
**position #2 is abreadaffair.com, a Vancouver bakery, with "11 Reasons to Eat Sourdough
Bread."** A bakery has already proven this is winnable against the health publishers.

Write it from the bench, not the internet: their actual fermentation schedule, what the acids
do, why Vince's starter matters. **Cite real sources for anything health-related and make no
medical claims** — this is a YMYL-adjacent query and thin health content will not hold.
Internal-link hard to the loaves page to capture the transactional `sourdough bread near me`
traffic (3,600/mo, KD 0) that this article's authority will feed.

**3. Pizza by the slice in Scarborough: Roman-style vs New York, and what $6 gets you**
Primary: `best pizza in scarborough` (880/mo, KD 0) · `best pizza scarborough` (880, KD 0)
Secondary: `pizza by the slice toronto` · `italian pizza by the slice near me`

The SERP is Reddit, blogTO's "Best Pizza in Scarborough", and TripAdvisor — and **both blogTO
and TripAdvisor list bakeries (Lamanna's, Calabria) among the best pizza**, so the category
crossover is already established in this market. Bakehouse has the goods: Bee Sting, NY
Pepperoni, Margherita, Vodka, Spicy Vodka Pepp, $6–$7. Also fixes the thin `/menus/pizza` page
(143 words) by giving it something to link to.

**4. An Italian bakery in Scarborough: bread, focaccia, and the imported pantry shelf**
Primary: `italian bakery scarborough` (390/mo, KD 0) · `best italian bakery scarborough` (30)
Secondary: `italian bakery near me` (9,900, KD 3) · `best italian bakery toronto` (140, KD 1)

This one does double duty: it targets a KD-0 local term **and** puts the retail range on the
website for the first time. The olive oil, chili oil, balsamic, four pasta shapes, five sauces
and pesto are on the Google Business Profile with prices and appear nowhere in the repo. Right
now someone searching for imported Italian pantry goods in Scarborough cannot find out this
shop sells them.

---

## 4. Fixes worth doing before or alongside the articles

Ordered by effort-to-impact. Several of these will outperform any single article.

**Bakehouse**
1. Add secondary Google Business Profile categories: `Sandwich shop`, `Pizza restaurant`, `Cafe`, `Italian restaurant`. Minutes of work, affects the surface that drives most of this business.
2. Put `/blog` in the nav and the sitemap before publishing anything into it — it is currently unreachable.
3. Shorten seven titles to ≤60 chars, starting with `/menus` (77) and the homepage (74).
4. Expand `/menus/pizza` (143 words) and `/menus` (120).
5. Build a retail/pantry page.

**Social**
1. Link `/sourdough-bakery` from the homepage, `/about`, and `/menus` — it is orphaned and it is the sourdough anchor.
2. Work "Italian" into the homepage title, H1 and meta description. The whole cluster in §2 hinges on a word the site does not use.
3. Build a blog route + Sanity schema. Nothing on this plan can ship without it.
4. Expand the three merchandise product pages and `/menus` (99 words).
5. Trim three titles and three meta descriptions.
6. Fix the H1 → H3 skips site-wide (17 pages) — accessibility as much as SEO.

---

## 5. What to do when GSC and GA4 are connected

1. Run `get_search_opportunities` on both projects — joins Search Console positions 4–20 against GA4 landing-page outcomes and scores them. This is the single highest-value call once the data exists.
2. Check whether the Bakehouse is getting impressions Labs data cannot see. A domain with no Labs footprint can still be picking up branded and "near me" impressions.
3. Validate the assumption behind Social article #1 — if Search Console already shows impressions on Italian terms, that article moves from speculative to certain.
4. Set up rank tracking on the ~20 keywords named above to measure whether the articles work.
