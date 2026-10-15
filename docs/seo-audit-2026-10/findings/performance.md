# Performance / Core Web Vitals: penelopesocial.com (2026-10-06)

**Score: 82/100.** Field data is excellent, so the site passes CWV. Lab mobile is weak (PSI 57-75), mostly because of an unexplained 7-12 s lab LCP and some avoidable payload and caching gaps.

## Core Web Vitals

Field data is CrUX, 28-day window 2026-09-07 to 2026-10-04, p75.

| Scope | LCP | INP | CLS | TTFB | Status |
|---|---|---|---|---|---|
| Origin, all devices (field) | 480 ms | 62 ms | 0.00 | 134 ms | PASS (98-99% good) |
| Homepage URL, mobile (field, PSI) | 680 ms | 72 ms | 0 | 227 ms | PASS |
| Homepage URL, desktop (field) | 602 ms | 57 ms | 0 | 236 ms | PASS |
| Other URLs (field) | PSI fell back to origin/ALL values (LCP 481, INP 68) | | | | PASS (origin level) |

`crux_history.py` for the origin and the homepage shows LCP, CLS and TTFB stable and good across all collection periods (CLS 0.0 throughout, TTFB 134-156 ms).

`lcp_subparts.py` returned null subparts for PHONE. The combined CrUX call (all form factors) gave these LCP subparts:

- TTFB: 120 ms
- Resource load delay: 97 ms
- Resource load duration: 65 ms
- Element render delay: 158 ms

Render delay is the largest slice, but the total is tiny.

## Lab (Lighthouse 13.5.0 via PSI, 2026-10-07 UTC)

| Page | Mobile perf | LCP | FCP | TBT | CLS | Desktop perf | LCP | TBT |
|---|---|---|---|---|---|---|---|---|
| / | 68 | 10.1 s | 2.4 s | 90 ms | 0 | 99 | 1.0 s | 40 ms |
| /menus/lunch | 57 | 9.5 s | 2.3 s | 490 ms | 0 | 99 | 0.8 s | 80 ms |
| /pizza-vaughan | 75 | 7.4 s | 1.7 s | 70 ms | 0 | 92 | 1.1 s | 200 ms |
| /catering-events | 68 | 12.6 s | 2.5 s | 90 ms | 0 | 99 | 1.0 s | 30 ms |

Lab mobile LCP is poor on every page. That is inconsistent with field LCP of 0.5-0.7 s and with desktop lab LCP of about 1 s. LCP is almost equal to TTI on each page (10.1/10.2, 9.5/9.5, 7.4/7.4, 12.6/12.6). That points to something late in the load: the hero or banner image is gated behind script or CSS animation, or it competes with the Turnstile and GTM downloads under Lighthouse's slow-4G throttling. The LCP element and its subparts were not available in the PSI payload, so this is a hypothesis. Verify it with a local Lighthouse mobile run, or the DevTools Performance panel with 4G throttling. Field data says real users are not affected, so treat it as lab-only for now. It still drags the PSI score and could mask real regressions.

## Page weight (homepage, mobile lab)

- Total: 1.63 MB over 50 requests.
- Images: 21 requests, 445 KB.
- Scripts: 15 requests, 321 KB.
- Fonts: 2 requests, 145 KB.
- "Other": 597 KB. This is mostly Cloudflare Turnstile challenge payloads (592 KB + 114 KB), not site content.
- HTML: 101 KB raw, 19.5 KB transferred.
- DOM: 529 elements, which is fine.
- Pages have 25-32 `<img>` tags. Only 4-11 are `loading="lazy"`, and the rest are small 68 px nav thumbnails with `fetchpriority="low"`.

## What works

- TTFB is 134 ms (origin) because pages are static on Cloudflare's edge and `cf-cache-status: HIT`.
- CLS is 0 in field and lab. Images carry width and height, and a size-adjusted fallback font face exists (`Sweet Sans Fallback` with `size-adjust`/`ascent-override`) in `web/src/styles/global.css`.
- INP is 44-72 ms and TBT is low. DOM is small (529 elements).
- The hero is `loading="eager"` with `fetchpriority="high"`. The two fonts used above the fold are preloaded. All `@font-face` rules use `font-display: swap`.
- Images come from Sanity with `auto=format`, so AVIF or WebP is negotiated. `srcset` is used for cards (500/800/1080).
- GA4 `gtag.js` is deferred until after `load` (`web/src/layouts/BaseLayout.astro`). It is hostname-gated, so it does not run on preview hosts.
- HTTP/2 and HTTP/3 (`alt-svc: h3`), with Brotli or gzip on the HTML.

