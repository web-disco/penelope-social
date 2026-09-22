import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/** "Buona Notte (3oz)" and "buona notte" are the same item. Mirrors web/src/lib/menuItems.ts. */
const itemKey = (title: string) =>
  title
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim()
    .toLowerCase()

/** "/menus/lunch#pizza-slices" -> "lunch". Mirrors web/src/lib/menuItems.ts. */
const menuSlugFromLink = (link?: string) => /\/menus\/([^/?#]+)/.exec(link ?? '')?.[1]

/**
 * Dish cards in the menu-cards style (4-up, swipe on mobile). Each card links to
 * a menu and names a dish on it; the site pulls the dish's description and price
 * from the menu in that link, so they can never disagree. The photo lives on the
 * card because menu items have no image.
 */
export const menuItemCards = defineType({
  name: 'menuItemCards',
  title: 'Menu item cards',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'rating',
      title: 'Google rating',
      type: 'object',
      description: 'Optional. Shown under the intro, linking to the reviews. Update the numbers by hand.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'score',
          title: 'Score',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5).precision(1),
        }),
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          description: 'e.g. “600+ reviews on Google”.',
        }),
        defineField({ name: 'url', title: 'Reviews link', type: 'url' }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Dishes',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuItemCard',
          fields: [
            defineField({
              name: 'link',
              title: 'Link',
              type: 'string',
              description:
                'Where the card goes, e.g. /menus/lunch#pizza-slices. The price and description come from the menu in this link, so /menus/lunch shows the lunch price.',
              validation: (Rule) =>
                Rule.required().custom((value) =>
                  !value || menuSlugFromLink(value) ? true : 'Link to a menu, e.g. /menus/dinner#pizza, so the card knows which price to show.',
                ),
            }),
            defineField({
              name: 'item',
              title: 'Dish name',
              type: 'string',
              description: 'Exactly as it appears on that menu, e.g. “Margherita”.',
              validation: (Rule) =>
                Rule.required().custom(async (value, context) => {
                  const slug = menuSlugFromLink((context.parent as any)?.link)
                  if (!value || !slug) return true
                  const titles: string[] = await context
                    .getClient({ apiVersion: '2024-10-01' })
                    .fetch('*[_type == "menu" && slug.current == $slug][0].categories[].items[].title', { slug })
                  return (titles ?? []).some((title) => itemKey(title) === itemKey(value))
                    ? true
                    : `“${value}” is not on the ${slug} menu. Check the spelling against the menu.`
                }),
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              description: 'Cropped to 4:5. Set the hotspot on the pizza.',
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'item', link: 'link', media: 'image' },
            prepare: ({ title, link, media }) => ({ title, subtitle: link, media }),
          },
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Section button',
      type: 'object',
      description: 'Optional outline button under the cards, e.g. “See the dinner menu”. Leave both fields empty to hide it.',
      options: { collapsible: true, collapsed: true },
      /*
       * Not the shared `link` type: that one requires label and URL, so a button
       * cleared back to empty cannot be published. Here each field is required
       * only once the other is filled in.
       */
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((value, context) =>
              (context.parent as any)?.url && !value ? 'Add a label, or clear the URL to hide the button.' : true,
            ),
        }),
        defineField({
          name: 'url',
          title: 'URL or path',
          type: 'string',
          description: 'e.g. /menus/dinner#pizza or https://…',
          validation: (Rule) =>
            Rule.custom((value, context) =>
              (context.parent as any)?.label && !value ? 'Add a URL, or clear the label to hide the button.' : true,
            ),
        }),
        defineField({ name: 'newTab', title: 'Open in a new tab', type: 'boolean', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading', items: 'items' },
    prepare: ({ heading, items }) => ({
      title: 'Menu item cards',
      subtitle: [heading, `${items?.length ?? 0} dish(es)`].filter(Boolean).join(' — '),
      media: BlockIcon,
    }),
  },
})
