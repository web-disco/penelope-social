# Penelope Social: working on this repo

## Editing content

All copy, prices, links and photos for the YAML-built pages live in
`web/src/content/`. Never put copy in `.astro` files. Components read content
only through `web/src/lib/content.ts`.

| To change | Edit |
|---|---|
| A menu item or price | `menus/<menu>.yaml`. Dish cards on the landing pages and Happy Hour's linked dinner items update themselves |
| A new menu page | Add `menus/<slug>.yaml`. It routes at `/menus/<slug>` |
| Happy Hour on other pages | `menus/happy-hour.yaml → callout`. Its photo card shows under the menu cards on `/` and `/menus`, and at the foot of each menu in `alsoOn` |
| A page: /contact, /catering-events, /menus, /merchandise, the four Vaughan landing pages | `pages/<slug>.yaml`. A new file routes at `/<slug>` |
| The homepage | `pages/home.yaml` (the FAQs below it are still in `web/src/data/faq.ts`) |
| Meta title / description / share image | the page's own `seo:` block |
| Header buttons, nav, Menus dropdown, footer | `site.yaml` |
| Announcement bar, promo popup | `site.yaml → announcement`, `site.yaml → popup` |
| Google rating ("600+ reviews") | `site.yaml → googleRating`. Sections show it with `rating: true` |
| A merch product | `merch/<slug>.yaml` |
| Hours, address, phone, shared FAQs, /about, /locations | Still TypeScript: `web/src/data/site.ts`, `faq.ts`, `about.ts`, `locations.ts` |

**Facts that repeat in prose.** Hours, prices, phone and address also appear in
sentences (landing-page copy and FAQs, meta descriptions, the /menus timeline).
After changing one, run `grep -rn "<old value>" web/src/content web/src/data`
and update every hit.

**Links in copy:** write `[link text](/path)`. Never write raw HTML: the build
rejects `<`.
- Internal: `(/menus/lunch)`, `(/menus/lunch#pizza-slices)`. The build fails if
  the page, or the menu section, doesn't exist.
- External: `(https://…)`, phone `(tel:+19056070606)`, email `(mailto:…)`.
- `**bold**` and `*italics*` work. Separate paragraphs with a blank line.

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

**Before pushing:** `pnpm build` must pass (set `PUBLIC_TURNSTILE_SITE_KEY=` in
`.env` locally). Content errors name the file and field: schema errors from
Astro, cross-file errors as "Content problems in src/content". Never push a
failing build.

## How it fits together

- `web/src/lib/content-schema.ts`: strict Zod schemas for every YAML file.
  Unknown keys, missing images and raw HTML fail the build.
- `web/src/content.config.ts`: the `site`, `home`, `pages`, `menus` and `merch`
  collections.
- `web/src/lib/content.ts`: loads everything, resolves images, renders Markdown
  links, checks internal links, dish cards, linked menu items, callouts and the
  landing pages' JSON-LD `schemaMenu`.
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
