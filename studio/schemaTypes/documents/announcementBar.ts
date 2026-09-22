import { defineField, defineType } from 'sanity'

/**
 * The thin bar above the header — holiday hours, NYE, Christmas parties. A
 * singleton, independent of the Marketing popup: its own schedule, its own
 * dismissal.
 *
 * It scrolls away with the page; the header rides down to meet it at the top
 * and settles back to the top edge once it has gone. Closing it hides it for
 * the rest of the campaign, which is keyed on the text, so rewording it shows
 * it again to everyone.
 */
export const announcementBar = defineType({
  name: 'announcementBar',
  title: 'Announcement bar',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show the bar',
      type: 'boolean',
      group: 'content',
      description: 'Off hides it everywhere, whatever the dates say.',
      initialValue: false,
    }),
    defineField({
      name: 'test',
      title: 'Test mode',
      type: 'boolean',
      group: 'content',
      description:
        'Shows the bar on every page load, ignoring the dates and “closed” state, on localhost and preview builds only — never on penelopesocial.com. Works even when “Show the bar” is off. Turn it off when you are done.',
      initialValue: false,
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      group: 'content',
      description:
        'One short line, e.g. “Christmas party dates are filling up. Book now.” Changing it shows the bar again to people who closed it.',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'mobileText',
      title: 'Mobile text',
      type: 'string',
      group: 'content',
      description:
        'Optional shorter line for phones, e.g. “Book your Christmas party”. Leave empty to use the text above.',
      validation: (Rule) => Rule.max(45),
    }),
    defineField({
      name: 'url',
      title: 'Links to',
      type: 'string',
      group: 'content',
      description:
        'Optional. Makes the whole bar clickable, e.g. /catering-events?event or https://…',
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      hidden: ({ document }) => !document?.url,
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
      description: 'Optional. The bar switches itself off after this day.',
      validation: (Rule) =>
        Rule.custom((end, context) => {
          const start = (context.document as { startDate?: string } | undefined)?.startDate
          return !end || !start || end >= start ? true : 'Must be on or after the start date'
        }),
    }),
  ],
  preview: {
    select: { title: 'text', enabled: 'enabled', test: 'test', endDate: 'endDate' },
    prepare: ({ title, enabled, test, endDate }) => ({
      title: title || 'Announcement bar',
      subtitle: [enabled ? 'On' : 'Off', test && 'Test mode', endDate && `until ${endDate}`]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
