import { defineField, defineType } from 'sanity'

/**
 * Page-builder blocks. Each one maps to exactly one component in
 * web/src/components/blocks/, wired up in web/src/components/PageBuilder.astro.
 * Adding a new section to the site = one schema here + one component + one
 * entry in that map.
 */

export const homeHero = defineType({
  name: 'homeHero',
  title: 'Home hero',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Background image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'orderOnline', title: 'Order online button', type: 'link' }),
    defineField({ name: 'reservations', title: 'Reservations button', type: 'link' }),
  ],
  preview: { select: { media: 'image' }, prepare: ({ media }) => ({ title: 'Home hero', media }) },
})

export const introSection = defineType({
  name: 'introSection',
  title: 'Intro section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      description: 'Each new line becomes a line break.',
    }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 5 }),
    defineField({ name: 'ctas', title: 'Buttons', type: 'array', of: [{ type: 'cta' }] }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'Intro section' }) },
})

export const pageBanner = defineType({
  name: 'pageBanner',
  title: 'Page banner',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { media: 'image' }, prepare: ({ media }) => ({ title: 'Page banner', media }) },
})

export const pageHeading = defineType({
  name: 'pageHeading',
  title: 'Page heading',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2 }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 5 }),
    defineField({
      name: 'variant',
      title: 'Width',
      type: 'string',
      options: { list: [{ title: 'Full width', value: 'default' }, { title: 'Narrow, centred', value: 'center' }] },
      initialValue: 'default',
    }),
    defineField({
      name: 'align',
      title: 'Alignment',
      type: 'string',
      options: { list: ['center', 'left'], layout: 'radio' },
      initialValue: 'center',
    }),
    defineField({ name: 'quickLinks', title: 'Quick links', type: 'array', of: [{ type: 'quickLink' }] }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'Page heading' }) },
})

export const menuGrid = defineType({
  name: 'menuGrid',
  title: 'Menu cards',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuCard',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'url', title: 'Links to', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
            defineField({ name: 'buttonUrl', title: 'Button link', type: 'string' }),
          ],
          preview: { select: { title: 'title', media: 'image' } },
        },
      ],
    }),
  ],
  preview: {
    select: { cards: 'cards' },
    prepare: ({ cards }) => ({ title: 'Menu cards', subtitle: `${cards?.length ?? 0} cards` }),
  },
})

export const splitFeature = defineType({
  name: 'splitFeature',
  title: 'Image + copy',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 6 }),
    defineField({ name: 'cta', title: 'Button', type: 'link' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'layout',
      title: 'Layout',
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
  ],
  preview: { select: { title: 'heading', media: 'image' } },
})

export const teamGrid = defineType({
  name: 'teamGrid',
  title: 'Team grid',
  type: 'object',
  fields: [
    defineField({ name: 'members', title: 'Members', type: 'array', of: [{ type: 'teamMember' }] }),
  ],
  preview: {
    select: { members: 'members' },
    prepare: ({ members }) => ({ title: 'Team grid', subtitle: `${members?.length ?? 0} people` }),
  },
})

export const storySection = defineType({
  name: 'storySection',
  title: 'Story section',
  type: 'object',
  description: 'A centred column of copy, optionally with a video or a three-up image gallery.',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'video', title: 'Video', type: 'storyVideo' }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'galleryId',
      title: 'Lightbox group',
      type: 'string',
      description: 'Galleries sharing this value open as one lightbox slideshow.',
      initialValue: 'story',
    }),
  ],
  preview: {
    select: { body: 'body', gallery: 'gallery' },
    prepare: ({ body, gallery }) => ({
      title: body?.[0]?.children?.[0]?.text?.slice(0, 60) || 'Story section',
      subtitle: gallery?.length ? `${gallery.length} images` : undefined,
    }),
  },
})

export const merchListing = defineType({
  name: 'merchListing',
  title: 'Merch listing',
  type: 'object',
  description: 'Renders every merch product, ordered by their "Order" field.',
  fields: [
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      readOnly: true,
      initialValue: 'Products are managed under Merch.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Merch listing' }) },
})

export const formSection = defineType({
  name: 'formSection',
  title: 'Enquiry form',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Form',
      type: 'string',
      options: {
        list: [
          { title: 'Events (posts to /api/events)', value: 'events' },
          { title: 'Contact (posts to /api/contact)', value: 'contact' },
        ],
      },
      initialValue: 'contact',
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 3 }),
    defineField({ name: 'fields', title: 'Fields', type: 'array', of: [{ type: 'formField' }] }),
    defineField({ name: 'submitLabel', title: 'Submit button label', type: 'string' }),
    defineField({ name: 'successMessage', title: 'Success message', type: 'string' }),
    defineField({ name: 'errorMessage', title: 'Error message', type: 'string' }),
  ],
  preview: { select: { title: 'heading', subtitle: 'variant' } },
})

export const imageGrid = defineType({
  name: 'imageGrid',
  title: 'Image grid',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { images: 'images' },
    prepare: ({ images }) => ({ title: 'Image grid', subtitle: `${images?.length ?? 0} images` }),
  },
})

export const blockTypes = [
  homeHero,
  introSection,
  pageBanner,
  pageHeading,
  menuGrid,
  splitFeature,
  teamGrid,
  storySection,
  merchListing,
  formSection,
  imageGrid,
]

export const blockNames = blockTypes.map((block) => ({ type: block.name }))
