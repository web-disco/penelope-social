/**
 * Shared GA4 event names + href classifiers.
 * Runtime firing lives in BaseLayout (inline) and src/scripts/ga.ts.
 */

export const GA_MEASUREMENT_ID_DEFAULT = 'G-ELZ7PDF4CN'

export type OrderPlacement = 'hero' | 'nav' | 'menu' | 'footer' | 'drawer'

export const ORDER_PLACEMENTS: ReadonlySet<string> = new Set([
  'hero',
  'nav',
  'menu',
  'footer',
  'drawer',
])

export function isSocialTelHref(href: string): boolean {
  if (!href.toLowerCase().startsWith('tel:')) return false
  const digits = href.replace(/\D/g, '')
  return digits === '9056070606' || digits === '19056070606'
}

export function isSocialOrderHref(href: string): boolean {
  if (!href) return false
  return /order\.toasttab\.com\/online\/penelope-social/i.test(href)
}

export function isSocialGiftCardHref(href: string): boolean {
  if (!href) return false
  return /order\.toasttab\.com\/egiftcards\/penelope-social/i.test(href)
}

export function isReservationHref(href: string): boolean {
  if (!href) return false
  if (href === '/reservations' || href.endsWith('/reservations')) return true
  return /tables\.toasttab\.com\/restaurants\/bfe7aa9b-9c6d-4de4-b0e5-79d3aaf65ce0/i.test(href)
}

export function isCateringHref(href: string): boolean {
  if (!href) return false
  const path = href.replace(/^https?:\/\/[^/]+/i, '').replace(/\/$/, '') || '/'
  return path === '/catering-events'
}

export function isMerchHref(href: string): boolean {
  if (!href) return false
  const path = href.replace(/^https?:\/\/[^/]+/i, '').replace(/\/$/, '') || '/'
  return path === '/merchandise' || path.startsWith('/merchandise/')
}

export function isMapsDirectionsHref(href: string): boolean {
  try {
    const url = new URL(href, 'https://penelopesocial.com')
    const host = url.hostname.toLowerCase()
    if (host === 'maps.apple.com') return true
    if (host === 'maps.google.com' || host === 'www.google.com' || host === 'google.com') {
      return url.pathname.includes('/maps') || url.search.includes('destination=') || url.search.includes('api=1')
    }
    return false
  } catch {
    return false
  }
}
