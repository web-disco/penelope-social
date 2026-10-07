# SXO findings: penelopesocial.com

Date: 2026-10-06 · Target: Penelope Social, 125 Hawkview Blvd, Woodbridge (Vaughan), ON
Method: I rendered the pages with Playwright (`render_page.py --mode always`) for the homepage, /catering-events, /menus/bar, /menus/catering, /pizza-vaughan, /sandwiches-vaughan, /cafe-in-vaughan and /bakery-vaughan, and used the crawl.json data for all 20 sitemap URLs. The SERP analysis used WebSearch (standard and extended) for 14 queries. Demand figures come from GSC in docs/seo-audit-2026-09.md.

## SXO Gap Score: 61 / 100

This is separate from the SEO Health Score. It is a site-level score weighted toward the 10 query clusters below.

| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 8/15 | The 4 specialty pages are well-matched Local pages. The homepage is the right type for a restaurant query, but it carries "cafe and bar" framing. There is **no page at all** for Italian, brunch or happy hour. /catering-events tries to serve 2 different SERPs (office trays and event venue) with one page and matches neither. |
| Content Depth | 10/15 | The specialty pages run 900-1,000 words, with dish cards and prices, a comparison table, a FAQ and a directions block. That is strong. /catering-events has 562 words, mostly the form, FAQ and footer. It gives no capacity, packages, prices or room description. |
| UX Signals | 10/15 | Order Online and Reservations are above the fold on mobile and desktop. The 4.7 rating from 600+ Google reviews sits below the fold, inside "On the menu". The mobile hero shows no hours, no "open tonight" and no address. The Christmas offer appears only in a banner and a modal, not in any page content. |
| Schema | 10/15 | Restaurant, BarOrPub, Menu/MenuItem/Offer, FAQPage and BreadcrumbList are all present. But `image` is `favicon-192.png`, and there is no `priceRange`, no `hasMap` and no Event/Offer for Christmas parties. `sameAs` points to `instagram.com/penelopesocial`, while the site links to `instagram.com/penelope.social` (mismatch). There are no Google Maps or Yelp sameAs links. |
| Media | 9/15 | The site uses real food and room photos. There are no event or room photos (capacity, set tables) on /catering-events, whose hero is the bar with merch on the wall. About 21 nav and footer images per page have empty alt text. |
| Authority | 8/15 | A review count is shown and linked. There are no quoted reviews, no press, and no "as seen on" mentions. Penelope is absent from the editorial lists that rank (Tourism Vaughan, haidasandwich.ca, diaryofatorontogirl, themarlowe.ca), although Yelp's "Cafes in Vaughan" title does name Penelope Social. |
| Freshness | 6/10 | htmldate returns a generic 2026-01-01. Christmas booking is live only as a popup, and there is no indexable seasonal page heading into the Oct-Nov search peak for party bookings. |

## Primary finding: page-type mismatches

