/**
 * Copy Joshua must publish in Sanity Studio for live pages to pick up
 * Woodbridge / restaurant wording. Dedicated Astro pages (about, locations,
 * /sourdough-bakery, FAQs, JSON-LD, unique titles) already ship from this repo
 * even if Studio is stale. Hosted dataset writes were not available from this agent.
 *
 * GSC (sc-domain:penelopesocial.com): submit sitemap-index.xml only.
 * /sourdough-bakery stays live as a Social vs Bakehouse page — do not 301 it.
 */
export const STUDIO_PUBLISH_CHECKLIST = [
  'Homepage hero: “Good food, better company at Penelope Social in Woodbridge” / “Focaccia sandwiches, sourdough pizza, and cocktails, made fresh daily.” Place in the H1, food in the lede. No period in the H1. Repo wins over stale CMS.',
  'Homepage — delete the “Cafe and bar in Woodbridge” intro block (Reservations / Our story). The build already skips it.',
  'Homepage mosaic — H2 “On the menu”, four cards with line (Lunch / Bar / Dinner / Catering), CTA “Explore our menus” → /menus',
  'Homepage bread — “Good bread, served here every day” + Social and Bakehouse → /sourdough-bakery',
  'Homepage events — “Birthdays, work dinners, and nights in the room…” (no street address)',
  'Site Settings — default SEO, reservations label, footer headings (sentence case), hours labels Cafe/Bar, NAP 125 Hawkview Blvd, Woodbridge, ON L4H 2E2',
  'Site Settings nav — delete the Bakery item. /sourdough-bakery stays live for GSC; do not add Bakery back to the header or drawer',
  'Page: about — SEO only if still editing the CMS about doc (route now uses dedicated about.astro)',
  'Page: contact — page hero heading “Get in touch” + lede on the photo. Delete the cream intro H1.',
  'Page: catering-events — page hero heading “Catering and events” + lede on the photo; no second cream H1',
  'Menu: catering — on-photo H1 “Catering tray menu” + one short lede. Keep “How to order these trays” + Enquire. No category jump pills.',
  'Page: menus — on-photo H1 “On the menu” + lede. Delete cream pageHeading. Tiles only underneath.',
  'Page: merchandise — on-photo H1 “Merch” + lede. Delete cream “Penelope Merch”.',
  'Menus lunch/dinner/bar — on-photo H1 Lunch / Dinner / Bar + one short lede. No cream title. No category jump pills.',
  'Do not 301 /sourdough-bakery — dedicated page ships from the repo (Bakehouse sourdough, served here). Unpublish the old “Best Sourdough Bakery in Vaughan” CMS doc so it cannot override.',
  'Copy rule: say what it is. No em or en dashes. No “not a dining room”. No street addresses in heroes. Woodbridge in meta + about intro.',
  'Newsletter subtext can stay as authored — type is now 20/18/16 to match Bakehouse',
  'GSC — submit https://penelopesocial.com/sitemap-index.xml only (not sitemap.xml)',
  'Optional: add FAQ / Timeline page-builder blocks',
] as const
