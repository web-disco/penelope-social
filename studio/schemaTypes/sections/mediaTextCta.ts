import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'
import { richTextField } from '../objects/richText'

/** Photo beside a heading, rich text and up to two buttons (7/5 story grid). */
export const mediaTextCta = defineType({
  name: 'mediaTextCta',
  title: 'Image + text',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', description: 'Small label above the heading. Optional.' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    richTextField(),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Cropped to 3:2.',
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Image left', value: 'image-first' },
          { title: 'Image right', value: 'copy-first' },
        ],
        layout: 'radio',
      },
      initialValue: 'image-first',
    }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: { heading: 'heading', media: 'image' },
    prepare: ({ heading, media }) => ({ title: 'Image + text', subtitle: heading, media: media ?? BlockIcon }),
  },
})
