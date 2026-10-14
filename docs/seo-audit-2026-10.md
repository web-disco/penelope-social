# SEO audit: why traffic still lands on the homepage, not the specialty pages

Date: 2026-10-14
Sources: Search Console (2026-09-13 to 10-11, 28 days), GA4 organic landing pages (09-16 to 10-13),
URL Inspection, DataForSEO keyword volumes and live Vaughan SERPs, plus the live HTML of every page.
Previous audit: [seo-audit-2026-09.md](seo-audit-2026-09.md).

Specialty pages in scope: `/pizza-vaughan`, `/sandwiches-vaughan`, `/cafe-in-vaughan`, `/bakery-vaughan`.

---

## Short answer

Most of the homepage's traffic is people searching for **Penelope Social by name**, and that traffic
belongs on the homepage. The specialty pages are **2–3 weeks old**. They mostly target **phrases
almost nobody searches**, and on the big generic searches the **map pack** sits above every organic
result and sends its clicks to the homepage. On top of that, the homepage **competes directly** with
the specialty pages through its FAQ.

The homepage doesn't have too many keywords overall. It does have a few lines aimed at exactly the
same queries as the specialty pages, and those lines need to go. It already links to the specialty
pages, but only from places Google and visitors give little weight: a hidden nav dropdown, collapsed
FAQ answers and one sentence near the bottom.

---

## 1. Most homepage traffic is brand traffic, and should be

| | Homepage, 28 days |
| --- | --- |
| Clicks | 3,821 |
| Impressions | 41,561 |
| Clicks from "penelope social" alone | 2,220 (27% CTR, pos 1.1) |
| Clicks from all brand variants (penelope, penelopes, penelope vaughan, penelope woodbridge, typos…) | ~2,640, **about 70%** |

Nobody searching "penelope social" should land on `/pizza-vaughan`. The share that matters is the
remaining ~30%, and the specialty pages can only win the part of it that is about their topic.

The non-brand clicks the homepage does get are mostly **general restaurant searches**: `restaurants
near me` (41), `restaurants in vaughan` (23), `restaurants vaughan` (22), `vaughan restaurants` (20).
None of the specialty pages targets these. They belong to the homepage.

## 2. The specialty pages are brand new

First impressions in Search Console: `/pizza-vaughan` on 09-21, the other three on 09-27 to 09-29.
All four are **indexed, canonical and in the sitemap** (URL Inspection, crawled 09-29 to 10-13), so
there is no technical block. Impressions went from 0 to roughly **450–650 a day** within a week.
That is a normal ramp. Local landing pages usually take **6–12 weeks** to settle into their
positions. Judging them on their third week is premature.

When people do land on them, they convert well:

| Landing page (organic, GA4) | Sessions | Key-event rate |
| --- | --- | --- |
| `/` | 4,271 | 47% |
| `/bakery-vaughan` | 26 | 42% |
| `/sandwiches-vaughan` | 20 | 45% |
| `/pizza-vaughan` | 6 | 83% |
| `/cafe-in-vaughan` | 4 | 50% |

So the pages work once someone gets there. Getting people there is the problem.

## 3. Most specialty impressions come from brand queries they can't win

`/cafe-in-vaughan` shows **3,290 impressions and 6 clicks**, which looks alarming. But 1,398 of those
impressions are "penelope social" (pos 4.2, under the homepage), 529 are "penelope social menu", 154
are "penelope social reviews", and so on. Google is showing the page as an extra result under a
brand search, where people just click the homepage. Most of the specialty pages' impressions look
like this.

The non-brand queries each page was built for barely register yet:

| Query | Page | Impr. | Pos |
| --- | --- | --- | --- |
| focaccia sandwich vaughan | `/sandwiches-vaughan` | 9 | 2.6 |
| italian sandwiches vaughan | `/sandwiches-vaughan` | 36 | 6.1 |
| sandwiches vaughan | `/sandwiches-vaughan` | 16 | 10.0 |
| sourdough pizza vaughan | `/pizza-vaughan` | 4 | 4.0 |
| italian cafe vaughan | `/cafe-in-vaughan` | 4 | 3.0 |
| coffee shops in vaughan | `/cafe-in-vaughan` | 1 | 22 |
| sourdough bread vaughan | `/bakery-vaughan` | 2 | 4.5 |

## 4. The pages target low-volume phrases; the real demand is one word over

Monthly search volume (DataForSEO, Canada):

