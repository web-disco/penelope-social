import type { SeoMeta } from './types'
import { restaurantCopy, usesVaughanAsCity } from './copy'

/**
 * Unique meta titles + descriptions per URL.
 * Woodbridge is the city. Vaughan is not used in titles.
 */
export const PAGE_SEO: Record<string, SeoMeta> = {
  '/': {
    title: 'Penelope Social | Cafe and bar in Woodbridge',
    description:
      'Cafe by day and a bar by night at 125 Hawkview Blvd, Woodbridge. Lunch, dinner, and drinks — sourdough from Penelope Bakehouse in Scarborough.',
  },
  '/about': {
    title: 'About Penelope Social | Woodbridge restaurant',
    description:
      'Three brothers, a Woodbridge restaurant, and bread from Penelope Bakehouse in Scarborough. The family story behind cafe, kitchen, and bar.',
  },
  '/contact': {
    title: 'Contact Penelope Social in Woodbridge',
    description:
      'Call (905) 607-0606, email info@penelopesocial.com, or write us at 125 Hawkview Blvd, Woodbridge. Reservations, catering, and general questions.',
  },
  '/catering-events': {
    title: 'Catering and events in Woodbridge | Penelope Social',
    description:
      'Plan catering or a private event at Penelope Social, 125 Hawkview Blvd, Woodbridge. Trays to-go or a night in the restaurant. 24 hours’ notice for catering.',
  },
  '/menus': {
    title: 'Menus | Lunch, dinner, bar, and catering | Penelope Social',
    description:
      'Lunch, dinner, bar, and catering menus at Penelope Social in Woodbridge. Focaccia sandwiches, pizza, handhelds, and cocktails.',
  },
  '/menus/lunch': {
    title: 'Lunch menu | Penelope Social Woodbridge',
    description:
      'Lunch at Penelope Social in Woodbridge: focaccia sandwiches, pizza, and salads. Monday–Saturday, 10am–3pm at 125 Hawkview Blvd.',
  },
  '/menus/dinner': {
    title: 'Dinner menu | Penelope Social Woodbridge',
    description:
      'Dinner in Woodbridge: pizza, handhelds, and shareable plates at Penelope Social. Monday–Saturday from 5pm at 125 Hawkview Blvd.',
  },
  '/menus/bar': {
    title: 'Bar menu | Cocktails in Woodbridge | Penelope Social',
    description:
      'Cocktails, wine, and a late bar at Penelope Social in Woodbridge. Monday–Thursday 5pm–10pm, Friday–Saturday 5pm–1am.',
  },
  '/menus/catering': {
    title: 'Catering tray menu | Pizza, focaccia, salads | Penelope Social',
    description:
      'Party trays from the Woodbridge kitchen: 24-slice pizzas, focaccia sandwiches (min 6), breads, and salads for 8–10. Prices on this page. Book trays on Catering and events — 24 hours’ notice.',
  },
  '/merchandise': {
    title: 'Merch | Penelope Social',
    description:
      'Hoodies, tees, and totes from Penelope Social — the Woodbridge cafe and bar. Take a piece of the restaurant home.',
  },
  '/merchandise/tote-bag': {
    title: 'Tote bag | Penelope Social merch',
    description: 'Penelope Social tote bag. Shop restaurant merch from the Woodbridge cafe and bar.',
  },
  '/merchandise/hoodie': {
    title: 'Hoodie | Penelope Social merch',
    description: 'Penelope Social hoodie. Shop restaurant merch from the Woodbridge cafe and bar.',
  },
  '/merchandise/t-shirt': {
    title: 'T-shirt | Penelope Social merch',
    description: 'Penelope Social t-shirt. Shop restaurant merch from the Woodbridge cafe and bar.',
  },
  '/locations': {
    title: 'Locations | Penelope Social and Penelope Bakehouse',
    description:
      'Penelope Social is the Woodbridge restaurant at 125 Hawkview Blvd. Penelope Bakehouse is the Scarborough micro-bakery at 71 Howden Rd.',
  },
  '/locations/woodbridge': {
    title: 'Woodbridge | Penelope Social | 125 Hawkview Blvd',
    description:
      'Visit Penelope Social at 125 Hawkview Blvd, Woodbridge. Cafe hours, bar hours, phone, and directions. Reservations on Toast.',
  },
  '/locations/scarborough': {
    title: 'Scarborough Bakehouse | Sister to Penelope Social',
    description:
      'Penelope Bakehouse at 71 Howden Rd, Scarborough is the micro-bakery sister to Penelope Social. Bread starts there. Visit penelopebakehouse.com.',
  },
}

export function normalizePath(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || '/'
  return path
}

export function resolveSeo(
  pathname: string,
  cms?: { metaTitle?: string; metaDescription?: string },
): SeoMeta {
  const path = normalizePath(pathname)
  const defaults = PAGE_SEO[path]
  // GSC: /menus/catering is crawled, not indexed. Repo copy wins over a thin CMS duplicate of /catering-events.
  if (path === '/menus/catering' && defaults) return defaults
  const cmsTitle = cms?.metaTitle?.trim()
  const cmsDescription = cms?.metaDescription?.trim()

  const title =
    cmsTitle && !usesVaughanAsCity(cmsTitle)
      ? restaurantCopy(cmsTitle, defaults?.title)
      : (defaults?.title ?? restaurantCopy(cmsTitle) ?? 'Penelope Social')

  const description =
    cmsDescription && !usesVaughanAsCity(cmsDescription)
      ? restaurantCopy(cmsDescription, defaults?.description)
      : (defaults?.description ?? restaurantCopy(cmsDescription) ?? '')

  return { title, description }
}
