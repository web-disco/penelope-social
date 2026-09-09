import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

export const stepTimeline = defineType({
  name: 'stepTimeline',
  title: 'Timeline',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'How Penelope started',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'timelineStep',
          fields: [
            defineField({ name: 'title', title: 'Year / title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: heading || 'Timeline',
      subtitle: 'About story steps',
      media: BlockIcon,
    }),
  },
})
