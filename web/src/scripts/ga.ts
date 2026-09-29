/**
 * Fallback GA4 click binder. Production clicks are captured in BaseLayout.
 */

import {
  ORDER_PLACEMENTS,
  isBakehouseSiteHref,
  isCateringHref,
  isMapsDirectionsHref,
  isMerchHref,
  isReservationHref,
  isSocialGiftCardHref,
  isSocialOrderHref,
  isSocialTelHref,
  type OrderPlacement,
} from '../lib/analytics'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __pbGaBound?: boolean
  }
}

function isProductionHost(): boolean {
  const host = window.location.hostname.toLowerCase()
  return host === 'penelopesocial.com' || host === 'www.penelopesocial.com'
}

export function track(name: string, params: Record<string, string> = {}) {
  if (!isProductionHost()) return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, { ...params, transport_type: 'beacon' })
}

function hrefOf(anchor: HTMLAnchorElement): string {
  return anchor.getAttribute('href') ?? ''
}

function orderPlacement(anchor: HTMLAnchorElement): OrderPlacement | undefined {
  const explicit = anchor.getAttribute('data-ga-placement')
  if (explicit && ORDER_PLACEMENTS.has(explicit)) return explicit as OrderPlacement
  if (anchor.closest('.menu-drawer')) return 'drawer'
  if (anchor.closest('.navbar, [data-navbar]')) return 'nav'
  if (anchor.closest('.section-home-hero, .home-hero')) return 'hero'
  if (anchor.closest('.footer')) return 'footer'
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/menus' || path.startsWith('/menus/')) return 'menu'
  return undefined
}

function eventFromMarkup(anchor: HTMLAnchorElement): { name: string; params: Record<string, string> } | null {
  const named = anchor.getAttribute('data-ga-event')
  if (!named) return null
  const params: Record<string, string> = {}
  if (named === 'order_click') {
    const placement = orderPlacement(anchor)
    if (placement) params.placement = placement
  } else {
    // Other named events may carry a placement too (review_click: rating_badge / footer).
    const placement = anchor.getAttribute('data-ga-placement')
    if (placement) params.placement = placement
    const item = anchor.getAttribute('data-ga-item')
    if (item) params.item = item
  }
  return { name: named, params }
}

/** Where on the page an untagged link sits: footer, faq, nav or content. */
function contextOf(el: Element): string {
  if (el.closest('.footer')) return 'footer'
  if (el.closest('.section-faq')) return 'faq'
  if (el.closest('.menu-drawer, .navbar, [data-navbar]')) return 'nav'
  return 'content'
}

function eventFromHref(
  href: string,
  anchor: HTMLAnchorElement,
): { name: string; params: Record<string, string> } | null {
  if (isSocialGiftCardHref(href)) return { name: 'gift_card_click', params: {} }
  if (isSocialOrderHref(href)) {
    const placement = orderPlacement(anchor)
    return { name: 'order_click', params: placement ? { placement } : {} }
  }
  if (isReservationHref(href)) return { name: 'reservation_click', params: {} }
  if (isCateringHref(href)) return { name: 'catering_click', params: {} }
  if (isMerchHref(href)) return { name: 'merch_click', params: {} }
  if (isSocialTelHref(href)) return { name: 'click_to_call', params: {} }
  if (isBakehouseSiteHref(href)) return { name: 'bakehouse_click', params: { placement: contextOf(anchor) } }
  if (/^mailto:/i.test(href)) return { name: 'email_click', params: { placement: contextOf(anchor) } }
  if (anchor.classList.contains('is-google-review')) return null
  if (/google reviews/i.test(anchor.textContent ?? '')) return null
  if (isMapsDirectionsHref(href)) return { name: 'get_directions', params: {} }
  return null
}

export function initAnalyticsClicks() {
  if (window.__pbGaBound) return
  window.__pbGaBound = true
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const bound = eventFromMarkup(anchor) ?? eventFromHref(hrefOf(anchor), anchor)
      if (!bound) return
      track(bound.name, bound.params)
    },
    true,
  )
  document.addEventListener(
    'toggle',
    (event) => {
      const details = event.target
      if (!(details instanceof HTMLDetailsElement) || !details.open || !details.closest('.section-faq')) return
      const q = details.querySelector('[data-faq-question]') ?? details.querySelector('summary')
      const question = (q?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 100)
      if (question) track('faq_open', { question })
    },
    true,
  )
}