| Query cluster (GSC) | SERP dominant type (consensus) | Penelope page | Match | Severity |
|---|---|---|---|---|
| restaurants in vaughan / vaughan restaurants (~3,400 impr, pos 4-5, CTR ~2%) | Directory and listicle (TripAdvisor, Yelp, OpenTable, Wanderlog, Restaurantji, diaryofatorontogirl) about 75%, plus local pack and a chain homepage (Moxies) | Homepage | Right type for a business result, but the snippet says "Cafe and bar in Woodbridge" and contains neither "restaurant" nor "Vaughan" | **HIGH** (CTR problem) |
| italian restaurant vaughan (464 impr across cluster, pos 14-24) | Directories (OpenTable "158 Best Italian", Yelp, Wanderlog) about 45%, plus Italian restaurant **brand homepages** (Giro d'Italia, Osteria Gente, Cantina Amici, Castello, Botticelli) about 55%, plus local pack | None. Homepage title and H1 never say "Italian restaurant" (0 occurrences site-wide) | Missing page | **CRITICAL** |
| brunch vaughan (~600 impr, pos 5-13) | Directories (TripAdvisor, Yelp x3, Uber Eats) about 55%, Tourism Vaughan listicle, TikTok, brand brunch page (Eggstatic), local pack | None. "brunch" appears 0 times on the site | Missing page, and no product (Sunday 8-12 cafe only) | **CRITICAL** (depends on the business) |
| happy hour vaughan (39 impr @ 7.2; "penelope social happy hour" 40 impr @ 35% CTR) | **Brand happy-hour menu pages** with days, times and $ (State & Main, Chop, Moxies) about 45%, Yelp about 55% | /menus/bar has 0 mentions of "happy hour". It lists cocktails ($17-19), wine and amari, but no happy hour times or deals | Mismatch | **HIGH** |
| catering vaughan | Directories (eventsource, WeddingWire, Yelp "party trays", Restaurantji) plus **dedicated caterer pages with per-person pricing and online ordering** (That's Italian "from $18/person, 8-40 people", San Fran Cafe, Avondale, Vaughan City Grill order portal) | /catering-events (1,258 impr, pos 8, CTR 0.4%) is form-only. Prices are on a different page (/menus/catering) | Partial | **HIGH** |
| event venue woodbridge | Banquet-hall directories (eventsource, WeddingWire, Eventective) and halls with 60-1,200 guests, plus private-dining pages (Forty "room for up to 80", Moxies group bookings, That's Italian private events, OpenTable private dining, themarlowe "Top 10 private room restaurants") | Same /catering-events page. Capacity, room photos and package details are all missing | Mismatch on the banquet-hall query. The winnable target is the "private dining / Christmas party" sub-intent | **HIGH** |
| pizza vaughan | Directories (Yelp, Wanderlog, OpenTable) plus chain location and delivery pages (Boston Pizza, Pizza Pizza, DoorDash) plus local pack | /pizza-vaughan, a Local page with prices, FAQ and comparison | Aligned | ALIGNED |
| italian sandwich vaughan (57 impr @ 6.7) | DoorDash, Yelp, TripAdvisor, TikTok x2, listicles (haidasandwich.ca "9 best", a Substack) | /sandwiches-vaughan, aligned. **Penelope is already named in the result set** ("bakes all the bread in house... massive portions") | Aligned | ALIGNED |
| cafe in vaughan | Yelp (title names "Penelope Social"), TripAdvisor (Faema), Wanderlog, TikTok, Tourism Vaughan "Cozy cafes", Uber Eats | /cafe-in-vaughan, aligned: hours timeline, Wi-Fi, parking, prices | Aligned | ALIGNED |
| bakery vaughan | Yelp, Wanderlog, a Taste Toronto feature on Bartholomew, the Bartholomew homepage, and cake/donut shops | /bakery-vaughan, a sourdough take-home shelf inside a cafe. Searchers expect pastries and cakes from a stand-alone bakery | Partial | MEDIUM |

The common pattern is that the local pack and directories own the top of every one of these SERPs. Penelope's website wins clicks only where its snippet says something a directory cannot: concrete prices, hours, "open late" and the exact offer. The pages that do this (pizza, sandwiches, cafe) are aligned. The pages that do not (homepage, catering/events, bar) are leaking.

## Findings

### F1. CRITICAL: no page for "italian restaurant vaughan"
- **Evidence:** In GSC the cluster sits at positions 14-24 (italian restaurant vaughan 208 impr @ 24.1). On the site, "italian restaurant" occurs 0 times and "Italian" never appears in the homepage title or H1. Schema `servesCuisine` does list Italian. In the SERP, about 5 of 9 results are Italian restaurant brand homepages whose title states "Italian Restaurant in Vaughan". GBP categories also lack "Italian restaurant" (prior audit). The Greek-query noise (from the name "Penelope") points the same way: Google is unsure what cuisine this is.
- **Recommendation:**
  - Build a Local page, `/italian-restaurant-vaughan`, with the H1 "Italian restaurant in Vaughan: sourdough pizza, focaccia and an amari bar".
  - Be honest about the format so it does not get pogo-sticked by pasta-seekers. Say "Italian-casual" and state what is and is not on the menu.
  - Include dinner hours, the reservation CTA, 4 signature dishes with prices, the 20+ amari list as a differentiator, Italian wines, and an "Italian restaurants in Vaughan: how we're different" FAQ.
  - Add "Italian" to the homepage title (see F2) and the GBP category.
  - To avoid cannibalization, keep the homepage on "restaurants" and this page on "Italian".

### F2. HIGH: homepage snippet does not match "restaurants in vaughan" intent (CTR 2% at pos 4-5)
- **Evidence:** The title is "Penelope Social | Cafe and bar in Woodbridge" (44 chars). The searcher typed "restaurants" and "Vaughan", and the snippet contains neither. The description has no rating, no price cue and no "open late". The SERP around it is "THE 10 BEST Restaurants in Vaughan (Updated September 2026)" style listings that promise choice and recency. Above the fold on mobile there is no rating, no hours and no address. Note that GSC may count some local-pack website clicks against this URL, so treat the position-to-CTR benchmark as indicative.
- **Recommendation:**
  - Title: `Penelope Social | Italian Restaurant & Bar in Vaughan (Woodbridge)` (about 63 chars, or drop "(Woodbridge)" if it gets truncated).
  - Meta: "Sourdough pizza, focaccia sandwiches and cocktails till 1am on weekends. 125 Hawkview Blvd, Woodbridge. 4.7 from 600+ Google reviews. Book or order online."
  - Change the H1 to include "restaurant in Vaughan".
  - Move the "4.7 · 600+ Google reviews" chip and a one-line "Open today: cafe 9-3 · bar 5-10" strip into the hero.

### F3. HIGH: /catering-events serves 2 SERPs with one form (CTR 0.4%)
- **Evidence:**
  - The page has 562 words: H1 "Catering and events", one paragraph, a form promising a reply "within 24 to 48 hours", and 4 FAQs.
  - It gives no headcount sizing, per-person cost, capacity, room photos, packages or testimonials.
  - The prices live on /menus/catering, and the 2 pages conflict on lead time. /catering-events says "24 hours' notice", while /menus/catering says "Full-Size Pizza (24pc)... 72-hour lead time".
  - The competing caterer results show "from $18/person, groups 8-40", itemized receipts and online ordering.
  - The venue results lead with capacity ("up to 80 guests", "10-150 guests").
  - The Christmas party offer ("cocktails and passed hors d'oeuvres or a seated four-course dinner") exists only in a modal and is not indexable.
- **Recommendation:** Split the page in two.
  1. `/catering-vaughan` (office trays). Title: "Office Catering in Vaughan | Sourdough Pizza & Focaccia Trays". Content: an "Feeds 10 / 20 / 40" sizing table with $ per head computed from the tray prices; minimum order (6 sandwiches); lead times stated in one place (24h for trays, 72h for full pizzas); pickup or delivery; an itemized-receipt note; tray photos; and a direct phone CTA next to the form.
  2. `/private-events-woodbridge` (private dining and Christmas parties). Title: "Private Events & Christmas Parties in Woodbridge | Penelope Social". Content: seated and standing capacity, room and bar photos, the 2 packages from the modal with from-prices, open December dates, a buyout option, and an FAQ (deposit, AV, minimum spend).
  - Do not chase "event venue woodbridge" against banquet halls. Target "christmas party venue vaughan", "private dining woodbridge" and "corporate christmas party vaughan". It is 6 Oct, so this is time-sensitive.

### F4. HIGH: happy-hour demand lands on a page that never says "happy hour"
- **Evidence:** "penelope social happy hour" gets 40 impr at 35% CTR, plus "...happy hour menu" at 20 impr. On /menus/bar, "happy hour" occurs 0 times. The H1 is just "Bar", and there is no beer list despite the "Cocktails, wine, beer" subhead. The competing pages are dedicated happy-hour pages with times and prices ("2pm-5pm and 9pm-close, from $5", "3pm-6pm and 9pm-close").
- **Recommendation:** First confirm with the client whether a happy hour exists. If yes, build `/happy-hour` with days and times, the deal prices, a "late night: kitchen till X Fri-Sat" block and a reservation CTA, plus a `Menu`/`Offer` schema. If no, do not invent one. Retitle /menus/bar to "Cocktail Bar in Vaughan, Open Till 1am Fri-Sat | Penelope Social" and add a FAQ entry, "Do you have a happy hour?", with the honest answer. That captures the brand+happy-hour searchers.

### F5. CRITICAL (business-dependent): brunch demand with no product or page
- **Evidence:** About 600 brunch impressions at positions 5-13 in GSC. "brunch" occurs 0 times on the site. The SERP is directories plus the Tourism Vaughan "Brunch spots and delicious bakeries in Vaughan" listicle plus a brunch-brand page (Eggstatic). Penelope's Sunday 8am-12pm cafe is a brunch-shaped window.
- **Recommendation:** If a Sunday brunch menu is launched, build `/brunch-vaughan` (Local page: menu with prices, Sunday hours, reservation or walk-in policy, photos). If not, build a smaller "Sunday mornings at Penelope" page that honestly offers coffee, pastries and focaccia, and pitch it to visitvaughan.ca for the existing listicle. Verify Sunday hours too: the site and schema say 8am, while the prior audit recorded GBP at 9am.

### F6. MEDIUM: schema and entity details that weaken local trust
- **Evidence:** Restaurant `image` is the favicon. `sameAs` IG handle (`penelopesocial`) differs from the linked handle (`penelope.social`). There is no `priceRange`, no `hasMap`, and no Yelp, TripAdvisor or Google Maps sameAs.
- **Recommendation:** Use a real dining-room photo for `image`, fix the IG handle, and add `priceRange: "$$"`, `hasMap` (GBP CID URL) and Yelp/Maps sameAs links. Run `/seo schema` for an Event/Offer markup pattern for the Christmas-party page.

### F7. MEDIUM: /bakery-vaughan only partly matches "bakery vaughan"
- **Evidence:** The SERP shows stand-alone bakeries (Bartholomew, La Strada) and cake/donut shops. Penelope's page sells loaves, focaccia and dough from a cafe counter.
- **Recommendation:** Leave the page type as it is. Add the pastry case (bombe, crullers, cookies, treat boxes from $24 for 6) high on the page to match what searchers expect. Keep "Penelope Bakehouse" out of the title and H1 to avoid re-opening the brand cannibalization.

### F8. LOW to MEDIUM: off-site listicles are the battleground on the aligned queries
- **Evidence:** Yelp, Wanderlog and TripAdvisor hold most top-10 slots for pizza, sandwich, cafe and brunch. Editorial lists rank too (haidasandwich.ca "9 Best Sandwich Places in Vaughan", visitvaughan.ca "Cozy cafes", diaryofatorontogirl "12 Best Restaurants in Vaughan", themarlowe "Top 10 private room restaurants"). Penelope already appears in Yelp's cafe title and in the sandwich result set.
- **Recommendation:** Do outreach and PR to the 4 named lists, claim and complete Yelp/TripAdvisor (photos, hours, menu link), and post TikTok sandwich and pizza content (TikTok ranks for both "italian sandwich vaughan" and "brunch vaughan").

## User stories (derived from SERP signals)

1. **Awareness.** As a local diner deciding where to eat tonight, I want to see a shortlist of good Vaughan restaurants with ratings and price, because I don't want a bad night out, but I'm blocked by **comparison fatigue**. *(Signal: the top 10 is dominated by "THE 10 BEST Restaurants in Vaughan (Updated September 2026)" from TripAdvisor, Yelp and Restaurantji; the AI summary lists ratings like "4.8 stars".)* Page fix: rating and "open today" in the hero and in the snippet.
2. **Consideration.** As someone craving Italian, I want to know whether a place is a real Italian restaurant before booking, because "authentic" is the recurring promise in this SERP, but I'm blocked by an **information gap**: Penelope never says "Italian restaurant". *(Signal: Giro d'Italia, Osteria Gente and Castello brand titles; the summary repeats "authentic Italian".)*
3. **Decision.** As an office manager ordering lunch for 15, I want per-person pricing and a fast way to order, because I need it approved and expensed, but I'm blocked by **price sensitivity and time pressure**: no per-head price and a 24-48h form reply. *(Signal: That's Italian "from $18/person, groups 8-40, itemized receipts"; Vaughan City Grill's online order portal.)*
4. **Consideration to decision.** As a planner booking a work Christmas party, I want to know whether my group fits and what it costs, because December dates go fast, but I'm blocked by a **trust and information gap**: no capacity, no photos of the room, no packages. *(Signal: venue results lead with capacity, "up to 80 guests" and "10-150 guests"; OpenTable private dining; Penelope's own "Christmas party dates are filling up fast" banner.)*
5. **Decision.** As a Sunday-morning brunch seeker, I want a brunch menu and hours, because I am choosing between named brunch spots right now, but I'm blocked because **Penelope has no brunch answer at all**. *(Signal: Eggstatic's dedicated brunch page and the Tourism Vaughan brunch listicle rank; GSC shows about 600 impressions at positions 5-13.)*

