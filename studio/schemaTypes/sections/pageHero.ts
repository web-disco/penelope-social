import { defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Fixed-height banner image at the top of an inner page.
 *
 * Was `pageBanner`; renamed to sit alongside `hero` and read as the same family
 * of thing, which is how editors pick between them.
 */
export const pageHero = defineType({
  name: 'pageHero',
  title: 'Page hero',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'H1 on the photo (Bakehouse inner-page pattern). No period at the end.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'One short sentence under the on-image H1. No em dash. No street address.',
    }),
  ],
  preview: {
    select: { alt: 'image.alt' },
    prepare: ({ alt }) => ({ title: 'Page hero', subtitle: alt, media: BlockIcon }),
  },
})
