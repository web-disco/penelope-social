import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Closing charcoal band: heading, a line and buttons, with the Woodbridge
 * hours, address and phone beside them. Those come from the site's own data
 * so they always match the footer; there is nothing to edit for them here.
 */
export const finalCta = defineType({
  name: 'finalCta',
  title: 'Final call to action',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'body', title: 'Line', type: 'text', rows: 2 }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
      description: 'Solid renders beige, Outline renders as a beige outline.',
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'showVisitDetails',
      title: 'Show map',
      description: 'Google map of 125 Hawkview Blvd beside the text. Off makes the text full width.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: 'Final call to action', subtitle: heading, media: BlockIcon }),
  },
})