## Persona scoring

| Persona (page scored) | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Brunch seeker (homepage, no brunch page) | 4 | 5 | 15 | 10 | **34** | Critical Mismatch |
| Event / Christmas-party planner (/catering-events) | 12 | 6 | 8 | 13 | **39** | Critical Mismatch |
| Office catering organizer (/catering-events + /menus/catering) | 16 | 10 | 8 | 12 | **46** | Needs Work |
| Italian-dinner searcher (homepage, /menus/dinner) | 12 | 12 | 16 | 21 | **61** | Good (barely) |
| Local diner deciding tonight (homepage) | 15 | 14 | 17 | 22 | **68** | Good |
| Coffee seeker (/cafe-in-vaughan) | 23 | 22 | 17 | 15 | **77** | Good |

Score evidence:
- **Brunch seeker:** there is no brunch content anywhere. The only adjacent fact (Sunday 8-12 hours) is buried in the FAQ and footer.
- **Event planner:** the hero is the bar, not an event setup. There is no capacity or pricing, and the Christmas packages exist only in a dismissible modal. The form is the single CTA, and the reply promise is 24-48h.
- **Office catering organizer:** the trays and prices exist but sit on another page. There is no per-head math, the lead times conflict (24h vs 72h), and there are no client testimonials or tray photos on the inquiry page.
- **Italian-dinner searcher:** the dishes are clearly Italian (San Marzano DOP, stracciatella, 20 amari), but nothing says "Italian restaurant" above the fold. The Reservations CTA is strong.
- **Local diner:** strong CTAs (Order Online and Reservations above the fold), but the rating, hours and address are all below the fold on mobile.
- **Coffee seeker:** the best page on the site. It has a 9am/10am/3pm/5pm timeline, Wi-Fi, outlets, free parking, prices and directions. It loses points because there is no order-ahead coffee CTA in the body and no quoted reviews.

