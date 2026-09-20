# SEO audit & content plan — Penelope Social + Penelope Bakehouse

Date: 2026-09-19 (v2 — rewritten against first-party Search Console + GA4 data)
Tooling: OpenSEO — site crawl, Search Console, GA4, DataForSEO keyword/SERP/competitor data, Google Business Profile

OpenSEO projects:
- Penelope Social — `f47f5443-8964-4be5-949d-b03157c3d7ac`
- Penelope Bakehouse — `c9c689c3-cd37-41bc-8ac9-fec1411a8e55`

**Data windows.** Search Console: 2026-08-19 → 09-16 (28 days). GA4: both properties were
created 2026-08-28, so GA4 covers roughly three weeks and has **no previous period to compare
against**. Bakehouse organic sessions by week ran 2 → 94 → 415 → 325, i.e. still ramping. Read
every GA4 number as an early baseline, not a trend.

---

## 1. The single biggest finding: the two sites are fighting over the Bakehouse's brand

Search Console shows **penelopesocial.com outranking penelopebakehouse.com for the Bakehouse's
own name**, and converting those searches at roughly one-eighth the rate.

Same queries, both properties, same 28 days:

| Query | On penelopesocial.com | On penelopebakehouse.com |
| --- | --- | --- |
| penelope bakehouse | 2,896 impr · 46 clicks · **1.6%** · pos 5.4 | 926 impr · 112 clicks · **12.1%** · pos 4.2 |
| penelope bakehouse menu | 1,657 · 41 · **2.5%** · pos 4.9 | 130 · 13 · **10.0%** · pos 5.4 |
| penelope bakery scarborough | 377 · 3 · **0.8%** · pos 6.3 | 550 · 93 · **16.9%** · pos 2.9 |
| penelope bakehouse scarborough | 337 · 4 · **1.2%** · pos 7.7 | 101 · 27 · **26.7%** · pos 3.6 |
| penelope bakehouse reviews | 320 · 4 · 1.3% · pos 6.7 | 8 · 0 · — · pos 7.3 |
| penelope bake house | 50 · 2 · 4.0% | 30 · 8 · 26.7% |
| penelopes bakehouse | 32 · 2 · 6.3% | 16 · 2 · 12.5% |
| **Totals** | **5,669 impr · 102 clicks · 1.8%** | **1,761 impr · 255 clicks · 14.5%** |

The wrong domain is taking **76% of the impressions** on the Bakehouse's brand and converting
them at about **one-eighth** the click-through rate.

**The page doing it is `/sourdough-bakery`** — the orphaned page flagged in v1. It is now the
highest-scoring opportunity in the whole account:

> `/sourdough-bakery` — **7,620 impressions, 60 clicks, 0.79% CTR, average position 5.2**, and
> only 31 GA4 sessions. Opportunity score 83/100.

A page nothing links to is pulling 7,600 impressions a month and wasting essentially all of
them. Its title ("Bakehouse sourdough, served here") and Social's `/locations/scarborough` page
are both bidding for Bakehouse-brand queries from the wrong domain.

**Rough upside.** If those 5,669 impressions landed on penelopebakehouse.com and behaved like
its existing brand traffic (14.5% CTR), that is on the order of **800 clicks per 28 days rather
than 102**. Hedge that properly — consolidating changes positions, and not every impression
transfers — but the Bakehouse currently gets 838 organic sessions in total, so fixing this is
plausibly the difference between its current traffic and roughly double it. Nothing else in
this document is worth as much.

**Options, in the order I'd consider them:**
1. Retitle `/sourdough-bakery` so it stops competing on the Bakehouse's name — make it about
   Social's use of the bread ("The sourdough we serve") rather than about the Bakehouse — and
   put a prominent above-the-fold link to penelopebakehouse.com. Fixes the orphan at the same
   time by linking it from `/about` and `/menus`.
