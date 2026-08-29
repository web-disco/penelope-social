/**
 * On-photo H1 + lede for every inner banner (Bakehouse catering style).
 * No periods in H1s. No em dashes. One short sentence.
 */
import { restaurantCopy } from './copy'
import { homeMenusFallback } from './home'

export const pageBannerCopy: Record<string, { heading: string; intro: string }> = {
  '/menus': {
    heading: 'On the menu',
    intro: homeMenusFallback.hubIntro,
  },
  '/menus/lunch': {
    heading: 'Lunch',
    intro: 'Focaccia sandwiches, pizza, and salads, Monday to Saturday, 10am to 3pm.',
  },
  '/menus/dinner': {
    heading: 'Dinner',
    intro: 'Pizza, handhelds, and shareable plates, Monday to Saturday from 5pm.',
  },
  '/menus/bar': {
    heading: 'Bar',
    intro: 'Cocktails, wine, and a late sit, from 5pm Monday to Saturday.',
  },
  '/menus/catering': {
    heading: 'Catering tray menu',
    intro: 'Party pizzas, focaccia sandwiches, breads, and salads for 8 to 10.',
  },
  '/catering-events': {
    heading: 'Catering and events',
    intro: 'Trays to-go or a night in the room, with pizza, focaccia, drinks, and a table we will set.',
  },
  '/contact': {
    heading: 'Get in touch',
    intro: 'Questions, a table, or an event. Call, email, or write us.',
  },
  '/merchandise': {
    heading: 'Merch',
    intro: 'Hoodies, tees, and totes from the Woodbridge cafe and bar.',
  },
}

export function bannerCopyFor(path: string, fallback?: { heading?: string; intro?: string }) {
  const known = pageBannerCopy[path]
  const heading = restaurantCopy(known?.heading || fallback?.heading || '').replace(/\.$/, '')
  const intro = restaurantCopy(known?.intro || fallback?.intro || '')
  return { heading, intro }
}