**Weakest persona with the highest demand weight:** the event and catering planners. /catering-events has 1,258 impressions, and it is Christmas booking season. **Top fix:** the F3 split. Put capacity, packages with from-prices and December availability above the fold of `/private-events-woodbridge`, and a "feeds 10/20/40" per-head table at the top of `/catering-vaughan`.

**Systemic issue:** trust is the lowest dimension across personas. The 4.7 from 600+ rating is linked but below the fold, and there are no quoted reviews, press mentions or client logos anywhere. Add 2-3 short Google review quotes per landing page, matched to the persona: a catering quote on the catering pages, a cocktail quote on the bar page.

## Priority actions
1. Split /catering-events into catering and private-events/Christmas pages (F3). This is time-sensitive.
2. Rewrite the homepage title, meta and H1, and add a rating and hours strip in the hero (F2).
3. Build `/italian-restaurant-vaughan` and add the GBP "Italian restaurant" category (F1).
4. Confirm happy hour and brunch with the client, then build `/happy-hour` and `/brunch-vaughan` or their honest fallbacks (F4, F5).
5. Schema cleanup (F6). Off-site listicle and Yelp outreach (F8).

Cross-skill: `/seo schema` (Event/Offer, sameAs, priceRange), `/seo local` (GBP categories and description, Sunday hours discrepancy), `/seo content` (E-E-A-T and review-quote layer), `/seo page` on /catering-events.

