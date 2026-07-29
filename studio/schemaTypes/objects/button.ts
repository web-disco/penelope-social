import { defineField, defineType } from 'sanity'

/**
 * A link rendered as a button. Was `cta`, which named the marketing intent
 * rather than the thing — the same object is used for buttons that aren't
 * calls to action at all.
 *
 * `style` picks the fill, not the palette; the palette comes from context.
 * That mirrors how Webflow combined `.btn.primary` / `.btn.is-outline`.
 */
export const button = defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL or path',
      type: 'string',
      description: 'e.g. /menus, /contact, #pizzas, or https://…',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Solid', value: 'primary' },
          { title: 'Outline', value: 'outline' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', url: 'url', style: 'style' },
    prepare: ({ title, url, style }) => ({
      title,
      subtitle: [url, style].filter(Boolean).join(' · '),
    }),
  },
})
