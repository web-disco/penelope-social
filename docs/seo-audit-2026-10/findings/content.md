# Content Quality and On-Page SEO: penelopesocial.com

Date: 2026-10-06 · Scope: all 20 sitemap URLs (crawl.json plus a live curl of every page) · Baseline: `docs/seo-audit-2026-09.md` (GSC 2026-08-19 to 09-16)
Method: main-content text pulled from live HTML with site-wide chrome removed (any line that appears on 15 or more pages counts as chrome), cross-page line-overlap analysis, Flesch readability on prose, `metadata_template.py` site-wide check, and keyword-presence counts.

## Scores

| Score | Value |
|---|---|
| **Content Quality** | **70 / 100** |
| **On-Page SEO** | **63 / 100** |
| AI citation readiness | 72 / 100 |

### E-E-A-T breakdown (this skill's internal weights, not Google's)

| Factor | Weight | Score | Basis |
|---|---|---|---|
| Experience | 20% | 78 | Specific first-hand detail: a named starter (Anastasia, then Penelope, since 2018), a 48-hour cold ferment, a Roman slice vs NY pie split, exact prices and ingredients, the day-part timeline, parking and Wi-Fi. No customer quotes, no staff voices, no photo captions showing process. |
| Expertise | 25% | 72 | Owners are named (Franco, Vince and Giuliano Stalteri). Vince's construction-to-sourdough path is given. No chef or baker bio or role, and the year Social opened is never stated. |
| Authoritativeness | 25% | 55 | A 4.7 / 600+ Google reviews badge links to the live Google reviews (good). No press, awards, review quotes or third-party mentions anywhere on the site. |
| Trustworthiness | 30% | 80 | NAP is consistent on every page, along with hours, phone, email, prices, HTTPS, a clear Social vs Bakehouse disclosure, and no self-serving review schema. A few small factual inconsistencies (F-12). |
| **Weighted** | | **71** | |

---

## What works

- **No templated metadata.** `metadata_template.py` on 20 pages: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`. Every title and description is written by hand and is page-specific. The 8 `brand_suffix_in_description` flags are low-severity and mostly false positives: for a local business, the name and address in the description help.
- **The four new Vaughan landing pages are substantive, not doorway pages.** Each has 535-663 words of unique main content with real prices, item names, hours, and FAQs that differ page to page. Duplicate body copy between them is limited to the visit/parking block (bakery and cafe) and the parking FAQ (3 pages).
- **There is no hard cannibalization among the four landing pages.** Intents are cleanly split: bread to take home, coffee and morning, pizza, sandwiches. Each page links contextually to its siblings, and the menu cards deep-link to `/menus/lunch#focaccia`, `#pizza-slices`, `/menus/dinner#pizza` and so on. That is the correct hub-and-spoke shape.
- **The FAQ layer is strong for AI citation.** Answers are short, self-contained and factual ("Lunch is Roman-style sourdough sold by the slice, cold-fermented for 48 hours, at $6 to $7 a slice"). The visible FAQs match the `FAQPage` JSON-LD, and price, hours and address appear in plain text.
- **Readability is good.** Flesch Reading Ease runs 52-80 and grade level 4.5-9.5 across the main pages. Sandwiches is lowest only because of Italian ingredient names.
- **Bakehouse disambiguation exists.** `/bakery-vaughan` answers "Is this Penelope Bakehouse? No…" and the home and about FAQs explain the relationship.
- `/sourdough-bakery` now 301s to `/bakery-vaughan`. www 301s to apex. `/menus` links all four landing pages under "What we're known for".

---

## Findings

Severity scale: Critical / High / Medium / Low.

### F-1 · High · The homepage targets "cafe and bar" while GSC demand is "restaurant" and "Italian restaurant"

