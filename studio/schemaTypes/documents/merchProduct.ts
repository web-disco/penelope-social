import { defineArrayMember, defineField, defineType } from 'sanity'

/** A product page at /merchandise/<slug>, listed by the merchListing block. */
export const merchProduct = defineType({
  name: 'merchProduct',
  title: 'Merch product',
  type: 'document',
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
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
      description: 'Published at /merchandise/<slug>.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'page',
      description: 'Position in the merch listing, lowest first.',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      group: 'content',
      description: 'Amount only — the $ is added by the template.',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 5, group: 'content' }),
    defineField({
      name: 'banner',
      title: 'Banner image',
      type: 'image',
      group: 'page',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
      description: 'The wide image at the top of the product page.',
      /*
       * Required, because there is nothing to fall back to. Site Settings used
       * to carry a default that a product could borrow, but every product has
       * always set its own — so the default never rendered, and its only real
       * effect was to turn a forgotten banner into a silently wrong image
       * instead of an error the editor can see.
       */
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Product images',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),
    defineField({ name: 'cta', title: 'Button', type: 'button', group: 'content' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', price: 'price', order: 'order', media: 'images.0' },
    prepare: ({ title, price, order, media }) => ({
      title,
      subtitle: [order != null && `#${order}`, price && `$${price}`].filter(Boolean).join(' · '),
      media,
    }),
  },
})
