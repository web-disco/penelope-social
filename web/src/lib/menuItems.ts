import { getAll } from './data'
import { menuTitle } from '../data/copy'

/**
 * A dish picked from a menu document by name. The menu comes from `link`
 * ("/menus/lunch#pizza-slices" -> lunch). `menu` is the older Sanity reference
 * or slug, still read so cards saved before the link field keep resolving.
 */
export interface MenuItemPick {
  item: string
  link?: string
  menu?: string | { _ref?: string }
}

/** "/menus/lunch#pizza-slices" -> "lunch". Mirrors the Studio's menuItemCards validation. */
export function menuSlugFromLink(link?: string): string | undefined {
  return /\/menus\/([^/?#]+)/.exec(link ?? '')?.[1]
}

/** "/menus/lunch#pizza-slices" -> "pizza-slices". */
function anchorFromLink(link?: string): string | undefined {
  return /#([^?]+)$/.exec(link ?? '')?.[1]
}

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

/** "Buona Notte (3oz)" and "buona notte" are the same item. */
function key(title: string): string {
  return title
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim()
    .toLowerCase()
}

/**
 * Looks a pick up on its menu so the card quotes the same name, description
 * and price as /menus/*. Returns null when the item is gone — menus are edited
 * in Sanity and a publish triggers a production build, so a stale pick must
 * not fail it.
 */
export async function resolveMenuItem(pick: MenuItemPick): Promise<ResolvedMenuItem | null> {
  const menus = await getAll<any>('menu')
  const slug = menuSlugFromLink(pick.link) ?? (typeof pick.menu === 'string' ? pick.menu : undefined)
  const ref = !slug && typeof pick.menu === 'object' ? pick.menu?._ref?.replace(/^drafts\./, '') : undefined
  const menu = menus.find((m) => (ref ? m._id === ref : m.slug?.current === slug))
  // The link's anchor names the category, so a dish on two lists quotes the one linked.
  const anchor = anchorFromLink(pick.link)
  const categories: any[] = [...(menu?.categories ?? [])].sort(
    (a, b) => Number(b.anchor?.current === anchor) - Number(a.anchor?.current === anchor),
  )
  const category = categories.find((c) =>
    c.items?.some((candidate: any) => candidate?.title && key(candidate.title) === key(pick.item)),
  )
  const item = category?.items.find((candidate: any) => candidate?.title && key(candidate.title) === key(pick.item))

  if (!item) {
    console.warn(`[menuItems] "${pick.item}" is not on the ${menu?.slug?.current ?? 'referenced'} menu; skipped`)
    return null
  }
  const tier = firstTier(item.price)
  return {
    title: menuTitle(item.title),
    description: item.description,
    price: tier?.price ?? item.price,
    priceUnit: tier?.unit ?? (item.price ? priceUnit(category.title) : undefined),
    menuUrl: `/menus/${menu.slug.current}`,
  }
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

/**
 * A menu's categories with every "item from another menu" (menuItemLink)
 * swapped for the item it points at: the source's name and description, at
 * this menu's price. The Happy Hour list is built this way, so its dishes
 * cannot drift from Dinner's. A link whose item is gone is dropped, not
 * rendered blank — same reasoning as resolveMenuItem.
 */
export function resolveMenuLinks(menu: any, menus: any[]): any {
  const byId = new Map(menus.map((m) => [String(m._id).replace(/^drafts\./, ''), m]))
  const categories = (menu.categories ?? []).map((category: any) => ({
    ...category,
    items: (category.items ?? []).flatMap((item: any) => {
      if (item?._type !== 'menuItemLink') return [item]
      const source = byId.get(String(item.menu?._ref ?? '').replace(/^drafts\./, ''))
      const original = source?.categories
        ?.flatMap((c: any) => c.items ?? [])
        .find((candidate: any) => candidate?._key === item.itemKey && candidate._type !== 'menuItemLink')
      if (!original?.title) {
        console.warn(`[menuItems] ${menu.slug?.current}: linked item ${item.itemKey} not found; skipped`)
        return []
      }
      return [{ _key: item._key, _type: 'menuItem', title: original.title, description: original.description, price: item.price }]
    }),
  }))
  return { ...menu, categories }
}

export interface MenuItemOffer {
  /** The menu offering it — "Happy Hour". */
  label: string
  /** Its price there. */
  price: string
  /** Straight to the section that lists it: "/menus/happy-hour#food". */
  url: string
}

/**
 * The reverse of resolveMenuLinks: for one menu, which of its items another
 * menu borrows, and at what price. Dinner's Crunchwrap is on Happy Hour at
 * 12, so Dinner can say so next to it. Keyed by the item's _key, the same
 * key the link stores.
 */
export function offersFor(menu: any, menus: any[]): Map<string, MenuItemOffer> {
  const id = String(menu._id).replace(/^drafts\./, '')
  const offers = new Map<string, MenuItemOffer>()
  for (const other of menus) {
    if (!other.slug?.current || String(other._id).replace(/^drafts\./, '') === id) continue
    for (const category of other.categories ?? []) {
      for (const item of category.items ?? []) {
        if (item?._type !== 'menuItemLink' || !item.itemKey || !item.price) continue
        if (String(item.menu?._ref ?? '').replace(/^drafts\./, '') !== id) continue
        const anchor = category.anchor?.current ? `#${category.anchor.current}` : ''
        offers.set(item.itemKey, {
          label: menuTitle(other.title),
          price: item.price,
          url: `/menus/${other.slug.current}${anchor}`,
        })
      }
    }
  }
  return offers
}
