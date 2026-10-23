/**
 * The only module pages and components read content from.
 *
 * Loads every collection once, swaps each `{ src: 'photo.jpg', alt }` for the
 * imported image asset, and runs the checks a single file's schema can't:
 * internal links point at real pages, menu-item cards and "from another menu"
 * items name real dishes, callouts and JSON-LD menus name real menus. Every
 * problem is collected and the build fails once, with the whole list.
 */
import type { ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'
import { getCollection, getEntry } from 'astro:content'
import type { z } from 'astro/zod'
import type * as S from './content-schema'
import { TOKEN } from './content-schema'

/* ------------------------------------------------------------------ */
/* Problems                                                           */
/* ------------------------------------------------------------------ */

const problems: string[] = []
const problem = (where: string, message: string) => problems.push(`  ${where}: ${message}`)

function throwProblems() {
  if (!problems.length) return
  throw new Error(`Content problems in src/content:\n${problems.join('\n')}\n`)
}

/* ------------------------------------------------------------------ */
/* Images                                                             */
/* ------------------------------------------------------------------ */

const ASSETS = new Map(
  Object.entries(
    import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpg,jpeg,png,webp,avif}', { eager: true }),
  ).map(([file, mod]) => [file.split('/').pop()!, mod.default]),
)

/** Originals above this are pointless (nothing renders wider than 2400) and bloat git forever. */
const MAX_EDGE = 3000

export type Image = { src: ImageMetadata; alt: string; objectPosition?: string }

/** `{ src: string }` becomes `{ src: ImageMetadata }`, at any depth. */
type Resolved<T> = T extends { src: string; alt: string }
  ? Omit<T, 'src'> & { src: ImageMetadata }
  : T extends (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T

function resolveImages<T>(value: T, where: string): Resolved<T> {
  if (Array.isArray(value)) return value.map((v, i) => resolveImages(v, `${where}[${i}]`)) as Resolved<T>
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.src === 'string' && typeof obj.alt === 'string') {
      const asset = ASSETS.get(obj.src)
      if (!asset) problem(`${where}.src`, `"${obj.src}" is not in src/assets/images/.`)
      else if (Math.max(asset.width, asset.height) > MAX_EDGE) {
        problem(
          `${where}.src`,
          `"${obj.src}" is ${asset.width}×${asset.height}. Resize it to ${MAX_EDGE}px or less on the long edge (2400 is plenty).`,
        )
      }
      return { ...obj, src: asset } as Resolved<T>
    }
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, resolveImages(v, `${where}.${k}`)]),
    ) as Resolved<T>
  }
  return value as Resolved<T>
}

/** A single WebP rendition, for the few places that need a URL rather than a <picture>. */
export async function imageSrc(image: Image, width?: number): Promise<string> {
  const w = width ? Math.min(width, image.src.width) : image.src.width
  const out = await getImage({ src: image.src, width: w, format: 'webp', quality: 78 })
  return out.src
}

/* ------------------------------------------------------------------ */
/* Markdown links                                                     */
/* ------------------------------------------------------------------ */

/* Quotes stay literal in text: the FAQ JSON-LD strips tags from this HTML, and
   an escaped apostrophe would land in it as "&#39;". Attribute values (href)
   escape `"` separately. */
const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' }
const escapeHtml = (s: string) => s.replace(/[&<>]/g, (c) => ESCAPES[c]!)
const escapeAttr = (s: string) => escapeHtml(s).replace(/"/g, '&quot;')

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

/** Links written in copy, collected for the route check below. */
const linksInCopy: { where: string; href: string }[] = []

/**
 * One line of copy with `[text](url)` links, `**bold**` and `*italics*`, to HTML.
 * External (https) links open in a new tab, like every other off-site link on
 * the site; on-site, tel: and mailto: links don't.
 */
export function inlineHtml(text: string): string {
  let out = ''
  let last = 0
  for (const match of text.matchAll(LINK)) {
    const href = match[2]!
    const newTab = href.startsWith('https://') ? ' target="_blank" rel="noopener"' : ''
    out += emphasis(escapeHtml(text.slice(last, match.index)))
    out += `<a href="${escapeAttr(href)}"${newTab}>${emphasis(escapeHtml(match[1]!))}</a>`
    last = match.index! + match[0].length
  }
  return out + emphasis(escapeHtml(text.slice(last)))
}

function emphasis(html: string): string {
  return html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

/** Paragraphs (separated by a blank line), each to a <p>. */
export function paragraphsHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .map((p) => `<p>${inlineHtml(p)}</p>`)
    .join('')
}

/** Copy without its link syntax, for JSON-LD and meta. */
export function plainText(text?: string): string {
  return (text ?? '').replace(LINK, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1').replace(/\s+/g, ' ').trim()
}

function collectLinks(value: unknown, where: string) {
  if (typeof value === 'string') {
    for (const match of value.matchAll(LINK)) linksInCopy.push({ where, href: match[2]! })
  } else if (Array.isArray(value)) value.forEach((v, i) => collectLinks(v, `${where}[${i}]`))
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'url' && typeof v === 'string') linksInCopy.push({ where: `${where}.url`, href: v })
      else collectLinks(v, `${where}.${k}`)
    }
  }
}

