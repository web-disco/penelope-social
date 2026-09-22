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

export interface ResolvedMenuItem {
  title: string
  description?: string
  price?: string
  menuUrl: string
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
  const item = menu?.categories
    ?.flatMap((category: any) => category.items ?? [])
    .find((candidate: any) => candidate?.title && key(candidate.title) === key(pick.item))

  if (!item) {
    console.warn(`[menuItems] "${pick.item}" is not on the ${menu?.slug?.current ?? 'referenced'} menu; skipped`)
    return null
  }
  return {
    title: menuTitle(item.title),
    description: item.description,
    price: item.price,
    menuUrl: `/menus/${menu.slug.current}`,
  }
}