2. Same for `/locations/scarborough`: keep it as a pointer, not a destination.
3. If the split persists after that, `noindex` the Social-side Scarborough pages and let the
   Bakehouse domain take the queries outright.
4. Strengthen penelopebakehouse.com's own brand signals (title, H1, sitemap — see §2).

I'd start with 1 and 2 and re-measure in three weeks before reaching for 3.

**Update 2026-09-19: options 1 and 2 are shipped.**

| Page | Was | Now |
| --- | --- | --- |
| `/locations/scarborough` | `Scarborough Bakehouse \| Penelope Bakehouse` | `Scarborough \| Penelope Social` |
| `/locations/scarborough` H1 | `Penelope Bakehouse` | `Our Scarborough bakehouse` |
| `/sourdough-bakery` | `Bakehouse sourdough, served here \| Penelope Social` | `Sourdough and focaccia in Woodbridge \| Penelope Social` |
| `/sourdough-bakery` H1 | `Bakehouse sourdough, served here` | `The sourdough we serve` |

Both meta descriptions were rewritten so "Penelope Bakehouse" no longer appears in the first 60
characters. The handoff is untouched — body copy, CTAs and the Website row still point at
penelopebakehouse.com, and the `/locations` hub card still reads "Penelope Bakehouse", which is
the right label beside "Penelope Social".

`/sourdough-bakery` is also **no longer orphaned**: `/about` now links to it from the "Inside the
bake" section. It had no inbound link because `isBakeryNav` strips the legacy "Bakery" nav row
deliberately, so a contextual link was the right fix rather than re-adding a nav item.

**Not yet done:** option 3 (noindex) is deliberately held back — it is the escalation if the
retitle alone does not move the numbers. Option 4 (Bakehouse brand signals) is still open and
overlaps with the title-length fixes in §2.

---

## 2. Technical crawl

Both crawls re-ran clean: no broken links, no server errors, no missing/duplicate titles or
descriptions, no canonical conflicts, no redirect chains.

### Penelope Bakehouse — a real sitemap bug

Search Console URL inspection returned:

| URL | Coverage state |
| --- | --- |
| `/menu` (singular) | **"Discovered – currently not indexed"**, and listed in `sitemap.xml` |
| `/menus` (the real route, in the nav) | **"URL is unknown to Google"** |
| `/blog` | **"URL is unknown to Google"** |

So Google has been told about a `/menu` URL that the repo does not generate, and has **never
seen the actual menu hub**. GA4 confirms the damage: **63 organic sessions landed on `/menu`
with 22% engagement and zero key events**, against 80% engagement and a 13.4% conversion rate
on the homepage.

The repo config is correct — `astro.config.mjs` lists `/menus` in its `INDEXABLE` set. So the
**live sitemap is stale**, and the likely cause is in `sitemapXmlAlias()`:

```js
try {
  await access(dest)
  return        // <- bails out if dist/sitemap.xml already exists
} catch { /* write below */ }
```

On any build where `dist/` is not cleaned first, an older `sitemap.xml` survives untouched and
keeps being served. That matches the symptom exactly.

**Fix:** always overwrite `dest` instead of returning early, rebuild clean, resubmit
`sitemap.xml` in Search Console, and request indexing for `/menus`. This is a small change with
a large blast radius — the entire menu section is currently invisible to Google.

Remaining Bakehouse issues: 3 thin pages (`/menus` 120 words, `/menus/pizza` 143, `/locations`
145) and 7 titles over 60 characters (`/menus` 77, homepage 74, `/about` 74).

### Penelope Social

Unchanged from v1: `/sourdough-bakery` orphaned (see §1), 6 thin pages (`/menus` 99 words,
`/merchandise` 94, the three product pages, `/locations` 128), 17 heading-order skips, 3 long
titles, 3 long meta descriptions. Still **no blog route or schema**.

