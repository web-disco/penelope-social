import { PAGE_SEO } from './seo'
import { BAKEHOUSE_SITE_URL, ORDER_ONLINE_URL, RESERVATIONS_PATH } from './site'

export const sourdoughMeta = PAGE_SEO['/sourdough-bakery']!

/**
 * Indexed URL that GSC shows as Bakehouse confusion.
 * Stay on this site. Do not 301 to /about or to penelopebakehouse.com.
 */
export const sourdoughPage = {
  heading: 'Bakehouse sourdough, served here',
  subheading: 'Bakehouse bread on the table at Social.',
  banner: {
    src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/673fe4fbd904d89c7a43b7f4_bakery-banner.avif',
    alt: 'Sourdough loaves from Penelope',
  },
  social: {
    heading: 'Eat and drink here',
    body: 'Sit down here for lunch and dinner, plus drinks on the sourdough we serve from the Bakehouse.',
    image: {
      src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/6738fc337434df480308980c_penelope-social-gathering.avif',
      alt: 'Dinner service at Penelope Social',
    },
    layout: 'image-first' as const,
    ctas: [
      { label: 'See the menus', url: '/menus', style: 'primary' as const },
      { label: 'Reservations', url: RESERVATIONS_PATH, style: 'outline' as const },
    ],
  },
  bakehouse: {
    heading: 'Baked in Scarborough',
    body: 'Loaves, focaccia sandwiches, and pizza by the slice, baked at the Scarborough bakehouse and focacceria.',
    image: {
      src: 'https://penelopebakehouse.com/images/location-bakehouse.jpg',
      alt: 'Counter at Penelope Bakehouse',
    },
    layout: 'copy-first' as const,
    ctas: [
      { label: 'Visit penelopebakehouse.com', url: BAKEHOUSE_SITE_URL, style: 'primary' as const, newTab: true },
    ],
  },
  orderOnlineUrl: ORDER_ONLINE_URL,
}
