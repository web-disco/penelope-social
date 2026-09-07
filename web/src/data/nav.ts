/**
 * Header + drawer IA.
 *
 * Bakehouse order is Menu → About → Locations → Gift Cards → Catering.
 * Social keeps that sequence, uses plural “Menus”, and adds Merch last.
 * Catering always points at /catering-events (the events form), not /menus/catering (trays).
 *
 * Live Sanity still has “Our Menus”, Bakery, and no Locations. This resolver
 * rewrites those labels/rows in code so drafts do not have to be published first.
 */

export type NavLink = {
  label: string
  url: string
  newTab?: boolean
}

export const GIFT_CARDS_URL =
  'https://order.toasttab.com/egiftcards/penelope-social-125-hawkview-boulevard'

export const DEFAULT_NAV: NavLink[] = [
  { label: 'Menus', url: '/menus' },
  { label: 'About', url: '/about' },
  { label: 'Locations', url: '/locations' },
  { label: 'Gift Cards', url: GIFT_CARDS_URL, newTab: true },
  { label: 'Catering', url: '/catering-events' },
  { label: 'Merch', url: '/merchandise' },
]

const CANONICAL_KEYS = ['menus', 'about', 'locations', 'gift', 'catering', 'merch'] as const
type NavKey = (typeof CANONICAL_KEYS)[number]

export function isBakeryNav(link: { label?: string; url?: string }) {
  return /^bakery$/i.test(link.label ?? '') || /sourdough-bakery/i.test(link.url ?? '')
}

export function isMerchNav(link: { label?: string; url?: string }) {
  return /^merch$/i.test(link.label ?? '') || /\/merchandise/i.test(link.url ?? '')
}

function pathOf(url?: string) {
  if (!url) return ''
  try {
    const parsed = /^https?:\/\//i.test(url) ? new URL(url) : new URL(url, 'https://penelopesocial.com')
    return parsed.pathname.replace(/\/$/, '') || '/'
  } catch {
    return url.split('#')[0]?.split('?')[0]?.replace(/\/$/, '') || ''
  }
}

function navKey(link: { label?: string; url?: string }): NavKey | string {
  const url = (link.url ?? '').trim()
  const path = pathOf(url)
  const label = (link.label ?? '').trim().toLowerCase()

  if (path === '/menus' || /^(our\s+)?menus?$/.test(label)) return 'menus'
  if (path === '/about' || /^about(\s+us)?$/.test(label)) return 'about'
  if (path === '/locations' || path.startsWith('/locations/') || /locations?/.test(label)) {
    return 'locations'
  }
  if (/egiftcards/i.test(url) || /gift/.test(label)) return 'gift'
  if (path === '/catering-events' || /^catering/.test(label)) return 'catering'
  if (path === '/merchandise' || /^merch/.test(label)) return 'merch'
  return path || url || label
}

/** “Our Menus” / “Menu” / “Our Menu” → “Menus”. Other chrome labels stay as written. */
export function menusNavLabel(label?: string) {
  const raw = (label ?? '').trim()
  if (!raw) return 'Menus'
  if (/^(our\s+)?menus?$/i.test(raw)) return 'Menus'
  return raw
}

function canonicalFor(key: NavKey): NavLink {
  return DEFAULT_NAV[CANONICAL_KEYS.indexOf(key)]!
}

/**
 * Bakehouse order + Social extras. Authored CMS links supply URLs when they
 * match a known item; labels and missing Locations come from DEFAULT_NAV.
 */
export function resolveNavLinks(authored: unknown): NavLink[] {
  const incoming = Array.isArray(authored)
    ? (authored as NavLink[]).filter((link) => link?.url && !isBakeryNav(link))
    : []

  const byKey = new Map<string, NavLink>()
  for (const link of incoming) {
    byKey.set(navKey(link), link)
  }

  const resolved = CANONICAL_KEYS.map((key) => {
    const canonical = canonicalFor(key)
    const match = byKey.get(key)
    if (!match) return canonical
    return {
      label: canonical.label,
      url: key === 'catering' ? '/catering-events' : match.url || canonical.url,
      newTab: match.newTab ?? canonical.newTab,
    }
  })

  const extras = incoming.filter((link) => {
    const key = navKey(link)
    return !CANONICAL_KEYS.includes(key as NavKey)
  })

  return [...resolved, ...extras]
}