One new item: Search Console reports some pages indexed under the **`www.` hostname**
(`www.penelopesocial.com/merchandise`, `/catering-events`, `/merchandise/tote-bag`,
`/merchandise/t-shirt`) separately from the canonical non-www versions. Low volume, but worth
confirming the www → apex redirect covers every route.

---

## 3. Measurement: Social is recording nothing

| | Penelope Social | Penelope Bakehouse |
| --- | --- | --- |
| Organic sessions (28d) | 1,946 | 838 |
| Engagement rate | 59.8% | 68.4% |
| **Key events** | **0** | **109** |
| Key events defined | `purchase`, `qualify_lead`, `close_convert_lead` | plus `order_click`, `get_directions`, `gift_card_click`, `newsletter_signup` |

The Bakehouse tracks what actually matters — 92 `order_click`, 10 `get_directions`, 4
newsletter signups, 3 gift-card clicks — giving it a **13.4% session-to-order-click rate** on
organic homepage traffic. That is a real conversion baseline to improve against.

Social reports **zero key events across 1,946 organic sessions**. **This is not missing tracking
code.** Social's instrumentation is near-identical to the Bakehouse's and in places richer:

- the same hostname-gated gtag bootstrap and beacon-on-click capture in `BaseLayout.astro`
- `data-ga-event="order_click"` on the nav, hero and drawer CTAs; `get_directions` in the footer
  and location blocks; `gift_card_click` on the Toast e-gift links
- plus `web/src/scripts/ga.ts`, a fallback binder (guarded by `__pbGaBound`, so it does not
  double-fire) that additionally recognises **reservation, catering, merch and `tel:` hrefs** —
  instrumentation the Bakehouse does not have

The gap is **GA4 property configuration only**. Social's three key events (`purchase`,
`qualify_lead`, `close_convert_lead`) are GA4/Ads defaults that nothing on the site fires, while
the events the site *does* send have never been marked as key events. They are being collected
as ordinary events and therefore never appear in any conversion report.

**Fix: GA4 Admin → Events → "Mark as key event"** on `order_click`, `get_directions` and
`gift_card_click` at minimum, plus reservation/catering/phone events if they are present. This
is a settings toggle measured in minutes, not a development task.

*Caveat:* the GA4 API only reports key events, so this analysis confirms the sending code exists
and the property config differs — it cannot confirm the events are arriving. Check Admin →
Events (or Realtime) first. If `order_click` is listed there, it is just the toggle; if it is
absent despite the code being present, that is a genuine bug to chase.

Until this is done, no page and no future article can be evaluated on outcomes.

**Update 2026-09-19:** done. Social now has 11 key events, including `order_click`,
`reservation_click`, `catering_click`, `get_directions`, `click_to_call`, `gift_card_click`,
`merch_click` and `newsletter_signup`. Note that marking a key event is **not retroactive** —
GA4 will not recount the historical window, so conversion data accrues from 2026-09-19 onward
and a usable baseline arrives in roughly two to three weeks.

**Open item on the Bakehouse, found while verifying the above:** the Bakehouse fires
`click_to_call` in code (`Footer.astro`, `VisitSection.astro`, `LocationDetails.astro`, both
location pages, and the inline capture in `BaseLayout.astro`) but has **not** marked it as a key
event — its list is `purchase`, `close_convert_lead`, `qualify_lead`, `order_click`,
`get_directions`, `gift_card_click`, `newsletter_signup`. Phone calls to a bakery are a real
conversion and none are being counted. Same toggle, other property. (`catering_click`,
`reservation_click` and `merch_click` do not apply there — no merch, no reservations, and
catering is a form page.)

---

## 4. Penelope Social — what the real data says

### The Italian gap is confirmed

v1 predicted this from keyword data alone. Search Console now proves the demand is real and
that Social is buried just below the fold:

| Query | Impressions | Avg position |
| --- | --- | --- |
| italian restaurant vaughan | 208 | **24.1** |
| italian restaurants vaughan | 93 | 19.2 |
| best italian restaurant vaughan | 60 | 17.8 |
| italian restaurant near me | 56 | 14.4 |
| italian sandwich vaughan | 57 | 6.7 |
| italian restaurants near me | 25 | 15.6 |
| best italian restaurant in vaughan | 22 | 14.0 |

