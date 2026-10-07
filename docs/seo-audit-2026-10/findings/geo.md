# GEO / AI Search Readiness: penelopesocial.com

Audit date: 2026-10-06. Scope: AI crawler access (robots.txt + live Cloudflare behaviour), /llms.txt, passage citability of key pages, entity clarity, off-site brand signals, and likely citation for three target prompts. No repo source was edited.

## AI Search Readiness Score: 71 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 78 | 19.5 |
| Structural readability | 20% | 82 | 16.4 |
| Multi-modal content | 15% | 60 | 9.0 |
| Authority and brand signals | 20% | 55 | 11.0 |
| Technical accessibility | 20% | 75 | 15.0 |
| **Total** | | | **71** |

Platform estimates (judgement calls, not measured visibility):

| Platform | Score | Main driver |
|---|---|---|
| Google AI Overviews / AI Mode | 72 | Googlebot allowed, full SSR, rich Restaurant/Menu/FAQ schema, 4.7 from 600+ Google reviews. Held back because the site never calls itself an Italian restaurant, and there is no brunch content |
| ChatGPT Search | 62 | OAI-SearchBot and ChatGPT-User get 200. Few third-party mentions (no TripAdvisor or Wikipedia, one Reddit thread) |
| Perplexity | 64 | PerplexityBot and Perplexity-User get 200. Perplexity leans heavily on Reddit and Yelp, where the brand only shows up thinly |
| Bing Copilot | 63 | bingbot allowed. Sitemap has no `<lastmod>` and IndexNow was not found |

No DataForSEO tools were available, so live ChatGPT visibility was not measured. The query checks below use Brave Search SERPs as a stand-in.

---

## What works

- **Server-side rendered (Astro), not a client-side app.** `is_spa=false`. Every key page returns its full text, JSON-LD and FAQ in the first HTML response (about 100 KB). AI crawlers do not need to run JavaScript.
- **Search and retrieval bots can get in.** OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot, bingbot, Applebot, DuckAssistBot, meta-externalagent and MistralAI-User all got 200 with the full page. I tested `/`, `/pizza-vaughan` and `/robots.txt` with each bot's user agent.
- **The landing pages are very citable.** /pizza-vaughan, /sandwiches-vaughan, /cafe-in-vaughan and /bakery-vaughan each have 6 to 8 FAQ answers that work on their own. Each answer leads with the name and address, then gives concrete prices. Examples: "$19 to $23. The Italian, Calabrese and The Canadian are $20…", "Lunch is Roman-style sourdough sold by the slice, cold-fermented for 48 hours, at $6 to $7 a slice. Dinner is 14-inch New York-style pies… from $25 to $31", "Classic sourdough loaves are $9…". This is the kind of factual, quotable passage answer engines pull out.
- **Comparison tables** (sourdough vs regular pizza, focaccia vs sub, cafe vs bar, sourdough vs supermarket bread) are in semantic HTML. Answer engines lift tables like these directly.
- **Entity basics are stated plainly and consistently.** Name, address (125 Hawkview Blvd, Woodbridge, ON L4H 2E2), phone, split cafe/bar hours, and the "Woodbridge is in Vaughan" link all appear in visible copy, JSON-LD and llms.txt.
- **Schema graph.** Restaurant (`servesCuisine: Italian, Pizza, Cafe`, geo, hasMenu, `acceptsReservations`), Cafe and BarOrPub departments with their own hours, Penelope Bakehouse as `supplier`, Menu/MenuItem/Offer on the landing pages, and FAQPage.
- **Founder story.** The Stalteri brothers (Franco, Vince, Giuliano) are named, and the origin of the starter (Anastasia renamed Penelope, 2018) is told consistently on /about, /pizza-vaughan and /bakery-vaughan. Streets of Toronto (2025-05-06) repeats the same story.
- **Content images have descriptive alt text** ("Sourdough pizza squares at Penelope Social", "Two catering trays of focaccia sandwiches"). The empty `alt=""` values are on 68px menu thumbnails, which is fine for decorative images.
- **/llms.txt exists (200, text/plain).** Its name, address, phone and hours match the site exactly.

