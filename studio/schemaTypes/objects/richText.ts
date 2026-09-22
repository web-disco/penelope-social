import { defineArrayMember, defineField } from 'sanity'

/**
 * Body copy for the SEO landing sections: paragraphs with bold, italic and
 * links. No headings — the section already owns its H2, and letting editors
 * add more is how the audit's heading-order skips happen.
 */
export const richTextField = (name = 'body', title = 'Body') =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [{ title: 'Paragraph', value: 'normal' }],
        lists: [],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                defineField({
                  name: 'href',
                  title: 'URL or path',
                  type: 'string',
                  description: 'e.g. /menus/dinner or https://…',
                  validation: (Rule) => Rule.required(),
                }),
              ],
            },
          ],
        },
      }),
    ],
  })
