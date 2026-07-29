import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A named group of items within a menu — "Focaccia", "Pizzas", "Cocktails".
 *
 * The anchor is what the quick links above the menu jump to, so it has to be
 * set and has to be unique within the menu; the quick link stores the same
 * string on its side.
 */
export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu category',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'anchorId',
      title: 'Section anchor',
      type: 'string',
      description: 'Target for the quick links above the menu, e.g. "pizzas".',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({ type: 'menuItem' })],
    }),
  ],
  preview: {
    select: { title: 'title', anchorId: 'anchorId', items: 'items' },
    prepare: ({ title, anchorId, items }) => ({
      title,
      subtitle: [anchorId && `#${anchorId}`, `${items?.length ?? 0} item(s)`]
        .filter(Boolean)
        .join(' — '),
    }),
  },
})
