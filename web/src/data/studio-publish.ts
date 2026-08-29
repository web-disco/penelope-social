/**
 * Copy Joshua must publish in Sanity Studio for live pages to pick up
 * Woodbridge / restaurant wording. Dedicated Astro pages (about, locations,
 * FAQs, JSON-LD, unique titles) already ship from this repo even if Studio
 * is stale. Hosted dataset writes were not available from this agent.
 *
 * Leave /sourdough-bakery unpublished/unchanged until Joshua decides.
 */
export const STUDIO_PUBLISH_CHECKLIST = [
  'Homepage — title, hero H1/body, intro, menu cards, bread + events blocks, SEO (Woodbridge restaurant, not Vaughan bakery)',
  'Site Settings — default SEO, reservations label, footer headings (sentence case), hours labels Cafe/Bar, NAP 125 Hawkview Blvd, Woodbridge, ON L4H 2E2',
  'Page: about — SEO only if still editing the CMS about doc (route now uses dedicated about.astro)',
  'Page: contact — heading “Get in touch”, Woodbridge NAP intro, SEO',
  'Page: catering-events — heading “Catering and events”, Woodbridge copy, SEO (not “Event space vaughan”)',
  'Page: menus — heading “Menus at Penelope Social”, SEO',
  'Page: merchandise — SEO without Vaughan-as-city',
  'Menus lunch/dinner/bar/catering — unique Woodbridge meta + intros',
  'Do not publish a rewrite of /sourdough-bakery until Joshua decides',
  'Optional: add FAQ / Timeline blocks from the new page-builder types',
] as const
