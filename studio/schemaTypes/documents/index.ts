import { defineField, defineType } from 'sanity'
import { blockNames } from '../blocks'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'header', title: 'Header & Menu', default: true },
    { name: 'footer', title: 'Footer' },
    { name: 'newsletter', title: 'Newsletter' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', hidden: true }),

    defineField({
      name: 'header',
      title: 'Header',
      type: 'object',
      group: 'header',
      fields: [
        defineField({ name: 'logo', title: 'Logo', type: 'image' }),
        defineField({ name: 'logoAlt', title: 'Logo alt text', type: 'string' }),
        defineField({ name: 'orderOnline', title: 'Order online button', type: 'link' }),
        defineField({ name: 'reservations', title: 'Reservations button', type: 'link' }),
        defineField({
          name: 'drawerLinks',
          title: 'Menu drawer links',
          type: 'array',
          of: [{ type: 'navLink' }],
        }),
      ],
    }),

    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({ name: 'logo', title: 'Logo', type: 'image' }),
        defineField({ name: 'logoAlt', title: 'Logo alt text', type: 'string' }),
        defineField({
          name: 'newsletter',
          title: 'Newsletter band',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'text', title: 'Copy', type: 'text', rows: 2 }),
            defineField({
              name: 'formAction',
              title: 'Mailchimp form action',
              type: 'url',
              description:
                'The list-manage subscribe/post URL. The site submits to its post-json twin so the inline success message still works.',
            }),
            defineField({ name: 'placeholder', title: 'Input placeholder', type: 'string' }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
            defineField({ name: 'successMessage', title: 'Success message', type: 'string' }),
            defineField({ name: 'errorMessage', title: 'Error message', type: 'string' }),
          ],
        }),
        defineField({
          name: 'menus',
          title: 'Menus column',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'blurb', title: 'Blurb', type: 'text', rows: 3 }),
            defineField({ name: 'blurbUrl', title: 'Blurb links to', type: 'string' }),
            defineField({ name: 'links', title: 'Links', type: 'array', of: [{ type: 'navLink' }] }),
          ],
        }),
        defineField({
          name: 'hours',
          title: 'Hours & location column',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'locationLabel', title: 'Location label', type: 'string' }),
            defineField({ name: 'address', title: 'Address', type: 'string' }),
            defineField({ name: 'mapUrl', title: 'Map link', type: 'url' }),
            defineField({ name: 'blocks', title: 'Hours', type: 'array', of: [{ type: 'hoursBlock' }] }),
          ],
        }),
        defineField({
          name: 'contact',
          title: 'Contact column',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'phone', title: 'Phone (display)', type: 'string' }),
            defineField({ name: 'phoneDigits', title: 'Phone (dial)', type: 'string' }),
            defineField({ name: 'email', title: 'Email (display)', type: 'string' }),
            defineField({ name: 'emailHref', title: 'Email link', type: 'string' }),
            defineField({ name: 'socialsLabel', title: 'Socials label', type: 'string' }),
            defineField({ name: 'socials', title: 'Socials', type: 'array', of: [{ type: 'social' }] }),
            defineField({ name: 'googleReview', title: 'Google Reviews button', type: 'link' }),
          ],
        }),
        defineField({
          name: 'copyright',
          title: 'Copyright row',
          type: 'object',
          fields: [
            defineField({ name: 'text', title: 'Copyright', type: 'string' }),
            defineField({ name: 'creditPrefix', title: 'Credit prefix', type: 'string' }),
            defineField({ name: 'creditLabel', title: 'Credit label', type: 'string' }),
            defineField({ name: 'creditUrl', title: 'Credit URL', type: 'url' }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'newsletterModal',
      title: 'Newsletter pop-up',
      type: 'object',
      group: 'newsletter',
      description:
        'The full-screen signup overlay on the homepage. It is hidden by CSS on the live site and stays hidden in this build.',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'text', title: 'Copy', type: 'text', rows: 3 }),
        defineField({ name: 'consentText', title: 'Consent checkbox label', type: 'text', rows: 2 }),
      ],
    }),

    defineField({
      name: 'merchBanner',
      title: 'Default merch banner',
      type: 'image',
      group: 'footer',
      description: 'Used on a merch product page that has no banner of its own.',
    }),

    defineField({ name: 'seo', title: 'Default SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'Use "home" for the homepage.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'sections', title: 'Sections', type: 'array', of: blockNames }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({ title, subtitle: slug === 'home' ? '/' : `/${slug}` }),
  },
})

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'Published at /menus/<slug>.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'banner', title: 'Banner image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2 }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 5 }),
    defineField({ name: 'quickLinks', title: 'Quick links', type: 'array', of: [{ type: 'quickLink' }] }),
    defineField({ name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'menuCategory' }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', media: 'banner' },
    prepare: ({ title, slug, media }) => ({ title, subtitle: `/menus/${slug}`, media }),
  },
})

export const merchProduct = defineType({
  name: 'merchProduct',
  title: 'Merch product',
  type: 'document',
  orderings: [
    { title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'Published at /merchandise/<slug>.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
    defineField({ name: 'price', title: 'Price', type: 'string', description: 'Amount only — the $ is added by the template.' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 5 }),
    defineField({ name: 'banner', title: 'Banner image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'images',
      title: 'Product images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'cta', title: 'Button', type: 'link' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'price', media: 'images.0' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle: subtitle ? `$${subtitle}` : '', media }),
  },
})

export const documentTypes = [siteSettings, page, menu, merchProduct]
