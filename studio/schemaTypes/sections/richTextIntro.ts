import { defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'
import { richTextField } from '../objects/richText'

/** Centred H2 over a rich-text body in a reading-width column. */
export const richTextIntro = defineType({
  name: 'richTextIntro',
  title: 'Text intro',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    richTextField(),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: 'Text intro', subtitle: heading, media: BlockIcon }),
  },
})
