import { defineArrayMember, defineField, defineType } from 'sanity'

/** One input in the enquiry form. `name` is what arrives in the email. */
export const formField = defineType({
  name: 'formField',
  title: 'Form field',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Field name',
      type: 'string',
      description: 'The label this value arrives under in the notification email.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'id',
      title: 'Field id',
      type: 'string',
      description:
        'The HTML id. "Reason-For-Inquiry" is load-bearing: the query-string prefill targets it.',
    }),
    defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
          { title: 'Number', value: 'number' },
          { title: 'Dropdown', value: 'select' },
          { title: 'Long text', value: 'textarea' },
        ],
      },
      initialValue: 'text',
    }),
    defineField({ name: 'required', title: 'Required', type: 'boolean', initialValue: false }),
    defineField({
      name: 'fullWidth',
      title: 'Full width',
      type: 'boolean',
      description: 'Spans both columns of the form grid.',
      initialValue: false,
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      hidden: ({ parent }) => parent?.type !== 'select',
    }),
    defineField({ name: 'note', title: 'Helper text', type: 'string' }),
  ],
  preview: {
    select: { placeholder: 'placeholder', name: 'name', type: 'type' },
    prepare: ({ placeholder, name, type }) => ({
      title: placeholder || name,
      subtitle: [name, type].filter(Boolean).join(' · '),
    }),
  },
})
