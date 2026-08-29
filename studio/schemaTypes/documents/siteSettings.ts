import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Site-wide chrome: header, footer, and the default SEO. A singleton — see
 * structure.ts's `singletonTypes`.
 *
 * The newsletter pop-up that used to live here is gone. Webflow shipped a
 * `.newsletter` overlay that never ran (`display:none` in the compiled CSS, no
 * trigger, no close button), and it was ported in that same hidden state behind
 * fields an editor could fill in with no way to ever see the result. Filling
 * them in was the trap: the wrapper is fixed/inset-0/z-50, so anything that
 * revealed it would cover the homepage on every visit with nothing to dismiss.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'header', title: 'Header & Menu', default: true },
    { name: 'footer', title: 'Footer' },
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
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({ name: 'logoAlt', title: 'Logo alt text', type: 'string' }),
        defineField({ name: 'orderOnline', title: 'Order online button', type: 'link' }),
        defineField({ name: 'reservations', title: 'Reservations button', type: 'link' }),
        defineField({
          name: 'drawerLinks',
          title: 'Nav links',
          type: 'array',
          description: 'Shown in the desktop bar and the mobile menu.',
          of: [defineArrayMember({ type: 'link' })],
        }),
      ],
    }),

    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
        defineField({ name: 'logoAlt', title: 'Logo alt text', type: 'string' }),
        defineField({
          name: 'newsletter',
          title: 'Newsletter band',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'text', title: 'Copy', type: 'text', rows: 2 }),
            defineField({ name: 'placeholder', title: 'Input placeholder', type: 'string' }),
            defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
            defineField({
              name: 'consentText',
              title: 'Consent checkbox text',
              type: 'text',
              rows: 2,
              description:
                'Shown beside the consent checkbox. Canadian anti-spam law (CASL) requires provable express consent, so this wording matters.',
              initialValue:
                'I agree to receive marketing emails from Penelope Social. Unsubscribe at any time.',
            }),
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
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({ type: 'link' })],
            }),
          ],
        }),
        defineField({
          name: 'hours',
          title: 'Hours & location column',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({
              name: 'locationLabel',
              title: 'Location label',
              type: 'string',
              description: 'Woodbridge is the locality. Do not put Vaughan as the city.',
            }),
            defineField({
              name: 'address',
              title: 'Address',
              type: 'string',
              description: 'Must match GBP: 125 Hawkview Blvd, Woodbridge, ON L4H 2E2',
            }),
            defineField({ name: 'mapUrl', title: 'Map link', type: 'url' }),
            defineField({
              name: 'blocks',
              title: 'Hours',
              type: 'array',
              of: [defineArrayMember({ type: 'hoursBlock' })],
            }),
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
            defineField({
              name: 'socials',
              title: 'Socials',
              type: 'array',
              of: [defineArrayMember({ type: 'social' })],
            }),
            defineField({ name: 'googleReview', title: 'Google Reviews button', type: 'link' }),
          ],
        }),
        /*
         * The copyright row is not editable. It was four fields — copyright
         * line, credit prefix, credit label, credit URL — none of which anyone
         * ever meaningfully changes, and the one that mattered had already
         * drifted: the line still read “© 2024”. The year is now derived at
         * build time and the Web Disco credit is fixed in Footer.astro.
         */
      ],
    }),

    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description:
        'Fallback title/description. Use Woodbridge as the city. Unique per-page SEO lives on each document.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
})
