# Local SEO findings: penelopesocial.com (audited 2026-10-06)

## Local SEO Score: 65 / 100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| GBP signals | 25 | 15 | Review link, directions link and Maps embeds exist. GBP itself not directly inspectable (category/description from prior audit). Two different Google place IDs linked from the site. |
| Reviews and reputation | 20 | 13 | Claimed "4.7, 600+ reviews on Google" with a review CTA. Third-party counts disagree and Yelp is thin (14). |
| Local on-page SEO | 20 | 15 | Strong local landing pages and Woodbridge/Vaughan handling. /locations is thin, no map on home or contact. |
| NAP consistency and citations | 15 | 9 | Site, schema and sister-site NAP are identical. Off-site: Apple Maps unit and hours, Yelp hours, MapQuest postal code, IG handle split. |
| Local schema | 10 | 7 | Correct Restaurant subtype, 6-decimal geo, hours. Gaps: image, hasMap, priceRange, sameAs, thin Bakery stub. |
| Local links and authority | 10 | 6 | Tourism Vaughan, Visit Vaughan, York Durham Headwaters, aggregators. Nothing local-press for Social itself. |

Business type: brick-and-mortar (visible address, directions links, Maps embed on location pages). Vertical: restaurant (cafe + bar), with a bakery-adjacent angle. Proximity (about 55% of local-pack variance) is outside our control.