/* ------------------------------------------------------------------ */
/* Load                                                               */
/* ------------------------------------------------------------------ */

type SiteData = z.infer<typeof S.siteSchema>
type HomeData = z.infer<typeof S.homeSchema>
type PageData = z.infer<typeof S.pageSchema>
type MenuData = z.infer<typeof S.menuSchema>
type MerchData = z.infer<typeof S.merchSchema>
type FaqsData = z.infer<typeof S.faqsSchema>
type AboutData = z.infer<typeof S.aboutSchema>
type LocationsData = z.infer<typeof S.locationsSchema>

export type Section = Resolved<z.infer<typeof S.section>>
export type SectionOf<T extends Section['type']> = Extract<Section, { type: T }>
export type Page = Resolved<PageData> & { slug: string }
export type Menu = Resolved<MenuData> & { slug: string }
export type MenuCategory = Menu['categories'][number]
export type Merch = Resolved<MerchData> & { slug: string }

async function singleton<T>(collection: 'site' | 'home' | 'faqs' | 'about' | 'locations', file: string): Promise<T> {
  const entry = await getEntry(collection, collection)
  if (!entry) throw new Error(`src/content/${file} is missing.`)
  return entry.data as T
}

const siteData = await singleton<SiteData>('site', 'site.yaml')

/* ------------------------------------------------------------------ */
/* Link tokens                                                        */
/* ------------------------------------------------------------------ */

const LINKS: Record<string, string> = siteData.links

/** "@order" → the order URL; "@bakehouse/about" → its site + "/about". */
function resolveToken(value: string, where: string): string {
  const match = TOKEN.exec(value)
  if (!match) return value
  const base = LINKS[match[1]!]
  if (!base) {
    problem(where, `unknown link token "@${match[1]}". Add it to site.yaml → links, or use one of: ${Object.keys(LINKS).map((k) => `@${k}`).join(', ')}.`)
    return value
  }
  return base + (match[2] ?? '')
}

/** Every `@token` in a url field or a Markdown link, swapped for its URL, at any depth. */
function resolveTokens<T>(value: T, where: string): T {
  if (typeof value === 'string') {
    if (TOKEN.test(value)) return resolveToken(value, where) as T
    return value.replace(LINK, (whole, text, href) =>
      href.startsWith('@') ? `[${text}](${resolveToken(href, where)})` : whole,
    ) as T
  }
  if (Array.isArray(value)) return value.map((v, i) => resolveTokens(v, `${where}[${i}]`)) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveTokens(v, `${where}.${k}`)])) as T
  }
  return value
}

/** Tokens, then the link check list, then images. */
function load<T>(data: T, file: string): Resolved<T> {
  const resolved = resolveTokens(data, file)
  collectLinks(resolved, file)
  return resolveImages(resolved, file)
}

/* ------------------------------------------------------------------ */
/* Load                                                               */
/* ------------------------------------------------------------------ */

export const site = load(siteData, 'site.yaml')
export const home = load(await singleton<HomeData>('home', 'pages/home.yaml'), 'pages/home.yaml')
const faqsData = load(await singleton<FaqsData>('faqs', 'faqs.yaml'), 'faqs.yaml')
export const about = load(await singleton<AboutData>('about', 'about.yaml'), 'about.yaml')
export const locations = load(await singleton<LocationsData>('locations', 'locations.yaml'), 'locations.yaml')

const bySlug = <T extends { slug: string }>(a: T, b: T) => a.slug.localeCompare(b.slug)

export const pages: Page[] = (await getCollection('pages'))
  .map((entry) => ({ ...load(entry.data as PageData, `pages/${entry.id}.yaml`), slug: entry.id }))
  .sort(bySlug)

export const menus: Menu[] = (await getCollection('menus'))
  .map((entry) => ({ ...load(entry.data as MenuData, `menus/${entry.id}.yaml`), slug: entry.id }))
  .sort(bySlug)

