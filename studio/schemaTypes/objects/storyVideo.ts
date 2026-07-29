import { defineField, defineType } from 'sanity'

/**
 * A self-hosted video in a story section. Two source URLs because the original
 * markup shipped both, and the browser picks the first it can play.
 */
export const storyVideo = defineType({
  name: 'storyVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({ name: 'mp4Url', title: 'MP4 URL', type: 'url' }),
    defineField({ name: 'webmUrl', title: 'WebM URL', type: 'url' }),
  ],
  preview: {
    select: { mp4Url: 'mp4Url', webmUrl: 'webmUrl' },
    prepare: ({ mp4Url, webmUrl }) => ({ title: 'Video', subtitle: mp4Url || webmUrl }),
  },
})