- **Evidence:** Title `Penelope Social | Cafe and bar in Woodbridge` (44 chars). H1 `Good food, better company at Penelope Social in Woodbridge`. The word **"restaurant" appears 0 times in visible homepage copy**, and "Italian" appears only inside two FAQ answers about sandwiches. "Vaughan" is absent from the title and H1. Meanwhile the homepage sits at pos 4-5 for `restaurants in vaughan` / `vaughan restaurants` / `restaurants vaughan` (~2,900 impr, 2.0-2.6% CTR), and the Italian cluster sits at pos 14-24 (464 impr). The schema already says `servesCuisine: Italian`, but the page copy does not.
- **Cannibalization angle:** "cafe" in the homepage title now competes with `/cafe-in-vaughan`, which exists to own the `cafe in vaughan` / `coffee shops in vaughan` cluster (2,900/mo each, KD 0).
- **Recommendation:**
  - Title (53): `Penelope Social | Italian Restaurant & Bar in Vaughan`
  - Meta (145): `Sourdough pizza, focaccia sandwiches and cocktails at 125 Hawkview Blvd, Woodbridge. Cafe from 9am, dinner and bar from 5pm. 4.7 stars on Google.`
  - H1: `Italian restaurant, cafe and bar in Woodbridge, Vaughan`. Keep "Good food, better company" as the eyebrow or subhead.
  - Add a 60-100 word intro paragraph under the H1 that says, in plain words, "Italian restaurant in Woodbridge, Vaughan". Mention the dinner menu (pies, shareables), the bar, and the Vaughan Mills proximity.
  - Let the homepage own "Italian restaurant Vaughan" for 3-4 weeks before building a separate page. A new page would split signals with the URL that already ranks 4-5 for "restaurants vaughan".

### F-2 · High · No page for brunch or happy hour, two measured demand pools

- **Evidence:** `brunch` appears 0 times and `happy hour` 0 times across all 20 pages. `/brunch` and `/happy-hour` return 404. GSC shows ~600 brunch impressions at pos 5-13 (`brunch vaughan` 134, `brunch near me` 122, `brunch woodbridge` 24 @ 5.7) and happy-hour queries at pos ~7 (`happy hour vaughan` 39), plus `penelope social happy hour` (40 impr, **35% CTR**) and `… happy hour menu` (20). The site already has the brunch-shaped slot: **Sunday cafe 8am-noon** (visible on `/cafe-in-vaughan`, `/menus` and in schema). The bar runs to 1am Friday and Saturday.
- **Recommendation:** These need a business decision first. Do not publish pages for offers that do not exist.
  - If a Sunday menu or happy hour exists or will exist: build `/brunch-vaughan` (title `Sunday Brunch in Vaughan | Penelope Social`, 42) and `/happy-hour` (title `Happy Hour in Vaughan | Penelope Social`, 39). Use the landing-page template, with real times, items, prices, and a FAQ ("Is there happy hour on Fridays?").
  - If not: add a "Sunday mornings" section with an FAQ on `/cafe-in-vaughan` ("Are you open for brunch on Sunday?" with an honest answer), and a "Late night in Vaughan" section on `/menus/bar`. That still captures part of the demand truthfully.

### F-3 · High · `/catering-events` is thin for a page with 1,258 impressions and 0.4% CTR, and `/menus/catering` competes with it

