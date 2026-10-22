import type { SeoMeta } from './types'

/**
 * Meta titles + descriptions for the pages still built from TypeScript
 * (/about and /locations/*). Every other page sets `seo:` in its YAML file
 * under src/content/.
 */
export const PAGE_SEO: Record<string, SeoMeta> = {
  '/about': {
    title: 'About Penelope Social | Woodbridge cafe and bar',
    description:
      'The Stalteri brothers, a Woodbridge cafe and bar, and bread from Penelope Bakehouse. The family story behind lunch and dinner, plus drinks.',
  },
  '/locations': {
    title: 'Locations | Penelope Social and Penelope Bakehouse',
    description:
      'Penelope Social is the Woodbridge restaurant at 125 Hawkview Blvd. Penelope Bakehouse is the Scarborough bakehouse at 71 Howden Rd.',
  },
  '/locations/woodbridge': {
    title: 'Woodbridge | Penelope Social | 125 Hawkview Blvd',
    description:
      'Visit Penelope Social at 125 Hawkview Blvd, Woodbridge. Cafe hours, bar hours, phone, plus directions. Reservations on Toast.',
  },
  /*
   * These two pages point at the sister bakehouse, so they used to lead with
   * "Penelope Bakehouse" in the title. That made them outrank
   * penelopebakehouse.com for its own brand from the stronger domain: 5,669
   * impressions on "penelope bakehouse*" landed here at 1.8% CTR against 14.5%
   * on the Bakehouse's own pages (Search Console, 2026-08-19 to 09-16).
   * Title and description now lead with Social; the handoff stays in the body.
   */
  '/locations/scarborough': {
    title: 'Scarborough | Penelope Social',
    description:
      'Our sister bakehouse and focacceria at 71 Howden Rd, Scarborough, where the bread for Penelope Social is baked. Hours, directions, and phone.',
  },
}