## Limitations
- WebSearch is not a live google.ca SERP. It does not expose the local pack, ads, PAA boxes, AI Overview citations or exact organic positions. The SERP composition shares above are estimates from the returned result sets plus the extended-mode summaries. A DataForSEO or OpenSEO SERP pull for these 10 queries, geo-set to Vaughan, would firm up the consensus percentages and show PAA questions.
- GBP, Yelp and TripAdvisor profiles were not inspected directly. Local-pack position, which likely drives most clicks on these queries, could not be measured.
- I did not verify whether a happy hour or brunch offer exists. Room capacity is unknown.
- GA4 key events only accrue from 2026-09-19, so I could not score on-page conversion.
- htmldate's publication date (2026-01-01) is a template default, not a real freshness signal.

Want a PDF report? Use `/seo google report`.

---

## Structured findings (Search Experience category, for audit-data.json)

```json
{
  "category": "Search Experience",
  "sxo_gap_score": 61,
  "dimensions": {"page_type": 8, "content_depth": 10, "ux_signals": 10, "schema": 10, "media": 9, "authority": 8, "freshness": 6},
  "findings": [
    {"id": "SXO-1", "severity": "critical", "title": "No page for 'italian restaurant vaughan' (pos 14-24)", "url": null, "evidence": "0 occurrences of 'Italian restaurant' site-wide; SERP ~55% Italian brand homepages + OpenTable/Yelp/Wanderlog", "recommendation": "Build /italian-restaurant-vaughan Local page; add 'Italian' to homepage title; add GBP Italian restaurant category"},
    {"id": "SXO-2", "severity": "high", "title": "Homepage snippet mismatches 'restaurants in vaughan' (CTR ~2% at pos 4-5)", "url": "https://penelopesocial.com/", "evidence": "Title 'Cafe and bar in Woodbridge' lacks 'restaurant'/'Vaughan'; rating and hours below the fold on mobile", "recommendation": "Title 'Penelope Social | Italian Restaurant & Bar in Vaughan (Woodbridge)'; meta with 4.7/600+ reviews and late hours; hero rating + open-today strip"},
    {"id": "SXO-3", "severity": "high", "title": "/catering-events serves catering and venue intents with one form-only page (CTR 0.4%)", "url": "https://penelopesocial.com/catering-events", "evidence": "No capacity, packages, per-head pricing or room photos; 24h vs 72h lead-time conflict with /menus/catering; Christmas packages only in a modal", "recommendation": "Split into /catering-vaughan (per-head sizing table) and /private-events-woodbridge (capacity, packages, December dates)"},
    {"id": "SXO-4", "severity": "high", "title": "Happy-hour demand lands on a bar menu without 'happy hour'", "url": "https://penelopesocial.com/menus/bar", "evidence": "'penelope social happy hour' 40 impr @35% CTR; 0 mentions on page; SERP = brand happy-hour pages with times/prices", "recommendation": "If the offer exists, build /happy-hour; otherwise retitle the bar page to late-night cocktail bar and add a FAQ entry"},
    {"id": "SXO-5", "severity": "critical", "title": "Brunch demand (~600 impr, pos 5-13) with no page or product", "url": null, "evidence": "0 mentions of brunch; SERP = directories + Tourism Vaughan listicle + Eggstatic brunch page", "recommendation": "Brunch page if a menu launches, otherwise a 'Sunday mornings' page; pitch visitvaughan.ca; reconcile Sunday 8am (site) vs 9am (GBP)"},
    {"id": "SXO-6", "severity": "medium", "title": "Restaurant schema entity gaps", "url": "https://penelopesocial.com/", "evidence": "image=favicon; sameAs IG handle mismatch; no priceRange/hasMap/Yelp sameAs", "recommendation": "Fix image, sameAs, add priceRange and hasMap"},
    {"id": "SXO-7", "severity": "medium", "title": "/bakery-vaughan only partly matches the bakery SERP", "url": "https://penelopesocial.com/bakery-vaughan", "evidence": "SERP expects pastry and cake bakeries; page leads with loaves and dough", "recommendation": "Surface the pastry case and treat boxes higher; keep Bakehouse brand out of the title and H1"},
    {"id": "SXO-8", "severity": "low", "title": "Off-site listicles own aligned queries", "url": null, "evidence": "Yelp/Wanderlog/TripAdvisor plus haidasandwich, visitvaughan and diaryofatorontogirl lists in the top 10", "recommendation": "Listicle outreach, Yelp/TripAdvisor completion, TikTok content"}
  ],
  "personas": [
    {"name": "Brunch seeker", "score": 34},
    {"name": "Event / Christmas-party planner", "score": 39},
    {"name": "Office catering organizer", "score": 46},
    {"name": "Italian-dinner searcher", "score": 61},
    {"name": "Local diner deciding tonight", "score": 68},
    {"name": "Coffee seeker", "score": 77}
  ]
}
```

