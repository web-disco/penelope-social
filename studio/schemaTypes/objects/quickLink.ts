import { defineField, defineType } from 'sanity'

/** Jumps to a section further down the same page. */
export const quickLink = defineType({
  name: 'quickLink',
  title: 'Quick link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'anchor',
      title: 'Section anchor',
      type: 'string',
      description: 'The "Section anchor" value of the menu category it links to.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'anchor' } },
})
