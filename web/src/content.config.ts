/**
 * Content collections. All site copy lives in src/content/*.yaml and is
 * validated against src/lib/content-schema.ts at build time.
 *
 * Read content through src/lib/content.ts, never with getCollection directly:
 * that module swaps image filenames for optimised assets, renders Markdown
 * links and checks the cross-file rules.
 */
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import {
  aboutSchema,
  faqsSchema,
  homeSchema,
  locationsSchema,
  menuSchema,
  merchSchema,
  pageSchema,
  siteSchema,
} from './lib/content-schema'

const pages = './src/content/pages'

export const collections = {
  site: defineCollection({ loader: glob({ pattern: 'site.yaml', base: './src/content' }), schema: siteSchema }),
  faqs: defineCollection({ loader: glob({ pattern: 'faqs.yaml', base: './src/content' }), schema: faqsSchema }),
  about: defineCollection({ loader: glob({ pattern: 'about.yaml', base: './src/content' }), schema: aboutSchema }),
  locations: defineCollection({ loader: glob({ pattern: 'locations.yaml', base: './src/content' }), schema: locationsSchema }),
  home: defineCollection({ loader: glob({ pattern: 'home.yaml', base: pages }), schema: homeSchema }),
  /** Every other file in pages/ routes at /<filename>. */
  pages: defineCollection({ loader: glob({ pattern: ['*.yaml', '!home.yaml'], base: pages }), schema: pageSchema }),
  menus: defineCollection({ loader: glob({ pattern: '*.yaml', base: './src/content/menus' }), schema: menuSchema }),
  merch: defineCollection({ loader: glob({ pattern: '*.yaml', base: './src/content/merch' }), schema: merchSchema }),
}
