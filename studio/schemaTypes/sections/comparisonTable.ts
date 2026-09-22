import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Rows of differences across a few options, e.g. Penelope sourdough pizza vs
 * Neapolitan vs delivery chain. Each row needs one value per column.
 */
export const comparisonTable = defineType({
  name: 'comparisonTable',
  title: 'Comparison table',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'What is being compared, left to right. Penelope first.',
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
    defineField({
      name: 'highlight',
      title: 'Highlighted column',
      type: 'number',
      description: 'Which column gets the green header. 1 is the first column.',
      initialValue: 1,
      validation: (Rule) => Rule.integer().min(1).max(4),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'comparisonRow',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. Dough, Crust, Price.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              description: 'One per column, in the same order.',
              validation: (Rule) =>
                Rule.custom((values, context) => {
                  const columns = ((context.document as any)?.sections ?? []).find((section: any) =>
                    section.rows?.some((row: any) => row._key === (context.parent as any)?._key),
                  )?.columns
                  if (!columns || !values) return true
                  return values.length === columns.length
                    ? true
                    : `Needs ${columns.length} values, one per column (has ${values.length}).`
                }),
            }),
          ],
          preview: {
            select: { title: 'label', values: 'values' },
            prepare: ({ title, values }) => ({ title, subtitle: (values ?? []).join(' · ') }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading', rows: 'rows' },
    prepare: ({ heading, rows }) => ({
      title: 'Comparison table',
      subtitle: [heading, `${rows?.length ?? 0} row(s)`].filter(Boolean).join(' — '),
      media: BlockIcon,
    }),
  },
})
