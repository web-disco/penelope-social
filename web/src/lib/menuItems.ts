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
  /** What the price buys when a card mixes units: "slice", "14\" pie". */
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
  if (/slice/i.test(categoryTitle)) return 'slice'
  const size = /\((\d+)["”]\s*round\)/i.exec(categoryTitle)?.[1]
  return size ? `${size}" pie` : undefined
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
  return {
    title: menuTitle(item.title),
    description: item.description,
    price: item.price,
    priceUnit: item.price ? priceUnit(category.title) : undefined,
    menuUrl: `/menus/${menu.slug.current}`,
  }
}
