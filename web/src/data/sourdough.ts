import { PAGE_SEO } from './seo'
import { BAKEHOUSE_SITE_URL, woodbridgeNap, scarboroughBakehouse } from './site'

export const sourdoughMeta = PAGE_SEO['/sourdough-bakery']!

/**
 * Disambiguation for GSC queries that hit this indexed URL
 * (penelope bakehouse, bakehouse menu, photos, Scarborough).
 * Not a 301 to /about. Not a 301 to Bakehouse.
 */
export const sourdoughPage = {
  heading: 'Two Penelopes',
  subheading:
    'Penelope Social is the Woodbridge restaurant. Penelope Bakehouse is the Scarborough micro-bakery.',
  banner: {
    src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/673fe4fbd904d89c7a43b7f4_bakery-banner.avif',
    alt: 'Sourdough loaves from Penelope',
  },
  social: {
    title: 'Penelope Social',
    place: 'Woodbridge restaurant',
    body: 'Cafe by day, kitchen and bar at night at 125 Hawkview Blvd. Lunch, dinner, and drinks. Vince’s sourdough starter is named Penelope — we serve that bread here as sandwiches, pizza, and loaves on the table.',
    address: `${woodbridgeNap.street}, ${woodbridgeNap.city}, ${woodbridgeNap.region} ${woodbridgeNap.postal}`,
    cta: { label: 'Visit the restaurant', url: '/locations/woodbridge' },
  },
  bakehouse: {
    title: 'Penelope Bakehouse',
    place: 'Scarborough micro-bakery',
    body: '71 Howden Rd, Scarborough. Counter service — loaves, focaccia sandwiches, and pizza by the slice. This is where the sourdough is baked. Menu, hours, photos, and online order live on penelopebakehouse.com.',
    address: `${scarboroughBakehouse.street}, ${scarboroughBakehouse.city}, ${scarboroughBakehouse.region} ${scarboroughBakehouse.postal}`,
    cta: { label: 'Go to penelopebakehouse.com', url: BAKEHOUSE_SITE_URL },
  },
  originHeading: 'Vince’s sourdough, served at Social',
  origin: [
    'On May 17, 2017, Vince Stalteri left construction to follow food. On January 1, 2018 he set out to learn sourdough. In February he made starter Anastasia, neglected it while opening the restaurant, revived it, and renamed it Penelope.',
    'That starter is the through-line. Social is the Woodbridge room where you sit down with the bread. Bakehouse is the Scarborough shop where the loaves are baked. If you searched for the bakery menu, photos, or Scarborough hours, you want Bakehouse.',
  ],
}
