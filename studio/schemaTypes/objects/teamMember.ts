import { defineField, defineType } from 'sanity'

/** One person in the team grid — square photo, name, role. */
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})
