import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3 }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean' }),
  ],
})

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'string' }),
    defineField({ name: 'newTab', title: 'Open in a new tab', type: 'boolean' }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
})

export const navLink = defineType({
  name: 'navLink',
  title: 'Navigation link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'string' }),
    defineField({ name: 'newTab', title: 'Open in a new tab', type: 'boolean' }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
})

export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'string' }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: { list: ['primary', 'outline'], layout: 'radio' },
      initialValue: 'primary',
    }),
    defineField({ name: 'newTab', title: 'Open in a new tab', type: 'boolean' }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
})

export const quickLink = defineType({
  name: 'quickLink',
  title: 'Quick link',
  type: 'object',
  description: 'Jumps to a section further down the same page.',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({
      name: 'anchor',
      title: 'Section anchor',
      type: 'string',
      description: 'The "Section anchor" value of the menu category it links to.',
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'anchor' } },
})

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu item',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'price', title: 'Price', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'price' } },
})

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu category',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'anchorId',
      title: 'Section anchor',
      type: 'string',
      description: 'Used by the quick links above the menu, e.g. "pizzas".',
    }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'items', title: 'Items', type: 'array', of: [{ type: 'menuItem' }] }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} items` }),
  },
})

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})

export const formField = defineType({
  name: 'formField',
  title: 'Form field',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Field name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'id', title: 'Field id', type: 'string' }),
    defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['text', 'email', 'tel', 'number', 'select', 'textarea'] },
      initialValue: 'text',
    }),
    defineField({ name: 'required', title: 'Required', type: 'boolean' }),
    defineField({
      name: 'fullWidth',
      title: 'Full width',
      type: 'boolean',
      description: 'Spans both columns of the form grid.',
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }) => parent?.type !== 'select',
    }),
    defineField({ name: 'note', title: 'Helper text', type: 'string' }),
  ],
  preview: { select: { title: 'placeholder', subtitle: 'name' } },
})

export const hoursBlock = defineType({
  name: 'hoursBlock',
  title: 'Opening hours',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. CAFE, BAR' }),
    defineField({ name: 'lines', title: 'Lines', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: {
    select: { title: 'label', lines: 'lines' },
    prepare: ({ title, lines }) => ({ title, subtitle: (lines ?? []).join(' · ') }),
  },
})

export const social = defineType({
  name: 'social',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: { list: ['instagram', 'tiktok'] },
    }),
    defineField({ name: 'url', title: 'URL', type: 'string' }),
    defineField({
      name: 'icon',
      title: 'Icon path',
      type: 'string',
      description: 'Defaults to /icons/<platform>.svg',
    }),
  ],
  preview: { select: { title: 'platform', subtitle: 'url' } },
})

export const storyVideo = defineType({
  name: 'storyVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({ name: 'mp4Url', title: 'MP4 URL', type: 'url' }),
    defineField({ name: 'webmUrl', title: 'WebM URL', type: 'url' }),
  ],
})

export const objectTypes = [
  seo,
  link,
  navLink,
  cta,
  quickLink,
  menuItem,
  menuCategory,
  teamMember,
  formField,
  hoursBlock,
  social,
  storyVideo,
]
