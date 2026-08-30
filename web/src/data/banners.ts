/**
 * On-photo H1 + lede for every inner banner (Bakehouse catering style).
 * No periods in H1s. No em dashes. One short sentence that stays one line at 1440.
 */
import { restaurantCopy } from './copy'

export const pageBannerCopy: Record<string, { heading: string; intro: string }> = {
  '/menus': {
    heading: 'On the menu',
    intro: 'Lunch, dinner, drinks, and catering.',
  },
  '/menus/lunch': {
    heading: 'Lunch',
    intro: 'Focaccia sandwiches, pizza, and salads.',
  },
  '/menus/dinner': {
    heading: 'Dinner',
    intro: 'Pizza, handhelds, and shareable plates.',
  },
  '/menus/bar': {
    heading: 'Bar',
    intro: 'Cocktails, wine, and beer till late.',
  },
  '/menus/catering': {
    heading: 'Catering tray menu',
    intro: 'Party pizzas, sandwiches, breads, and salads.',
  },
  '/catering-events': {
    heading: 'Catering and events',
    intro: 'Trays to-go, or a night in the room.',
  },
  '/contact': {
    heading: 'Get in touch',
    intro: 'Questions, a table, or an event.',
  },
  '/merchandise': {
    heading: 'Merch',
    intro: 'Hoodies, tees, and totes. Pick them up in store.',
  },
}

export function bannerCopyFor(path: string, fallback?: { heading?: string; intro?: string }) {
  const known =
    pageBannerCopy[path] ||
    (path.startsWith('/merchandise/') ? pageBannerCopy['/merchandise'] : undefined)
  const heading = restaurantCopy(known?.heading || fallback?.heading || '').replace(/\.$/, '')
  const intro = restaurantCopy(known?.intro || fallback?.intro || '')
  return { heading, intro }
}