| What the page targets (H1/title) | Vol. | The search people actually type | Vol. |
| --- | --- | --- | --- |
| sourdough pizza vaughan | ~0 | **pizza vaughan** / **best pizza vaughan** / **pizza woodbridge** | 880 / 880 / 590 |
| italian cafe vaughan | 40 | **cafe in vaughan** / **coffee shops in vaughan** / cafe woodbridge | 2,900 / 2,900 / 390 |
| focaccia sandwich vaughan | 40 | **sandwiches vaughan** / best sandwiches vaughan / italian sandwiches vaughan | 210 / 170 / 140 |
| sourdough bread vaughan | 30 | bakery in vaughan | 1,600 (but the SERP is cakes and pastries; poor fit) |

"Sourdough" and "Italian" in the H1s describe the product well, but they narrow the pages to searches
with almost no volume. The pages need to lead with the broad term and treat "sourdough" as the reason
to choose Penelope: e.g. **"Pizza in Vaughan: sourdough slices and 14-inch pies"**, not "Sourdough
Pizza in Vaughan".

## 5. The map pack takes the generic clicks, and it links to the homepage

Live Vaughan SERPs for `pizza vaughan`, `cafe in vaughan`, `bakery in vaughan`, `italian restaurant
vaughan` and `sandwiches vaughan` **all open with a 3-pack of map results**. Below the pack it's
Reddit, TripAdvisor, Yelp and OpenTable lists before any restaurant website.

For `sandwiches vaughan`, **Penelope Social is #2 in the map pack**, and that listing links to
`https://penelopesocial.com/`. Every click from a Business Profile goes to the homepage, and Search
Console counts it as a homepage click. This alone moves a lot of food-intent traffic onto `/`.
The specialty pages can only compete in the organic results below the pack.

Implications:
- For the map pack, work on the **Business Profile** (categories, products, menu, photos, posts)
  rather than the website. From the last audit: Social's GBP still doesn't list *Italian restaurant*,
  and the description says nothing useful.
- GBP **Products** and **Menu** items can each link to a URL. Point the pizza/sandwich products at the
  specialty pages. A GBP post per specialty, linking to its page, also helps.

## 6. The homepage competes directly with the specialty pages

The homepage carries an FAQ, also emitted as `FAQPage` JSON-LD from `homeFaq`, with these questions:

- *Where can I get sourdough pizza in Vaughan?*
- *Where can I get Italian sandwiches in Vaughan?*
- *Is there a cafe for coffee in Vaughan?*

Those are the specialty pages' target queries, word for word, on the strongest page on the site. The
H1 subline and meta description also lead with "focaccia sandwiches… sourdough pizza". Search
Console shows the homepage winning those queries:

| Query | Homepage | Specialty page |
| --- | --- | --- |
| focaccia sandwich vaughan | 39 impr · pos 5.2 · 3 clicks | `/sandwiches-vaughan` 9 impr · pos 2.6 · 0 clicks |
| italian sandwiches vaughan | 46 impr · pos 5.7 · 3 clicks | `/sandwiches-vaughan` 36 impr · pos 6.1 · 1 click |
| focaccia sandwich near me | 25 impr · pos 10.4 · 5 clicks | `/sandwiches-vaughan` 5 impr · pos 8.6 · 1 click |
| best pizza vaughan | 36 impr · pos 8.4 | `/pizza-vaughan`: none |
| pizza near me | 95 impr · pos 13.1 | `/pizza-vaughan`: none |

**Is it too many keywords?** By count, no. 744 words that mention pizza/sandwich/focaccia/sourdough
about 13 times each is normal for a restaurant homepage, and it should say what you sell. The
problem is these **specific Vaughan-intent questions**, which tell Google the homepage answers them.

**Fix:** keep naming the food on the homepage, but drop or rewrite the three "Where can I get X in
Vaughan?" FAQs, e.g. merge them into one "What's on the menu?" answer that links out. Keep those
exact questions on the specialty pages, which already have their own FAQs.

## 7. Homepage links to the specialty pages are there but weak

Every specialty link on the homepage, by where it sits:

| Where | Visible? | Anchor |
| --- | --- | --- |
| Desktop "Menus" dropdown → Specialties | Only on hover | "Sourdough Pizza", "Focaccia Sandwiches"… |
| Mobile drawer → Menus → Specialties | Two taps deep | same |
| "Good bread, served here every day" sentence | Yes, near the bottom | "sandwiches", "pizza" |
| FAQ answers | Collapsed | "our sourdough pizza", "our cafe"… |

