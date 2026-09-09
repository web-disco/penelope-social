import { defineField, defineType } from 'sanity'

/** One dish or drink inside a menu category. */
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'Title Case. Keep NY, DOP, 2oz, 1pc as written. Descriptions stay as written.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description:
        'Printed exactly as typed, with no $ added — the menus show bare figures, unlike Merch. ' +
        'A slash is glass/bottle on the wine lists (“17/68”).',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'price' } },
})