export const merch: Merch[] = (await getCollection('merch'))
  .map((entry) => ({ ...load(entry.data as MerchData, `merch/${entry.id}.yaml`), slug: entry.id }))
  .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))

/* ------------------------------------------------------------------ */
/* Address, phone and hours (typed once in site.yaml, derived here)    */
/* ------------------------------------------------------------------ */

/** The site's origin, from astro.config.mjs `site`. */
export const SITE_ORIGIN = (import.meta.env.SITE as string).replace(/\/$/, '')

export const links = LINKS

const addressLine = (a: { street: string; city: string; region: string; postal: string }) =>
  `${a.street}, ${a.city}, ${a.region} ${a.postal}`
/** "(905) 607-0606" → "+19056070606". */
const e164 = (phone: string) => `+1${phone.replace(/\D/g, '')}`

export interface HourBlock {
  label: string
  lines: string[]
}

/** Penelope Social, Woodbridge. */
export const nap = {
  ...site.nap,
  phoneDigits: e164(site.nap.phone),
  address: addressLine(site.nap),
  mapQuery: addressLine(site.nap),
  mapUrl: LINKS.directions!,
}

/** The sister bakehouse, Scarborough. */
export const bakehouse = {
  ...site.bakehouse,
  phoneDigits: e164(site.bakehouse.phone),
  address: addressLine(site.bakehouse),
  url: LINKS.bakehouse!,
  mapQuery: addressLine(site.bakehouse),
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine(site.bakehouse)).replace(/%20/g, '+')}`,
}

export const cafeHours: HourBlock[] = [{ label: site.hours.cafe.label, lines: site.hours.cafe.lines }]
export const barHours: HourBlock[] = [{ label: site.hours.bar.label, lines: site.hours.bar.lines }]
/** Footer, location and hours-FAQ lines. One day-range per line. */
export const stackedHoursBlocks: HourBlock[] = [...cafeHours, ...barHours]
export const hoursSchedule = { cafe: site.hours.cafe.schedule, bar: site.hours.bar.schedule }

/** The footer's formats: "(905) 607 0606", tel:9056070606. */
export const footerContact = {
  phone: site.nap.phone.replace('-', ' '),
  phoneDigits: site.nap.phone.replace(/\D/g, ''),
  email: site.nap.email,
  address: nap.address,
}

/** The four main menus, for the restaurant's `hasMenu`: the Menus group of the dropdown. */
export const MENU_URLS = (site.menusDropdown.find((g) => g.heading === 'Menus')?.links ?? []).map(
  (link) => `${SITE_ORIGIN}${link.url}`,
)
/** Social profiles only. Never penelopebakehouse.com: that mixes the two entities. */
export const SAME_AS = [LINKS.instagram!, LINKS.tiktok!]

/* ------------------------------------------------------------------ */
/* FAQs                                                               */
/* ------------------------------------------------------------------ */

export interface Cta {
  label: string
  url: string
  style?: 'primary' | 'outline'
  newTab?: boolean
}

export interface FaqItem {
  question: string
  /** HTML: links rendered, stripped to text for FAQPage JSON-LD. */
  answer: string
}

/** The hours as one FAQ answer: each group's label in bold, one range per line. */
const hoursFaqHtml = stackedHoursBlocks
  .map((block, i) =>
    // inline-block so the top margin applies; it separates the two groups.
    [i ? `<strong class="mt-space-12 inline-block">${block.label}</strong>` : `<strong>${block.label}</strong>`, ...block.lines.map(escapeHtml)].join('<br>'),
  )
  .join('<br>')

export const faqs = Object.fromEntries(
  Object.entries(faqsData).map(([set, items]) => [
    set,
    items.map((item): FaqItem => ({
      question: item.question,
      answer: 'hours' in item ? hoursFaqHtml : inlineHtml(item.answer),
    })),
  ]),
) as Record<keyof FaqsData, FaqItem[]>

export const getPage = (slug: string) => pages.find((p) => p.slug === slug)
export const getMenu = (slug: string) => menus.find((m) => m.slug === slug)

/* ------------------------------------------------------------------ */
/* Menus                                                              */
/* ------------------------------------------------------------------ */

type MenuItem = { title: string; description?: string; price?: string }
type LinkedItem = { from: string; item: string; price: string }
const isLinked = (item: MenuItem | LinkedItem): item is LinkedItem => 'from' in item

/** "Buona Notte (3oz)" and "buona notte" are the same item. */
function itemKey(title: string): string {
  return title
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim()
    .toLowerCase()
}

function findItem(menu: Menu | undefined, name: string, anchor?: string) {
  // The link's anchor names the category, so a dish on two lists quotes the one linked.
  const categories = [...(menu?.categories ?? [])].sort(
    (a, b) => Number(b.anchor === anchor) - Number(a.anchor === anchor),
  )
  for (const category of categories) {
    const item = category.items.find((i) => !isLinked(i) && itemKey(i.title) === itemKey(name)) as MenuItem | undefined
    if (item) return { item, category }
  }
  return undefined
}

/**
 * A menu's categories with every "from another menu" item swapped for the dish
 * it names: that menu's title and description, at this menu's price. The Happy
 * Hour list is built this way, so its dishes cannot drift from Dinner's.
 */
export function menuCategories(menu: Menu): { title: string; anchor: string; description?: string; items: MenuItem[] }[] {
  return menu.categories.map((category) => ({
    ...category,
    items: category.items.map((item) => {
      if (!isLinked(item)) return item
      const found = findItem(getMenu(item.from), item.item)!
      return { title: found.item.title, description: found.item.description, price: item.price }
    }),
  }))
}

export interface MenuItemOffer {
  /** The menu offering it: "Happy Hour". */
  label: string
  price: string
  /** Straight to the section that lists it: "/menus/happy-hour#food". */
  url: string
}

/**
 * The reverse of menuCategories: for one menu, which of its dishes another menu
 * borrows, and at what price, keyed by dish name. Dinner's Crunchwrap is on
 * Happy Hour at 12, so Dinner can say so next to it.
 */
export function offersFor(menu: Menu): Map<string, MenuItemOffer> {
  const offers = new Map<string, MenuItemOffer>()
  for (const other of menus) {
    if (other.slug === menu.slug) continue
    for (const category of other.categories) {
      for (const item of category.items) {
        if (!isLinked(item) || item.from !== menu.slug) continue
        offers.set(itemKey(item.item), {
          label: other.title,
          price: item.price,
          url: `/menus/${other.slug}#${category.anchor}`,
        })
      }
    }
  }
  return offers
}
export const offerFor = (offers: Map<string, MenuItemOffer>, title: string) => offers.get(itemKey(title))

