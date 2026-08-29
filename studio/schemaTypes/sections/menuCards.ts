import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Menu mosaic — image-led cards (4-up on desktop, swipe on mobile).
 *
 * Cards are authored here rather than referencing `menu` documents because the
 * artwork is its own thing: none of the four card images is the banner of the
 * menu it links to.
 */
export const menuCards = defineType({
  name: 'menuCards',
  title: 'Menu cards',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional — the /menus page shows the cards with no heading.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
      description: 'Optional supporting line under the heading.',
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuCard',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'line',
              title: 'Line',
              type: 'string',
              description: 'Optional one-liner under the title.',
            }),
            defineField({
              name: 'url',
              title: 'Links to',
              type: 'string',
              description: 'The whole card is the link, e.g. /menus/lunch.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'url', media: 'image' } },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'cta',
      title: 'Section button',
      type: 'link',
      description: 'Optional button under the cards, e.g. “Explore all menus”.',
    }),
  ],
  preview: {
    select: { heading: 'heading', cards: 'cards' },
    prepare: ({ heading, cards }) => ({
      title: 'Menu cards',
      subtitle: [heading, `${cards?.length ?? 0} card(s)`].filter(Boolean).join(' — '),
      media: BlockIcon,
    }),
  },
})
