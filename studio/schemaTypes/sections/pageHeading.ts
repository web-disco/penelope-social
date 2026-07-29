import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * `.page-heading` — the heading block on menu, bakery and merch pages.
 *
 * Two things it does that `introSection` does not: it can cap itself at 900px
 * and centre (`is-center`), and it can carry the row of anchor buttons above a
 * menu.
 */
export const pageHeading = defineType({
  name: 'pageHeading',
  title: 'Page heading',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      description: 'Rendered as the page <h1>. Line breaks become <br>.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 5 }),
    defineField({
      name: 'variant',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          { title: 'Full width', value: 'default' },
          { title: 'Narrow, centred', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Centered', value: 'center' },
          { title: 'Left', value: 'left' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'quickLinks',
      title: 'Quick links',
      type: 'array',
      of: [defineArrayMember({ type: 'quickLink' })],
      description: 'Anchor buttons that jump to a menu category further down.',
    }),
  ],
  preview: {
    select: { heading: 'heading', quickLinks: 'quickLinks' },
    prepare: ({ heading, quickLinks }) => ({
      title: 'Page heading',
      subtitle: [
        (heading ?? '').replace(/\n/g, ' '),
        quickLinks?.length ? `${quickLinks.length} quick link(s)` : null,
      ]
        .filter(Boolean)
        .join(' — '),
      media: BlockIcon,
    }),
  },
})