Positions 14–24 means Google already associates the site with these terms but ranks nothing
well. The Google Business Profile reinforces the gap: categories are **Restaurant, Bakery,
Cocktail bar, Sandwich shop — no "Italian restaurant"**. The GBP description is currently
*"Penelope Social is an enigma, don't try and classify it."* — a 750-character field doing no
work at all.

### New discovery: brunch demand nobody is serving

Not visible in keyword tools, obvious in Search Console. Roughly **600 impressions across
brunch queries, all at positions 5–13**:

`brunch vaughan` 134 impr @ 10.5 · `brunch near me` 122 @ 9.0 · `brunch in vaughan` 95 @ 9.3 ·
`brunch spots vaughan` 53 @ 6.8 · `vaughan brunch` 37 @ 9.6 · `brunch` 25 @ 11.1 ·
`brunch places near me` 26 @ 6.6 · `brunch woodbridge` 24 @ 5.7 · plus a dozen smaller variants.

**Penelope Social has no brunch menu and no brunch page.** The Business Profile shows Sunday
hours of 9 a.m.–12 p.m. — a brunch-shaped window already exists. This is demand arriving at the
door with nothing to land on.

### The homepage has a click-through problem, not a ranking problem

| Query | Impressions | Position | CTR |
| --- | --- | --- | --- |
| restaurants in vaughan | 1,137 | 4.4 | 2.3% |
| vaughan restaurants | 899 | 4.2 | 2.0% |
| restaurants vaughan | 886 | 4.7 | 2.6% |
| best restaurants vaughan | 301 | 4.9 | 2.3% |
| restaurants near me | 2,934 | 9.3 | 1.0% |

~3,400 impressions sitting at positions 4–5 and converting at ~2%. Position 4–5 should earn
roughly 6–9%. The homepage overall does 48,241 impressions → 4,111 clicks (8.5%) at position
5.6, so the brand queries are carrying it while the category queries leak. Title and meta
description rewrites on the homepage are a cheap test here, independent of any article.

`/catering-events` is worse: **1,258 impressions, 5 clicks, 0.4% CTR at position 8.0**, and 6
GA4 sessions at 33% engagement. Demand exists; the page is not earning the click.

### Attribute queries where Social already ranks well

Small volumes, strong positions — evidence for an FAQ/"good to know" layer rather than articles:
`healthy restaurants vaughan` @ 1.4 · `casual restaurants vaughan` @ 1.1 · `gluten free
restaurants in vaughan` @ 1.5 · `dog friendly patios vaughan` @ 1.6 · `best family restaurants
vaughan` @ 1.3 · `kid friendly restaurants vaughan` @ 2.7 · `date night restaurants vaughan` @
2.7 · `hidden gem restaurants in vaughan` 122 impr @ 5.0.

### Noise worth knowing about

A Greek cluster (`greek restaurant vaughan` 66 impr @ 8.5, `greek food vaughan` 22 @ 13.8,
`greek restaurants vaughan`, `best greek restaurant vaughan` @ 3.7) is almost certainly the
name "Penelope" reading as Greek. It is mismatched traffic, not an opportunity — and a mild
argument for making the Italian positioning explicit.

---

## 5. Penelope Bakehouse — ranks fine, has no demand

The Bakehouse's problem is the inverse of Social's. It ranks **well** for non-brand terms and
gets almost no impressions for them:

| Query | Impressions | Position | Clicks |
| --- | --- | --- | --- |
| focaccia bread near me | 7 | **1.4** | 0 |
| best sourdough bread near me | 3 | **1.0** | 0 |
| fresh sourdough bread near me | 3 | 2.3 | 0 |
| italian bakery scarborough | 5 | 5.6 | 0 |
| bakery scarborough | 42 | 8.9 | 0 |
| bakery near me | 88 | 8.4 | 1 |
| italian bakery near me | 9 | 7.7 | 0 |

