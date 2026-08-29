/**
 * Title-case / Woodbridge copy helpers.
 * Vaughan may appear as a region or areaServed — never as the city in titles.
 *
 * /sourdough-bakery 301s to /about (same site). Do not send that URL to
 * penelopebakehouse.com. Nav "Bakery" is a normal link to the Bakehouse site.
 */

const EXACT_REPLACEMENTS: Record<string, string> = {
  'Sourdough Bakery & Restaurant in Vaughan.': 'A Woodbridge restaurant with Bakehouse sourdough',
  'Sourdough Bakery & Restaurant in Vaughan | Penelope Social':
    'Penelope Social | Cafe and bar in Woodbridge',
  'Experience Penelope Social, a Sourdough Bakery & Restaurant in Vaughan. Indulge in freshly baked goods and delicious meals. Visit us today!':
    'Cafe by day and a bar by night at 125 Hawkview Blvd, Woodbridge. Lunch, dinner, and drinks — bread from Penelope Bakehouse in Scarborough.',
  'Event space vaughan': 'Catering and events in Woodbridge',
  'Event Space Vaughan | Penelope Social': 'Catering and events in Woodbridge | Penelope Social',
  'Catering menu | Penelope Social Woodbridge':
    'Catering tray menu | Pizza, focaccia, salads | Penelope Social',
  'Trays of sandwiches, pizza, and more from Penelope Social in Woodbridge. See the catering menu, then enquire at /catering-events.':
    'Party trays from the Woodbridge kitchen: 24-slice pizzas, focaccia sandwiches (min 6), breads, and salads for 8–10. Prices on this page. Book trays on Catering and events — 24 hours’ notice.',
  'Penelope Social\nMenus Vaughan': 'Menus at Penelope Social',
  'Penelope Social Menu Vaughan | Lunch, Dinner & Catering':
    'Menus | Lunch, dinner, bar, and catering | Penelope Social',
  'Get in Touch with\nPenelope Social Vaughan': 'Get in touch',
  'Contact Penelope Social Vaughan | Get in Touch Today':
    'Contact Penelope Social in Woodbridge',
  'Penelope Social Merch Vaughan | Shop Exclusive Apparel':
    'Merch | Penelope Social',
  'About Penelope Social Vaughan | Neighborhood Gem for Food & Drinks':
    'About Penelope Social | Woodbridge restaurant',
  'About\nPenelope Social': 'About Penelope Social',
  'reservations': 'Reservations',
  'stay in the loop.': 'Stay in the loop',
  'stay in the loop': 'Stay in the loop',
}

/** True when copy treats Vaughan as the city, not just the wider area. */
export function usesVaughanAsCity(text?: string): boolean {
  if (!text) return false
  if (/\bVaughan area\b/i.test(text) || /\bareaServed\b/i.test(text)) return false
  return (
    /\bin Vaughan\b/i.test(text) ||
    /\bVaughan's\b/i.test(text) ||
    /\bVaughan \|/i.test(text) ||
    /\bEvent space vaughan\b/i.test(text) ||
    /\bMenus Vaughan\b/i.test(text) ||
    /\bSocial Vaughan\b/i.test(text) ||
    /\bbakery in Vaughan\b/i.test(text) ||
    /\bRestaurant in Vaughan\b/i.test(text) ||
    /\bMerch Vaughan\b/i.test(text)
  )
}

export function rewriteVaughanCity(text: string): string {
  return text
    .replace(/\bVaughan's\b/gi, "Woodbridge's")
    .replace(/\bin Vaughan\b/gi, 'in Woodbridge')
    .replace(/\bVaughan \|/g, 'Woodbridge |')
    .replace(/\bEvent space vaughan\b/gi, 'Catering and events in Woodbridge')
    .replace(/\bMenus Vaughan\b/gi, 'Menus')
    .replace(/\bSocial Vaughan\b/gi, 'Social')
    .replace(/\bbakery in Vaughan\b/gi, 'restaurant in Woodbridge')
    .replace(/\bRestaurant in Vaughan\b/gi, 'restaurant in Woodbridge')
    .replace(/\bMerch Vaughan\b/gi, 'Merch')
}

/**
 * Prefer authored copy unless it still names Vaughan as the city.
 * Exact stale strings get restaurant-first replacements.
 */
export function restaurantCopy(text?: string, fallback?: string): string {
  const raw = (text ?? '').trim()
  if (!raw) return fallback ?? ''
  const exact = EXACT_REPLACEMENTS[raw] ?? EXACT_REPLACEMENTS[raw.replace(/\s+$/, '')]
  if (exact) return exact
  if (usesVaughanAsCity(raw)) {
    const rewritten = rewriteVaughanCity(raw)
    return rewritten || fallback || raw
  }
  return raw
}

/** Sentence/title case for chrome that arrived as ALL CAPS or random lowercase. */
export function displayHeading(text?: string, fallback?: string): string {
  const raw = restaurantCopy(text, fallback)
  if (!raw) return fallback ?? ''
  const trimmed = raw.trim()
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
    const lower = trimmed.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }
  if (trimmed === trimmed.toLowerCase() && trimmed.length > 0) {
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  }
  return trimmed
}

export function displayLinkLabel(text?: string): string {
  return displayHeading(text)
}