---

## AI crawler access status

robots.txt is just `User-agent: * / Allow: / / Disallow: /api/` plus the sitemap. It has no bot-specific rules and no Cloudflare Content-Signals. Cloudflare then overrides it for some bots, as the live tests show:

| Crawler | Governs | robots.txt | Live response (spoofed user agent) |
|---|---|---|---|
| OAI-SearchBot | ChatGPT Search citations | Allowed | **200** |
| ChatGPT-User | ChatGPT fetches a page for a user | Allowed | **200** |
| GPTBot | OpenAI model training only | Allowed | **403 "Your request was blocked."** |
| Claude-SearchBot | Claude search citations | Allowed | **200** |
| Claude-User | Claude fetches a page for a user | Allowed | **200** |
| ClaudeBot | Anthropic model training only | Allowed | **403** |
| PerplexityBot | Perplexity index | Allowed | **200** |
| Perplexity-User | Perplexity fetches a page for a user | Allowed | **200** |
| Googlebot | Google Search and AI Overviews | Allowed | **200** |
| Google-Extended | Gemini/Vertex training and grounding (robots.txt token only, not a real user agent) | Allowed | n/a (the token is never sent as a user agent) |
| bingbot | Bing and Copilot | Allowed | **200** |
| Applebot | Siri/Spotlight/Safari | Allowed | **200** |
| Applebot-Extended | Apple Intelligence training (robots.txt token only) | Allowed | n/a |
| CCBot | Common Crawl (training corpora) | Allowed | **403** |
| cohere-ai | Cohere training | Allowed | **403** |
| Bytespider | ByteDance training | Allowed | **403** |
| Amazonbot | Amazon (training, plus Alexa/Rufus answers) | Allowed | **403** |
| meta-externalagent | Meta AI training | Allowed | **200** |
| DuckAssistBot | DuckDuckGo AI answers | Allowed | **200** |

The 403 comes from Cloudflare (`server: cloudflare`, a 25-byte plain-text body, no challenge page). It looks like Cloudflare's "Block AI bots / AI Scrapers and Crawlers" setting. **Even /llms.txt returns 403 to GPTBot.** Caveat: I sent spoofed user agents from a non-verified IP. Cloudflare's AI-bot rule matches on user agent, so the real crawlers are almost certainly blocked too, but only the Cloudflare Security Events log can confirm that.

---

## Findings

### F1. Cloudflare blocks AI training crawlers while robots.txt says "allow all" (Medium)
- **Evidence:** GPTBot, ClaudeBot, CCBot, cohere-ai, Bytespider and Amazonbot all get 403 on `/`, `/pizza-vaughan`, `/about` and `/llms.txt`, but get 200 on `/robots.txt`. robots.txt itself names no bots. meta-externalagent (also a training crawler) is *not* blocked, so the policy is inconsistent.
- **Impact:** Search citations are not affected, because OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot and bingbot all get through. What is affected is presence in future model training data (GPTBot, ClaudeBot, CCBot). For a small local restaurant, training data is how a model "knows" the brand when it answers without searching. Amazonbot also feeds Alexa+ and Rufus answers.
- **Recommendation:** Decide on purpose. For a local restaurant that wants to be recommended, **allowing** training crawlers is usually the better trade: the content is public marketing copy. Either turn off Cloudflare's AI-bot block (Security > Bots), or allow GPTBot, ClaudeBot, CCBot and Amazonbot specifically. Then make robots.txt state the same policy as Cloudflare enforces, so the two stop contradicting each other. If the client prefers to block training, add explicit `Disallow` groups for those bots in robots.txt and block meta-externalagent too, so the stated and enforced policies match. **Effort:** 15 minutes in the Cloudflare dashboard.