Position 1 on three impressions is not a win — it is a keyword nobody searches locally. The
homepage carries the whole site: **3,910 impressions, 495 clicks, 12.7% CTR, position 4.3**,
and **681 of 838 organic sessions (81%)** land there.

So the Bakehouse does not need better rankings. It needs **reasons for more people to search**,
which is exactly what content does — and it needs the `/menus` sitemap bug fixed so its product
pages can be indexed at all.

Also: a large tail of cake, cupcake, donut and dessert queries draws impressions at positions
20–66 with zero clicks. The Bakehouse does not sell cakes. Likewise several gluten-free bakery
queries. Mismatched impressions, safe to ignore.

**Business Profile:** claimed, 4.6★ / 74 reviews, 104 photos, menu synced with prices. Still
categorized **"Bakery" and nothing else** — no *Sandwich shop*, *Pizza restaurant*, *Cafe* or
*Italian restaurant*, despite sandwiches being the single most-mentioned review topic (30).
This remains the highest-value five-minute fix on either site.

---

## 6. Competitors

### bartholomewbakery.com — and what it proves

Bartholomew Bakery (467 Edgeley Blvd, Concord) has **~37,600 estimated organic traffic across
321 keywords**. Penelope Social has 114 keywords, nearly all brand. It out-ranks both Penelope
sites, and how it does it is the most useful thing in this audit.

**Half its playbook is local category terms:**
`bakery in vaughan` (1,900/mo, KD 1) @ 4 · `bakeries in vaughan` (1,900) @ 4 · `vaughan bakery`
(1,600, KD 0) @ 4 · `coffee shops in vaughan` (2,900, KD 0) @ 6 · `cafe in vaughan` (2,900,
KD 0) @ 14 · `desserts vaughan` (1,000) @ 9 · `best bakery vaughan` @ 2 · `best coffee in
vaughan` @ 6.

Penelope Social *is* a cafe and bar and ranks for **none** of the Vaughan cafe/coffee cluster.

**The other half is educational content about their own craft** — and this is the proof point:

| Their keyword | Volume | Their position |
| --- | --- | --- |
| **benefits of sourdough bread** | 1,900 | 26 |
| **sourdough bread benefits** | 1,300 | 22 |
| how to bake croissants | 1,300 | 9 |
| artisanal sourdough bread | 720 | 10 |
| does croissant have egg | 390 | 4 |
| are croissants healthy | 320 | 15 |
| what is an artisan bread | 260 | 9 |
| carbs in a croissant | 210 | 12 |
| where can i buy sourdough bread | 170 | 7 |
| sourdough bread vs regular bread | 70 | 6 |

A neighbourhood bakery built a whole informational layer around croissants and sourdough and it
is carrying a meaningful share of 37,600 visits. **This is the Bakehouse plan from v1, already
working, two suburbs away.**

The strategic opening: Bartholomew is **croissant-led and only ranks 22nd and 26th on the
sourdough-benefit terms**. Penelope Bakehouse is an actual sourdough specialist with a named
starter and a 24-hour ferment. Out-specialising them on sourdough is a winnable fight against a
page that is barely trying.

### Penelope Bakehouse's Scarborough competitors — you asked, here they are

From a SERP-competitor analysis across eight Scarborough bakery/sandwich/sourdough queries:

**The direct one: `francescabakery.com` — Francesca Italian Bakery, 2 Invergordon Ave,
Scarborough.** Ranks **#1 for both `italian bakery scarborough` and `bakery scarborough`**
(average position 1.0). It is the head-to-head competitor, and the Bakehouse currently sits at
positions 5.6 and 8.9 on those same terms.