## Findings

### 1. HIGH. Hashed `/_astro/*`, fonts, and images have `Cache-Control: public, max-age=0, must-revalidate`
- Evidence: curl on `/_astro/ui.C05RCV_O.css`, `/fonts/SweetSansPro-Regular.otf`, and `/`. All three return `max-age=0, must-revalidate`. `web/public/` has no `_headers` file (only `_redirects`).
- Impact: repeat visits and later page views revalidate every CSS, JS and font file. That costs round trips and delays render on mobile. The LCP effect is small in the field (currently fine) but real for returning visitors.
- Fix: add `web/public/_headers`.
  - `/_astro/*` gets `Cache-Control: public, max-age=31536000, immutable`.
  - `/fonts/*` and `/icons/*` get `public, max-age=31536000, immutable`, or one month if the files are not hash-versioned.
  - HTML stays `max-age=0, must-revalidate`.
- Cloudflare Workers Static Assets honors `_headers`.

### 2. HIGH. Cloudflare Turnstile loads on every page, including pages without a form
- Evidence:
  - `<script async defer src="https://challenges.cloudflare.com/turnstile/v0/api.js">` is in `<head>` on all four pages tested (`web/src/layouts/BaseLayout.astro` lines 78-80).
  - Homepage lab: a 302 redirect for api.js, then about 592 KB + 114 KB of challenge payloads, plus `brunhild.challenges.cloudflare.com`. That is about 40% of homepage transfer.
  - The homepage renders a `cf-turnstile` widget in the newsletter or footer slot (`web/src/components/Turnstile.astro`, `NewsletterForm.astro`), so the widget initializes at page load.
- Impact: it competes with the hero image and CSS on throttled mobile, and it is the best candidate for the lab LCP and TTI gap above. It also adds third-party main-thread time.
- Fix:
  - Load api.js lazily, on first focus or interaction of a form input or when the form scrolls into view (IntersectionObserver). Use `render=explicit`, and render the widget on demand.
  - Or use `data-appearance="interaction-only"` and defer the script. Remove the `<head>` tag from `BaseLayout.astro` and inject it from `web/src/scripts/forms.ts` and `web/src/lib/turnstile.ts`.

### 3. MEDIUM. Oversized hero and banner images (no `width` param, no `srcset`)
- Evidence:
  - `Hero.astro` and `BannerHero.astro` call `imageUrl(image)` with no width, so Sanity serves the original pixel size. They add no `srcset` or `sizes` (`web/src/lib/image.ts` provides `imageSrcset`, but neither hero uses it).
  - Homepage hero: 1920x1281 AVIF, 67 KB with no width param. With `w=800` it would be about 34 KB.
  - `/pizza-vaughan` banner: 3840x2160 source served as a **575 KB AVIF**. With `w=1200`, WebP is 126 KB.
  - Lighthouse `image-delivery-insight`: about 177 KiB estimated savings on the homepage.
- Fix:
  - In `BannerHero.astro` and `Hero.astro`, emit `srcset` for widths such as 640/960/1440/1920 with `sizes="100vw"`, and set `quality` (about 70).
  - Cap the source with `imageUrl(image, 1920)`.
  - Also compress the Sanity source images (pizza is a 3840-wide JPG).
- The 1440x810 `width`/`height` attributes on the banners do not match the 1920x720 source aspect ratio (CLS is protected by `absolute inset-0`, but correct them).

### 4. MEDIUM. Fonts are `.otf` (not woff2) and use four faces
- Evidence: `SweetSansPro-Medium.otf` (71 KB transfer, 130 KB raw) and `-Regular.otf` (74 KB transfer, 137 KB raw), served `font/otf`. `Thin.otf` and `Elmoder-Bold.otf` are also declared in `web/src/styles/global.css` lines 101-128. Both preloads are present and use the right `crossorigin`.
- Impact: 145 KB of fonts is the second-heaviest static asset group. woff2 typically cuts OTF/CFF by 30-50%.
- Fix:
  - Convert to woff2, for example with `pyftsubset --flavor=woff2`.
  - Subset to Latin plus punctuation.
  - Update the `src:` URLs and the `<link rel=preload>` types (`font/woff2`).
  - Check licensing allows web subsetting.
  - Preload only the faces used above the fold. Elmoder and Thin are not preloaded, which is correct.

