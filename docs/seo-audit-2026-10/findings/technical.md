# Technical SEO audit: https://penelopesocial.com/ (2026-10-06)

**Technical score: 78/100.** Crawlability, indexability, canonicals, sitemap and rendering are clean. Points are lost for zero security headers, no long-term asset caching, no sitemap lastmod, a few redirect and canonical nits, and thin or short-title pages.

| Category | Status |
|---|---|
| Crawlability | Pass |
| Indexability | Pass (minor notes) |
| Security | Fail (no headers) |
| URL structure / redirects | Pass with notes |
| Mobile | Pass |
| Core Web Vitals (source) | Pass, caching gap |
| Structured data | Pass (see schema report) |
| JS rendering | Pass (static HTML) |
| Sitemap | Pass, lastmod missing |
| IndexNow | Not implemented (Low) |

## What works
- 20/20 sitemap URLs return 200 with a self-referencing canonical (crawl.json). No noindex on any indexable page.
- robots.txt allows all, disallows /api/ only, and declares /sitemap-index.xml, which resolves (200, application/xml). The child sitemap-0.xml holds the same 20 URLs.
- /sitemap.xml 301s to /sitemap-index.xml (web/public/_redirects).
- www and http redirect to the https apex. 301 for https://www.penelopesocial.com/about -> https://penelopesocial.com/about.
- /events 301 -> /catering-events and /sourdough-bakery 301 -> /bakery-vaughan are single hops. Neither is in the sitemap (astro.config.mjs filter, lines 22-25).
- 404s return a real HTTP 404 (/nonexistent-xyz, /ABOUT), with `<meta name="robots" content="noindex">` and a custom page, so there is no soft 404.
- Static HTML is fully server-rendered (homepage 100 KB, brotli). All content, JSON-LD and canonical are in the raw HTML. No CSR dependency.
- Viewport meta is present on all pages (BaseLayout.astro:~50, 404.astro). GA is deferred until after load.
- Exactly one H1 per page. Titles are mostly 37-71 chars. Descriptions are present on every page.
- /api/subscribers.csv answers 405 to an unauthenticated HEAD and is excluded in robots.txt.

## Findings