Also real:
- **calabriabakery.ca** — #3 `italian bakery scarborough`
- **montmartrebakery.com** — #3 `bakery scarborough`
- **paninaro.ca** — #4 `focaccia sandwich near me`, #5 `italian sandwiches near me` — the closest thing to a direct focaccia-sandwich rival
- **micosandwiches.ca** (Mico Italian Sandwiches) — #5 `focaccia sandwich near me`
- Secondary: rusticbakery.ca, italianmarket.ca, buongiornocaffe.ca, subitosandwich.com

**Important caveat:** the top of these SERPs is not local businesses at all. **Yelp holds
positions 1–4 across six of the eight queries** (#1 for both `sourdough bread near me` and
`focaccia sandwich near me`), with Instagram, Facebook, TripAdvisor and Reddit close behind. For
"near me" queries, **the Yelp and Instagram profiles are the battleground, not the website.**
Claiming and filling out those profiles will move more than a blog post will.

---

## 7. Revised article plan

Changes from v1 are flagged. Every item now ties to measured impressions, not inference.

### 2026-09-20 refresh — read this before the briefs below

A second pass over the Search Console long tail (3-month window, striking-distance filters)
plus keyword sizing and SERP checks produced two new topics and one format change. The briefs
further down still stand except where noted here.

**Format change: brunch should be a page, not a post.** The `brunch vaughan` SERP is a local
pack plus *single-business pages* — Clementina at #4 with `clementinabrunch.com`, Eggstatic at
#7 with a dedicated `/vaughan-brunch-restaurant` page, Pür & Simple's location page at #9 on
`best breakfast in vaughan`. Google is not rewarding editorial here; it is rewarding businesses
with a brunch page. A `/brunch` route beats a blog post.

The cluster is also much bigger than the v2 estimate. Vaughan/Woodbridge brunch **and** breakfast,
all at **KD 0**:

| Keyword | Volume/mo |
| --- | --- |
| brunch vaughan | 2,900 |
| best brunch vaughan / best brunch in vaughan | 480 each |
| breakfast woodbridge | 480 |
| best breakfast in vaughan | 390 |
| breakfast places vaughan | 390 |
| brunch woodbridge | 390 |
| brunch kleinburg · sunday brunch vaughan · all day breakfast vaughan · best breakfast woodbridge · brunch vaughan mills | 70–90 each |

That is roughly **5,800/mo at KD 0**, against 544 impressions already landing at positions
6.9–10.2 over three months with nothing to land on. Direct competitor to study: Clementina, a
brunch-only spot that just opened in RioCan Colossus Centre, minutes from Social.

**New for Bakehouse — sourdough pizza.** The strongest find of this pass, and more distinctive
than the generic "pizza by the slice" brief below:

| Keyword | Volume/mo | KD | Bakehouse position |
| --- | --- | --- | --- |
| sourdough pizza | 2,900 | 11 | 4.5 (8 impressions) |
| sourdough pizza near me | 880 | **0** | 8.5 (10 impressions) |
| sourdough pizza toronto | 390 | **0** | — |
| sourdough pizza dough near me | 70 | 0 | — |

The `sourdough pizza near me` local pack returns Hamilton, Burnaby and Gloucester — Google has
almost no GTA options to show. Organic #4 is **Slowhand Sourdough Pizza** (Leslieville),
essentially the only Toronto player. Both Penelope sites make sourdough pizza and neither says
so in a way Google can index. This is an open niche with transactional intent and zero difficulty.

**New for Bakehouse — how to store sourdough bread.** 1,000/mo at **KD 0**. The SERP is an AI
overview, Reddit, The Clever Carrot, The Perfect Loaf — and at #9 **spentgoods.ca, a Canadian
food business**, so a bakery can rank. Ideal post-purchase content: it targets people who have
just bought a loaf, and it earns links from the sourdough community far more easily than a
health post.

