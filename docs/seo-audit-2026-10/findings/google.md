# Google first-party data re-measure: penelopesocial.com (run 2026-10-06)

Source: Google API (field data). GSC property `sc-domain:penelopesocial.com` (www hostnames are included in the domain property). Raw JSON in `findings/google-raw/`.
Windows: CURRENT 2026-09-06 to 10-03 (28d); PREVIOUS 2026-08-09 to 09-05; PRIOR-AUDIT 2026-08-19 to 09-16; POST-SHIP 2026-09-19 to 10-03 (15d, no overlap with the old titles). GSC lag 2-3 days. All totals are `totals_complete: true` (dimensionless aggregates).
Credential tier: 2 on paper, but GA4 access was granted mid-audit (see section 5). GSC, URL Inspection, CrUX and PSI all worked.

## 1. Totals

| Window | Clicks | Impressions | CTR | Avg pos |
| --- | --- | --- | --- | --- |
| Prior audit 08-19 to 09-16 | 5,283 | 53,748 | 9.83% | 5.6 |
| Previous 28d 08-09 to 09-05 | 5,060 | 50,733 | 9.97% | 5.5 |
| **Current 28d 09-06 to 10-03** | **4,517** | **44,793** | **10.08%** | **5.4** |
| Post-ship 15d 09-19 to 10-03 | 2,510 | 24,815 | 10.11% | 5.3 |

Clicks are -14.5% vs the prior audit and -10.7% vs the preceding 28d; impressions -16.7% / -11.7%. CTR and position are slightly better. The drop is mostly the Bakehouse-brand impressions leaving (about 3,400 fewer brand impressions, only about 130 fewer brand clicks) plus lower brand-demand volume ("penelope social" 8,668 to 7,836 impr, 2,783 to 2,418 clicks, CTR ~31-33% flat). Non-brand clicks are roughly flat.

### Top queries (current: clicks/impr/CTR/pos; prior-audit clicks/impr in brackets)
1. penelope social 2,418/7,836/30.9%/1.2 [2,783/8,668]
2. penelope social menu 227/1,174/19.3%/2.0 [245/1,227]
3. penelope social vaughan 68/178/38.2%/1.2 [87/267]
4. penelopes social 54/134/40.3% [54/159]
5. penelope restaurant 45/191/23.6%/2.9 [51/222]
6. penelopes 41/283/14.5%/2.0 [50/328]
7. restaurants near me 35/2,682/1.3%/8.6 [30/2,934]
8. penelope social photos 31/444/7.0%/1.4 [34/485]
9. penelopes vaughan 31/75/41.3% [29/70]
10. restaurants vaughan 26/899/2.9%/4.5 [23/886]
11. penelope restaurant woodbridge 25/60/41.7% [32/69]
12. penelope vaughan 25/75/33.3% [20/89]
13. restaurants in vaughan 23/1,045/2.2%/4.4 [26/1,137]
14. vaughan restaurants 21/813/2.6%/4.2 [18/899]
15. penelope bakery 20/224/8.9%/2.8 [53/379]
16. penelope woodbridge 20/55/36.4% [13/48]
17. penelope 18/222/8.1%/3.7 [15/262]
18. penelope bakehouse 13/1,397/0.93%/5.3 [46/2,896]
19. penelope focacceria 11/58/19.0% [23/155]
20. penelope social happy hour 11/40/27.5%/1.6 [14/40]
21. penelope vaughan restaurant 11/27/40.7%
22. penelope bakery vaughan 10/30/33.3%
23. penelope social woodbridge 10/35/28.6%
24. penelope's social 10/25/40.0%
25. penelope's woodbridge 9/20/45.0%
Top by impressions not above: penelope bakehouse menu 592, penelope social reviews 452, penelope bakery scarborough 415, italian restaurant vaughan 236.
Site remains ~85% brand-driven.

