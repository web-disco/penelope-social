import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description:
        'Unique per URL. Use Woodbridge as the city — never Vaughan as the city. Vaughan can appear as the wider area only.',
    }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3 }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
      description: '1200×630 works best. Falls back to the site default.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