**One sharp diagnostic for the Italian brief.** Over three months Social ranks **6.3 for
`italian sandwiches vaughan`** but **18.8 for `italian restaurants vaughan`** and 17.7 for
`best italian restaurant vaughan`. Google has classified it as a sandwich shop, not an Italian
restaurant. The article's job is to bridge that gap explicitly — the sandwich authority already
exists and is not transferring.

**Revised shortlist, highest expected return first:**

*Social* — 1) `/brunch` page (not a post) · 2) Italian in Vaughan · 3) Hidden gems / where to eat
in Vaughan · 4) Happy hour and late night. `hidden gem restaurants in vaughan` is worth calling
out: 590/mo at KD 0, and Social already sits at position 5.0 on 122 impressions.

*Bakehouse* — 1) Focaccia sandwich · 2) **Sourdough pizza** · 3) **How to store sourdough
bread** · 4) Sourdough benefits / 24-hour ferment. The "Italian bakery in Scarborough" brief
drops to fifth, but the retail/pantry gap inside it is still worth fixing on its own.


### Penelope Social

**1. Italian food in Vaughan: focaccia, sourdough pizza and what to order** *(confirmed)*
Evidence: 464 impressions across the Italian cluster at positions 14–24 (table in §4).
The demand is measured, not assumed. Pair the article with adding **"Italian restaurant" to the
Google Business Profile categories** and rewriting the GBP description, which currently says
nothing. Targets `italian restaurant vaughan` (8,100/mo, KD 1) and `italian restaurants in
woodbridge` (2,900, KD 8).

**2. Brunch in Vaughan: where to go, and what we serve Sunday morning** *(new — from GSC)*
Evidence: ~600 impressions across brunch queries at positions 5–13, with no brunch page and no
brunch menu. The clearest unserved demand on the site.
*Caveat worth raising with the client: this only works if there is something brunch-like to
sell. If a Sunday brunch offer is not on the cards, this becomes a "Sunday mornings at
Penelope" page instead — smaller, but still better than the nothing that exists now.*

**3. Happy hour and late night in Vaughan** *(confirmed, and stronger than expected)*
Evidence: `happy hour vaughan` 39 impr @ 7.2, `happy hour near me` 32 @ 7.6, `bars in vaughan
ontario` @ 3.3, `late night food vaughan` @ 2.6 — plus, tellingly, **`penelope social happy
hour` 40 impr at 35% CTR** and `penelope social happy hour menu` 20 impr. People are searching
the brand *plus* happy hour and there is no page for it. The bar runs to 1 a.m. Friday and
Saturday; the GBP flags cocktails as a notable highlight.
This one should probably be a permanent `/happy-hour` page, not just a post.

**4. Where to eat in Vaughan: a local's guide** *(retargeted from "Woodbridge" to "Vaughan")*
The v1 draft aimed at Woodbridge. Search Console shows the **Vaughan** variants carry far more
volume — ~3,400 impressions at positions 4–5 versus a few hundred for Woodbridge equivalents.
Same article, better target.
*Same tradeoff as v1:* it means linking to competitors. It works because generosity is what
outranks TripAdvisor and OpenTable, and Social holds local pack #1 on the Woodbridge variant
anyway. Drop this one if that is unwelcome — items 1–3 stand alone.

**Demoted from v1:** the catering article. `/catering-events` already gets 1,258 impressions at
position 8 and converts at 0.4%. That is a page-quality and CTR problem, not a missing-content
problem. Fix the existing page first; revisit the article after.

### Penelope Bakehouse

**1. What a focaccia sandwich actually is — and the six we build in Scarborough** *(confirmed)*
`focaccia sandwich` is 2,900/mo at KD 0 and the SERP is five recipe blogs, an AI overview and a
recipes carousel — no businesses. The Bakehouse already ranks 1.4 for `focaccia bread near me`
and 2.0 for `focaccia sandwich`, on single-digit impressions. It has the authority and needs
the demand. Sandwiches are also the #1 review topic on its Business Profile (30 mentions).
Direct rivals to beat: paninaro.ca and micosandwiches.ca.

