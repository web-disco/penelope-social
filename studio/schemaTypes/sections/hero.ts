import { defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Full-viewport image hero with the two action buttons over it.
 *
 * Was `homeHero`. The name baked in where it happens to be used rather than
 * what it is — nothing about the block is homepage-specific.
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
    defineField({ name: 'orderOnline', title: 'Order online button', type: 'link' }),
    defineField({ name: 'reservations', title: 'Reservations button', type: 'link' }),
  ],
  preview: {
    select: { alt: 'image.alt' },
    prepare: ({ alt }) => ({ title: 'Hero', subtitle: alt, media: BlockIcon }),
  },
})
