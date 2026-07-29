import { defineField, defineType } from 'sanity'

/** A social profile link in the footer. */
export const social = defineType({
  name: 'social',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'TikTok', value: 'tiktok' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon path',
      type: 'string',
      description: 'Defaults to /icons/<platform>.svg — only set this to override.',
    }),
  ],
  preview: { select: { title: 'platform', subtitle: 'url' } },
})
