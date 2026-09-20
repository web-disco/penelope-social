import type { Cta } from './types'
import { PAGE_SEO } from './seo'
import {
  BAKEHOUSE_CATERING_URL,
  BAKEHOUSE_ORDER_ONLINE_URL,
  CATERING_EVENTS_URL,
  GET_DIRECTIONS_HREF,
  ORDER_ONLINE_URL,
  RESERVATIONS_PATH,
  barHours,
  cafeHours,
  scarboroughBakehouse,
  woodbridgeNap,
} from './site'

export const locationsHubMeta = PAGE_SEO['/locations']!

export const locationsHub = {
  heading: 'Our locations',
  intro: 'Two sister spots. Woodbridge cafe and bar, Scarborough bakery.',
}

export const woodbridgeLocationMeta = PAGE_SEO['/locations/woodbridge']!

export const woodbridgeLocation = {
  heading: 'Penelope Social',
  hubTitle: 'Penelope Social',
  hubImage: {
    src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/6738fc337434df480308980c_penelope-social-gathering.avif',
    alt: 'Dinner service at Penelope Social',
    objectPosition: 'center 40%',
  },
  hubCta: { label: 'Visit Penelope Social', url: '/locations/woodbridge' },
  hubContact: {
    address: {
      label: `${woodbridgeNap.street}, ${woodbridgeNap.city}, ${woodbridgeNap.region} ${woodbridgeNap.postal}`,
      href: GET_DIRECTIONS_HREF,
    },
    phone: {
      label: woodbridgeNap.phone,
      href: `tel:${woodbridgeNap.phoneDigits}`,
    },
    email: {
      label: woodbridgeNap.email,
      href: `mailto:${woodbridgeNap.email}`,
    },
  },
  intro: 'Cafe, kitchen, and bar in Woodbridge',
  nap: woodbridgeNap,
  cafeHours,
  barHours,
  offeringsHeading: 'Cafe, kitchen, and bar',
  offeringsBody:
    'Penelope Social is the Woodbridge cafe and bar. Focaccia sandwiches and pizza at lunch, dinner plates and drinks after. Bread starts at Penelope Bakehouse in Scarborough.',
  detailHeading: 'Cafe by day, bar by night',
  detailCtas: [
    { label: 'Order online', url: ORDER_ONLINE_URL, style: 'primary' as const, newTab: true },
    { label: 'Reservations', url: RESERVATIONS_PATH, style: 'outline' as const },
  ] satisfies Cta[],
  hubBlurb: 'Cafe lunch and dinner, then late drinks.',
}

export const scarboroughLocationMeta = PAGE_SEO['/locations/scarborough']!

export const scarboroughLocation = {
  /**
   * `heading` is this page's H1; `hubTitle` labels its card on /locations.
   * They differ on purpose. Naming the sister brand twice (title tag + H1) made
   * this page outrank penelopebakehouse.com for "penelope bakehouse" from the
   * stronger domain, at 1.8% CTR against its 14.5%. The hub card still says
   * "Penelope Bakehouse" — that is the right label next to "Penelope Social" —
   * and the body copy, CTAs and Website row still hand off to the Bakehouse.
   */
  heading: 'Our Scarborough bakehouse',
  hubTitle: 'Penelope Bakehouse',
  hubImage: {
    src: 'https://penelopebakehouse.com/images/location-bakehouse.jpg',
    alt: 'Counter at Penelope Bakehouse in Scarborough',
    objectPosition: 'center 50%',
  },
  hubCta: { label: 'Visit Penelope Bakehouse', url: '/locations/scarborough' },
  hubContact: {
    address: {
      label: `${scarboroughBakehouse.street}, ${scarboroughBakehouse.city}, ${scarboroughBakehouse.region} ${scarboroughBakehouse.postal}`,
      href: scarboroughBakehouse.mapUrl,
    },
    phone: {
      label: scarboroughBakehouse.phone,
      href: `tel:${scarboroughBakehouse.phoneDigits}`,
    },
    email: {
      label: scarboroughBakehouse.email,
      href: `mailto:${scarboroughBakehouse.email}`,
    },
  },
  intro: 'Sister bakehouse in Scarborough',
  offeringsHeading: 'Sourdough and focaccia, baked there',
  offeringsBody:
    'Penelope Bakehouse is the Scarborough bakery. Loaves, focaccia sandwiches, pizza by the slice. Hours and the bakery menu live on penelopebakehouse.com.',
  hubBlurb: 'Sourdough and focaccia, pizza by the slice.',
  /**
   * Order online + Catering only, matching the pair penelopebakehouse.com puts
   * in its own hero — this page is the Bakehouse's presence on the Social site,
   * so the two should not offer a different set of actions. The dropped
   * "Visit penelopebakehouse.com" button is not a lost route: the Website row
   * in the detail table (scarborough.astro) still links out.
   */
  ctas: [
    {
      label: 'Order online',
      url: BAKEHOUSE_ORDER_ONLINE_URL,
      style: 'primary' as const,
      newTab: true,
    },
    {
      label: 'Catering',
      url: BAKEHOUSE_CATERING_URL,
      style: 'outline' as const,
      newTab: true,
    },
  ] satisfies Cta[],
  bakehouse: scarboroughBakehouse,
  hours: [
    { label: 'Hours', lines: ['Monday to Friday: 9am to 3pm', 'Saturday and Sunday: Closed'] },
  ],
}

export const cateringEventsUrl = CATERING_EVENTS_URL
