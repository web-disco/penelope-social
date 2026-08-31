/**
 * Site-wide NAP, hours, and URLs.
 * Woodbridge is the locality. Vaughan is areaServed / region only — never the city.
 */

import type { HourBlock, Nap } from './types'

export const SITE_NAME = 'Penelope Social'
export const SITE_ORIGIN = 'https://penelopesocial.com'
export const BAKEHOUSE_SITE_URL = 'https://penelopebakehouse.com'

/** Scarborough Bakehouse Toast — not Social's order link. */
export const BAKEHOUSE_ORDER_ONLINE_URL =
  'https://order.toasttab.com/online/penelope-bakehouse-scarborough-71-howden-road?diningOption=takeout&rwg_token=AE37R_ia7EAZEVcG9NpbtfhSwTVvmCeGwEAHkDzGsiouYTQl4FQHPdw2vVFRRzlSLmtTqQLuqAjNDwNCl8DpKxGNTJ4TST6CLQ%3D%3D'

/** Bakehouse catering intake — not Social /catering-events. */
export const BAKEHOUSE_CATERING_URL = `${BAKEHOUSE_SITE_URL}/catering`

export const OG_IMAGE_PATH = '/images/og-share.jpg'

export const ORDER_ONLINE_URL =
  'https://order.toasttab.com/online/penelope-social-125-hawkview-boulevard'

export const GIFT_CARDS_URL =
  'https://order.toasttab.com/egiftcards/penelope-social-125-hawkview-boulevard'

/** Internal path that 301s to Toast. Keep this URL; do not rename to /catering. */
export const RESERVATIONS_PATH = '/reservations'

export const RESERVATIONS_TOAST_URL =
  'https://tables.toasttab.com/restaurants/bfe7aa9b-9c6d-4de4-b0e5-79d3aaf65ce0/reserve?partySize=2'

export const CATERING_EVENTS_URL = '/catering-events'
export const CATERING_MENU_URL = '/menus/catering'

export const INSTAGRAM_URL = 'https://www.instagram.com/penelopesocial/?hl=en'
export const TIKTOK_URL = 'https://www.tiktok.com/@penelope.social?_t=8rVjknXtEaF&_r=1'

/** Get directions — Maps place URL, not the reviews panel. */
export const GET_DIRECTIONS_HREF =
  'https://www.google.com/maps/dir/?api=1&destination=125+Hawkview+Blvd%2C+Woodbridge%2C+ON+L4H+2E2'

export const MAPS_PLACE_HREF =
  'https://www.google.com/maps/search/?api=1&query=125+Hawkview+Blvd%2C+Woodbridge%2C+ON+L4H+2E2'

/** YorkMaps / municipal listing for 125 Hawkview Blvd. */
export const woodbridgeNap: Nap = {
  name: 'Penelope Social',
  street: '125 Hawkview Blvd',
  city: 'Woodbridge',
  region: 'ON',
  postal: 'L4H 2E2',
  country: 'Canada',
  phone: '(905) 607-0606',
  phoneDigits: '+19056070606',
  email: 'info@penelopesocial.com',
  mapQuery: '125 Hawkview Blvd, Woodbridge, ON L4H 2E2',
  mapUrl: GET_DIRECTIONS_HREF,
  geo: { latitude: 43.828533, longitude: -79.552276 },
}

export const cafeHours: HourBlock[] = [
  {
    label: 'Cafe',
    lines: ['Mon-Sat: 9am-3pm', 'Sun: 8am-12pm'],
  },
]

export const barHours: HourBlock[] = [
  {
    label: 'Bar',
    lines: ['Mon-Thu: 5pm-10pm', 'Fri-Sat: 5pm-1am', 'Closed Sunday night.'],
  },
]

/** Footer / location / hours-FAQ lines. One day-range per line, like Bakehouse. */
export const stackedHoursBlocks: HourBlock[] = [...cafeHours, ...barHours]

export const stackedHoursFaqHtml = [
  '<strong>Cafe</strong>',
  ...cafeHours[0]!.lines,
  '<strong>Bar</strong>',
  ...barHours[0]!.lines,
].join('<br>')

/** Strip ?subject= (and any other query) from mailto hrefs. */
export function mailtoHref(href?: string, email = woodbridgeNap.email) {
  const raw = (href || `mailto:${email}`).trim()
  return raw.split('?')[0] || `mailto:${email}`
}

export const scarboroughBakehouse = {
  name: 'Penelope Bakehouse',
  street: '71 Howden Rd',
  city: 'Scarborough',
  region: 'ON',
  postal: 'M1R 3C7',
  phone: '(647) 812-0104',
  phoneDigits: '+16478120104',
  email: 'info@penelopebakehouse.com',
  url: BAKEHOUSE_SITE_URL,
  mapQuery: '71 Howden Rd, Scarborough, ON M1R 3C7',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=71+Howden+Rd%2C+Scarborough%2C+ON+M1R+3C7',
}

export const MENU_URLS = [
  `${SITE_ORIGIN}/menus/lunch`,
  `${SITE_ORIGIN}/menus/dinner`,
  `${SITE_ORIGIN}/menus/bar`,
  `${SITE_ORIGIN}/menus/catering`,
] as const

/** Social profiles only. Do not put penelopebakehouse.com here — that mixes the two entities. */
export const SAME_AS = [INSTAGRAM_URL, TIKTOK_URL] as const