- **Evidence:** About 190 unique main-content words, just a two-line intro, a form and 4 FAQs. There is nothing on capacity, room or space description, event packages, price ranges, menus for events, photos of the room, past events, or testimonials. Ironically, the richest events copy on the site is the site-wide Christmas modal ("cocktails and passed hors d'oeuvres or a seated four-course dinner, tailored to your group"), and that copy is not on this page. Meanwhile `/menus/catering` (505 unique words, prices) is the page that actually answers "catering vaughan" intent, so the two pages split the query. Title `Catering and events in Woodbridge | Penelope Social` uses Woodbridge, while the demand is Vaughan.
- **Recommendation:**
  - Title (54): `Catering & Private Events in Vaughan | Penelope Social`
  - Meta (147): `Pizza and focaccia sandwich trays for offices and parties, or book the room for birthdays, work dinners and Christmas parties. Woodbridge, Vaughan.`
  - H1: `Catering and private events in Vaughan`
  - Add three sections to reach 600-800 words: (a) **Events:** seated and standing capacity, buyout vs semi-private, a format list (passed hors d'oeuvres, four-course seated, cocktail reception), a starting price or minimum spend, and 3-4 room photos with descriptive alt text. (b) **Catering:** a summary of the top 4 trays with prices, plus "Full tray menu" linking to `/menus/catering`. (c) **Proof:** two review quotes from Google mentioning events, plus logos or names of corporate clients if permitted.
  - Change the "Contact Us" anchor on `/pizza-vaughan`, `/sandwiches-vaughan` and `/bakery-vaughan` (it links to `/catering-events`) to "Plan catering or an event". The anchor currently promises a contact page.

### F-4 · Medium · "Italian" intent is split, and no URL owns "Italian restaurant Vaughan"

- **Evidence:** "Italian" is used as the head modifier on `/cafe-in-vaughan` (title `Italian Cafe & Coffee Shop in Vaughan`, H1 `Italian Cafe in Vaughan`) and `/sandwiches-vaughan` (`Italian Focaccia Sandwiches in Vaughan`). The homepage and `/menus/dinner`, the two URLs that should carry "Italian restaurant", never use it. `italian sandwich vaughan` (57 impr, pos 6.7) is well served. `italian restaurant vaughan` (208 @ 24.1) is not.
- **Recommendation:** Apply F-1 on the homepage. On `/cafe-in-vaughan`, drop "Italian" from the title to sharpen it on the high-volume terms: `Cafe & Coffee Shop in Vaughan | Penelope Social` (47). Keep "Italian cafe" in the H1 and body. Add one sentence to `/menus/dinner` and `/menus` framing dinner as Italian (pies, 'nduja, stracciatella, amari, Italian wine). Also add "Italian restaurant" as a GBP category (still open from the September audit).

### F-5 · Medium · Bakehouse brand signal still leaking into Social: `/bakery-vaughan` inherited the `/sourdough-bakery` 301, and internal links feed `/locations/scarborough`

- **Evidence:** `/sourdough-bakery` (7,620 impr in the baseline, mostly Bakehouse-brand queries) now 301s to `/bakery-vaughan`, so that page will inherit the brand-query impressions. Three high-authority pages link the anchor "Visit the Bakehouse" / "Penelope Bakehouse" / "Bakehouse in Scarborough" to **internal** `/locations/scarborough` rather than to penelopebakehouse.com: the homepage, `/cafe-in-vaughan` and `/pizza-vaughan` (plus `/about`). `/locations/scarborough` FAQs are written in the Bakehouse's first person ("Our focacceria is inside the bakehouse"; "Is the sourdough baked in-house? Yes… including the bread for our other locations"; "What do you sell?"). That reads as the Bakehouse's own page.
- **Recommendation:** Point every "Penelope Bakehouse" anchor straight to `https://penelopebakehouse.com`. Rewrite the `/locations/scarborough` FAQs in Social's third person ("Penelope Bakehouse, our sister bakery, sells…"). In GSC, filter page = `/bakery-vaughan` for `penelope bakehouse*` queries over the next 3 weeks. If Bakehouse-brand impressions on Social do not fall, take the September audit's option 3 (noindex `/locations/scarborough`).

### F-6 · Medium · The four landing pages share one skeleton, the starter story is duplicated, and the comparison tables are generic

- **Evidence:** All four pages follow the same sequence: H1 "X in Vaughan", explainer, 4 menu cards plus the "4.7 / 600+ reviews" badge, the starter story, an "X vs Y" table, a catering block, a visit block, FAQ, and a CTA. The starter story ("It began in 2018 as a starter called Anastasia. It was nearly lost, brought back to life and renamed Penelope. The restaurant and the bakehouse both grew from it.") appears nearly word for word on `/bakery-vaughan`, `/pizza-vaughan` and twice on `/about`, and is referenced in the `/sandwiches-vaughan` FAQ. The comparison tables lean on strawman generalities rather than first-hand specifics: "Regular sub: Pre-sliced deli meats and processed cheese", "Supermarket bread: In a factory, days before you buy it", "Regular pizza: Often made in bulk, sometimes frozen". Headlines like "worth the drive" and "the pizzas people keep coming back for" are claims with no proof. `/menus` repeats the `/cafe-in-vaughan` day-part timeline ("9am: Coffee and pastries … 5pm") almost verbatim. Under the September 2025 QRG this is not low-quality AI content, because the pages are full of verifiable specifics. Still, "repetitive structure across pages" is a listed marker, and the tables are the weakest copy on the site.
- **Recommendation:** Keep the full starter story only on `/about`. Elsewhere, use one sentence plus a link ("made with Penelope, our starter since 2018"). On each landing page, replace the "vs" table or half its rows with first-hand detail only Penelope can give: hydration and ferment times, who bakes and when the truck arrives from Scarborough, the best-seller ranking, a staff pick with a named staff member, and **one real Google review quote** about that product. That turns "people keep coming back for" into evidence.

### F-7 · Medium · The menu-page titles are long and overlap the landing pages' product terms

- **Evidence:** `/menus/lunch` `Lunch Menu | Sourdough Focaccia, Pizzas & Salads at Penelope Social` (71 chars, truncates). `/menus/dinner` `Dinner Menu | Pizzas, Handhelds & Shareables at Penelope Social` (67). Both put "pizza" and "focaccia" up front, the head terms `/pizza-vaughan` and `/sandwiches-vaughan` now own. `/menus/catering` description is 201 chars. Bar H1 is just `Bar`, dinner H1 `Dinner`, lunch H1 `Lunch`. The bar subtitle reads "Cocktails, wine, beer" but there is no beer section.
- **Recommendation:**
  - `/menus/lunch` (58): `Lunch Menu | Focaccia Sandwiches & Pizza | Penelope Social`. Shorter alternative (40): `Lunch Menu | Penelope Social, Woodbridge`. H1 `Lunch menu`.
  - `/menus/dinner` (50): `Dinner Menu | Pizza & Shareables | Penelope Social`. H1 `Dinner menu`.
  - `/menus/bar` (52): `Bar Menu | Cocktails, Wine & Amari | Penelope Social`. H1 `Bar menu`. Fix the "beer" claim or add the beer list.
  - `/menus/catering` title (45): `Catering Tray Menu & Prices | Penelope Social`. Meta (142): `24-slice sourdough pizzas, focaccia sandwich trays (min 6), breads and salads for 8 to 10, with prices. Woodbridge, Vaughan. 24 hours' notice.`
  - Low risk of real cannibalization: menus carry "menu" intent and the landing pages carry "in Vaughan" intent. Shortening still stops truncation and sharpens the split.

### F-8 · Medium · The merch product pages share H1 "Merch", and the tote description is 305 chars of generic copy

- **Evidence:** `/merchandise/hoodie`, `/t-shirt` and `/tote-bag` all have H1 `Merch`, with the product name in an H2. Unique content is 35-65 words each. Tote description (305 chars): "This grey tote bag combines style and function … making it an eco-friendly companion for any occasion." That is the most generic, AI-sounding copy on the site, and it is also the visible body text. "available in store" links to `/contact`. There is no Product schema (see the schema findings).
- **Recommendation:** H1s `Penelope Social Hoodie`, `Penelope Social T-Shirt`, `Penelope Social Tote Bag`. Titles like `Penelope Social Hoodie | Merch` (30). Tote meta (≤155): `Grey tote with Penelope's bicycle-and-bread graphic on one side and the Social logo on the other. $10, pick up in store in Woodbridge.` Rewrite the body in the same plain voice as the hoodie and t-shirt pages, and add sizes, material and care. These pages carry little search value; the fixes are hygiene.

### F-9 · Medium · Thin hub and location pages

- **Evidence:** Unique main-content words: `/locations` 48, `/contact` 83, `/locations/woodbridge` 155, `/merchandise` 27. `/locations/woodbridge` H1 is just `Penelope Social`, and its title `Woodbridge | Penelope Social | 125 Hawkview Blvd` puts the address where a query term belongs.
- **Recommendation:**
  - `/locations/woodbridge` is the natural owner of "Penelope Social hours / address / parking". Title (54): `Penelope Social, Woodbridge | Hours, Address & Parking`. Meta (146): `Hours, address, parking and phone for Penelope Social at 125 Hawkview Blvd, Woodbridge (Vaughan). Cafe from 9am, bar till 1am Friday and Saturday.` H1 `Penelope Social in Woodbridge, Vaughan`. Add 150-250 words: directions from Hwy 400/427 and Vaughan Mills, parking, patio, accessibility, and a nearby-landmark sentence.
  - `/locations`: add one short paragraph per location (who it is for, what to order). Otherwise leave as is; it is a hub.
  - `/contact` is linked only from the three merch product pages (it is not in the nav or footer). Add it to the footer.

### F-10 · Medium · No `<main>` landmark on 16 of 20 pages

- **Evidence:** Only `/about`, `/locations`, `/locations/scarborough` and `/locations/woodbridge` have a `<main>` element, and no page has `<header>` or `<footer>`. The homepage, all four landing pages, all menus, catering-events, contact and merch have neither.
- **Impact:** Main-content extractors (trafilatura, AI-crawler readability passes, assistive tech) cannot reliably separate the page body from the mega-menu and the site-wide Christmas modal. That dilutes what gets quoted and makes the main-content word counts in the crawl unreliable for those pages. It is also a WCAG landmark issue.
- **Recommendation:** Wrap page content in `<main>` in the shared layout, and use `<header>` and `<footer>` for the chrome. This is a one-line layout fix.

### F-11 · Low · Site-wide seasonal modal and newsletter add a duplicate H2 to every page

- **Evidence:** Every page ends with H2 `Booking a Corporate Christmas Party?` plus ~60 words of Christmas copy, and most pages also have H2 `Stay in the loop`. Those H2s sit after the footer H4s (`Menus`, `Hours & location`, `Contact`), which produces the heading skips in crawl.json (`…2224442`).
- **Recommendation:** Render the modal copy outside the main content (a `<dialog>` with no heading level, or `aria-hidden` until opened), and remove it after the season. Make the footer headings `<h2>` or plain text styled as headings, to clear the H2-to-H4 skips.

### F-12 · Low · Small factual inconsistencies that cost trust

- `/bakery-vaughan` hero says "to take home from our Woodbridge counter" and "come by the counter", but the FAQ and catering menu say loaves need **24 hours' notice**. Say clearly what is on the shelf for walk-ins and what is order-ahead only.
- `/about` timeline: the starter was "nearly lost while opening the restaurant" (2018), yet "2024: Penelope became the base for the doughs at Social". The year Social opened is never stated. Add it, because it is a basic Experience signal.
- `/menus/bar` subtitle says "beer" but lists none.
- Schema `sameAs` uses `instagram.com/penelopesocial/`, while every visible link uses `instagram.com/penelope.social/`. Confirm which handle is real.
- `/pizza-vaughan` title says "**Best** Sourdough Pizza in Vaughan" while its H1 says "Sourdough Pizza in Vaughan". The superlative is unsupported on the page. Use `Sourdough Pizza in Vaughan | Penelope Social` (44) or back "best" with review quotes.
- `/about` copy is telegraphic in places ("Franco, Vince, Giuliano." / "Bakehouse bakes it. Social is the cafe and bar." / "Breads and pizzas drawn from Italy and further."). Expand it into full sentences. This is the page Google and AI systems use for who-runs-this.

### F-13 · Low · No freshness signals

- **Evidence:** No `dateModified`, no "updated" text and no dated content on any page. There is no blog, so nothing on the site changes visibly over time. The menus change (rotating crullers, cookies, "local fruit" cocktails) without any date.
- **Recommendation:** Add `dateModified` to the WebPage JSON-LD on the menu and landing pages, generated from Sanity `_updatedAt`. A visible "Menu updated October 2026" line on menu pages is a cheap freshness and trust cue. The blog route from the September plan remains the real fix.

---

## Cannibalization matrix (current state)

| Query cluster | Intended owner | Other URLs competing | Risk | Action |
|---|---|---|---|---|
| sourdough pizza vaughan / pizza vaughan | `/pizza-vaughan` | `/menus/dinner`, `/menus/lunch` titles lead with "Pizzas" | Low | F-7 titles |
| italian sandwich / focaccia sandwich vaughan | `/sandwiches-vaughan` | `/menus/lunch` title "Sourdough Focaccia…" | Low | F-7 |
| cafe / coffee shop vaughan | `/cafe-in-vaughan` | **Homepage title "Cafe and bar"**, `/about` title "cafe and bar" | **Medium** | F-1, F-4 |
| bakery / sourdough bread vaughan | `/bakery-vaughan` | `/locations/scarborough`, penelopebakehouse.com (brand queries via the 301) | **Medium** | F-5 |
| catering vaughan | `/catering-events` | `/menus/catering` (richer, has prices) | **Medium** | F-3 |
| italian restaurant vaughan | none | split between cafe and sandwiches "Italian" | Gap | F-1, F-4 |
| restaurants vaughan | Homepage | none | n/a (CTR problem) | F-1 |
| brunch vaughan | none | none | Gap | F-2 |
| happy hour vaughan | none | none | Gap | F-2 |

## Word counts (unique main content, chrome removed) vs floors

| Page | Words | Floor | Status |
|---|---|---|---|
| Home | 362 | 500 | Below. Add the F-1 intro |
| `/catering-events` (service) | 188 | 800 | **Well below** |
| `/cafe-in-vaughan` | 620 | 500-800 (location/service) | OK |
| `/pizza-vaughan` | 663 | 500-800 | OK |
| `/sandwiches-vaughan` | 594 | 500-800 | OK |
| `/bakery-vaughan` | 535 | 500-800 | OK |
| `/locations/woodbridge` | 155 | 500-600 | Below |
| `/locations` | 48 | hub | Thin |
| `/about` | 280 | n/a | Adequate; expand per F-12 |
| Merch products | 35-65 | 300 | Thin (low priority) |
| Menus (lunch/dinner/bar/catering) | 304-557 | n/a (menu) | OK |

Floors are topical coverage guides. Word count is not a ranking factor.

## Priority order

1. F-1 homepage title, meta, H1 and intro (cheapest test against ~2,900 impressions at pos 4-5).
2. F-3 `/catering-events` rewrite and retitle.
3. F-5 point Bakehouse anchors off-site, rewrite the Scarborough FAQs, monitor `/bakery-vaughan`.
4. F-2 brunch and happy-hour decision with the client, then pages or sections.
5. F-10 `<main>` landmark (one-line layout fix).
6. F-7, F-8, F-9 title, H1 and meta hygiene. F-6 de-duplication and first-hand detail. F-11 to F-13.

## Structured findings (Content Quality category, audit-data.json)

```json
{
  "category": "Content Quality",
  "score": 70,
  "on_page_seo_score": 63,
  "ai_citation_readiness": 72,
  "eeat": {"experience": 78, "expertise": 72, "authoritativeness": 55, "trustworthiness": 80, "weighted": 71},
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}},
  "findings": [
    {"id": "F-1", "severity": "high", "title": "Homepage targets 'cafe and bar'; 'restaurant' absent despite pos 4-5 for restaurants vaughan at ~2% CTR", "urls": ["/"]},
    {"id": "F-2", "severity": "high", "title": "No brunch or happy hour content despite ~600 brunch impr and branded happy-hour queries", "urls": []},
    {"id": "F-3", "severity": "high", "title": "/catering-events thin (~190 words), 0.4% CTR, split with /menus/catering", "urls": ["/catering-events", "/menus/catering"]},
    {"id": "F-4", "severity": "medium", "title": "Italian intent split across cafe/sandwiches; no owner for 'Italian restaurant Vaughan'", "urls": ["/", "/cafe-in-vaughan", "/sandwiches-vaughan", "/menus/dinner"]},
    {"id": "F-5", "severity": "medium", "title": "Bakehouse brand leakage: /sourdough-bakery 301 into /bakery-vaughan; internal Bakehouse anchors to /locations/scarborough; first-person Bakehouse FAQs", "urls": ["/bakery-vaughan", "/locations/scarborough", "/", "/cafe-in-vaughan", "/pizza-vaughan"]},
    {"id": "F-6", "severity": "medium", "title": "Landing pages share one template; starter story duplicated; generic comparison tables", "urls": ["/bakery-vaughan", "/cafe-in-vaughan", "/pizza-vaughan", "/sandwiches-vaughan", "/about", "/menus"]},
    {"id": "F-7", "severity": "medium", "title": "Menu titles long (71/67) and lead with landing-page head terms; one-word H1s; catering desc 201 chars", "urls": ["/menus/lunch", "/menus/dinner", "/menus/bar", "/menus/catering"]},
    {"id": "F-8", "severity": "medium", "title": "Merch product H1s all 'Merch'; tote description 305 chars, generic", "urls": ["/merchandise/hoodie", "/merchandise/t-shirt", "/merchandise/tote-bag"]},
    {"id": "F-9", "severity": "medium", "title": "Thin /locations (48), /locations/woodbridge (155), /contact orphaned from nav/footer", "urls": ["/locations", "/locations/woodbridge", "/contact"]},
    {"id": "F-10", "severity": "medium", "title": "No <main> landmark on 16/20 pages; no header/footer elements", "urls": ["site-wide"]},
    {"id": "F-11", "severity": "low", "title": "Site-wide Christmas modal H2 and newsletter H2 on every page; footer H4 skips", "urls": ["site-wide"]},
    {"id": "F-12", "severity": "low", "title": "Factual inconsistencies: bread walk-in vs 24h notice, Social opening year missing, bar 'beer', Instagram handle mismatch, unsupported 'Best' in title", "urls": ["/bakery-vaughan", "/about", "/menus/bar", "/pizza-vaughan"]},
    {"id": "F-13", "severity": "low", "title": "No freshness signals (no dateModified, no dated content, no blog)", "urls": ["site-wide"]}
  ]
}
```