**2. Sourdough: what a 24-hour ferment actually does** *(strongly confirmed — see §6)*
No longer a hypothesis. Bartholomew Bakery ranks **22nd and 26th** for `sourdough bread
benefits` (1,300) and `benefits of sourdough bread` (1,900) — as a croissant shop. A dedicated
sourdough bakery with a named starter should beat that. Also picks up `sourdough bread vs
regular bread`, `where can i buy sourdough bread`, `artisanal sourdough bread`, and feeds the
transactional `sourdough bread near me` (3,600/mo, KD 0) where the Bakehouse already ranks 1.0.
**Cite real sources on anything health-related and make no medical claims** — this is
YMYL-adjacent and thin health content will not hold.

**3. An Italian bakery in Scarborough: bread, focaccia and the imported pantry shelf** *(confirmed, now with a named target)*
Francesca Bakery holds #1 for both `italian bakery scarborough` and `bakery scarborough`; the
Bakehouse sits at 5.6 and 8.9. This article also finally puts the **retail range on the website
for the first time** — the olive oil, chili oil, balsamic, four pasta shapes, five sauces and
pesto are all listed with prices on the Google Business Profile and appear **nowhere in the
repo**.

**4. Pizza by the slice in Scarborough: Roman vs New York, and what $6 gets you** *(confirmed)*
`best pizza in scarborough` is 880/mo at KD 0, and the SERP is Reddit, blogTO and TripAdvisor —
whose lists already include bakeries (Lamanna's, Calabria). Gives the thin `/menus/pizza` page
(143 words) something to support.

---

## 8. Priority order

Ranked by expected return. **The first four are worth more than the entire article plan.**

1. ~~**Fix the brand cannibalization**~~ (§1) — **retitle + de-orphan shipped 2026-09-19.** Watch the §1 table for three weeks; escalate to `noindex` only if it does not move. Originally: retitle `/sourdough-bakery`, link it, point the
   Scarborough pages at the Bakehouse domain. ~5,700 impressions currently converting at 1.8%
   that should convert at ~14%.
2. **Fix the Bakehouse sitemap bug** (§2) — overwrite `dest` in `sitemapXmlAlias()`, clean
   rebuild, resubmit, request indexing for `/menus`. The entire menu section is unindexed.
3. ~~**Mark Social's existing GA4 events as key events**~~ — **done 2026-09-19** (11 key
   events). Remaining: mark **`click_to_call` as a key event on the Bakehouse property** — it is
   fired in code and counted nowhere (§3). Neither is retroactive, so baselines build from now.
4. **Business Profiles** — add *Italian restaurant* to Social; add *Sandwich shop*, *Pizza
   restaurant*, *Cafe*, *Italian restaurant* to the Bakehouse. Rewrite Social's GBP description.
   Claim and fill the Yelp and Instagram profiles (§6 — Yelp holds positions 1–4 on the
   Bakehouse's "near me" terms).
5. **Homepage and `/catering-events` title + meta rewrites on Social** — ~3,400 impressions at
   positions 4–5 converting at ~2%, and 1,258 impressions at 0.4%.
6. **Build the blog route + Sanity schema on Social**; put `/blog` in the Bakehouse nav and
   sitemap. Prerequisites for everything in §7.
7. **Articles**, in the order given in §7.
8. **Housekeeping** — thin pages, long titles, heading-order skips, www/apex consistency.

---

## 9. Re-measure

Re-run this audit in **three to four weeks**, by which point GA4 will have a comparable previous
period. Watch specifically:

- Bakehouse-brand CTR on penelopebakehouse.com vs penelopesocial.com (§1) — the clearest
  before/after in the whole plan.
- Whether `/menus` moves from "unknown to Google" to indexed.
- Whether Social's key events start reporting once they are marked in GA4.
- Whether the Italian cluster moves off positions 14–24.
- Set up rank tracking on the ~25 keywords named here so the articles can be judged on evidence.