Sources (SERP pulls, 2026-10-06): tripadvisor.com/Restaurants-g499300-Vaughan_Ontario.html · yelp.ca/search?cflt=italian&find_loc=Vaughan · opentable.ca/cuisine/best-italian-restaurants-vaughan-ontario-ontario · giroditalia.ca · osteriagente.ca · cantinaamici.ca · visitvaughan.ca/brunch-spots-and-delicious-bakeries-in-vaughan/ · eggstatic.ca/branches/vaughan-brunch-restaurant · stateandmain.ca (Vaughan happy hour) · chop.ca/locations/vaughan · thatsitalian.ca/the-best-office-catering-in-vaughan-why-local-businesses-choose-thats-italian/ · eventsource.ca/caterers/vaughan/corporate-caterers · eventsource.ca/venues/woodbridge · forty40.ca/private-dining-vaughan · themarlowe.ca/private-room-restaurants-vaughan/ · yelp.com/search?cflt=cafes&find_loc=Vaughan,+ON · visitvaughan.ca/cozy-cafes-in-vaughan-comfort-food-that-invites-you-to-stay/ · haidasandwich.ca/best-sandwich-places-in-vaughan/ · wanderlog.com (Vaughan pizza/bakery/cafe lists) · bartholomewbakery.com · diaryofatorontogirl.com/best-restaurants-in-vaughan/
