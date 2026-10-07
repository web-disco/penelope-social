# Visual / Mobile / Images audit: penelopesocial.com (2026-10-06)

Scores: **Visual 86/100**, **Images 80/100**

Method: Playwright (Chromium) at 1440x900 desktop and 390x844 mobile (DPR 2, touch) on /, /menus, /pizza-vaughan, /catering-events, /locations/woodbridge. Stock capture_screenshot.py only supports 1920/375 fixed viewports, so a custom script was used for 1440/390. Stock analyze_visual.py run on / (H1 visible, CTA visible, no horizontal scroll, no overlap; reports base font 14px "not readable", see F6).
Screenshots: `screenshots/<page>-<desktop|mobile>-atf-1.png` (1.5s), `-atf-2-after6s.png` (layout-shift check), `-full.png`, plus `home-mobile-popup-15s.png`. Pages: home, menus, pizza-vaughan, catering-events, woodbridge.

## What is good
- No horizontal overflow on any page at either width (scrollWidth == viewport). Viewport meta present.
- CLS 0.00 on all 10 renders; screenshots at 1.5s and 6.5s are identical (no visible shift).
- Home mobile above the fold (390x844): announcement bar, logo, hamburger, H1 (32px, top 484px), subhead, and two full-width 340x54 CTAs "Order Online" (y 688) and "Reservations" (y 758) all inside the 844px fold. Strong.
- /locations/woodbridge mobile: "Order online" (y 772) and "Reservations" (y 842) CTAs are at the fold edge; the first is visible, Reservations only just clipped.
- Hero is a real `<img>` with `fetchpriority=high`, `loading=eager`, AVIF, alt text present, explicit width/height.

## Findings

### F1 (Medium): Marketing popup is a full-modal on mobile, but timing keeps interstitial risk low
- Evidence: `<dialog class="marketing-popup">`, campaign "Booking a Corporate Christmas Party?", active 2026-09-22 to 2026-12-01 (live today). Script: opens via `showModal()` after 15s OR at 50% scroll, once per session, 30-day suppression after dismissal (localStorage), skipped on /catering-events (its CTA target). Not present at load, so no above-the-fold interstitial during initial render (not in 1.5s or 6.5s screenshots). Mobile popup: 358x717px of 844px (about 85% of viewport), locks page scroll, Esc and backdrop-click close, "No thanks" button plus close X. Close X is 40x40 (slightly under the 44-48px guideline).
- Risk: Google's intrusive-interstitial guidance targets popups that cover content right after landing from search. A delay-triggered or scroll-triggered dialog is lower risk, but a user who scrolls 50% within seconds from organic search gets an 85%-viewport modal. Acceptable; keep it as is or raise trigger to 60s / exit only.
- Recommendation: Keep the delay (do not shorten). Enlarge close X to 44px. Consider suppressing for the first pageview of an organic session, and make sure the dialog is removed after 2026-12-01 (it self-disables by date).

### F2 (Low): Announcement bar consumes 40px on mobile and is sticky-offset with the nav
- Evidence: Bar is 40px tall (42px desktop), pushes the navbar (fixed, top: 40px). Not an overlay: no content is obscured. Dismiss button 36x36 (under 44px). Text on mobile truncated to "Book your Christmas party" (sensible).
- Recommendation: Raise dismiss target to 44x44. Low priority.

### F3 (Medium): Primary conversion CTAs are not visible above the fold on inner pages (mobile)
- Evidence (390x844): /menus, /pizza-vaughan, /locations/woodbridge heroes show H1 + subhead + breadcrumb; no Order/Reserve/Directions in the first screen except woodbridge's Order Online button peeking at y 772. /catering-events shows "See the catering menu" at y 690 (good). /menus and /pizza-vaughan have no CTA above the fold (nav CTAs are hidden inside the hamburger). /pizza-vaughan is likely a high-intent local landing page.
- Recommendation: Add a persistent compact mobile action bar (Order / Reserve / Directions/Call) or place an Order + Reserve pair in the inner-page hero. "Directions" and phone are not above the fold anywhere on mobile; add a tap-to-call and Directions link (maps) on /locations/woodbridge hero.

### F4 (Low): Tap targets under 44px on mobile
- Evidence: logo link 84x27; breadcrumb "Home/Locations" links 47x18 and 92x18; inline text links 16px tall (e.g., "focaccia sandwiches" 162x16, "pizza" 41x16, "cafe" 34x16, "Penelope Bakehouse" 166x16); announcement dismiss 36x36; popup close 40x40. Hamburger (44x44) and main CTAs (340x54) pass.
- Recommendation: Add padding to breadcrumb links and logo link (min-height 44px). Inline body links are WCAG 2.2 exempt (inline) but breadcrumbs are not.

### F5 (Low): Header nav CTA hidden on mobile
- Evidence: Desktop header shows "Order Online" and "Reservations" (140x48, 143x48). On mobile they appear only in the drawer menu. See F3.

