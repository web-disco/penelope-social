import { defineField, defineType } from 'sanity'
import { richTextField } from '../objects/richText'

/**
 * A site-wide promo modal — Christmas parties, Valentine's, NYE. A singleton:
 * there is one popup, and the copy changes with the season.
 *
 * Shown once per visit, after the visitor has shown some interest (a few
 * seconds on the site or half a page scrolled), never on page load. Closing it
 * hides it for `dismissDays`; clicking the main button hides it for the rest
 * of the campaign. A campaign is keyed on the title, so a new title shows the
 * popup again to everyone who dismissed the last one.
 *
 * The site is static, so changes go live on the next build like every other
 * document. The schedule is checked in the browser, which is what lets a
 * popup switch itself off on the end date without a deploy.
 */
export const marketingPopup = defineType({
  name: 'marketingPopup',
  title: 'Marketing popup',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show the popup',
      type: 'boolean',
      group: 'content',
      description: 'Off hides it everywhere, whatever the dates below say.',
      initialValue: false,
    }),
    defineField({
      name: 'test',
      title: 'Test mode',
      type: 'boolean',
      group: 'content',
      description:
        'Opens the popup straight away on every page load, on localhost and preview builds only — never on penelopesocial.com. Works even when “Show the popup” is off, so you can check copy before going live. Turn it off when you are done.',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Banner image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Optional. Sits across the top of the popup, cropped to 16:9. Set the hotspot to keep the subject in frame.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the photo, e.g. “Long table set for a holiday dinner”. Leave empty if it is purely decorative.',
        }),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description:
        'Changing the title starts a new campaign: people who closed the old popup will see this one.',
      validation: (Rule) => Rule.required().max(80),
    }),
    {
      ...richTextField('text', 'Text'),
      group: 'content',
      description:
        'One or two short paragraphs. Enter starts a new paragraph; Shift+Enter adds a line break.',
    },
    defineField({
      name: 'primaryCta',
      title: 'Main button',
      type: 'link',
      group: 'content',
      description: 'e.g. “Book your Christmas party” → /catering-events',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryLabel',
      title: 'Close button text',
      type: 'string',
      group: 'content',
      description: 'This button always closes the popup.',
      initialValue: 'Not right now',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'startDate',
      title: 'Start showing on',
      type: 'date',
      group: 'settings',
      description: 'Optional. Leave empty to start as soon as it is published.',
    }),
    defineField({
      name: 'endDate',
      title: 'Stop showing after',
      type: 'date',
      group: 'settings',
      description: 'Optional. The popup switches itself off after this day.',
      validation: (Rule) =>
        Rule.custom((end, context) => {
          const start = (context.document as { startDate?: string } | undefined)?.startDate
          return !end || !start || end >= start ? true : 'Must be on or after the start date'
        }),
    }),
    defineField({
      name: 'dismissDays',
      title: 'Hide for this many days after closing',
      type: 'number',
      group: 'settings',
      initialValue: 14,
      validation: (Rule) => Rule.required().integer().min(1).max(365),
    }),
  ],
  preview: {
    select: { title: 'title', enabled: 'enabled', test: 'test', endDate: 'endDate' },
    prepare: ({ title, enabled, test, endDate }) => ({
      title: title || 'Marketing popup',
      subtitle: [enabled ? 'On' : 'Off', test && 'Test mode', endDate && `until ${endDate}`]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
