import { defineArrayMember, defineField, defineType } from 'sanity'

/** A menu page at /menus/<slug>: banner, heading, quick links, categories. */
export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  groups: [
    { name: 'page', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
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
      name: 'quickLinks',
      title: 'Quick links',
      type: 'array',
      of: [defineArrayMember({ type: 'quickLink' })],
      group: 'content',
      description: 'Anchor buttons above the menu; each targets a category anchor below.',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'menuCategory' })],
      group: 'content',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', media: 'banner', categories: 'categories' },
    prepare: ({ title, slug, media, categories }) => ({
      title,
      subtitle: [slug && `/menus/${slug}`, `${categories?.length ?? 0} category/ies`]
        .filter(Boolean)
        .join(' — '),
      media,
    }),
  },
})