### 5. MEDIUM. 4 render-blocking stylesheets, and an `ui.css` of 14.5 KB
- Evidence: Lighthouse `render-blocking-insight` lists `ui.C05RCV_O.css` (751 ms wasted on mobile), `swiper-bundle.DKSTbavy.css`, `seo.CFDok6Oo.css`, and `menu-mosaic-swiper.CErV7xzj.css` (about 150-450 ms each).
- Impact: FCP of 2.4 s in the mobile lab. Field FCP is about 0.4-0.6 s, so this is not hurting users now.
- Fix:
  - Set `build.inlineStylesheets: 'always'` (or `'auto'` with a larger limit) in `web/astro.config.mjs`.
  - Load swiper CSS only on pages that have the carousel.

### 6. MEDIUM. `/menus/lunch` mobile TBT is 490 ms
- Evidence: TBT is 490 ms, `max-potential-fid` fails, and the page scores 57. Other pages are 70-90 ms. Likely causes are the extra scripts on the page (carousel or menu-card scripts, `step-timeline.*.js` costing about 175 ms of scripting on the homepage, and GSAP at about 51 ms) plus the GTM `gtag.js` long tasks (104 ms + 88 ms).
- Fix: dynamic-import GSAP, `step-timeline` and swiper only when their section is near the viewport. Defer `MarketingPopup` and `AnnouncementBar` scripts with `requestIdleCallback`. Field INP is fine, so this is low urgency.

### 7. LOW. Third-party scripts
- GA4 via `gtag.js`: 180 KB, 166 ms main thread, 76 KB unused (Lighthouse `unused-javascript`, 450 ms mobile estimate), and two long tasks. It is already loaded after `load`. Consider Cloudflare Zaraz or partytown only if TBT becomes an issue.
- Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`): 10 KB, flagged for legacy JS. It is injected by Cloudflare. If GA4 covers the need, disable it in the dashboard.
- Toast: only outbound links were seen on these pages. No Toast script was in the loaded resources.
- Marketing popup: a first-party module (`MarketingPopup.astro_astro_type_script...js`). It caused no CLS (CLS is 0).

### 8. LOW. No speculation rules (`preload_check.py` score 75/100)
- Add `<script type="speculationrules">` with prefetch (moderate eagerness) for internal links such as `/menus/*`, `/locations/*`, and `/catering-events`. Apply it in `BaseLayout.astro`.
- bfcache signals are clean: no `unload` listener and no `no-store`.
- The LCP image is correctly marked `fetchpriority=high`. There is no `<link rel=preload as=image>`, which is fine because the `<img>` appears early in the HTML.

### 9. LOW. Minor hygiene
- The footer logo `<img src="">` with `loading="lazy"` (a Lighthouse `unsized-images` item) and unsized footer social icons: add `width`/`height`. The navbar logo SVG also lacks explicit dimensions.
- `/menus/lunch`, `/pizza-vaughan` and `/catering-events` have no `<main>` landmark (`landmark-one-main`). `/catering-events` has a `<select>` with no accessible name (`select-name`). A footer `h4` is out of heading order.
- No HSTS, COOP, CSP or X-Frame-Options headers (Lighthouse best-practices flags). Set them in `_headers` alongside the cache rules. HSTS has the most benefit.
- Legacy JS: 11 KiB, all in Cloudflare's own beacon, so it is not actionable.

## Priority order (expected impact)
1. `_headers` immutable caching (finding 1). About 15 minutes of work.
2. Lazy-load Turnstile (finding 2). Likely fixes most of the lab mobile gap.
3. Responsive hero and banner images with width caps (finding 3). Saves up to 450 KB on pizza-type banners.
4. Convert fonts to woff2 and subset (finding 4).
5. Inline critical CSS (finding 5), trim script on /menus/lunch (finding 6), and add speculation rules (finding 8).

## Raw data
Scratchpad PSI JSON: `psi1-4.json`, `cruxo.json`, `cruxh.json`, `sub.json`, `pre.json` in the session scratchpad.