### H1 (High): No security headers on any response
Evidence: `curl -I` on /, /about, /robots.txt, /sitemap-index.xml returns only cache-control, content-type, cf-*, nel and report-to. There is no Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options or frame-ancestors, and no CSP. web/public has no `_headers` file and the Worker only runs for /api/*, so static assets get none.
Impact: Not a direct ranking factor. It is a trust and security baseline, and HSTS also closes the http->https first-hop gap.
Fix: Add `web/public/_headers` (Workers Static Assets supports it):
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN
```
Add a CSP in report-only mode first. GA, Turnstile and Sanity CDN images are the third-party origins to allow. Add `preload` to HSTS only after confirming that every subdomain is https.

### H2 (Medium-High): Hashed assets and fonts are not cached long-term
Evidence: `/_astro/seo.CFDok6Oo.css` and `/fonts/SweetSansPro-Regular.otf` both return `cache-control: public, max-age=0, must-revalidate`. HTML uses the same value, which is fine.
Impact: Repeat visits and navigation revalidate every CSS, JS and font file. This hurts LCP and INP on repeat views. Two fonts are preloaded on every page.
Fix: In `web/public/_headers`:
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=2592000
```
Fonts are not hashed, so give them a 30-day max-age (not immutable), or hash them.

### M1 (Medium): Sitemap has no `<lastmod>`
Evidence: sitemap-0.xml has bare `<loc>` entries. The index has no lastmod either. `@astrojs/sitemap` is configured in astro.config.mjs:19-27 without `lastmod`.
Fix: Set `lastmod: new Date()` in the integration options as a minimum. A better option is per-page `serialize()` using the Sanity `_updatedAt` for each document, with a build date for static pages. Only emit honest dates, since Google ignores lastmod that changes without content changes. The 2026-09 baseline also lacks lastmod.
Also: the sitemap declares unused news, image and video namespaces. This is harmless.

### M2 (Medium): Slashed URLs redirect with 307 (temporary)
Evidence: `https://penelopesocial.com/about/` -> 307 `location: /about`, and `/index.html` -> 307 `/`. This is Cloudflare's `html_handling: "drop-trailing-slash"` (wrangler.jsonc, assets block). It is the intended behaviour, and every internal link already uses the no-slash form, so the redirect is hit only by external links.
Impact: Google treats a 307 like a 302, so it may keep the slashed URL for a while, and link equity passes less cleanly. The canonical on the destination mitigates this.
Fix: There is no config switch for the code. Either accept it, or add an explicit 301 Redirect Rule in the Cloudflare zone: when the URI path ends with `/` and is not `/`, 301 to the path without the trailing slash. Low urgency.

### M3 (Medium): Non-slashed redirect chain on http://www
Evidence: `http://www.penelopesocial.com/` -> 301 `https://www.penelopesocial.com/` -> 301 `https://penelopesocial.com/` (2 hops). `http://penelopesocial.com/` is 1 hop.
Fix: In the Cloudflare Redirect Rule, redirect all http and www variants directly to `https://penelopesocial.com/${path}`. Enable "Always Use HTTPS" in addition. This is a minor efficiency fix.

### M4 (Medium): Homepage canonical and og:url have no trailing slash, and the sitemap matches
Evidence: `<link rel="canonical" href="https://penelopesocial.com">`, the sitemap `<loc>https://penelopesocial.com</loc>`, and the internal links are mixed (`https://penelopesocial.com` and `https://penelopesocial.com/`, both present on the home crawl). BaseLayout.astro:44 strips the trailing slash (`.replace(/\/$/, '')`).
Impact: Low in practice, because an origin-only URL is equivalent to `/` in HTTP, and the canonical and sitemap agree, so there is no conflict. It looks like a mismatch only to naive validators. Optional: make the homepage canonical `https://penelopesocial.com/` and make the sitemap `<loc>` match. If you change one, change both.

### M5 (Medium): Thin or weak pages
Evidence (crawl.json words_main): /locations 63 words, /locations/woodbridge 211, /locations/scarborough 232, /about 284.
Risk: /locations/woodbridge versus /about, /contact and the home page (same NAP, hours and map) are near-duplicate in intent. The landing pages (/cafe-in-vaughan, /pizza-vaughan, /sandwiches-vaughan, /bakery-vaughan) have 877-996 words each and distinct titles, so they do not cannibalise each other at the technical level. Do not merge them. Make sure /locations/woodbridge carries unique content (parking, neighbourhood, directions, nearby landmarks) and consider adding it to the main nav.
Also: /locations/scarborough is a different business (Penelope Bakehouse). Keep it, but make sure its LocalBusiness schema points at the Bakehouse and not Social. Every page emits the same Restaurant, Bakery and BarOrPub nodes (sitewide), so this is worth checking in the schema report.

### M6 (Medium): Title and description lengths
- Too short: /merchandise (23 chars), /merchandise/hoodie (24), /t-shirt (25), /tote-bag (26), /locations/scarborough (29). Add a descriptor, for example "Penelope Social Merch | Hoodies, Tees and Totes".
- Too long (likely truncated at about 60 characters): /menus/lunch (71), /menus/dinner (67), /menus/catering (62), /cafe-in-vaughan (59, borderline).
- Description: /merchandise/tote-bag is 305 chars (limit about 155-160). /menus/catering is 201 chars. Trim both.
- Titles in the crawl show `&amp;` (for example "Coffee Shop &amp; ..."). This is proper HTML escaping if it appears in the source. Confirm that it is not double-escaped in rendered SERP output (if "&amp;" is visible in the browser tab, the Sanity string is pre-escaped).

### L1 (Low): Product pages are weakly linked
Inbound internal link counts: /merchandise/hoodie, /t-shirt and /tote-bag each have 2 inbound links (merch index plus self or sibling). Fine for a small site, but they are not in the global nav or footer.
/contact has 4 inbound links. All other pages have 8-21.

### L2 (Low): 404 page canonical and asset URLs
- The 404 page has noindex and no canonical, which is good. The homepage crawl shows a canonical that resolves to https://penelopesocial.com, which is fine.
- Cloudflare serves 404 content with `cache-control: public, max-age=0, must-revalidate` and `cf-cache-status: HIT`, so no problem.
- Case-variant URLs (/ABOUT) return 404 rather than a redirect. That is fine for a small site.

### L3 (Low): Image alt coverage
crawl.json shows about 21 `<img>` without alt on every page (22 of 32 on the homepage), a sitewide count that is nearly constant, which suggests nav, footer or decorative icons. Check that they carry `alt=""` explicitly (decorative) rather than no attribute. Content images (menu, hero, product) need descriptive alt text.

### L4 (Low): /reservations is an internal link that 301s off-site
All 21 pages link to https://penelopesocial.com/reservations, which 301s to the Toast booking URL (web/public/_redirects:5). It is correctly excluded from the sitemap (astro.config.mjs filter) and not disallowed in robots.txt. A 301 is cached by browsers and search engines for a long time, so if Toast changes the booking URL the old target will stick. A 302 is the safer status for a third-party destination. Optional.

### L5 (Low): IndexNow not implemented
No key file at /{key}.txt and no submission hook. Bing, Yandex and Naver benefit little for a 20-page site, but a Cloudflare Crawler Hints setting (free) gives the same effect with no code. Enable it in the Cloudflare dashboard (Caching > Configuration > Crawler Hints).

### L6 (Low): llms.txt is present
/llms.txt (200) gives NAP, hours and site links. Good. It is optional and is not read by Google. Keep it in sync with the site content.

### Info
- hreflang: N/A (single-language en-CA site, `<html lang="en">`). Consider `lang="en-CA"`.
- Core Web Vitals (source inspection only; no field data used): the HTML is 100 KB brotli-compressed with 2 preloaded fonts. The Turnstile script (`async defer`) loads on every page, including pages with no form, which costs an extra third-party connection. Load it only on /contact, /catering-events and wherever the newsletter form lives (BaseLayout.astro:77-81, `turnstileSiteKey &&`). Swiper CSS and JS are loaded on the homepage. Confirm the hero image has explicit width and height and `fetchpriority="high"`, and that sliders reserve height, to protect CLS. Run PageSpeed Insights or CrUX for field data.
- Fonts and PNG/ICO favicons are crawled as assets (they appear in crawl.json), which is fine.
- Prior audit baseline (docs/seo-audit-2026-09.md): sitemap and canonical structure are unchanged. No regressions were found.
