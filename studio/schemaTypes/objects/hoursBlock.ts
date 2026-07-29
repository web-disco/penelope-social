import { defineArrayMember, defineField, defineType } from 'sanity'

/** One labelled group of opening hours in the footer, e.g. CAFE / BAR. */
export const hoursBlock = defineType({
  name: 'hoursBlock',
  title: 'Opening hours',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. CAFE, BAR',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lines',
      title: 'Lines',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'One line per row, e.g. "Mon - Fri: 8am - 4pm".',
    }),
  ],
  preview: {
    select: { title: 'label', lines: 'lines' },
    prepare: ({ title, lines }) => ({ title, subtitle: (lines ?? []).join(' · ') }),
  },
})
