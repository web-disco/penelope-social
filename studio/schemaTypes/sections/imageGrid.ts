import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/** Full-width row of images below the enquiry forms. */
export const imageGrid = defineType({
  name: 'imageGrid',
  title: 'Image grid',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { images: 'images' },
    prepare: ({ images }) => ({
      title: 'Image grid',
      subtitle: `${images?.length ?? 0} image(s)`,
      media: BlockIcon,
    }),
  },
})