### F2. /llms.txt contains internal dev/ops notes and leaves out the three main landing pages (Medium)
- **Evidence:** The file includes instructions written for the developer, not for AI readers: "Do not rename catering-events to /catering (that would collide with /menus/catering)", "Submit only https://penelopesocial.com/sitemap-index.xml on sc-domain:penelopesocial.com", "Request indexing for /contact is a GSC click after submit", "Woodbridge is the city in titles and addressLocality". Its Site list leaves out /pizza-vaughan, /sandwiches-vaughan and /cafe-in-vaughan, which are the pages most likely to be cited. It has no cuisine, price range, signature items, founders, or Google rating.
- **Accuracy check:** Name, address, phone, email, cafe/bar hours, the Bakehouse address and phone, and the Toast order/gift card URLs all match the site and JSON-LD. One wording issue: "Woodbridge is the city" is wrong. Woodbridge is a community inside the City of Vaughan.
- **Recommendation:** Rewrite it as a public summary. Start with a one-paragraph description ("Penelope Social is an Italian-leaning cafe and cocktail bar in Woodbridge, Vaughan, Ontario, run by the Stalteri brothers. Sourdough focaccia sandwiches ($19 to $23) and Roman-style pizza by the slice ($6 to $7) at lunch; 14-inch sourdough pies ($25 to $31), shareables and cocktails at night…"). List every landing page with a one-line description, and add Google rating, founders and any aliases (see F4). Move the routing and GSC notes into the repo (a README or code comments). **Effort:** 30 minutes.

### F3. The site never calls itself an Italian restaurant and has no brunch content, so it misses two of the three target prompts (High)
- **Evidence:**
  - Homepage title: "Cafe and bar in Woodbridge". Homepage H1: "Good food, better company…". The visible homepage copy uses "Italian" only once, in the "Italian sandwiches" FAQ. "Italian" appears in the visible text of /about, /pizza-vaughan, /bakery-vaughan and /locations/woodbridge zero times. The only claim of Italian cuisine is `servesCuisine` in the JSON-LD.
  - **"brunch" appears 0 times on every page fetched.** Sunday hours are 8am to 12pm (cafe only).
  - On Brave, "best Italian restaurant Vaughan" returns six or more r/Vaughan threads, TripAdvisor, OpenTable, yorkregion.com and full-service Italian restaurants (Trimani, Cantina Amici, Osteria Gente, Zizi, Nascosto, Il Forno). Penelope Social is not in the top 20. "brunch Vaughan" returns OpenTable, Visit Vaughan's "Brunch spots and delicious bakeries" (no Penelope), r/Vaughan threads, Eggstatic and Evviva. Penelope is absent.
- **Likely AI answers:**
  - **"focaccia sandwich Vaughan": high chance of citation.** penelopesocial.com is the #1 organic result on Brave, with /menus and /menus/lunch also ranking. It also appears through Instagram reels and a @marcelloeats TikTok. /sandwiches-vaughan is not ranking yet, and the homepage ranks in its place.
  - **"best Italian restaurant Vaughan": low chance.** The site presents itself as a cafe and bar, "best" prompts are answered from listicles and Reddit, and the site does not say in plain text that it is an Italian restaurant.
  - **"brunch Vaughan": very low chance.** There is no brunch content, and Penelope does not appear on any brunch list.
- **Recommendation:**
  1. Add a factual definition passage of about 40 to 60 words near the top of the homepage and /about. For example: "Penelope Social is an Italian-inspired cafe and cocktail bar at 125 Hawkview Blvd in Woodbridge, Vaughan. By day: espresso, Bakehouse pastries, sourdough focaccia sandwiches and Roman-style pizza by the slice. By night: 14-inch sourdough pies, Italian shareables, Italian wine, amari and cocktails." Consider putting "Italian" into the homepage title and meta description ("Italian cafe and bar in Woodbridge, Vaughan").
  2. Add an FAQ: "Is Penelope Social an Italian restaurant?" Answer it honestly, along the lines of "an Italian-leaning cafe and bar, not a white-tablecloth trattoria", and name the Italian dishes, wines and amari.
  3. Brunch: **only target it if the client actually serves brunch.** If Sunday 8am to 12pm is coffee and pastries, write that answer instead ("Is there brunch? We serve coffee, pastries and … on Sunday mornings from 8am; the full lunch menu runs Mon to Sat from 10am") and target "breakfast / coffee Vaughan". If they do serve brunch, give it its own menu section and FAQ, and pitch Visit Vaughan to add Penelope to its brunch round-up.
