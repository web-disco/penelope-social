import { JSDOM } from 'jsdom'

export const SITE = 'https://www.penelopesocial.com'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const cache = new Map()

/** Fetch a page once and hand back its parsed document. */
export async function fetchDoc(path) {
  const url = path.startsWith('http') ? path : `${SITE}${path}`
  if (cache.has(url)) return cache.get(url)

  const response = await fetch(url, { headers: { 'user-agent': UA } })
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`)
  const html = await response.text()
  const doc = new JSDOM(html).window.document
  cache.set(url, doc)
  return doc
}

/**
 * Webflow's rich-text fields sprinkle zero-width joiners/spaces around inline
 * elements. They are invisible but survive into the CMS as junk, so strip them.
 */
const stripInvisible = (value) => value.replace(/[​-‍﻿]/g, '')

/** Trim and collapse the whitespace Webflow's pretty-printer leaves behind. */
export const text = (el) =>
  stripInvisible(el?.textContent ?? '')
    .replace(/\s+/g, ' ')
    .trim()

/** Raw walk — keeps `<br>` as `\n` without normalising, so nesting composes. */
function rawTextWithBreaks(el) {
  let out = ''
  for (const node of el.childNodes) {
    if (node.nodeType === 3) out += node.textContent
    else if (node.nodeName === 'BR') out += '\n'
    else if (node.nodeType === 1) out += rawTextWithBreaks(node)
  }
  return out
}

/**
 * Read an element's text preserving `<br>` as newlines, so headings like
 * "Sourdough Bakery<br>& Restaurant" survive the round trip.
 */
export function textWithBreaks(el) {
  if (!el) return ''
  return normaliseLines(stripInvisible(rawTextWithBreaks(el)))
}

/**
 * As `textWithBreaks`, but keeps Webflow's zero-width joiners.
 *
 * The footer's rich-text fields end with `<br>` followed by a ZWJ, which
 * renders as a real blank line and makes the live footer ~48px taller than the
 * same copy without them. Keeping them here is what lets the rebuild match the
 * original height exactly. They are ordinary content — an editor deleting them
 * simply tightens the footer.
 */
export function textWithBreaksKeepingBlanks(el) {
  if (!el) return ''
  return normaliseLines(rawTextWithBreaks(el))
}

function normaliseLines(value) {
  return value
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+|\n+$/g, '')
}

/**
 * Build the image object the site's data layer understands.
 *
 * IMPORTANT: always pass the element you actually want. Webflow page banners
 * stack a decorative `.page-banner-overlay` next to the real
 * `.page-banner-image`, so a bare `querySelector('img')` grabs the wrong node.
 */
export function image(img, altOverride) {
  if (!img) return null
  const src = img.getAttribute('src')
  if (!src) return null
  return {
    _type: 'image',
    _migrationSrc: decodeCdnUrl(src),
    _migrationSrcset: img.getAttribute('srcset')
      ? img.getAttribute('srcset').split(', ').map(decodeCdnUrl).join(', ')
      : undefined,
    _migrationSizes: img.getAttribute('sizes') ?? undefined,
    alt: altOverride ?? img.getAttribute('alt') ?? '',
  }
}

/** Webflow occasionally emits `%2F`-encoded paths (the bakery video sources). */
function decodeCdnUrl(url) {
  return url.replace(/%2F/g, '/')
}

export function absoluteUrl(href) {
  if (!href) return href
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return href
  return href
}

/** Turn a list of paragraphs into Portable Text blocks. */
export function toPortableText(paragraphs) {
  return paragraphs.map((value, index) => ({
    _type: 'block',
    _key: `p${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${index}`, text: value, marks: [] }],
  }))
}

export function seoFrom(doc) {
  return {
    _type: 'seo',
    metaTitle: doc.querySelector('title')?.textContent?.trim() ?? '',
    metaDescription: doc.querySelector('meta[name=description]')?.getAttribute('content') ?? '',
    ogImage: ogImageFrom(doc),
  }
}

function ogImageFrom(doc) {
  const src = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
  if (!src) return undefined
  return { _type: 'image', _migrationSrc: src, alt: '' }
}
