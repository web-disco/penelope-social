import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      description: 'Plain text for FAQPage JSON-LD. Links can be added in the dedicated pages.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'question' },
  },
})
