# Social: Sanity to YAML

**Goal:** the same as the Bakehouse pilot (`penelope-bakehouse/docs/content-in-git-pilot.md`).
Every content edit on penelopesocial.com can be made from anywhere with one
credential (GitHub), and a bad edit fails the build instead of shipping.

Written against `origin/main` @ `a284d5f`.

## Status

**Phase 1: on branch `claude/sanity-markdown-yaml-migration-537d4e`** (not merged).

- The site reads nothing from Sanity. `@sanity/client`, `@sanity/image-url` and
  `astro-portabletext` are gone from `web/`.
- Every published Sanity document is in `web/src/content/` as YAML: `site.yaml`
  (site settings, announcement bar, popup), `pages/home.yaml`, 8 files in
  `pages/`, 5 in `menus/`, 3 in `merch/`.
- Rich text was paragraphs and links only (65 blocks, 22 links), so it is
  Markdown in YAML strings.
- 52 photos are in `web/src/assets/images/` (11 MB of originals), served as
  responsive WebP through `astro:assets`. The two cropped in Sanity were
  cropped on export; the one original over 2400px (the 3840px pizza header)
  was resized. Share images and logos are in
  `web/public/images/`.
- The "repo wins" layer is gone. `data/copy.ts` (90 exact-string rewrites plus
  the Vaughan→Woodbridge rewrite), `banners.ts`, `home.ts`, `nav.ts`,
  `merch.ts`, `menus.ts`, `catering.ts` and most of `seo.ts` rewrote stale
  Sanity strings at render time. The YAML holds the text that actually rendered,
  so editing a YAML value now changes the page.

### Verified

Against a local build of `main`, which was itself byte-identical to live on all
22 pages (minus asset hashes):

- **HTML.** Normalised DOM diff (images compared by which photo they show) of
  all 22 pages: identical apart from the deliberate changes below.
- **CSS.** Same rules on every page, apart from `.contents` (added for
  `<picture>`) and utilities only the deleted dead sections used.
- **Layout.** Page height, plus position, size, `object-fit` and
  `object-position` of every image, identical on all 21 content pages at 375,
  900 and 1440px. The only differences are the two pages in "Fixed" below.
- **Guardrails.** A misspelled key, a missing image, a link to a missing page
  and a dish card naming a dish that isn't on the menu each fail the build,
  naming the file and field.

### Deliberate differences

1. **Images** are local WebP `srcset`s in a `<picture>` (with
   `display: contents`, so layout is unchanged) instead of Sanity CDN URLs.
2. **Share images** are `penelopesocial.com/images/og/*.jpg` instead of Sanity
   PNGs (same pictures, about a tenth of the bytes).
3. **/menus/dinner JSON-LD** Menu `name` is "Dinner" (the H1) instead of
   "Dinner menu", which no visible text said. Lunch and Bar already used the H1.
4. **WaveMoment's CSS** (scoped, so inert) now ships on every page-builder page,
   because the homepage's merch band is a page-builder section now.

### Fixed

- **/locations and /locations/scarborough** loaded the Bakehouse photo from
  `penelopebakehouse.com/images/location-bakehouse.jpg`, which has 404'd since
  Bakehouse #34 moved its photos into `astro:assets`. Both pages showed a broken
  image. The photo is now in this repo (`bakehouse-counter.jpg`).
- The /about banner and the /locations hub photo came from Webflow's CDN. They
  are local assets now.

### Not carried over (never rendered)

- `page-about` (the route is `pages/about.astro`) and `page-sourdough-bakery`
  (301s to penelopebakehouse.com).
- Section types that rendered nothing on the live site: `introSection` (hidden
  under every hero), `pageHeading` (hidden under every banner), `imageGrid`
  (empty on both pages), `teamGrid` and `storySection` (only on the two pages
  above). Their components are deleted.
- Stale Sanity values the rewrite layer replaced: homepage hero/intro copy,
  "Our Menus" nav labels, the Bakery nav link, SEO fields the repo overrode.

## Cutover (needs a decision)

Merging this changes nothing visible, but after it Studio edits stop reaching
the site. Before or right after merging:

1. Tell whoever edits in https://penelope-social.sanity.studio/ that edits now
   go through git (GitHub app, Claude, or a PR).
2. Remove the Sanity webhook that calls the Workers Builds deploy hook (it is
   harmless, it just triggers a rebuild of the same content).
3. Delete the `PUBLIC_SANITY_*` / `SANITY_*` build variables in Workers Builds.
4. Later, once nobody needs it for reference: delete `studio/`,
   `scripts/migrate.js` and `scripts/output/`, undeploy the Studio, and archive
   the Sanity project.

## Phase 2: on branch `claude/social-yaml-phase-2` (stacked on phase 1)

`web/src/data/` is gone. Everything it held is YAML:

- `site.yaml` gains `links` (the `@order`, `@giftCards`, `@directions`,
  `@bakehouse`, … tokens, usable as any `url:` or Markdown link, with an
  optional path: `@bakehouse/about`), `nap`, `bakehouse` and `hours`. 14 literal
  Toast, directions and Bakehouse URLs across the page files became tokens.
- **Hours drive the structured data from a `schedule`**, not from the display
  strings. `lib/schema.ts` used to regex-parse "Mon-Sat: 9am-3pm" into
  OpeningHoursSpecification, so rewording a line silently broke the JSON-LD.
  The output is identical.
- Phone, email and address are typed once (`nap`). The footer's
  "(905) 607 0606" / `tel:9056070606` and the address line are derived from it,
  so they can't drift from the FAQs and location pages.
- `faqs.yaml` holds the six shared FAQ sets as Markdown. The hours answers are
  `hours: true`, printed from `site.yaml`.
- `about.yaml` and `locations.yaml` hold /about and /locations/*, including the
  SEO that `data/seo.ts` had, and the Woodbridge intro that was hand-written
  HTML in `woodbridge.astro`.
- The unused `cateringMenuFaq` set wasn't carried over.

Verified against the phase-1 build: normalised HTML identical on 18 of 22 pages,
CSS rules identical on all, and on the four that differ (/, /about,
/locations/woodbridge, /locations/scarborough) page height and every link's
computed style and box identical at 375 and 1440px. The differences:

- **External links in FAQ answers open in a new tab** (`target="_blank"
  rel="noopener"`), like every other off-site link on the site and the
  Bakehouse rule. Nine links; the home "Order online" one already did, and
  drops `noreferrer`.
- The Woodbridge intro's link styling moved from each `<a>` to the paragraph.

An unknown `@token` and a malformed schedule time both fail the build.

### Still open

- **Instagram handle mismatch.** The footer and drawer link
  `instagram.com/penelope.social`; the JSON-LD `sameAs` and the Woodbridge
  "Social" row use `instagram.com/penelopesocial` (`site.yaml → links.instagram`).
  Kept as-is; confirm which is current and make `links.instagram` match.
- **Two directions URLs.** The footer address links to a long Google Maps URL
  (`footer.hours.mapUrl`); everything else uses `@directions`. Kept as-is.
- The /about video (`PENNY BREAD-transcode.mp4`, about 10 MB) is still served
  from Webflow's CDN. Move it to R2 like the Bakehouse video (needs a bucket /
  domain decision).
- A little fixed copy is still in `.astro` files: the 404 page, the catering
  notice checkbox on the events form, and row labels on the location pages.

## Re-running the export

The one-off export script (Sanity → YAML, applying the old rewrite helpers) is
not committed; the YAML is now the source of truth. The dataset is still
publicly readable if anything needs checking:
`https://wlwg9juj.api.sanity.io/v2024-10-01/data/query/production?query=*`.
