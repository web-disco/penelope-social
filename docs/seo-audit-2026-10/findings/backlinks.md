# Backlink Profile: penelopesocial.com (2026-10-06)

## Score
**Backlink Health Score: INSUFFICIENT DATA (no numeric score).**
Tier 0 only (Common Crawl + verify crawler). No Moz/Bing/DataForSEO keys. 0 of 7 scoring factors have a usable data source, so a 0-100 number would be misleading. Factors skipped: referring domains, quality distribution, anchors, toxic ratio, velocity, follow/nofollow, geo.

## Data sources and confidence
| Source | Status | Confidence |
|---|---|---|
| Common Crawl domain graph (release cc-main-2026-jan-feb-mar, quarterly, domain-level) | OK | 0.50 |
| Live HTML fetch of both sites (outbound links, parsed) | OK | 0.95 |
| Moz / Bing / DataForSEO | Not configured | n/a |

Limitation: CC does not give referring-domain counts or link lists. "Not in CC" means not in the Jan-Mar 2026 graph; it does not mean zero backlinks.

## Common Crawl comparison
| Domain | In crawl | Harmonic centrality (rank) | PageRank (rank) |
|---|---|---|---|
| penelopesocial.com | No | none | none |
| penelopebakehouse.com | No | none | none |
| bartholomewbakery.com (local competitor) | Yes | 14,256,480 (4,308,272) | 8.05e-09 (7,228,123) |

Referring-domain counts: not obtainable at this tier. The competitor has a minimal-but-present footprint (about the 4.3M-rank tier, 2 hosts). That is modest, but both Penelope domains are absent from the graph.

## Cross-link relationship (Parsed, 0.95)
- penelopesocial.com homepage links out to penelopebakehouse.com; penelopebakehouse.com links back to www.penelopesocial.com. This is a reciprocal sister-brand link, expected and low risk.
- The Bakehouse site also links to the Social TikTok (@penelope.social). Redirects normalise http and www to https://penelopesocial.com.
- Only the homepage was checked, so I can't say how many internal pages carry the cross-link. Link equity between two near-zero-authority domains is negligible. The value is brand and user navigation.
- Repo note: /sourdough-bakery 301s to /bakery-vaughan, deliberately not to penelopebakehouse.com. Good: it keeps the Vaughan bakery page as a local-relevance asset.

## Findings
| # | Severity | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| 1 | High | Neither Penelope domain appears in the Common Crawl graph, so there is no measurable link authority. | CC lookups returned in_crawl=false for both. The competitor is present. | Treat the profile as thin/unverified. Get actual numbers free: add the site to Google Search Console (Links report) and Bing Webmaster Tools, then re-run with a Moz free key (2,500 rows/month). |
| 2 | Medium | No evidence of editorial or local citations. Unverified. | Not observable at Tier 0. Only the outbound links on the sites were seen. | Run the local link-building list below. |
| 3 | Medium | The outbound profile is mostly third-party platforms (Toast, Google Maps, Instagram, TikTok), so no earned-link signals are visible. | Parsed homepage hrefs. | Ensure the Google Business Profile and Instagram bios link to the right domain, since these are the strongest brand-owned citations. |
| 4 | Low | The sister-domain reciprocal link is fine. | See above. | Keep it. Use descriptive anchors ("Penelope Bakehouse, Scarborough") rather than generic text. |
| 5 | Low | Toxic-link risk cannot be assessed. | No spam score source. | Check GSC for manual actions. No action is warranted for a small local business without evidence. |

## Local link opportunities (proportionate, not verified as existing)
Priority order; I did not verify whether listings exist.
1. Google Business Profile (both locations), Yelp, TripAdvisor: claim and complete NAP, with a website link. Highest value for the effort, though Yelp and TripAdvisor links are nofollow-ish brand citations.
2. Vaughan Chamber of Commerce: membership gives a directory link. Also consider the Woodbridge BIA, if one applies, and Vaughan tourism/Taste of Vaughan events.
3. blogTO (cafe/bakery roundups, new-opening or "best of" lists) and Vaughan Today / local news: pitch with a hook (new Hawkview Blvd location, sourdough/focaccia, seasonal menu). Earned, so slow.
4. Local food bloggers and Instagram creators in Vaughan/GTA/Scarborough: tasting invites with a link to the menu page.
5. Supplier, event and catering partners (venues, local suppliers): they can link from "where to buy" or vendor pages, which fits the catering-events page.
6. Toronto/GTA bakery and brunch lists on Reddit and Eater-style sites: lower control, opportunistic.

Avoid: paid link packages and generic directory spam; not needed at this scale.

## Next steps
- Re-run with GSC/Bing exports or a Moz key to produce a real score.
- For on-page and E-E-A-T, see `/seo content`; for crawlability, `/seo technical`.
