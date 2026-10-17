import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A menu page at /menus/<slug>: banner, heading, and its categories.
 *
 * Categories and their items are nested here rather than living as their own
 * document types, so a menu reads in the Studio as the thing it is and position
 * in the array *is* the order — reordering is dragging, not editing numbers.
 *
 * The quick-link buttons under the intro used to be a hand-written array beside
 * the categories, duplicating each one's label and anchor. They are derived
 * from the categories now (see objects/menuCategory.ts), which is one list
 * fewer to keep in sync and makes a stale jump link unrepresentable.
 */
export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  groups: [
    { name: 'page', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
    { name: 'categories', title: 'Categories' },
    { name: 'callout', title: 'Callout' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'page',
      options: { source: 'title', maxLength: 96 },
      description: 'Published at /menus/<slug>.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'banner',
      title: 'Banner image',
      type: 'image',
      group: 'page',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'Line breaks become <br>.',
    }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 5, group: 'content' }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'menuCategory' })],
      group: 'categories',
      description:
        'Drag to reorder — the order here is the order on the page, and the order of the quick-link buttons above it.',
      validation: (Rule) => Rule.min(1),
    }),
    /*
     * Lunch, Dinner, Bar and Catering are the four menu cards. A menu that
     * isn't one of them (Happy Hour) can still be surfaced: switched on, it
     * shows as a wide callout under the cards on the homepage and /menus.
     */
    defineField({
      name: 'callout',
      title: 'Featured callout',
      type: 'object',
      group: 'callout',
      description: 'A banner under the menu cards on the homepage and /menus, linking to this menu.',
      fields: [
        defineField({ name: 'enabled', title: 'Show the callout', type: 'boolean', initialValue: false }),
        defineField({ name: 'line', title: 'Line', type: 'text', rows: 2, description: 'One sentence under the title.' }),
        defineField({
          name: 'ctaLabel',
          title: 'Button label',
          type: 'string',
          description: 'Defaults to “View the menu”.',
        }),
        defineField({
          name: 'alsoOn',
          title: 'Also show on these menus',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'menu' }] }],
          description: 'The callout also appears at the bottom of these menu pages, e.g. Dinner and Bar.',
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Defaults to the banner image.',
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', media: 'banner', categories: 'categories' },
    prepare: ({ title, slug, media, categories }) => ({
      title,
      subtitle: [slug && `/menus/${slug}`, `${categories?.length ?? 0} categories`]
        .filter(Boolean)
        .join('  —  '),
      media,
    }),
  },
})