### F6 (Info): Text legibility
- Evidence: Body copy on mobile renders about 16-18px (popup 16-18px). The stock tool's "14px base, not readable" flag came from small text elements: about 6-18% of text nodes are under 14px (nav, footer 12px copyright, breadcrumb/labels). Minor. Contrast of H1 over hero photo is acceptable due to dark overlay (visual check on home and woodbridge).
- Recommendation: Raise footer/label text from 12px to 13-14px where feasible.

### F7 (Low): Home mobile hero image is very dark and the H1 sits at y=484 below ~480px of photo
- Evidence: Screenshot home-mobile-atf-1.png: top half of first screen is imagery only; value prop starts at about 57% of the viewport. CTAs still fit. No change required; consider shorter hero (e.g., 85svh) on small phones (iPhone SE 667px high would push CTAs below the fold: the CTAs end at ~y 812 on an 844px screen, so on 667-740px devices Reservations would be clipped). Recommend verifying at 375x667.

## Images

Images score: **80/100**

### Alt text: the "~21 images lacking alt" is almost entirely decorative or false positive
All images carry an `alt` attribute (0 missing attribute); crawl's "no alt" count is empty `alt=""`. Breakdown on /menus (21 empty) and similar on every page (21-22):
| Group | Count (per page) | Verdict |
|---|---|---|
| Mega-menu thumbnails (Lunch, Dinner, Bar, Catering, Italian Cafe, Sourdough Pizza, Focaccia Sandwiches, Sourdough Bakery), 136px AVIF/JPG, each inside a `<a>` that has adjacent visible text, rendered twice (desktop menu and mobile drawer = 16 imgs) | 16 | Legitimate decorative (alt="" correct since link text names the destination) |
| Instagram and TikTok icon SVGs inside links with `aria-label="instagram"/"tiktok"` (drawer + footer = 4 imgs) | 4 | Legitimate decorative; links are named via aria-label |
| `penelope-bike.svg` illustration (home only), `aria-hidden=true` | 1 | Legitimate decorative |
| Navbar logo | 1 | NOT empty: alt="Penelope Logo" (the crawler list may count by src; logo has alt). |
Meaningful content images checked have good descriptive alt: hero "People having dinner at Penelope Social.", "Focaccia Sandwich", "Crafted Cocktail", "Penelope Burger", "Two catering trays of focaccia sandwiches", "Loaves of Sourdough Bread", "Event at Penelope". So no meaningful image is missing alt.
Improvements: (a) Alt on some is thin/generic ("Event at Penelope" reused for two images, "Penelope Social Logo" for a footer graphic); (b) footer and social icons could drop the img and inline the SVG with `aria-hidden`; (c) 16 hidden duplicate menu thumbnails are in the DOM at all times (8 are display:none/0x0 on mobile, hidden on desktop until hover); wasteful to crawlers and gets counted as "missing alt" by audit tools. Recommend lazy-loading them (they are `loading=auto`) and, where practical, rendering nav thumbnails once.

### Formats / sizing / loading
- Formats: Sanity CDN with `auto=format`, AVIF served to Chromium (about 40-55% of images AVIF, rest JPG fallback for menu items, SVG for logos). Good.
- Hero: single 1920px AVIF (67 KB) with NO srcset/sizes, served to 390px phones (1920 intrinsic vs 780 needed at DPR2). A w=800 version is 28 KB: about 60% saving on the LCP asset. Recommendation: add `srcset`/`sizes` (or `?w=`) to the hero. Width/height declared (1440x810) but actual image is 1920x1281, aspect mismatch is hidden by object-fit; fine.
- Below-the-fold images set `loading="eager"` unnecessarily: "Event at Penelope" (y 1773) and "Loaves of Sourdough Bread" (y 3047) load eagerly on mobile, competing with the hero. Make these lazy. Menu thumbnails use `loading=auto` (browser decides, effectively eager when 0x0 hidden).
- Lazy loading used on carousel/grid items (8-11 per page); explicit width/height on about 78% of images. Missing dimensions: "Event at Penelope", "Loaves", footer logo SVG (potential CLS but measured CLS is 0).
- Mega-menu thumbs are 136px intrinsic displayed at 68px: appropriate (2x).
- Card images (351px natural at 308px displayed): slightly low for DPR2/3 phones but OK.

## Top recommendations (priority)
1. Add srcset/sizes (or w=800 on mobile) to the home/inner hero image; set below-fold eager images to lazy. (Images, Medium)
2. Add an always-visible mobile Order / Reserve / Directions action bar or hero CTAs on /menus, /pizza-vaughan, /locations/woodbridge. (Visual, Medium)
3. Ensure Directions + tap-to-call are visible on mobile Woodbridge page (currently not above fold). (Visual, Medium)
4. Bump tap targets (breadcrumbs, logo, announcement dismiss, popup close) to 44px. (Low)
5. Keep popup timing as is (15s / 50% scroll, once per session); no change needed for interstitial risk beyond F1 notes. Do not mark the "21 missing alt" as an issue; they are decorative.
6. Verify on short phones (375x667) that the home hero CTAs remain visible. (Low)
