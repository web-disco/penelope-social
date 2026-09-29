import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * "Plan your visit" block: heading, a line and buttons on the left, labelled
 * rows on the right, map below. Same layout as /locations/woodbridge.
 *
 * The address and the cafe and bar hours come from the site's own data so they
 * always match the footer; the toggles only choose whether to show them. Rows
 * authored here (parking, getting here, …) sit after them.
 */
export const visitDetails = defineType({
  name: 'visitDetails',
  title: 'Visit details',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'intro', title: 'Line', type: 'text', rows: 3 }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'Details first puts the address and hours on the left, to alternate with a copy-left block above.',
      options: {
        list: [
          { title: 'Heading first', value: 'copy-first' },
          { title: 'Details first', value: 'details-first' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'copy-first',
    }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'showAddress',
      title: 'Show address',
      description: '125 Hawkview Blvd, linked to Google Maps directions.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'hours',
      title: 'Show hours',
      type: 'string',
      options: {
        list: [
          { title: 'Cafe and bar', value: 'both' },
          { title: 'Cafe only', value: 'cafe' },
          { title: 'Bar only', value: 'bar' },
          { title: 'None', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'both',
    }),
    defineField({
      name: 'rows',
      title: 'More rows',
      description: 'Parking, getting here, and so on. One line per line of text.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'visitRow',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'body', title: 'Text', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'body' } },
        }),
      ],
    }),
    defineField({
      name: 'showMap',
      title: 'Show map',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: 'Visit details', subtitle: heading, media: BlockIcon }),
  },
})