The prominent **"On the menu"** card row, the first thing under the hero, links to `/menus/lunch`,
`/menus/dinner`, `/menus/bar` and `/menus/catering` instead. Its card copy, "Pizza and focaccia
sandwiches", sends that intent to `/menus/lunch` and not to `/sandwiches-vaughan`. The footer doesn't
link the specialty pages at all.

**So yes, link them properly:**
1. Add a visible **"Our specialties"** row on the homepage, right after "On the menu", with four
   cards: Pizza in Vaughan, Italian sandwiches, Cafe & coffee, Sourdough bread. Use descriptive
   anchors ("sourdough pizza in Vaughan", not "Learn more").
2. Add a **Specialties** column to the footer so every page links all four.
3. On `/menus/lunch` and `/menus/dinner`, link the pizza and sandwich section headings to their
   specialty pages. Those menus get 12,000+ impressions each and pass their weight on.

Internal links help, but they won't lift a page the map pack and Reddit/Yelp lists sit on top of.
Treat this as necessary but not sufficient.

## 8. The biggest opportunities still have no page

| Cluster | Monthly vol. | Where Social ranks now |
| --- | --- | --- |
| italian restaurant vaughan / woodbridge | 8,100 + 2,900 | homepage, **pos 20–23** |
| brunch vaughan (+ "brunch near me", "brunch woodbridge") | 2,900 | homepage, pos 9–12 |
| bars in vaughan / happy hour vaughan | 1,000 / 210 | homepage, pos 4–7 |

These are worth more than all four current specialty pages combined, and the homepage ranks poorly
for them because nothing on the site is about them. `/italian-restaurant-vaughan` and
`/happy-hour` (plus a Sunday brunch page, if there's an offer to sell) were recommended last audit.

**Update 2026-10-14: the Italian restaurant query belongs to Arti, not Penelope.** The same owners run
[Arti Ristorante](https://artiristorante.com/), a sit-down Italian restaurant, and that is the right
answer for "italian restaurant vaughan". A Penelope page aimed at the same query would compete with
Arti. Instead, Arti should own "italian restaurant vaughan / woodbridge" (fix its site and GBP),
Penelope keeps the casual Italian angle it already has (sourdough pizza, Italian sandwiches, Italian
cafe), and each site links to the other where it fits. Penelope's next page is `/happy-hour`,
then brunch.

## 9. Smaller items

- **Off-site links all point at the homepage.** Google's referring URLs for `/` include Wanderlog
  lists. The specialty pages have no external links. Ask a couple of local lists or food
  writers to link the pizza or sandwich page directly.
- **`/menus/dinner` and `/menus/lunch` landings have 36–40% engagement** (homepage: 80%). They pick up
  brand traffic from sitelinks and lose it. Worth a look separately.
- The **Christmas popup** adds an extra H2 ("Booking a Corporate Christmas Party?") to every page.
  Minor, but it puts unrelated text into each specialty page's outline.
- `www.penelopesocial.com/merchandise` and `/contact` still collect a few impressions. The 301s are
  in place (checked), so they'll drop out on their own.

---

## Priority order

1. ~~**Remove the homepage's "Where can I get X in Vaughan?" FAQs**~~ **Done 2026-10-14**: replaced
   with one "What does Penelope Social serve?" answer that links to all four pages.
2. ~~**Add a visible Specialties row to the homepage and a Specialties column to the footer.**~~
   **Done 2026-10-14**: a "What we're known for" sentence under "On the menu" ("Come in for
   sourdough pizza, Italian sandwiches, coffee at our Italian cafe and bread to take home"), each
   phrase a photo + link to its page, and a Specialties column in the footer. The lunch and dinner
   menus already link the pizza and sandwich pages.
3. **Retarget titles and H1s to the high-volume term** (copy drafted 2026-10-14, to publish in Sanity), keeping "sourdough"/"Italian" as the
   differentiator: Pizza in Vaughan, Cafe in Vaughan, Sandwiches in Vaughan. Keep the URLs.
4. **Business Profile:** add *Italian restaurant*, *Pizza restaurant* and *Cafe* categories. Link
   GBP products and posts to the specialty pages. Rewrite the description.
5. **Build `/happy-hour`**, then brunch if there's an offer. Leave "italian restaurant vaughan" to Arti (see §8).
6. **Wait.** Re-measure on **2026-11-15**, about 7–8 weeks after launch. Judge the specialty pages on
   **non-brand** clicks, not total clicks, and set up rank tracking on the table in §4.

The homepage will still get most of the traffic after all of this, because it gets the brand and
map-pack clicks. Success means the specialty pages pick up the non-brand pizza/cafe/sandwich
searches, not that the homepage's share falls.