- **Effort:** 1 to 2 hours of copy in Sanity.

### F4. The brand is split across names and handles, which muddies entity resolution (High)
- **Evidence:**
  - blogTO (June 2026, `/eat_drink/2026/06/penelope-focacceria-toronto/`) covers the business as **"Penelope Focacceria"**, a sourdough bakery "that operates out of the restaurant in the mornings" at Penelope Social, with Instagram **@penelope.focacceria**. The site never uses the name "Penelope Focacceria". It calls the Scarborough shop "Penelope Bakehouse… bakehouse and focacceria".
  - **Two Instagram accounts are linked from the site.** The JSON-LD `sameAs` points to `instagram.com/penelopesocial`, while the footer and the bakery card link to `instagram.com/penelope.social`. Both return 200.
  - **The site links two different Google place IDs.** The directions link uses `0x882b2f5c52cae66f:0xd9f3c33a869788c9`, and the "4.7, 600+ reviews on Google" badge uses `0x882b2f14f3cd3fbb:0x3e54ffff5191a9bd`. This could mean a duplicate Google Business Profile (GBP) listing.
  - Mindtrip.ai lists the restaurant under **"thornhill-ontario"**. Several scraper directories exist (menu-world, wheree, restaurants-us, nears.me, novacircle).
  - Streets of Toronto (2025-05-06) names a sister restaurant, **Artigianale Ristorante & Enoteca**. The site never mentions it, and /about's "nearly lost it while opening the restaurant" never says which restaurant.
- **Recommendation:**
  1. Confirm with the client which Instagram account is official. Use it everywhere, and add the other (if it is still active) to `sameAs` only if it belongs to the business.
  2. Open both Google place IDs. If there is a duplicate GBP, merge it or report it, and point both links at the canonical place.
  3. Add a "Formerly Penelope Focacceria" line plus an FAQ ("Is Penelope Focacceria the same as Penelope Social / Bakehouse?") on /about and in llms.txt. Use `alternateName` in the Restaurant or Bakery JSON-LD, whichever applies.
  4. Add `foundingDate`, `founder` (Person entries for the three brothers), and an opening year for Social on /about. Today the timeline jumps from 2018 to 2024 without ever saying when Social opened.
  5. If the client agrees, mention Artigianale as the family's Italian restaurant. That is genuine Italian-restaurant authority the site currently doesn't use.
  6. Ask Mindtrip to correct its listing to Woodbridge/Vaughan.
- **Effort:** 2 to 3 hours, plus client confirmation.

### F5. Thin third-party footprint (Medium)
- **Evidence (Brave, 2026-10-06):**
  - Present: Yelp (`yelp.ca/biz/penelope-social-woodbridge`), Visit Vaughan / York Durham Headwaters directory, one Reddit thread (`r/Vaughan "Is Penelope Social worth trying?"`; Reddit blocked automated fetches, so I could not read its sentiment), Streets of Toronto feature, blogTO (on the Focacceria/Bakehouse), stephaniedickison.com, Wanderlog, Uber Eats, Indeed/Glassdoor, TikTok creator content (@marcelloeats), and 4.7 from 600+ Google reviews (homepage badge).
  - Not found: TripAdvisor listing, Wikipedia/Wikidata entity (Wikidata search returned nothing), YouTube coverage, OpenTable (it uses Toast Tables), Facebook in `sameAs`. Not mentioned on Visit Vaughan's brunch list or in the r/Vaughan "best Italian" and "Italian sandwich" threads that rank for the target queries. I could only check those threads through SERP titles because Reddit blocked fetching, so this needs a manual look.
- **Recommendation:** Claim and complete TripAdvisor. Pitch Visit Vaughan and yorkregion.com for their Italian/sandwich/brunch round-ups. Get a short YouTube video posted (owner story or making focaccia), since YouTube mentions correlate most strongly with AI citation. Expand `sameAs` to Yelp, TripAdvisor, the canonical Instagram, TikTok, Facebook (if one exists) and the GBP URL. A Wikidata item is optional; it is low effort but needs notability sources (the Streets of Toronto and blogTO articles help). **Effort:** ongoing; 2 to 4 hours to set up.

