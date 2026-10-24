# Penelope Social: working on this repo

## Editing content

All copy, prices, hours, links and photos live in `web/src/content/`. Never put copy in `.astro` files. Components read content
only through `web/src/lib/content.ts`.

| To change | Edit |
|---|---|
| A menu item or price | `menus/<menu>.yaml`. Dish cards on the landing pages and Happy Hour's linked dinner items update themselves |
| A new menu page | Add `menus/<slug>.yaml`. It routes at `/menus/<slug>` |
| Happy Hour on other pages | `menus/happy-hour.yaml → callout`. Its photo card shows under the menu cards on `/` and `/menus`, and at the foot of each menu in `alsoOn` |
| A page: /contact, /catering-events, /menus, /merchandise, the four Vaughan landing pages | `pages/<slug>.yaml`. A new file routes at `/<slug>` |
| The homepage | `pages/home.yaml` |
| Hours | `site.yaml → hours`: the `lines` AND the `schedule`, then grep prose (below) |
| Phone, email, address | `site.yaml → nap` (the Bakehouse: `site.yaml → bakehouse`), then grep prose. Footer, tel: links and map queries are derived |
| Toast, gift card, directions, Bakehouse links | `site.yaml → links` |
| FAQs on Home, /about, /contact, /catering-events, /locations/* | `faqs.yaml` (the landing pages keep theirs in their own `faqSection`) |
| /about | `about.yaml` |
| /locations, /locations/woodbridge, /locations/scarborough | `locations.yaml` |
| Meta title / description / share image | the page's own `seo:` block |
| Header buttons, nav, Menus dropdown, footer | `site.yaml` |
| Announcement bar, promo popup | `site.yaml → announcement`, `site.yaml → popup` |
| Google rating ("600+ reviews") | `site.yaml → googleRating`. Sections show it with `rating: true` |
| A merch product | `merch/<slug>.yaml` |

**Facts that repeat in prose.** Hours, prices, phone and address also appear in
sentences (landing-page copy and FAQs, meta descriptions, the /menus timeline).
After changing one, run `grep -rn "<old value>" web/src/content` and update
every hit.

**Links in copy:** write `[link text](/path)`. Never write raw HTML: the build
rejects `<`.
- Internal: `(/menus/lunch)`, `(/menus/lunch#pizza-slices)`. The build fails if
  the page, or the menu section, doesn't exist.
- Shared links: `(@order)`, `(@giftCards)`, `(@directions)`, `(@bakehouse)`,
  and the others in `site.yaml → links`. A path can follow: `(@bakehouse/about)`.
  Also valid as a button `url:`. An unknown token fails the build.
- External: `(https://…)`. These open in a new tab automatically.
- Phone / email: `(tel:+19056070606)`, `(mailto:…)`.
- `**bold**` and `*italics*` work. Separate paragraphs with a blank line.

**FAQ hours:** `- { question: What are your hours?, hours: true }` prints the
cafe and bar hours from `site.yaml`, so the FAQ can't drift from the footer.

**YAML:** quote any value that contains `: `, starts with `@`, `*`, `&`, `!`,
`[`, `{`, or looks like a number, date, time or boolean (`price: "12"`,
`startDate: "2026-12-01"`, `"yes"`). A string that **starts** with a Markdown
link starts with `[`, so it must be quoted.

**Menu items from another menu.** Happy Hour lists some dinner dishes at its own
price. Write them as `{ from: dinner, item: Crunchwrap Supreme, price: "12" }`.
The name must match the dinner menu (the build checks), and the dinner page
shows "Happy Hour · 12" next to the dish automatically.

**New image:** export as JPEG (not HEIC), max 3000px on the long edge (2400 is
plenty). Put it in `web/src/assets/images/` and reference it by filename:
`image: { src: my-photo.jpg, alt: "What's in the photo" }`. Add
`objectPosition: "50% 30%"` to steer a crop. The build makes responsive WebP
sizes; there is nothing else to run. `web/public/images/` only holds files that
need a fixed URL: share images (`og/`) and the logos.

**Video / files over 5 MB:** R2 bucket `penelope`, served from
`https://media.penelopebakehouse.com/` (shared with the Bakehouse; the build
only accepts URLs there). Upload under a new filename, with a year's cache:
`npx wrangler r2 object put penelope/<file> --file <file> --cache-control "public, max-age=31536000, immutable" --remote`.
Compress video first and keep `faststart` so it starts before it has fully
downloaded: `ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an out.mp4`.
Export a poster with `ffmpeg -ss 2 -i out.mp4 -frames:v 1 -q:v 3 poster.jpg`.

**Before pushing:** `pnpm build` must pass (set `PUBLIC_TURNSTILE_SITE_KEY=` in
`.env` locally). Content errors name the file and field: schema errors from
Astro, cross-file errors as "Content problems in src/content". Never push a
failing build.

## How it fits together

- `web/src/lib/content-schema.ts`: strict Zod schemas for every YAML file.
  Unknown keys, missing images and raw HTML fail the build.
- `web/src/content.config.ts`: the `site`, `faqs`, `about`, `locations`,
  `home`, `pages`, `menus` and `merch` collections.
- `web/src/lib/content.ts`: loads everything, resolves `@tokens` and images,
  renders Markdown links, derives phone/address formats, and checks internal
  links, dish cards, linked menu items, callouts and the landing pages' JSON-LD
  `schemaMenu`.
- `web/src/lib/schema.ts`: JSON-LD. Opening hours come from `hours.*.schedule`.
- `web/src/components/PageBuilder.astro`: section `type` → component.
- `web/src/components/ResponsivePicture.astro`: every content photo.

## Development

```bash
pnpm install
pnpm dev     # http://localhost:4380
pnpm build   # static build into web/dist
```

`astro dev` resizes images on every request, so a hard refresh can show a blank
hero for a moment. Production builds them once.
