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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Shown exactly as typed — the menus print bare numbers, with no $.',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'price' } },
})