### F6. Restaurant schema `image` is the favicon, and `priceRange` is missing (Low)
- **Evidence:** `"image":"https://penelopesocial.com/favicon-192.png"`. There is no `priceRange` anywhere. No `aggregateRating` is set, which is correct: self-serving ratings are not eligible.
- **Recommendation:** Set `image` to two or three real photos (interior, sandwich, pizza; 1200px or wider), add `"priceRange": "$$"` (or "$10–$30"), and add `founder`/`foundingDate` (F4). **Effort:** 15 minutes.

### F7. The homepage has the weakest passages of the key pages (Low-Medium)
- **Evidence:** The homepage has about 330 words of extractable text. Outside the FAQ it is all marketing lines ("Good food, better company", "Take a shirt home from Social", with the merch marquee repeated six times). It has no definition passage and no prices (prices appear only on the landing pages).
- **Recommendation:** Add the definition paragraph from F3 and a short "What's good here" block (three signature items with prices) linking to /sandwiches-vaughan, /pizza-vaughan and /cafe-in-vaughan. These pages are not ranking on Brave yet; the homepage ranks in their place. **Effort:** 1 hour.

### F8. Freshness signals are weak (Low)
- **Evidence:** `sitemap-0.xml` has no `<lastmod>`. The pages have no visible "updated" date. The renderer picked up `publication_date: 2026-01-01` on most pages, which is a placeholder-looking date. Brave still indexes `/sourdough-bakery` (a 301) and several `www.` URLs, which suggests recrawls are slow.
- **Recommendation:** Emit `<lastmod>` from Sanity `_updatedAt`. Add "Menu updated <month year>" to the menu pages. Set up IndexNow (Cloudflare Crawler Hints, one toggle) so Bing, and through it Copilot and ChatGPT, pick up changes faster. **Effort:** 30 to 60 minutes.

### F9. No video or other multimedia beyond photos (Low)
- **Evidence:** No embedded video, no YouTube channel found, no VideoObject. TikTok and Instagram reels exist, but answer engines rarely cite them.
- **Recommendation:** Embed one or two short videos (the starter story, focaccia being pulled) with VideoObject schema, and post the same videos to YouTube. **Effort:** depends on available footage.

---

## Top 5 highest-impact changes

1. **Say plainly that it is an Italian-leaning cafe and bar,** and answer the brunch question honestly (F3, F7). Homepage and /about definition passage, title tweak, FAQ. *1 to 2 h.*
2. **Merge the brand names and profiles** (F4): one Instagram account, check the two Google place IDs for a duplicate GBP, add "Penelope Focacceria" as `alternateName` with an FAQ, add founder/foundingDate and Social's opening year. *2 to 3 h, plus client input.*
3. **Clean up and expand /llms.txt** (F2): remove the dev/GSC notes, add a description, the landing pages, prices, founders and aliases. *30 min.*
4. **Make the Cloudflare AI-bot policy deliberate and match robots.txt** (F1). Unblock GPTBot, ClaudeBot, CCBot and Amazonbot, or block them in robots.txt as well. *15 min.*
5. **Build third-party presence** (F5): TripAdvisor, local round-up pitches (Visit Vaughan, yorkregion.com), one YouTube video, expanded `sameAs`. *Ongoing.*

---

## Structured findings (for audit-data.json, category "AI Search Readiness")

