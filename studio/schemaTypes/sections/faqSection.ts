import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'FAQs',
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: heading || 'FAQ',
      subtitle: 'FAQ accordion + FAQPage JSON-LD',
      media: BlockIcon,
    }),
  },
})
