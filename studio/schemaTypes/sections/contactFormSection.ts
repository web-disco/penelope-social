import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Enquiry form. Submissions go to the Cloudflare Worker, which verifies the
 * Turnstile token and emails them on — Webflow's own form dashboard doesn't
 * survive the migration.
 *
 * Was `formSection`. A query string deep-links a reason:
 * /catering-events?general-inquiry preselects "General Inquiry".
 */
export const contactFormSection = defineType({
  name: 'contactFormSection',
  title: 'Contact form',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'variant',
      title: 'Form',
      type: 'string',
      options: {
        list: [
          { title: 'Events — posts to /api/events', value: 'events' },
          { title: 'Contact — posts to /api/contact', value: 'contact' },
        ],
        layout: 'radio',
      },
      initialValue: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'intro', title: 'Intro copy', type: 'text', rows: 3 }),
    defineField({
      name: 'fields',
      title: 'Fields',
      type: 'array',
      of: [defineArrayMember({ type: 'formField' })],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
      initialValue: 'Submit',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
      initialValue: 'Thank you! Your submission has been received!',
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error message',
      type: 'string',
      initialValue: 'Oops! Something went wrong while submitting the form.',
    }),
  ],
  preview: {
    select: { heading: 'heading', variant: 'variant', fields: 'fields' },
    prepare: ({ heading, variant, fields }) => ({
      title: 'Contact form',
      subtitle: [heading, variant, `${fields?.length ?? 0} field(s)`].filter(Boolean).join(' — '),
      media: BlockIcon,
    }),
  },
})
