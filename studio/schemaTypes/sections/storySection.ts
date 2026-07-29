import { defineArrayMember, defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * A centred column of rich copy, optionally followed by a video or a three-up
 * image gallery. The bakery page stacks five of these.
 */
export const storySection = defineType({
  name: 'storySection',
  title: 'Story section',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({ name: 'video', title: 'Video', type: 'storyVideo' }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),
    defineField({
      name: 'galleryId',
      title: 'Lightbox group',
      type: 'string',
      description: 'Galleries sharing this value open as one lightbox slideshow.',
      initialValue: 'story',
    }),
  ],
  preview: {
    select: { body: 'body', gallery: 'gallery', video: 'video' },
    prepare: ({ body, gallery, video }) => ({
      title: 'Story section',
      subtitle:
        [
          body?.[0]?.children?.[0]?.text?.slice(0, 50),
          gallery?.length ? `${gallery.length} image(s)` : null,
          video?.mp4Url || video?.webmUrl ? 'video' : null,
        ]
          .filter(Boolean)
          .join(' — ') || undefined,
      media: BlockIcon,
    }),
  },
})
