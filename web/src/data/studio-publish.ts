/**
 * Copy Joshua must publish in Sanity Studio for live pages to pick up
 * Woodbridge / restaurant wording. Dedicated Astro pages (about, locations,
 * FAQs, JSON-LD, unique titles) already ship from this repo even if Studio
 * is stale. Hosted dataset writes were not available from this agent.
 *
 * /sourdough-bakery 301s to /about. Unpublish that CMS page so it cannot
 * rebuild as HTML in front of the redirect.
 */
export const STUDIO_PUBLISH_CHECKLIST = [
  'Homepage — title, hero H1/body, intro, menu cards, bread + events blocks, SEO (Woodbridge restaurant, not Vaughan bakery)',
  'Homepage bread CTA — Visit the Bakehouse → https://penelopebakehouse.com (not /sourdough-bakery)',
  'Site Settings — default SEO, reservations label, footer headings (sentence case), hours labels Cafe/Bar, NAP 125 Hawkview Blvd, Woodbridge, ON L4H 2E2',
  'Site Settings nav — Bakery → https://penelopebakehouse.com (same tab; not /sourdough-bakery)',
  'Page: about — SEO only if still editing the CMS about doc (route now uses dedicated about.astro)',
  'Page: contact — heading “Get in touch”, Woodbridge NAP intro, SEO',
  'Page: catering-events — heading “Catering and events”, Woodbridge copy, SEO (not “Event space vaughan”)',
  'Page: menus — heading “Menus at Penelope Social”, SEO',
  'Page: merchandise — SEO without Vaughan-as-city',
  'Menus lunch/dinner/bar/catering — unique Woodbridge meta + intros',
  'Unpublish /sourdough-bakery — same-site 301 to /about already ships from _redirects',
  'Optional: add FAQ / Timeline page-builder blocks',
] as const
