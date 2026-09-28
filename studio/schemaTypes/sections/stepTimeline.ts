import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'
import { richTextField } from '../objects/richText'

/** Step body flattened for the list preview; tolerates legacy plain strings. */
const plainText = (body: unknown): string =>
  typeof body === 'string'
    ? body
    : Array.isArray(body)
      ? body.map((block: any) => (block?.children ?? []).map((child: any) => child.text ?? '').join('')).join(' ')
      : ''

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
            richTextField(),
          ],
          preview: {
            select: { title: 'title', body: 'body' },
            prepare: ({ title, body }) => ({ title, subtitle: plainText(body) }),
          },
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
