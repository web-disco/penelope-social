import { defineField, defineType } from 'sanity'
import { pageBuilderField } from '../objects/pageBuilder'

/**
 * A standard page at /<slug>. The front page is NOT one of these — it's the
 * `homepage` singleton — so there is no way to create a second "home".
 */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'page', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'page',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value?.current === 'home'
            ? 'The front page is managed under Homepage, not as a page.'
            : true,
        ),
    }),
    { ...pageBuilderField, group: 'content' },
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : undefined }),
  },
})