/** Menus with a callout (Happy Hour), shown under the main menu cards. */
export const featuredMenus = menus.filter((m) => m.callout)

/** Featured menus whose callout lists this menu under `alsoOn`. */
export const calloutsFor = (menu: Menu) => featuredMenus.filter((m) => m.callout?.alsoOn?.includes(menu.slug))

export interface ResolvedMenuItem {
  title: string
  description?: string
  price?: string
  /** What the price buys, worded for the card: "per slice", "per 14\" pie", "per piece". */
  priceUnit?: string
  menuUrl: string
}

/**
 * Menu prices are bare numbers and the unit lives in the category title, which
 * a card drops. Without it a $6 slice sits next to a $29 pie with nothing to
 * say why.
 */
function priceUnit(categoryTitle?: string): string | undefined {
  if (!categoryTitle) return undefined
  if (/slice/i.test(categoryTitle)) return 'per slice'
  const size = /\((\d+)["”]\s*round\)/i.exec(categoryTitle)?.[1]
  return size ? `per ${size}" pie` : undefined
}

/**
 * Some items are priced in tiers, too long for a card's one-line price. By
 * count ("1pc 4.50 | 6pc 24 | 12pc 45") the card quotes the first tier with its
 * unit ("4.50 per piece"). By size ("SM 12 | LG 20") it quotes the lowest as
 * "From 12", with no unit. The menu page lists every tier.
 */
function firstTier(price?: string): { price: string; unit: string } | undefined {
  if (!price?.includes('|')) return undefined
  const first = price.split('|')[0]!.trim()
  const count = /^(\d+)\s*pc\s+\$?([\d.]+)$/i.exec(first)
  if (count) return { price: count[2]!, unit: count[1] === '1' ? 'per piece' : `per ${count[1]} pieces` }
  const size = /^(SM|LG|small|large)\s+\$?([\d.]+)$/i.exec(first)
  // Empty unit, not undefined, so the category-title unit doesn't fill in behind it.
  if (size) return { price: `From ${size[2]!}`, unit: '' }
  return undefined
}

/** A menu-item card's dish, quoted from its menu so name, description and price match /menus/*. */
export function resolveMenuItem(pick: { item: string; link: string }): ResolvedMenuItem {
  const slug = /\/menus\/([^/?#]+)/.exec(pick.link)![1]!
  const anchor = /#([^?]+)$/.exec(pick.link)?.[1]
  const { item, category } = findItem(getMenu(slug), pick.item, anchor)!
  const tier = firstTier(item.price)
  return {
    title: item.title,
    description: item.description,
    price: tier?.price ?? item.price,
    priceUnit: tier?.unit ?? (item.price ? priceUnit(category.title) : undefined),
    menuUrl: `/menus/${slug}`,
  }
}

/* ------------------------------------------------------------------ */
/* Nav                                                                */
/* ------------------------------------------------------------------ */

/** 136px WebP (2x the 68px dropdown slot). Not lazy: a lazy image in the hidden panel shows blank on first open. */
export const menusDropdown = await Promise.all(
  site.menusDropdown.map(async (group) => ({
    heading: group.heading,
    links: await Promise.all(group.links.map(async (link) => ({ ...link, thumb: await imageSrc(link.image, 136) }))),
  })),
)
export const specialties = menusDropdown.find((g) => g.heading === 'Specialties')?.links ?? []

/* ------------------------------------------------------------------ */
/* Cross-file checks                                                  */
/* ------------------------------------------------------------------ */

/** Pages that exist outside the YAML collections (hand-built .astro pages and redirects). */
const FIXED_ROUTES = ['/', '/about', '/locations', '/locations/woodbridge', '/locations/scarborough', '/reservations']
const routes = new Set([
  ...FIXED_ROUTES,
  ...pages.map((p) => `/${p.slug}`),
  ...menus.map((m) => `/menus/${m.slug}`),
  ...merch.map((m) => `/merchandise/${m.slug}`),
])

for (const page of pages) {
  if (routes.has(`/${page.slug}`) && FIXED_ROUTES.includes(`/${page.slug}`)) {
    problem(`pages/${page.slug}.yaml`, `/${page.slug} is already a page. Rename the file.`)
  }
}

for (const { where, href } of linksInCopy) {
  if (!href.startsWith('/')) continue
  const [path, hash] = href.split('#')
  const route = path!.split('?')[0]!.replace(/\/$/, '') || '/'
  if (!routes.has(route)) {
    problem(where, `links to ${href}, but there is no page at ${route}.`)
    continue
  }
  const menuSlug = /^\/menus\/([^/]+)$/.exec(route)?.[1]
  if (hash && menuSlug && !getMenu(menuSlug)!.categories.some((c) => c.anchor === hash)) {
    problem(where, `links to ${href}, but the ${menuSlug} menu has no "${hash}" section.`)
  }
}

for (const menu of menus) {
  const file = `menus/${menu.slug}.yaml`
  menu.categories.forEach((category, ci) =>
    category.items.forEach((item, ii) => {
      if (!isLinked(item)) return
      const from = getMenu(item.from)
      if (!from) problem(`${file} → categories[${ci}].items[${ii}]`, `no menu called "${item.from}".`)
      else if (!findItem(from, item.item)) {
        problem(`${file} → categories[${ci}].items[${ii}]`, `"${item.item}" is not on the ${item.from} menu.`)
      }
    }),
  )
  for (const slug of menu.callout?.alsoOn ?? []) {
    if (!getMenu(slug)) problem(`${file} → callout.alsoOn`, `no menu called "${slug}".`)
  }
}

const allSections: [string, Section[]][] = [
  ['pages/home.yaml', home.sections],
  ...pages.map((p): [string, Section[]] => [`pages/${p.slug}.yaml`, p.sections]),
]
for (const [file, sections] of allSections) {
  sections.forEach((section, si) => {
    if (section.type !== 'menuItemCards') return
    section.items.forEach((pick, i) => {
      const slug = /\/menus\/([^/?#]+)/.exec(pick.link)![1]!
      const menu = getMenu(slug)
      if (menu && !findItem(menu, pick.item)) {
        problem(`${file} → sections[${si}].items[${i}]`, `"${pick.item}" is not on the ${slug} menu.`)
      }
    })
  })
}

for (const page of pages) {
  page.schemaMenu?.forEach((ref, i) => {
    const menu = getMenu(ref.menu)
    if (!menu) problem(`pages/${page.slug}.yaml → schemaMenu[${i}]`, `no menu called "${ref.menu}".`)
    else if (!menu.categories.some((c) => c.anchor === ref.category)) {
      problem(`pages/${page.slug}.yaml → schemaMenu[${i}]`, `the ${ref.menu} menu has no "${ref.category}" section.`)
    }
  })
}

throwProblems()