### Top pages (current clicks/impr/CTR/pos [prior-audit clicks/impr])
| Page | Current | Prior audit |
| --- | --- | --- |
| / | 3,670/40,278/9.11%/5.5 | 4,328/50,785 (8.52%) |
| /menus/dinner | 252/12,292/2.05%/2.4 | 329/13,991 |
| /menus | 319/11,923/2.68%/2.5 | 181/9,009 |
| /menus/lunch | 153/11,715/1.31%/2.5 | 165/9,444 |
| /sourdough-bakery | 75/11,635/0.64%/3.8 | 61/8,272 |
| /about | 21/11,133/0.19%/2.8 | 29/13,064 |
| /menus/catering | 41/9,131/0.45% | 37/8,206 |
| /menus/bar | 20/1,894/1.06% | 23/1,704 |
| /cafe-in-vaughan (new) | 5/1,410/0.35%/3.8 | - |
| /catering-events | 10/871/1.15%/7.4 | 7/1,319 (0.53%) |
| /pizza-vaughan (new) | 7/841/0.83%/7.3 | - |
| /sandwiches-vaughan (new) | 10/577/1.73%/6.6 | - |
| /bakery-vaughan (new) | 3/233/1.29%/6.6 | - |
Homepage CTR improved 8.52% to 9.11%. www duplicates mostly consolidated: www.* pages are now near zero except www/contact (487 impr) and www/merchandise (84). Caveat: most /menus/*, /about, /sourdough-bakery and new-page impressions are sitelink-style impressions on "penelope social" brand queries (pos 2-3), which is why CTR looks tiny; they are not independent rankings.

## 2. Bakehouse-brand cannibalization (queries with penelope + bake/bakery)

| | Clicks | Impr | CTR | Pos |
| --- | --- | --- | --- | --- |
| Prior audit window | 188 | 6,661 | 2.82% | 5.5 |
| Previous 28d | 190 | 7,130 | 2.66% | 5.5 |
| Current 28d | 61 | 3,257 | 1.87% | 5.3 |
| Post-ship 15d | 20 | 1,780 | 1.12% | 5.5 |

Weekly (starting): 08-19 3,494 impr/87 clk; 08-26 1,204/45; 09-02 1,019/24; 09-09 843/29; 09-16 764/11; 09-23 793/9; 09-30 543/6. Impressions and clicks on Social for Bakehouse-brand queries have fallen by roughly 75-85% (about 120/day post-ship vs about 240/day in the audit window). Caveat: most of the fall began around 08-26, before the 09-19 retitle, so the retitle cannot take all the credit (the homepage stopped surfacing for these queries, 4,904 impr in the audit window vs 513 now; the Bakehouse domain presumably strengthened). Wasted clicks were already tiny; what was removed is mainly wasted impressions.

Key queries (current vs prior audit): penelope bakehouse 1,397 impr/13 clk/0.93% (was 2,896/46/1.59%); penelope bakehouse menu 592/8/1.35% (1,657/41/2.47%); penelope bakery scarborough 415/0 clk (377/3); penelope bakehouse scarborough 96/1 (337/4); penelope bakehouse reviews 130/1 (320/4); penelope bakery 224/20, 8.9% pos 2.8 (379/53, 14%, pos 2.0); penelope bakehouse photos 229/1.
Which Social pages still rank: `/sourdough-bakery` is now almost the only one: it holds 1,351 of 1,397 impressions for "penelope bakehouse" (pos 5.3, 12 clicks) and 548 of 592 for "...menu", 368 of 415 for "bakery scarborough". It still earns about 1% CTR at pos 5.3, so the retitle did NOT improve CTR; it just reduced volume. Homepage dropped out (162 impr on "penelope bakehouse", pos 7.2). New pages /pizza-vaughan (117 impr "penelope bakehouse", pos 9.0) and /sandwiches-vaughan (90 impr on "...menu", pos 9.6) pick up leakage at pos 9+ (0 clicks). `/locations/scarborough` is "Discovered - currently not indexed" and never ranked, so it was never part of the problem.
Status of 301: URL Inspection (crawled 2026-10-06 01:20Z) reports /sourdough-bakery as "Page with redirect", Google canonical = /bakery-vaughan. Google has only just processed the redirect, but impressions were still 399 on 10-03. Expect the residual ~380 impr/day to transfer to /bakery-vaughan (currently 233 impr, pos 6.6-8.3 for brand queries) or fall away. Re-check in 2-3 weeks. noindex (option 3) is not yet justified; watch whether /bakery-vaughan inherits the "penelope bakehouse" impressions at 0.9% CTR, in which case reconsider (retitle/noindex or point at penelopebakehouse.com). Bakehouse domain data is not available to this service account (only sc-domain:penelopesocial.com and henleystrategies.com are granted), so Bakehouse-side CTR could not be compared.
Verdict: PARTIALLY IMPROVED. Volume down about 75-85%; remaining leakage concentrated on one URL that is now 301-ing.

## 3. Clusters (impressions / clicks / CTR / pos; aud = prior audit, cur = current, post = 15d post-ship)

| Cluster | Prior audit | Current | Post-ship |
| --- | --- | --- | --- |
| Italian restaurant (non-sandwich) | 905 impr / 21 clk / 2.3% / 20.8 | 982 / 25 / 2.55% / 19.6 | 613 / 19 / 3.1% / 18.6 |
| Brunch | 840 / 35 / 4.2% / 9.0 | 704 / 21 / 3.0% / 9.6 | 407 / 10 / 2.5% / 9.4 |
| Happy hour (non-brand) | 155 / 6 / 3.9% / 7.2 | 143 / 8 / 5.6% / 6.1 | 78 / 5 / 6.4% / 5.4 |
| penelope + happy hour | 60 / 16 / 26.7% | 50 / 12 / 24% | 30 / 7 / 23% |
| Generic "restaurants (in) vaughan" | 5,218 / 155 / 2.97% / 5.0 | 4,581 / 129 / 2.82% / 4.9 | 2,362 / 57 / 2.41% / 4.7 |
| Restaurants near me | 4,027 / 49 / 1.2% / 9.4 | 3,673 / 54 / 1.5% / 8.7 | 2,298 / 36 / 1.6% / 7.6 |
| Catering (all) | 65 / 12 / 18% / 9.4 | 46 / 6 / 13% / 12.3 | 24 / 3 / 12.5% / 14.1 |
| Cafe/coffee (non-brand) | 75 / 2 / 2.7% / 13.0 | 118 / 1 / 0.85% / 11.3 | 74 / 1 / 1.4% / 8.3 |
| Pizza (non-brand) | 201 / 11 / 5.5% / 15.8 | 346 / 12 / 3.5% / 13.4 | 262 / 8 / 3.1% / 12.4 |
| Sandwich (non-brand) | 1,037 / 53 / 5.1% / 6.0 | 840 / 45 / 5.4% / 5.9 | 454 / 23 / 5.1% / 5.6 |
| Bakery/bread/focaccia (non-brand) | 337 / 12 / 3.6% / 8.3 | 267 / 21 / 7.9% / 8.0 | 133 / 12 / 9.0% / 7.7 |

Specifics:
- Italian: unchanged. italian restaurant vaughan 236 impr @ 23.6 (was 208 @ 24.1); italian restaurants vaughan 114 @ 19.4; best italian restaurant vaughan 56 @ 17.7. No page targets it (new pages are cafe/pizza/sandwich/bakery). Still the biggest unaddressed gap.
- Brunch: 112 @ 12.1 for "brunch vaughan" (was 134 @ 10.5): slightly worse, no brunch page.
- Restaurants in vaughan (pos 4-5): 1,045 impr, CTR 2.2% @ 4.4 (was 2.29%); vaughan restaurants 813, 2.6% (was 2.0%); restaurants vaughan 899, 2.9% (was 2.6%); best restaurants vaughan 186, 0.5% @ 4.9 (was 2.3%). Title/meta CTR fix has NOT moved the needle (about 2-3% where 6-9% would be expected). Homepage whole-page CTR rose only because brand mix shifted.
- /catering-events: 871 impr, 10 clicks, 1.15% CTR @ 7.4 (was 1,319/7/0.53% @ 7.9). CTR doubled but off a tiny base; still low. Most of its impressions are "penelope social menu" sitelinks at pos 8.4, not catering queries. Real catering-query demand is only 46 impressions.
- Cafe/coffee Vaughan: /cafe-in-vaughan has 1,410 impr but the top queries are brand (penelope social 633 @ pos 2.4, penelope social menu 228 @ 5.4); the page ranks for none of "cafe in vaughan / coffee shops in vaughan" yet. Only cafe near me 16 @ 7.5, cafe woodbridge 14 @ 10.7.
- Pizza Vaughan: pizza vaughan 15 impr @ 20, best pizza vaughan 29 @ 11.3, pizza near me 50 impr @ 13.5 (new; was 1). Mild lift in impressions, /pizza-vaughan 841 impr @ 7.3 mostly brand sitelink traffic.
- Sandwiches Vaughan: stable, strong (best sandwiches vaughan @ 3.1, but impressions 69 down to 38; italian sandwiches vaughan 62 @ 5.8). /sandwiches-vaughan: 577 impr, 10 clicks, 1.73%, mostly brand sitelinks, own query "italian sandwiches vaughan" 11 impr @ 6.2.
- Bakery Vaughan: /bakery-vaughan 233 impr, 3 clicks, pos 6.6. Brand-bakery queries only; the 301 was processed 10-06, so no non-brand ranking yet ("bakery near me" 11 impr @ 12.3).
Verdict: new pages are indexed but 2-4 weeks old and not yet ranking for their non-brand targets. No cluster has a measurable win yet; sandwich and happy hour are the only strong positions, and they were already strong.

## 4. URL Inspection (inspected 2026-10-06)

| URL | Coverage state | Last crawl | Google canonical |
| --- | --- | --- | --- |
| / | Submitted and indexed | 2026-10-02 | https://penelopesocial.com/ (match) |
| /bakery-vaughan | Submitted and indexed | 2026-10-06 01:20Z | self (match) |
| /cafe-in-vaughan | Submitted and indexed | 2026-09-29 | self (match) |
| /pizza-vaughan | Submitted and indexed | 2026-10-02 | self (match) |
| /sandwiches-vaughan | Submitted and indexed | 2026-10-02 | self (match) |
| /catering-events | Submitted and indexed | 2026-10-03 | self (match) |
| /sourdough-bakery | **Page with redirect** (NEUTRAL) | 2026-10-06 | https://penelopesocial.com/bakery-vaughan |
| /locations/scarborough | **Discovered - currently not indexed** | never | none |
All inspected pages: robots allowed, fetch successful, breadcrumb rich result PASS, no referring URLs on new pages (no internal-link referrers reported by Google yet, worth confirming they are linked in nav/footer; sitemap-0.xml was resubmitted 2026-09-30, 20 URLs, 0 errors/warnings; sitemap-index.xml 20 URLs). `/locations/scarborough` is in the "discovered, not indexed" state: either exclude it from the sitemap if it is intentionally thin, or build links to it; it explains why the Scarborough retitle had no measurable effect.

## 5. GA4 (property 552033154, access granted 2026-10-06)

Raw: `google-raw/ga4-organic.json`, `ga4-top-pages.json`, `ga4-device.json`, `ga4-events.json`.

**Channels (2026-09-08 to 10-05):**

| Channel | Sessions | Engagement | Key events |
| --- | --- | --- | --- |
| Organic Search | 5,881 | 69.6% | 4,786 |
| Direct | 2,589 | 55.1% | 1,157 |
| Organic Social | 333 | 83.5% | 320 |
| Referral | 64 | | |
| AI Assistant | 59 | 74.6% | |

Organic devices: mobile 4,655 sessions (66.5% engaged), desktop 1,170 (80.5%). The prior audit's 1,946 organic sessions came from a partial window on a new property, so it is not comparable to these numbers.

**Key events are polluted.** Five engagement events are marked as key events. Organic key events since 09-19:

| Event | Key events |
| --- | --- |
| `popup_view` | 1,684 |
| `popup_dismiss` | 1,351 |
| `nav_menu_click` | 554 |
| `faq_open` | 188 |
| `announcement_dismiss` | 79 |
| **Total** | **3,856** |

That is about 80% of all organic "conversions". Unmark them in GA4 Admin → Events, or every conversion rate will be overstated about 5×.

**Real conversions, organic, 09-19 to 10-05** (key events):

| Event | Key events |
| --- | --- |
| `reservation_click` | 390 |
| `order_click` | 311 |
| `catering_click` | 132 |
| `merch_click` | 18 |
| `get_directions` | 14 |
| `click_to_call` | 13 |
| `generate_lead` (form submits) | 8 |
| `gift_card_click` | 5 |

That is about 890 conversion actions across about 3,760 organic sessions. `newsletter_signup` did not appear.

`bakehouse_click` (5) and `review_click` (2) are tracked as events, not key events, which is correct.

**Popup.** 1,805 organic views, 1,458 dismissals (81%), 18 clicks (1.0%). The Christmas popup earns about one click per 100 views.

**Organic landing pages since 09-19:**

| Landing page | Sessions | Engagement |
| --- | --- | --- |
| `/` | 2,646 | 83% |
| `/menus/dinner` | 345 | **39%** |
| `/menus` | 219 | 87% |
| `/menus/lunch` | 179 | **47%** |
| `(not set)` | 173 | 6% |
| `/catering-events` | 13 | |
| `/sandwiches-vaughan` | 13 | |
| `/bakery-vaughan` | 12 | |
| `/pizza-vaughan` | 5 | |
| `/cafe-in-vaughan` | 2 | |

- `/menus/dinner` and `/menus/lunch` land users from brand sitelinks and lose most of them. Add Reserve and Order CTAs at the top of the menu pages.
- `(not set)` is likely sessions with no page_view (bots or consent).

## 6. CrUX / PSI (field data)
Origin (CrUX history, latest collection period 09-06 to 10-03, all devices): LCP p75 485 ms (98.9% good), INP p75 62 ms (98.0% good), CLS 0.00 (98.9% good), TTFB 134 ms, FCP 427 ms. All GOOD, stable across the 7 weeks of data available. Homepage URL-level CrUX identical band (LCP 480 ms, INP 62 ms, CLS 0).
PSI mobile lab (homepage, Lighthouse 13.5): Perf 67, A11y 98, BP 100, SEO 100; lab LCP 10.2 s, FCP 2.4 s, TBT 150 ms, CLS 0. Field data is excellent but the simulated-throttle lab LCP is 10.2 s, which is worth a look (likely hero media or heavy image) even though real users do not experience it.

## Verdicts
1. Bakehouse-brand cannibalization: dropped about 75-85% in impressions (3,494/wk to about 550-800/wk), clicks 188 to 61 (28d), residual concentrated on /sourdough-bakery, now 301 to /bakery-vaughan. Partially fixed; CTR on the remainder is still about 1%. Part of the decline predates the 09-19 changes.
2. Overall traffic: clicks -14.5% vs audit window, impressions -16.7%, CTR 9.83% to 10.08%.
3. New landing pages: all indexed, none ranking for non-brand targets yet; too early (1-3 weeks).
4. CTR leaks (restaurants in vaughan 2.2%, catering-events 1.15%): not materially changed.
5. Italian (pos 20-24) and brunch (pos 9-12): no change, no page serves them.
6. /locations/scarborough is not indexed.
7. GA4: organic 5,881 sessions / 69.6% engaged; key events are inflated by five engagement events marked as key (about 80% of organic key events).
