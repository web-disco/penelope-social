import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Grid of menu cards — square artwork, title, and the whole image as the link.
 *
 * Was `menuGrid`; the title already read "Menu cards", so the schema name was
 * the last thing still calling it a grid.
 *
 * Cards are authored here rather than referencing `menu` documents because the
 * artwork is its own thing: none of the four card images is the banner of the
 * menu it links to.
 *
 * There is deliberately no button label or button URL. The markup carries a
 * `.menu-btn-wrap` "View menu" link, but it is `display:none` at every
 * breakpoint on the live site, so no visitor ever sees it — it stays in the DOM
 * for parity and takes its href from `url`. As editable fields they were pure
 * drift surface, and they had already drifted: the Catering card on /menus
 * pointed its invisible button at /menus/dinner.
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
      validation: (Rule) => Rule.min(1),
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
