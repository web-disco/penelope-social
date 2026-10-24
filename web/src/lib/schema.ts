/**
 * JSON-LD builders. Restaurant NAP is Woodbridge only.
 * Vaughan is areaServed, never addressLocality.
 */

import {
  MENU_URLS,
  SAME_AS,
  SITE_ORIGIN,
  bakehouse as scarboroughBakehouse,
  hoursSchedule,
  nap as woodbridgeNap,
  type FaqItem,
} from './content'

const SITE = SITE_ORIGIN
const SITE_NAME = woodbridgeNap.name
const BAKEHOUSE_SITE_URL = scarboroughBakehouse.url

function stripHtml(html: string): string {
  // Tags become spaces so block tags don't glue words; then drop the space a
  // closing </a> leaves before punctuation ("pizza .").
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim()
}

const DAY_NAMES = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
} as const

/** site.yaml → hours.*.schedule as OpeningHoursSpecification. */
function hoursFromSchedule(schedule: { days: (keyof typeof DAY_NAMES)[]; opens: string; closes: string }[]) {
  return schedule.map((rule) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: rule.days.map((day) => DAY_NAMES[day]),
    opens: rule.opens,
    closes: rule.closes,
  }))
}

export function restaurantSchema() {
  const nap = woodbridgeNap
  return {
    '@type': 'Restaurant',
    '@id': `${SITE}/#restaurant`,
    name: SITE_NAME,
    image: `${SITE}/favicon-192.png`,
    url: `${SITE}/`,
    telephone: nap.phone,
    email: nap.email,
    description:
      'Penelope Social is a Woodbridge cafe and bar at 125 Hawkview Blvd. Focaccia sandwiches, sourdough pizza, and cocktails, made fresh daily.',
    servesCuisine: ['Italian', 'Pizza', 'Cafe'],
    acceptsReservations: true,
    hasMenu: [...MENU_URLS],
    supplier: { '@id': `${BAKEHOUSE_SITE_URL}/#bakery` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: nap.street,
      addressLocality: 'Woodbridge',
      addressRegion: 'ON',
      postalCode: nap.postal,
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: nap.geo.latitude,
      longitude: nap.geo.longitude,
    },
    areaServed: [
      { '@type': 'City', name: 'Woodbridge' },
      { '@type': 'City', name: 'Vaughan' },
    ],
    openingHoursSpecification: [...hoursFromSchedule(hoursSchedule.cafe), ...hoursFromSchedule(hoursSchedule.bar)],
    sameAs: [...SAME_AS],
    department: [
      {
        '@type': 'FoodEstablishment',
        name: 'Cafe',
        openingHoursSpecification: hoursFromSchedule(hoursSchedule.cafe),
      },
      {
        '@type': 'BarOrPub',
        name: 'Bar',
        openingHoursSpecification: hoursFromSchedule(hoursSchedule.bar),
      },
    ],
  }
}

/**
 * Menu prices can be tiered ("1pc 4.50 | 6pc 24", "SM 12 | LG 20", "17/68")
 * or not a number at all ("MP"). schema.org wants a numeric price per Offer, so
 * each tier becomes its own Offer, named by its label; non-numeric prices get none.
 */
function menuOffers(price?: string) {
  if (!price) return undefined
  const offers = price
    .split(/\s*[|/]\s*/)
    .map((tier) => {
      const match = /^(?:([A-Za-z0-9]+)\s+)?\$?(\d+(?:\.\d+)?)$/.exec(tier.trim())
      if (!match) return null
      const label = match[1]
      const name = !label
        ? undefined
        : /^sm$/i.test(label)
          ? 'Small'
          : /^lg$/i.test(label)
            ? 'Large'
            : /^(\d+)pc$/i.test(label)
              ? `${label.replace(/pc$/i, '')} ${label === '1pc' ? 'piece' : 'pieces'}`
              : label
      return { '@type': 'Offer', price: match[2], priceCurrency: 'CAD', ...(name ? { name } : {}) }
    })
    .filter(Boolean)
  if (!offers.length) return undefined
  return offers.length === 1 ? offers[0] : offers
}

/**
 * The sister bakehouse, a separate entity: never fold it into Social's sameAs. By default a reference only (@id, name, url): the full
 * record (address, phone, description) on every Social page told Google these
 * pages describe Penelope Bakehouse, and they ranked for its name. The full
 * entity lives on penelopebakehouse.com under the same @id; only Social's
 * /locations/scarborough page, which is about that location, passes `full`.
 */
export function bakehouseSchema({ full = false }: { full?: boolean } = {}) {
  const bakehouse = scarboroughBakehouse
  const reference = {
    '@type': 'Bakery',
    '@id': `${BAKEHOUSE_SITE_URL}/#bakery`,
    name: bakehouse.name,
    url: bakehouse.url,
  }
  if (!full) return reference
  return {
    ...reference,
    description:
      'Scarborough bakehouse and focacceria. Counter service, loaves, focaccia sandwiches, and pizza by the slice. Menu and orders live on penelopebakehouse.com.',
    telephone: bakehouse.phone,
    email: bakehouse.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: bakehouse.street,
      addressLocality: 'Scarborough',
      addressRegion: 'ON',
      postalCode: bakehouse.postal,
      addressCountry: 'CA',
    },
  }
}

export function menuSchema(input: {
  name: string
  path: string
  description: string
  sections: { name: string; description?: string; items: { name: string; description?: string; price?: string }[] }[]
}) {
  return {
    '@type': 'Menu',
    '@id': `${SITE}${input.path}#menu`,
    name: input.name,
    url: `${SITE}${input.path}`,
    description: input.description,
    hasMenuSection: input.sections.map((section) => ({
      '@type': 'MenuSection',
      name: section.name,
      description: section.description || undefined,
      hasMenuItem: section.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description || undefined,
        offers: menuOffers(item.price),
      })),
    })),
  }
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(item.answer),
      },
    })),
  }
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.path.startsWith('http') ? crumb.path : `${SITE}${crumb.path === '/' ? '/' : crumb.path}`,
    })),
  }
}

/**
 * The page itself, tied to the restaurant it is about and, for landing pages
 * that list dishes, the Menu node that carries them.
 */
export function webPageSchema(input: {
  path: string
  name: string
  description?: string
  image?: string
  mainEntityId?: string
}) {
  return {
    '@type': 'WebPage',
    '@id': `${SITE}${input.path}#webpage`,
    url: `${SITE}${input.path}`,
    name: input.name,
    description: input.description || undefined,
    inLanguage: 'en-CA',
    about: { '@id': `${SITE}/#restaurant` },
    mainEntity: input.mainEntityId ? { '@id': input.mainEntityId } : undefined,
    primaryImageOfPage: input.image ? { '@type': 'ImageObject', url: input.image } : undefined,
  }
}

export function pageGraph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

