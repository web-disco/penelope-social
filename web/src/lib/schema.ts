/**
 * JSON-LD builders. Restaurant NAP is Woodbridge only.
 * Vaughan is areaServed, never addressLocality.
 */

import type { FaqItem, HourBlock } from '../data/types'
import {
  BAKEHOUSE_SITE_URL,
  INSTAGRAM_URL,
  MENU_URLS,
  SAME_AS,
  SITE_NAME,
  SITE_ORIGIN,
  TIKTOK_URL,
  barHours,
  cafeHours,
  scarboroughBakehouse,
  woodbridgeNap,
} from '../data/site'

const SITE = SITE_ORIGIN.replace(/\/$/, '')

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function daysFromLabel(line: string): string[] {
  const d = line.toLowerCase()
  if (d.includes('mon') && d.includes('sat') && !d.includes('sun')) {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }
  if (d.includes('mon') && d.includes('thu')) {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
  }
  if (d.includes('fri') && d.includes('sat')) {
    return ['Friday', 'Saturday']
  }
  if (d.startsWith('sun')) return ['Sunday']
  return []
}

function to24h(raw?: string): string {
  if (!raw) return ''
  const cleaned = raw.replace(/\s/g, '').toLowerCase()
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/)
  if (!match) return raw.trim()
  let hour = Number(match[1])
  const minute = match[2] ?? '00'
  const meridiem = match[3]
  if (meridiem === 'pm' && hour < 12) hour += 12
  if (meridiem === 'am' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${minute}`
}

function hoursFromBlocks(blocks: HourBlock[]) {
  return blocks.flatMap((block) =>
    block.lines
      .filter((line) => !/closed/i.test(line) && line.trim() && line !== '‍')
      .map((line) => {
        const [daysPart, timePart] = line.split(':').map((s) => s.trim())
        const times = (timePart ?? '').split(/[–-]/).map((s) => s.trim())
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: daysFromLabel(daysPart ?? ''),
          opens: to24h(times[0]),
          closes: to24h(times[1]),
        }
      })
      .filter((spec) => spec.dayOfWeek.length && spec.opens && spec.closes),
  )
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
    menu: [...MENU_URLS],
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
    openingHoursSpecification: [...hoursFromBlocks(cafeHours), ...hoursFromBlocks(barHours)],
    sameAs: [...SAME_AS],
    department: [
      {
        '@type': 'FoodEstablishment',
        name: 'Cafe',
        openingHoursSpecification: hoursFromBlocks(cafeHours),
      },
      {
        '@type': 'BarOrPub',
        name: 'Bar',
        openingHoursSpecification: hoursFromBlocks(barHours),
      },
    ],
  }
}

/** Separate Bakehouse entity. Do not fold this into Social's sameAs. */
export function bakehouseSchema() {
  const bakehouse = scarboroughBakehouse
  return {
    '@type': 'Bakery',
    '@id': `${BAKEHOUSE_SITE_URL}/#bakery`,
    name: bakehouse.name,
    description:
      'Scarborough bakehouse and focacceria. Counter service, loaves, focaccia sandwiches, and pizza by the slice. Menu and orders live on penelopebakehouse.com.',
    url: bakehouse.url,
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
        offers: item.price
          ? { '@type': 'Offer', price: item.price, priceCurrency: 'CAD' }
          : undefined,
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

export function pageGraph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

export { INSTAGRAM_URL, TIKTOK_URL }