## What works
- NAP is identical everywhere on-site and in JSON-LD: 125 Hawkview Blvd, Woodbridge, ON L4H 2E2, (905) 607-0606 (the footer's "(905) 607 0606" is a harmless format variant), info@penelopesocial.com. tel: links are present. The Bakehouse's own /locations page repeats Social's NAP exactly.
- Hours are consistent between visible text and schema on all 11 pages checked. Cafe is Mon-Sat 9-3 and Sun 8-12. Bar is Mon-Thu 5-10 and Fri-Sat 5-1. Closed Sunday night. They are marked up as openingHoursSpecification, plus Cafe and BarOrPub departments.
- Schema is `Restaurant` (the right subtype) with geo at 6 decimals, address, telephone, servesCuisine, acceptsReservations, hasMenu, areaServed (Woodbridge, Vaughan) and `supplier` pointing to the Bakehouse `@id`.
- The four Vaughan landing pages pass the doorway swap test. Each has 900-1000 words of unique, menu-specific copy, prices, FAQs and a Menu entity. None are city-swap templates.
- Geo-targeting is deliberate. Core pages say "Woodbridge", landing pages say "Vaughan", and copy bridges the two ("125 Hawkview Blvd, Woodbridge, in Vaughan"). Titles, H1s and meta descriptions are unique.
- Google directions deep links (with the CID), a "Google Reviews" footer link, Toast order and reserve links, and Maps embeds on /locations/woodbridge and /locations/scarborough.
- Citation footprint is already broad. Found: Yelp, Apple Maps, MapQuest, Restaurantji, Tourism Vaughan (visitvaughan.ca), York Durham Headwaters, Uber Eats, Toast, Instagram, Facebook mentions, blogTO (as Penelope Focacceria).

## Findings

### HIGH-1. Scarborough page on Social's domain still carries full Bakehouse content (cannibalization risk persists)
Evidence: /locations/scarborough has title "Scarborough | Penelope Social" and H1 "Our Scarborough bakehouse". It holds Bakehouse NAP and hours (Mon-Fri 9-3, closed weekends), a Bakehouse Toast order link, a map embed, and an FAQPage covering Bakehouse products (Bianca, Classico, Calabrese, Margherita, NY Pepperoni, Vodka, Bee Sting, "baked fresh daily at our Scarborough bakehouse"). It also links to penelopebakehouse.com/menu and /catering. The title frames it as "Penelope Social" in Scarborough. The page is indexed and appears on the first results page, in position 2 behind penelopebakehouse.com, for "Penelope Bakehouse Scarborough Howden Rd". Page-level schema is only the Social Restaurant plus the stub Bakery, with no Bakehouse entity.
Why it matters: it takes a second SERP slot from the Bakehouse brand and dilutes the Bakehouse entity. The "Scarborough | Penelope Social" title can also suggest a Social location in Scarborough.
Recommendation: reduce it to a short sister-business card of about 60-100 words with name, address, phone and one link to penelopebakehouse.com. Remove the product FAQ, the Toast order link and the map embed. Retitle it "Penelope Bakehouse in Scarborough (sister bakery)". Either keep it indexable with a canonical to https://penelopebakehouse.com/locations or set it to noindex. A 301 to the Bakehouse is the cleanest option if the Social /locations hub does not need a child page. If kept, add `Bakery` JSON-LD with `@id` https://penelopebakehouse.com/#bakery and `parentOrganization`/sibling relation.

### HIGH-2. Apple Maps listing is wrong (unit number, hours, category, description)
Evidence (maps.apple.com place I92ABAD4270518475):
- Address is "12-125 Hawkview Blvd Vaughan ON L4H 2E2". The site and Google use no unit.
- Hours are Sun-Tue closed, Wed-Thu 10-3 and 5-10, Fri-Sat 10-3 and 5-12am. The site says Mon-Sat 9-3 and Sun 8-12, and the bar closes at 1am on Fri-Sat.
- Category is "Pizza Restaurant".
- Description is "micro sourdough bakery during the day and comfort food restaurant at night", which conflicts with the site's "baked at our Scarborough bakehouse".
- Only 15 ratings.
Recommendation: claim or update it in Apple Business Connect. Use the same address (confirm whether Unit 12 is real; if it is, add it everywhere or remove it from Apple), hours, and category (Restaurant/Cafe). Use a description that matches site copy.

### HIGH-3. Yelp hours look stale and Yelp review volume is thin
Evidence: the search-engine snippet for yelp.ca/biz/penelope-social-woodbridge shows "Try Our New Menu ... Mon closed, Tue-Sat 10:00 am - 3:00 pm, Sun closed". That has no dinner hours, no 9am cafe opening and no Sunday morning. Yelp shows 14 reviews and 68 photos, against 600+ on Google as claimed on the site. Yelp could not be fetched directly (403), so the snippet may be cached.
Recommendation: verify and update the hours on Yelp. Push review requests to Yelp, since Yelp dominates the "near me" SERPs per the prior audit. Add a Yelp link beside the Google Reviews link and add Yelp to schema sameAs.

### HIGH-4. Two Google place IDs and two Instagram handles are linked from the site
Evidence:
- The footer Google review link uses `lrd=0x882b2f14f3cd3fbb:0x3e54ffff5191a9bd`. The directions link uses `1s0x882b2f5c52cae66f:0xd9f3c33a869788c9`. These are different feature IDs. Either one is an old or duplicate profile, or one is a different place such as the Bakehouse or Focacceria. This needs checking in GBP.
- Footer and body Instagram links go to @penelope.social, but schema sameAs lists @penelopesocial. The @penelopesocial bio reads "Sister to: @penelope.focacceria". The /locations/woodbridge page links both handles. MapQuest sameAs uses @penelope.social. Instagram showed no usable content for @penelope.social when fetched.
Recommendation: confirm the real GBP CID, then use one CID on all links (review, directions) and add a canonical Google Maps URL as `hasMap`. Settle on one official Instagram handle across footer, schema and Bakehouse cross-links, and remove or redirect the other.

### MEDIUM-1. Brand and name drift on third-party sources
Evidence: the June 2026 blogTO piece (blogto.com/eat_drink/2026/06/penelope-focacceria-toronto) and the Instagram bio use "Penelope Focacceria" for the daytime counterpart, while the site says "Penelope Bakehouse". Restaurantji lists Social as "Bakery, Cafe". Apple says "Pizza Restaurant". MapQuest lists postal code L4H 3T7 for 125 Hawkview Blvd (site: L4H 2E2) with slightly different geo (43.828487, -79.551925). Third parties disagree on rating and count: Restaurantji 4.6/204, another aggregator 4.9/251, Cups & Bites 4.6/361, site 4.7/600+.
Recommendation: claim the MapQuest and Restaurantji listings, or submit corrections, and fix the postal code. Pick one name and one story for the sister business ("Penelope Bakehouse, formerly Focacceria"?) and ask blogTO for a clarification or update.

### MEDIUM-2. Bakery claim is inconsistent across listings, site and Vaughan pages
Evidence: /bakery-vaughan says loaves are "Baked at our Scarborough bakehouse" and sold at Woodbridge. Apple Maps, Tourism Vaughan and Visit Vaughan describe Social as a "micro sourdough bakery". The page is titled "Sourdough Bakery in Vaughan | Penelope Social" and competes with Bakehouse for bakery intent. It is geo-qualified, so the risk is lower than with the Scarborough page.
Recommendation: choose one truth and align the listing descriptions (Apple, Visit Vaughan, York Durham Headwaters) to it. Keep /bakery-vaughan clearly framed as "take-home bread at the Woodbridge cafe", with a link to the Bakehouse for "Scarborough bakery" intent. Do not target bare "bakery" terms.

### MEDIUM-3. GBP categories and description (carried from the prior audit, unverified here)
Categories Restaurant, Bakery, Cocktail bar and Sandwich shop with no "Italian restaurant" (primary category is the top local ranking factor), and the description "Penelope Social is an enigma, don't try and classify it." The site and schema position the business as Italian (servesCuisine Italian, Italian Cafe, Italian focaccia sandwiches). Recommendation: set the primary category to match revenue intent (Italian restaurant or Pizza restaurant, depending on GBP Insights), and add Cafe and Bar as secondaries. Replace the description with a 600-750 character keyword-natural summary: Woodbridge, Vaughan, sourdough pizza, focaccia sandwiches, cafe by day, bar by night, reservations. Add services and menu items, and add Q&A seeds, products and weekly posts.

### MEDIUM-4. /locations hub is thin (63 words) and the locations tree mixes two businesses
Evidence: /locations has 63 words of main text. It is two NAP cards with no map, no neighbourhood content and no hours. Its schema carries both Restaurant and Bakery. Locations are linked from the nav, but the hub does not clearly separate "our location" from "sister business". The /locations/woodbridge page (211 words) is good but short on local context (parking, nearby landmarks, drive-time from Vaughan, Kleinburg, Nobleton, Maple, Concord, Bolton).
Recommendation: make /locations a clear one-location page: Social's NAP, hours and map up top, with the Bakehouse in a smaller "sister bakery" block. Expand /locations/woodbridge with directions, parking, accessibility, service-area language and a Vaughan mention in the title (for example "Penelope Social, 125 Hawkview Blvd, Woodbridge (Vaughan)").

### MEDIUM-5. Embedded map and directions coverage
Evidence: a Google Maps iframe exists only on /locations/woodbridge and /locations/scarborough. There is no map on the home page, /contact or the landing pages. The footer has a "Hours & location" block with the address but no directions link or map. The Google directions link is present on the home page and /contact. The iframe uses `?q=...&output=embed` (an address search, not the Place embed), so it may not show the business card.
Recommendation: add a Place-based embed (the real CID or place ID) to /contact and the home page. Add a "Get directions" link to the footer and to each Vaughan landing page. Lazy-load the iframes.

### MEDIUM-6. Review signals are claimed but not substantiated on-page
Evidence: "4.7, 600+ reviews on Google" appears as a text badge on the home page and the 4 landing pages. There is no review text, no widget, no schema (aggregateRating is correctly omitted; self-serving review markup is not eligible), and the badge is not tied to a dated source. The only CTA is a footer "Google Reviews" link, with no "leave a review" short link on the thank-you or reservation flow. Review velocity and response rate could not be assessed without GBP access.
Recommendation: add a short-link or QR "Leave a review" CTA (g.page / writereview link) on the contact and location pages. Show 3-4 real quoted reviews with source and date on the landing pages. Keep the badge current, since the aggregator counts above differ. Track `review_click` in GA4 (already in the repo). Respond to every review, and also cultivate Yelp and TripAdvisor.

### LOW-1. Schema polish
- `image` is the 192px favicon. Use a 1200px storefront or food photo (several images).
- Add `hasMap` (Google Maps URL), `priceRange` ("$$"), `servesCuisine` stays as is, and `sameAs` for Yelp, Facebook, Google Maps and TripAdvisor if present.
- The Bakery node is an inline stub (name, url, phone, address). Either flesh it out with geo and hours, or reduce it to `{"@id": ...}` so it does not conflict with the Bakehouse site's own markup.
- The Cafe department is typed `FoodEstablishment`, which is fine. `CafeOrCoffeeShop` is the more specific type.
- Menu entities on landing pages carry only name and url. Add hasMenuSection/hasMenuItem or drop them.
- Add areaServed GeoCircle or nearby neighbourhoods.

### LOW-2. Hours wording could confuse
Cafe hours of 9am-3pm sit next to "Lunch 10am to 3pm" on the lunch and sandwich pages. This is probably cafe counter versus kitchen, so say so explicitly ("coffee and pastries 9am, lunch kitchen from 10am") in schema and listings. The cafe-in-vaughan timeline already does this well. Schema also lacks holiday and special hours (Christmas party and event periods).

### LOW-3. Citation gaps and consistency programme
Present: Yelp, Apple Maps, MapQuest, Restaurantji, Uber Eats, Toast, Tourism Vaughan, York Durham Headwaters, Cups & Bites, wheree. Not confirmed (no result found via search): TripAdvisor (a gluten-free listing page with 1 rating exists but is unclaimed; claim it), Facebook business page (only third-party reels surfaced), Bing Places (not verifiable), OpenTable (not used; Toast Tables is the booking tool), blogTO (only a mention of the sister brand), BBB. Hours and name across the aggregator pages vary (wheree shows "Closed 9-3, 5-10" with a wrong phone format). Recommendation: set up one canonical NAP sheet (name, address with or without Unit 12, phone, hours, description, categories, Instagram handle) and push via Apple Business Connect, Bing Places, TripAdvisor, Facebook and Yelp. Pursue editorial links (blogTO, Narcity, Vaughan Citizen, Toronto Life, Daily Hive) with a Social-specific hook, as the existing blogTO piece covers only the Focacceria.

## Local landing pages review
| Page | Words | Vaughan / Woodbridge mentions | Verdict |
|---|---|---|---|
| /pizza-vaughan | 996 | 8 / 8 | Pass. Unique menu, prices, FAQ. |
| /sandwiches-vaughan | 916 | 9 / 6 | Pass. |
| /cafe-in-vaughan | 977 | 5 / 3 | Pass. Timeline, cafe vs bar comparison. |
| /bakery-vaughan | 877 | 8 / 10 | Pass, with the Scarborough/Bakehouse positioning caveat (MEDIUM-2). |
All four are in the sitemap, linked from home, mega-nav and footer, and have unique titles and H1s. Internal linking depth is one click from home.

## Limitations
GBP could not be inspected directly (no DataForSEO or GBP access). Category, description, review velocity, response rate, photos and posts are from the prior audit and on-page signals only. Yelp, TripAdvisor and Toast returned 403 to automated fetches, so Yelp and TripAdvisor details come from search-engine snippets and may be cached. Facebook and Bing Places could not be verified. Local-pack positions and Google review counts and ratings were not measured, and the 4.7 / 600+ figure is the site's own claim. Proximity is outside our control.

## Top 10 actions
1. [High] Cut /locations/scarborough down to a short sister card, or noindex/canonical it to penelopebakehouse.com; retitle (HIGH-1).
2. [High] Fix the Apple Maps listing: unit number, hours, category, description (HIGH-2).
3. [High] Verify and update Yelp hours; add a Yelp review CTA and sameAs (HIGH-3).
4. [High] Reconcile the two Google CIDs and two Instagram handles across footer, schema and sister site (HIGH-4).
5. [Medium] Re-set the GBP primary category (Italian restaurant or Pizza restaurant) and replace the "enigma" description (MEDIUM-3).
6. [Medium] Align the bakery story across site, Apple, Visit Vaughan and York Durham Headwaters (MEDIUM-2).
7. [Medium] Correct MapQuest postal code; claim Restaurantji and TripAdvisor; resolve the Focacceria/Bakehouse naming with blogTO (MEDIUM-1, LOW-3).
8. [Medium] Add a Place embed and directions links to home, /contact and the landing pages; thicken /locations and /locations/woodbridge (MEDIUM-4, MEDIUM-5).
9. [Medium] Add a "leave a review" CTA and real dated review quotes (MEDIUM-6).
10. [Low] Schema polish: image, hasMap, priceRange, sameAs, thin Bakery stub, hours wording (LOW-1, LOW-2).
