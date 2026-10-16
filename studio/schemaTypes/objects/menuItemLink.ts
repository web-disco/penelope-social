import { defineField, defineType } from 'sanity'
import { MenuItemKeyInput } from '../components/MenuItemKeyInput'

const API_VERSION = '2025-02-19'

/**
 * A dish or drink borrowed from another menu, at this menu's price — the
 * Happy Hour list is mostly Dinner items at 12.
 *
 * Menu items are objects inside a menu document, not documents of their own,
 * so a Sanity reference cannot point at one directly. This stores the source
 * menu as a reference plus the item's `_key` within it, and the site copies
 * the name and description across at build time. Fixing a typo on Dinner
 * fixes it here too; only the price is this menu's own.
 */
export const menuItemLink = defineType({
  name: 'menuItemLink',
  title: 'Item from another menu',
  type: 'object',
  fields: [
    defineField({
      name: 'menu',
      title: 'From menu',
      type: 'reference',
      to: [{ type: 'menu' }],
      options: {
        // Not this menu — an item linking to its own list would be a duplicate.
        filter: ({ document }) => {
          const id = String(document._id ?? '').replace(/^drafts\./, '')
          return { filter: '!(_id in [$id, $draftId])', params: { id, draftId: `drafts.${id}` } }
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'itemKey',
      title: 'Item',
      type: 'string',
      description: 'The name and description come from this item. Edit them on its own menu.',
      components: { input: MenuItemKeyInput },
      hidden: ({ parent }) => !parent?.menu?._ref,
      validation: (Rule) =>
        Rule.required().custom(async (key, context) => {
          const ref = (context.parent as { menu?: { _ref?: string } })?.menu?._ref
          if (!key || !ref) return true
          const found = await context
            .getClient({ apiVersion: API_VERSION })
            .withConfig({ perspective: 'drafts' })
            .fetch<boolean>('count(*[_id == $ref][0].categories[].items[_key == $key]) > 0', {
              ref,
              key,
            })
          return found || 'That item is no longer on the menu. Pick another, or remove this line.'
        }),
    }),
    defineField({
      name: 'price',
      title: 'Price on this menu',
      type: 'string',
      description: 'Printed exactly as typed, with no $ added.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      menuTitle: 'menu.title',
      categories: 'menu.categories',
      itemKey: 'itemKey',
      price: 'price',
    },
    prepare: ({ menuTitle, categories, itemKey, price }) => {
      const item = (categories ?? [])
        .flatMap((category: any) => category?.items ?? [])
        .find((entry: any) => entry?._key === itemKey)
      return {
        title: item?.title ?? (itemKey ? 'Missing item' : 'Pick an item'),
        subtitle: [price, menuTitle && `from ${menuTitle}`].filter(Boolean).join('  ·  '),
      }
    },
  },
})
