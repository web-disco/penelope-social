import { defineField, defineType } from 'sanity'

/**
 * A single link: label + destination.
 *
 * The destination stays a plain string rather than a `url` so internal paths
 * match the live URLs 1:1, query strings included (`/catering-events?general-inquiry`).
 *
 * This replaces what used to be two identical types — `link` and `navLink`.
 * They had the same three fields and the same preview; the only thing `navLink`
 * added was a second name for editors to pick wrongly.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL or path',
      type: 'string',
      description: 'e.g. /menus, /catering-events?general-inquiry, or https://…',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
})
