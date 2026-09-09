import { defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Full-viewport image hero with overlay H1, supporting copy, and two CTAs.
 */
export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'The page H1, overlaid on the image.',
    }),
    defineField({
      name: 'body',
      title: 'Supporting line',
      type: 'text',
      rows: 2,
    }),
    defineField({ name: 'orderOnline', title: 'Primary button', type: 'link' }),
    defineField({ name: 'reservations', title: 'Secondary button', type: 'link' }),
  ],
  preview: {
    select: { heading: 'heading', alt: 'image.alt' },
    prepare: ({ heading, alt }) => ({
      title: heading || 'Hero',
      subtitle: alt,
      media: BlockIcon,
    }),
  },
})
