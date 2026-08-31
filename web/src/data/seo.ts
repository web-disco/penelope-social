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
      'Cafe and bar at 125 Hawkview Blvd, Woodbridge. Focaccia sandwiches, sourdough pizza, and cocktails, made fresh daily.',
  },
  '/about': {
    title: 'About Penelope Social | Woodbridge cafe and bar',
    description:
      'The Stalteri brothers, a Woodbridge cafe and bar, and bread from Penelope Bakehouse. The family story behind lunch and dinner, plus drinks.',
  },
  '/contact': {
    title: 'Contact Penelope Social in Woodbridge',
    description:
      'Call (905) 607-0606, email info@penelopesocial.com, or write us at 125 Hawkview Blvd, Woodbridge. Reservations and catering, plus general questions.',
  },
  '/catering-events': {
    title: 'Catering and events in Woodbridge | Penelope Social',
    description:
      'Plan catering or a private event at Penelope Social, 125 Hawkview Blvd, Woodbridge. Trays to-go or a night in the restaurant. 24 hours’ notice for catering.',
  },
  '/menus': {
    title: 'Menus | Lunch, dinner, bar, and catering | Penelope Social',
    description:
      'Lunch, dinner, bar, and catering menus at Penelope Social in Woodbridge. Focaccia sandwiches, pizza, handhelds, plus cocktails.',
  },
  '/menus/lunch': {
    title: 'Lunch menu | Penelope Social Woodbridge',
    description:
      'Lunch at Penelope Social in Woodbridge: focaccia sandwiches and pizza, plus salads. Monday to Saturday, 10am to 3pm at 125 Hawkview Blvd.',
  },
  '/menus/dinner': {
    title: 'Dinner menu | Penelope Social Woodbridge',
    description:
      'Dinner in Woodbridge: pizza, handhelds, shareable plates at Penelope Social. Monday to Saturday from 5pm at 125 Hawkview Blvd.',
  },
  '/menus/bar': {
    title: 'Bar menu | Cocktails in Woodbridge | Penelope Social',
    description:
      'Cocktails, wine, and a late bar at Penelope Social in Woodbridge. Monday to Thursday 5pm to 10pm, Friday to Saturday 5pm to 1am.',
  },
  '/menus/catering': {
    title: 'Catering tray menu | Pizza, focaccia, salads | Penelope Social',
    description:
      'Party trays from the Woodbridge kitchen: 24-slice pizzas, focaccia sandwiches (min 6), breads, and salads for 8 to 10. Prices on this page. Book trays on Catering and events. We prefer 24 hours notice.',
  },
  '/merchandise': {
    title: 'Merch | Penelope Social',
    description:
      'Hoodies, tees, totes from Penelope Social, the Woodbridge cafe and bar. Take a piece of the restaurant home.',
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
      'Penelope Social is the Woodbridge restaurant at 125 Hawkview Blvd. Penelope Bakehouse is the Scarborough bakehouse at 71 Howden Rd.',
  },
  '/locations/woodbridge': {
    title: 'Woodbridge | Penelope Social | 125 Hawkview Blvd',
    description:
      'Visit Penelope Social at 125 Hawkview Blvd, Woodbridge. Cafe hours, bar hours, phone, plus directions. Reservations on Toast.',
  },
  '/locations/scarborough': {
    title: 'Scarborough Bakehouse | Penelope Bakehouse',
    description:
      'Penelope Bakehouse at 71 Howden Rd, Scarborough is the bakehouse and focacceria. Bread for Penelope Social starts there. Visit penelopebakehouse.com.',
  },
  '/sourdough-bakery': {
    title: 'Bakehouse sourdough, served here | Penelope Social',
    description:
      'Vince’s starter lives at Penelope Social in Woodbridge. The loaves are baked at Penelope Bakehouse in Scarborough. Menu, hours, online order at penelopebakehouse.com.',
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
  // Repo wins: stale CMS still says “Best Sourdough Bakery in Vaughan”.
  if ((path === '/menus/catering' || path === '/sourdough-bakery') && defaults) return defaults
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
