import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * `.section-intro` — centred heading, a capped intro paragraph, and up to two
 * buttons.
 *
 * Distinct from `pageHeading` despite the overlap in fields: that one renders a
 * different wrapper (`.page-heading`) with its own alignment and quick-link
 * behaviour. Merging them would change the DOM on six pages, so they stay two
 * blocks.
 */
export const introSection = defineType({
  name: 'introSection',
  title: 'Intro',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      description: 'Line breaks become <br>.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 5 }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: 'Intro',
      subtitle: (heading ?? '').replace(/\n/g, ' '),
      media: BlockIcon,
    }),
  },
})
