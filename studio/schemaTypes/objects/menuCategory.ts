import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A named group of items within a menu — "Focaccia", "Pizzas", "Cocktails".
 *
 * `title` does three jobs: it names the section on the page, it labels the
 * quick link that jumps to it, and it is the source for `anchor`. So the jump
 * link always matches the section name (#pizzas for "Pizzas") without anyone
 * keeping two fields in step.
 *
 * The quick links above the menu used to be a second, hand-written array on the
 * menu document, each entry repeating a category's title and anchor. In every
 * one of the four menus it was an exact duplicate of the category list — a
 * parallel list whose only possible future was to drift out of sync. They are
 * derived from these categories now, so adding, renaming or dragging a category
 * moves its quick link with it.
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
      description:
        'Title Case (The Pizzas, Handhelds, Red Wine). Keep NY, DOP, 2oz as written.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'anchor',
      title: 'Section anchor',
      type: 'slug',
      description: 'The jump-link target — #pizzas. Generated from the title.',
      /*
       * A function, not `source: 'title'`. Inside an array member the plain
       * string form resolves against the *document* root, where there is no
       * `title` on this category's behalf — `options.parent` is the category.
       */
      options: {
        source: (_doc, options) => (options.parent as { title?: string })?.title ?? '',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({ type: 'menuItem' })],
      description: 'Drag to reorder — the order here is the order on the page.',
    }),
  ],
  preview: {
    select: { title: 'title', anchor: 'anchor.current', items: 'items' },
    prepare: ({ title, anchor, items }) => ({
      title,
      subtitle: [`${items?.length ?? 0} item(s)`, anchor && `#${anchor}`]
        .filter(Boolean)
        .join('  ·  '),
    }),
  },
})