```json
{
  "category": "AI Search Readiness",
  "score": 71,
  "dimensions": {"citability": 78, "structural_readability": 82, "multimodal": 60, "authority_brand": 55, "technical_accessibility": 75},
  "platform_scores": {"google_aio": 72, "chatgpt_search": 62, "perplexity": 64, "bing_copilot": 63},
  "llms_txt": "present_with_issues",
  "findings": [
    {"id": "GEO-1", "severity": "medium", "title": "Cloudflare 403s AI training crawlers (GPTBot, ClaudeBot, CCBot, cohere-ai, Bytespider, Amazonbot) while robots.txt allows all; meta-externalagent not blocked", "evidence": "curl with each UA: 403 'Your request was blocked.' on /, /pizza-vaughan, /about, /llms.txt; 200 on /robots.txt", "recommendation": "Choose a policy deliberately; preferably unblock training bots for a local restaurant, and make robots.txt match Cloudflare"},
    {"id": "GEO-2", "severity": "medium", "title": "llms.txt contains internal dev/GSC notes and omits /pizza-vaughan, /sandwiches-vaughan, /cafe-in-vaughan", "evidence": "'Do not rename catering-events...', 'Submit only ... on sc-domain:penelopesocial.com', 'Request indexing for /contact is a GSC click'", "recommendation": "Rewrite as a public summary with description, prices, founders, aliases, all landing pages"},
    {"id": "GEO-3", "severity": "high", "title": "No visible 'Italian restaurant' claim and zero 'brunch' content; absent from 'best Italian restaurant Vaughan' and 'brunch Vaughan' results", "evidence": "Homepage title 'Cafe and bar in Woodbridge'; 'brunch' appears 0 times on every page fetched; Brave top 20 for both queries has no Penelope", "recommendation": "Add an Italian-cafe-and-bar definition passage and FAQ; answer the brunch question honestly"},
    {"id": "GEO-4", "severity": "high", "title": "Entity fragmentation: 'Penelope Focacceria' alias (blogTO), two Instagram handles, two Google place IDs, Mindtrip lists Thornhill", "evidence": "sameAs instagram.com/penelopesocial vs footer instagram.com/penelope.social; place IDs 0x882b2f5c52cae66f:0xd9f3c33a869788c9 vs 0x882b2f14f3cd3fbb:0x3e54ffff5191a9bd", "recommendation": "Consolidate handles and GBP, add alternateName, founder, foundingDate, Social's opening year"},
    {"id": "GEO-5", "severity": "medium", "title": "Thin third-party footprint: no TripAdvisor, Wikidata or YouTube; one Reddit thread", "evidence": "Brave SERPs 2026-10-06; Wikidata search empty", "recommendation": "Claim TripAdvisor, pitch local round-ups, publish YouTube video, expand sameAs"},
    {"id": "GEO-6", "severity": "low", "title": "Restaurant schema image is favicon-192.png; no priceRange", "evidence": "JSON-LD @id #restaurant", "recommendation": "Use real photos; add priceRange, founder, foundingDate"},
    {"id": "GEO-7", "severity": "low", "title": "Homepage passages are thin marketing lines; landing pages not yet ranking (homepage ranks in their place)", "evidence": "About 330 extractable words; Brave ranks / for 'focaccia sandwich Vaughan' and 'sourdough pizza Vaughan'", "recommendation": "Add definition paragraph and signature-items block linking to landing pages"},
    {"id": "GEO-8", "severity": "low", "title": "No sitemap lastmod or visible updated dates; stale URLs still indexed", "evidence": "sitemap-0.xml has no <lastmod>; Brave indexes /sourdough-bakery and www URLs", "recommendation": "Emit lastmod from Sanity _updatedAt; enable IndexNow/Crawler Hints"},
    {"id": "GEO-9", "severity": "low", "title": "No video content or VideoObject", "evidence": "No embeds; no YouTube channel found", "recommendation": "Embed short videos with VideoObject and post them to YouTube"}
  ]
}
```

## Method notes and limitations
- Bot tests sent spoofed user agents from a residential IP. Verified-bot IP behaviour should be confirmed in Cloudflare Security Events.
- I did not have WebSearch, and DuckDuckGo/Bing scraping failed, so brand and query research used Brave Search SERP HTML. Rankings differ by engine and location (Google results were not checked).
- Reddit and Yelp blocked automated fetches, so their content and sentiment could not be read. Only their presence was confirmed.
- No live ChatGPT or Perplexity prompts were run (no DataForSEO). The citation likelihood figures are inferences from crawler access, page content and SERP presence.
