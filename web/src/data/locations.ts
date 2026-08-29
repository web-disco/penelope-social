import type { Cta } from './types'
import { PAGE_SEO } from './seo'
import {
  BAKEHOUSE_SITE_URL,
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
  intro: 'Woodbridge restaurant and Scarborough bakehouse',
}

export const woodbridgeLocationMeta = PAGE_SEO['/locations/woodbridge']!

export const woodbridgeLocation = {
  heading: 'Penelope Social in Woodbridge',
  hubTitle: 'Penelope Social',
  hubImage: {
    src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/6738fc337434df480308980c_penelope-social-gathering.avif',
    alt: 'Dinner service at Penelope Social in Woodbridge',
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
  intro: 'Cafe by day, bar by night',
  nap: woodbridgeNap,
  cafeHours,
  barHours,
  offeringsHeading: 'Cafe, kitchen, and bar',
  offeringsBody:
    'Penelope Social is the Woodbridge restaurant. Cafe by day with focaccia sandwiches and Bakehouse bread. Dinner and drinks at night. The sourdough starts at Penelope Bakehouse in Scarborough.',
  detailHeading: 'Cafe by day, bar by night',
  detailCtas: [
    { label: 'Order online', url: ORDER_ONLINE_URL, style: 'primary' as const, newTab: true },
    { label: 'Reservations', url: RESERVATIONS_PATH, style: 'outline' as const },
  ] satisfies Cta[],
  hubBlurb: 'Woodbridge restaurant. Cafe by day, bar by night. Bakehouse sourdough on the table.',
}

export const scarboroughLocationMeta = PAGE_SEO['/locations/scarborough']!

export const scarboroughLocation = {
  heading: 'Penelope Bakehouse in Scarborough',
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
  intro: 'The Scarborough micro-bakery — not a second Social dining room',
  offeringsHeading: 'Micro-bakery, not a dining room',
  offeringsBody:
    'Penelope Bakehouse at 71 Howden Rd, Scarborough is our sister micro-bakery. Loaves, focaccia sandwiches, and pizza by the slice. Bread for Penelope Social starts there. Hours, menu, and orders live on penelopebakehouse.com.',
  hubBlurb: 'Scarborough micro-bakery. Sourdough for both places starts here.',
  ctas: [
    { label: 'Visit penelopebakehouse.com', url: BAKEHOUSE_SITE_URL, style: 'primary' as const, newTab: true },
    { label: 'Social in Woodbridge', url: '/locations/woodbridge', style: 'outline' as const },
  ] satisfies Cta[],
  bakehouse: scarboroughBakehouse,
  hours: [
    { label: 'Hours', lines: ['Monday–Friday: 9am–3pm', 'Saturday & Sunday: Closed'] },
  ],
}

export const cateringEventsUrl = CATERING_EVENTS_URL
