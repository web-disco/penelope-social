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
import { homeSchema, menuSchema, merchSchema, pageSchema, siteSchema } from './lib/content-schema'

const pages = './src/content/pages'

export const collections = {
  site: defineCollection({ loader: glob({ pattern: 'site.yaml', base: './src/content' }), schema: siteSchema }),
  home: defineCollection({ loader: glob({ pattern: 'home.yaml', base: pages }), schema: homeSchema }),
  /** Every other file in pages/ routes at /<filename>. */
  pages: defineCollection({ loader: glob({ pattern: ['*.yaml', '!home.yaml'], base: pages }), schema: pageSchema }),
  menus: defineCollection({ loader: glob({ pattern: '*.yaml', base: './src/content/menus' }), schema: menuSchema }),
  merch: defineCollection({ loader: glob({ pattern: '*.yaml', base: './src/content/merch' }), schema: merchSchema }),
}
