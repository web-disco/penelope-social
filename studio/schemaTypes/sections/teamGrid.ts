import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/** Grid of people — square photo, name, role. */
export const teamGrid = defineType({
  name: 'teamGrid',
  title: 'Team grid',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'members',
      title: 'Members',
      type: 'array',
      of: [defineArrayMember({ type: 'teamMember' })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { members: 'members' },
    prepare: ({ members }) => ({
      title: 'Team grid',
      subtitle: `${members?.length ?? 0} person/people`,
      media: BlockIcon,
    }),
  },
})
