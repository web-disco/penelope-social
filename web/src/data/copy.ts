/**
 * Title-case / Woodbridge copy helpers.
 * Vaughan may appear as a region or areaServed — never as the city in titles.
 *
 * /sourdough-bakery stays on this site as a Social vs Bakehouse page.
 * Do not 301 it to /about or to penelopebakehouse.com.
 */

const EXACT_REPLACEMENTS: Record<string, string> = {
  'Sourdough Bakery & Restaurant in Vaughan.': 'Good food, better company',
  'A Woodbridge restaurant with Bakehouse sourdough': 'Good food, better company',
  'Cafe by day. Bar by night.': 'Good food, better company',
  "Woodbridge's Cafe and Bar": 'Good food, better company',
  'Cafe by day and a bar by night at 125 Hawkview Blvd. Lunch, dinner, and drinks — bread from Penelope Bakehouse in Scarborough.':
    'Focaccia sandwiches, sourdough pizza, and cocktails, made daily at our Woodbridge cafe and bar.',
  'Lunch, dinner, and drinks — sourdough from Penelope Bakehouse.':
    'Focaccia sandwiches, sourdough pizza, and cocktails, made daily at our Woodbridge cafe and bar.',
  'Lunch, dinner, and drinks — focaccia sandwiches, pizza, and sourdough from Penelope Bakehouse.':
    'Focaccia sandwiches, sourdough pizza, and cocktails, made daily at our Woodbridge cafe and bar.',
  'Focaccia sandwiches, sourdough pizza, and cocktails, made fresh daily.':
    'Focaccia sandwiches, sourdough pizza, and cocktails, made daily at our Woodbridge cafe and bar.',
  'Penelope Social, a cafe and bar in Woodbridge.':
    'Focaccia sandwiches, sourdough pizza, and cocktails, made daily at our Woodbridge cafe and bar.',
  'Naturally leavened loaves start at Penelope Bakehouse in Scarborough. We serve that bread at the Woodbridge restaurant — sandwiches, pizza, and loaves on the table.':
    'Loaves start at Penelope Bakehouse and land here as sandwiches, pizza, and bread with dinner.',
  'Loaves start at Penelope Bakehouse. We put that sourdough on the table here — sandwiches, pizza, and bread with dinner.':
    'Loaves start at Penelope Bakehouse and land here as sandwiches, pizza, and bread with dinner.',
  'Lunch, dinner, the bar, and catering — from the Woodbridge kitchen, on Bakehouse sourdough.':
    'Lunch, dinner, the bar, and catering trays, all from this kitchen.',
  'Lunch, dinner, the bar, and catering — on Bakehouse sourdough.':
    'Lunch, dinner, the bar, and catering trays, all from this kitchen.',
  'Focaccia sandwiches at lunch, cocktails after work, and pizza at dinner — all at 125 Hawkview Blvd, Woodbridge.':
    'Focaccia sandwiches, pizza, shareable plates, and cocktails, plus trays when you want them.',
  'Focaccia sandwiches at lunch, pizza at dinner, and cocktails at the bar.':
    'Focaccia sandwiches, pizza, shareable plates, and cocktails, plus trays when you want them.',
  'Focaccia sandwiches and pizza': 'Focaccia sandwiches and pizza daily',
  'Cocktails and a late sit': 'Cocktails, wine, and a late sit',
  'Pizza, handhelds, shareables': 'Pizza, handhelds, and shareable plates',
  'Trays for your table': 'Trays of pizza and sandwiches',
  'Birthdays, work dinners, and nights in the room. Food, drinks, and a table we will set.':
    'Birthdays, work dinners, and nights in the room, with food, drinks, and a table we will set.',
  'Trays to-go, or a night in the room.':
    'Trays to-go or a night in the room, with pizza, focaccia, drinks, and a table we will set.',
  "We'd love to hear from you. Questions, a table, or an event — call, email, or visit us at 125 Hawkview Blvd, Woodbridge.":
    'Questions, a table, or an event. Call, email, or write us.',
  'Lunch at Penelope Social in Woodbridge. Focaccia sandwiches, New York-style pizzas, and salads.\n\nMonday–Saturday 10:00am–3:00pm':
    'Focaccia sandwiches, pizza, and salads.\n\nMonday to Saturday, 10am to 3pm',
  'Dinner at Penelope Social in Woodbridge. Gut-friendly pizzas, handhelds, and shareable plates.\n\nMonday–Saturday 5:00pm–close':
    'Pizza, handhelds, and shareable plates.\n\nMonday to Saturday, 5pm to close',
  'Skip the traffic and sit at the bar in Woodbridge. Cocktails to match the night — bold or light.':
    'Cocktails, wine, and a late sit.',
  'Explore our menus — focaccia sandwiches, pizza, shareables, and handcrafted cocktails at the Woodbridge restaurant.':
    'Focaccia sandwiches, pizza, shareables, and cocktails.',
  'Explore our menus — focaccia sandwiches, pizza, shareables, and handcrafted cocktails at the Woodbridge restaurant.\n‍':
    'Focaccia sandwiches, pizza, shareables, and cocktails.',
  'Birthdays, work dinners, and nights in the Woodbridge restaurant. Artisanal dishes, handcrafted cocktails, and a room we will set for you. Catering trays if you want the food at yours.':
    'Birthdays, work dinners, and nights in the room, with food, drinks, and a table we will set.',
  'Celebrate at Penelope Social in Woodbridge. Intimate dinners, work nights, or trays to-go. We will design the night with you — food, drinks, and the room.':
    'Food, drinks, and a table we will set. Prefer 24 hours’ notice for catering.',
  'Penelope Social is the restaurant in Woodbridge — cafe by day, kitchen and bar at night — at 125 Hawkview Blvd. We serve lunch, dinner, and drinks. The sourdough on the table comes from Penelope Bakehouse, our Scarborough micro-bakery.':
    'This is a Woodbridge cafe and bar. Lunch, dinner, and drinks on sourdough from Penelope Bakehouse.',
  'A Woodbridge cafe and bar. Lunch, dinner, and drinks — sourdough from Penelope Bakehouse.':
    'This is a Woodbridge cafe and bar. Lunch, dinner, and drinks on sourdough from Penelope Bakehouse.',
  'Trays from the Woodbridge kitchen — not a private-event booking page, and not the Scarborough bakehouse menu. Party pizzas (24 slices), focaccia sandwiches (minimum of 6, cut in four), breads, and salads for 8–10. Prices are below. Prefer 24 hours’ notice; send the order on Catering and events.':
    'Party pizzas (24 slices), focaccia sandwiches (minimum of 6, cut in four), breads, and salads for 8 to 10. Prices are below. Prefer 24 hours notice. Send the order on Catering and events.',
  'Sourdough Bakery & Restaurant in Vaughan | Penelope Social':
    'Penelope Social | Cafe and bar in Woodbridge',
  'Best Sourdough Bakery in Vaughan | Penelope Social':
    'Bakehouse sourdough, served here | Penelope Social',
  'Penelope Social and Penelope Bakehouse | Two places':
    'Bakehouse sourdough, served here | Penelope Social',
  'The Scarborough micro-bakery — not a second Social dining room':
    'The Scarborough bakehouse and focacceria.',
  'Micro-bakery, not a dining room': 'Sourdough and focaccia, baked in Scarborough.',
  'Experience Penelope Social, a Sourdough Bakery & Restaurant in Vaughan. Indulge in freshly baked goods and delicious meals. Visit us today!':
    'Cafe and bar at 125 Hawkview Blvd, Woodbridge. Focaccia sandwiches, sourdough pizza, and cocktails, made fresh daily.',
  'Event space vaughan': 'Catering and events in Woodbridge',
  'Event Space Vaughan | Penelope Social': 'Catering and events in Woodbridge | Penelope Social',
  'Catering menu | Penelope Social Woodbridge':
    'Catering tray menu | Pizza, focaccia, salads | Penelope Social',
  'Trays of sandwiches, pizza, and more from Penelope Social in Woodbridge. See the catering menu, then enquire at /catering-events.':
    'Party trays from the Woodbridge kitchen: 24-slice pizzas, focaccia sandwiches (min 6), breads, and salads for 8 to 10. Prices on this page. Book trays on Catering and events. We prefer 24 hours notice.',
  'Penelope Social\nMenus Vaughan': 'On the menu',
  'Menus at Penelope Social': 'On the menu',
  'Penelope Social Menu Vaughan | Lunch, Dinner & Catering':
    'Menus | Lunch, dinner, bar, and catering | Penelope Social',
  'Get in Touch with\nPenelope Social Vaughan': 'Get in touch',
  'Contact Penelope Social Vaughan | Get in Touch Today':
    'Contact Penelope Social in Woodbridge',
  'Penelope Social Merch Vaughan | Shop Exclusive Apparel':
    'Merch | Penelope Social',
  'About Penelope Social Vaughan | Neighborhood Gem for Food & Drinks':
    'About Penelope Social | Woodbridge cafe and bar',
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

/** Bakehouse does not use em or en dashes in live copy. */
function neutralizeDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ', ').replace(/–/g, '-')
}

/**
 * Prefer authored copy unless it still names Vaughan as the city.
 * Exact stale strings get restaurant-first replacements.
 */
export function restaurantCopy(text?: string, fallback?: string): string {
  const raw = (text ?? '').trim()
  if (!raw) return neutralizeDashes(fallback ?? '')
  const exact = EXACT_REPLACEMENTS[raw] ?? EXACT_REPLACEMENTS[raw.replace(/\s+$/, '')]
  if (exact) return neutralizeDashes(exact)
  if (usesVaughanAsCity(raw)) {
    const rewritten = rewriteVaughanCity(raw)
    return neutralizeDashes(rewritten || fallback || raw)
  }
  return neutralizeDashes(raw)
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
