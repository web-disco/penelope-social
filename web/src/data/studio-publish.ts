/**
 * Copy Joshua must publish in Sanity Studio for live pages to pick up
 * Woodbridge / restaurant wording. Dedicated Astro pages (about, locations,
 * /sourdough-bakery, FAQs, JSON-LD, unique titles) already ship from this repo
 * even if Studio is stale. Hosted dataset writes were not available from this agent.
 *
 * GSC (sc-domain:penelopesocial.com): submit sitemap-index.xml only.
 * /sourdough-bakery stays live as a disambiguation page — do not 301 it.
 */
export const STUDIO_PUBLISH_CHECKLIST = [
  'Homepage — title, hero H1/body, intro, menu cards, bread + events blocks, SEO (Woodbridge restaurant, not Vaughan bakery)',
  'Homepage bread CTA — Social and Bakehouse → /sourdough-bakery',
  'Site Settings — default SEO, reservations label, footer headings (sentence case), hours labels Cafe/Bar, NAP 125 Hawkview Blvd, Woodbridge, ON L4H 2E2',
  'Site Settings nav — Bakery → /sourdough-bakery (disambiguator; CTA on that page goes to Bakehouse)',
  'Page: about — SEO only if still editing the CMS about doc (route now uses dedicated about.astro)',
  'Page: contact — heading “Get in touch”, Woodbridge NAP intro, unique SEO (keep in sitemap; request-indexing is a GSC click after submit)',
  'Page: catering-events — heading “Catering and events”, Woodbridge copy, SEO (not “Event space vaughan”)',
  'Menu: catering — tray-list heading + unique SEO (not a thin copy of /catering-events)',
  'Page: menus — heading “Menus at Penelope Social”, SEO',
  'Page: merchandise — SEO without Vaughan-as-city',
  'Menus lunch/dinner/bar — unique Woodbridge meta + intros',
  'Do not 301 /sourdough-bakery — dedicated disambiguation page ships from the repo. Unpublish the old “Best Sourdough Bakery in Vaughan” CMS doc so it cannot override.',
  'GSC — submit https://penelopesocial.com/sitemap-index.xml only (not sitemap.xml)',
  'Optional: add FAQ / Timeline page-builder blocks',
] as const
