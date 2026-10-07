# Schema audit: penelopesocial.com
Score: 72/100. Date 2026-10-06.

Generator: /web/src/lib/schema.ts (restaurantSchema :75, bakehouseSchema :155, menuSchema :177, faqPageSchema :203, breadcrumbSchema :217, webPageSchema :233). Emitted as one @graph per page via pageGraph (:253). Pages: index.astro:31-46, [slug].astro:109-136, menus/[slug].astro:63-85, merchandise/[slug].astro:39-48, locations/*.astro.

## Detection (live fetch of 7 representative pages plus crawl.json for all 20)
- 1 JSON-LD block per page, all valid JSON, @context https://schema.org, absolute URLs, no placeholders.
- Correction to the observed list: "Bakery" is NOT Penelope Social. The Bakery node is the separate Penelope Bakehouse (@id https://penelopebakehouse.com/#bakery, url penelopebakehouse.com, 71 Howden Rd Scarborough). "BarOrPub" and "FoodEstablishment" are nested `department` items (Cafe, Bar) of the Restaurant, not top-level entities.
- No Product, WebSite, Organization, or aggregateRating anywhere. No Review markup (good, no self-serving risk).

## What works
- Entity separation is correct and documented: Restaurant NAP Woodbridge only, Bakehouse its own @id/url/address, Bakehouse not in Social's sameAs.
- Hours match visible hours (Cafe Mon-Sat 9-3, Sun 8-12; Bar Mon-Thu 5-10, Fri-Sat 5pm-1am, closed Sun night). 01:00 close is valid for next-day close. Parser (schema.ts:29-73) is brittle but output is correct today.
- Breadcrumbs correct: absolute URLs, proper positions, match visible crumbs. Menu items have numeric CAD Offers, tiers split to separate Offers (:130).
- Menu @ids and WebPage.mainEntity link correctly on landing pages. FAQPage content is visible on page and differs per page (home, about 4, contact 3, etc.), so not a sitewide duplicate. FAQ rich results are retired (May 2026), so this is Info only.

## Findings

### 1. Medium: Merch product pages have no Product schema
Evidence: /merchandise/hoodie, /t-shirt, /tote-bag emit only Restaurant + BreadcrumbList (merchandise/[slug].astro:39). Visible: "$ 40", "available in store", purchase and pick up in store. Merchant-listing and product snippets are missed; the page is also an unmodelled entity.
Fix: add Product with Offer (CAD, InStock, pickup-only via availableAtOrFrom). Price comes from the Sanity merchProduct field; confirm field name. Snippet:
```json
{"@type":"Product","@id":"https://penelopesocial.com/merchandise/hoodie#product","name":"Hoodie","description":"Grey hoodie. Penelope logo on the left chest. Bike on the back, carrying sourdough and coffee. Relaxed fit.","image":["https://penelopesocial.com/<hoodie-image>.jpg"],"brand":{"@type":"Brand","name":"Penelope Social"},"url":"https://penelopesocial.com/merchandise/hoodie","offers":{"@type":"Offer","price":"40.00","priceCurrency":"CAD","availability":"https://schema.org/InStoreOnly","itemCondition":"https://schema.org/NewCondition","url":"https://penelopesocial.com/merchandise/hoodie","seller":{"@id":"https://penelopesocial.com/#restaurant"},"availableAtOrFrom":{"@id":"https://penelopesocial.com/#restaurant"}}}
```
Also add the Product to graph at merchandise/[slug].astro:39 and use InStoreOnly (no shipping, so no shippingDetails/return policy needed; note Google merchant listings may want them, product snippets do not). /merchandise index could emit an ItemList.

### 2. Medium: Dangling @id reference on merch, location-index and some pages
Evidence: restaurantSchema().supplier points to https://penelopebakehouse.com/#bakery (schema.ts:90), but merch pages (merchandise/[slug].astro:39) and apparently /merchandise-style pages that omit bakehouseSchema() do not define it (hoodie live graph has Restaurant without Bakery node). Cross-domain @id cannot resolve and `supplier` is a weak relation.
Fix: either always include bakehouseSchema() or move supplier out of restaurantSchema into the pages that need it. Better: use `parentOrganization`-style relation on a shared Organization (see 3), and keep Bakehouse as `isRelatedTo`/`brand`-free sibling.

### 3. Medium: No WebSite / Organization nodes; Restaurant used as the whole identity
Evidence: no WebSite node, no logo (image is favicon-192.png at schema.ts:81, a 192px icon, too small for a good photo/logo). Add WebSite (name, url, publisher) once on home, plus `logo` ImageObject and a real storefront photo >= 800px in `image` array. Home-only block in index.astro:31:
```json
{"@type":"WebSite","@id":"https://penelopesocial.com/#website","url":"https://penelopesocial.com/","name":"Penelope Social","inLanguage":"en-CA","publisher":{"@id":"https://penelopesocial.com/#restaurant"}}
```

### 4. Low: sameAs thin and contains tracking params
Evidence: schema.ts:109 / data/site.ts:44-45: Instagram has `?hl=en`, TikTok has `?_t=...&_r=1`. Strip query strings. Add Google Business Profile / Maps URL, Toast ordering page, Facebook/Yelp if they exist. Do not add penelopebakehouse.com (current policy is right).

### 5. Low: Menu entities are not linked from the Restaurant
Evidence: `hasMenu` is an array of plain URL strings (schema.ts:89, data/site.ts MENU_URLS); Menu nodes (@id .../menus/lunch#menu) exist only on their own page. Use `hasMenu: [{"@id":".../menus/lunch#menu"}, ...]` or URL strings is acceptable but @id objects give graph linkage. Menu pages also lack WebPage nodes, and `menus/[slug].astro` Menu has no `inLanguage`/`offers.url`; non-numeric prices ("MP") correctly omitted. Menu is not a Google rich result; value is semantic only.

### 6. Low: Restaurant + department typing
Evidence: top-level Restaurant has an `openingHoursSpecification` merging cafe and bar hours (:108), duplicated in departments (:110-121). Departments lack @id, url, address, telephone, so Google may ignore them. Recommendation: keep top-level hours (that is what Google reads), add `@id` to departments and `parentOrganization`/address, or drop duplication. Consider `["Restaurant","BarOrPub"]` multi-type instead? Not necessary; keep Restaurant. Add `priceRange` (e.g. "$$"), `hasMap` (Google Maps URL), `menu` (singular, main), `servesCuisine` fine, `paymentAccepted`, `potentialAction: ReserveAction` to the Toast link (acceptsReservations: true is boolean, Google prefers URL string "https://..." - the Toast URL).

### 7. Info: FAQPage
Evidence: FAQPage on home, about, contact, locations/woodbridge, locations/scarborough, menus, and landing pages (schema.ts:203; FaqSection.astro:62 emits only when includeSchema, all callers pass false so no duplicates). FAQ content is visible and distinct per page. No Google SERP benefit since 2026-05-07; harmless. Leave or remove at will; do not expand. The Scarborough FAQ markup answers for the Bakehouse inside Social's page (data/site.ts:22); acceptable but the Bakehouse is not the page entity.

### 8. Info: aggregateRating
None present. Correct to keep it that way unless the rating is from reviews shown on-site by third-party; self-serving LocalBusiness ratings are not eligible for stars.

### 9. Info: canonical vs @id
@id and url use `https://penelopesocial.com/` (trailing slash); canonical on home is `https://penelopesocial.com` (no slash, equivalent). Fine.

## Priority
1. Product + Offer for 3 merch pages. 2. Fix dangling supplier @id. 3. WebSite + logo/real image. 4. Clean sameAs, add GBP/map/ReserveAction/priceRange. 5. Link Menu nodes by @id.
