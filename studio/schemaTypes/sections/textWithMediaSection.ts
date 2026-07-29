import { defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Two-column image + copy block with a button.
 *
 * Was `splitFeature`, which described the layout rather than the content — and
 * "split" is what the CSS does, not what an editor is filling in.
 *
 * `layout` mirrors the same section built twice in Webflow, once each way
 * round; one block with a side option covers both.
 */
export const textWithMediaSection = defineType({
  name: 'textWithMediaSection',
  title: 'Text with media',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 6 }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Image side',
      type: 'string',
      options: {
        list: [
          { title: 'Image left, copy right', value: 'image-first' },
          { title: 'Copy left, image right', value: 'copy-first' },
        ],
        layout: 'radio',
      },
      initialValue: 'image-first',
    }),
    defineField({ name: 'cta', title: 'Button', type: 'button' }),
  ],
  preview: {
    select: { heading: 'heading', layout: 'layout' },
    prepare: ({ heading, layout }) => ({
      title: 'Text with media',
      subtitle: [heading, layout === 'copy-first' ? 'image right' : 'image left']
        .filter(Boolean)
        .join(' — '),
      media: BlockIcon,
    }),
  },
})
