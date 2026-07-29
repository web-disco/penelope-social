import { defineField, defineType } from 'sanity'
import { pageBuilderField } from '../objects/pageBuilder'

/**
 * The front page — a singleton, so there is exactly one and it can't be
 * created, duplicated or deleted. Registered in structure.ts's `singletonTypes`,
 * which sanity.config.ts uses to strip those actions and hide it from the
 * global create menu.
 *
 * It used to be a `page` with the slug "home", which made the site's most
 * important document indistinguishable from the rest of the list, deletable,
 * and duplicable into a second homepage that nothing would have flagged.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Used as the browser tab title unless the SEO meta title overrides it.',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    { ...pageBuilderField, group: 'content' },
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage', subtitle: '/' }),
  },
})
