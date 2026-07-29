import { defineArrayMember, defineField } from 'sanity'

/**
 * Shared page-builder array, used by both the homepage singleton and the page
 * document. Every entry here maps to one component in
 * web/src/components/sections/ and one case in PageBuilder.astro.
 *
 * The field name stays `sections` — it is what the migrated content and the
 * templates already call it, and "sections" is the word editors use.
 */
export const pageBuilderField = defineField({
  name: 'sections',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({ type: 'hero' }),
    defineArrayMember({ type: 'pageHero' }),
    defineArrayMember({ type: 'introSection' }),
    defineArrayMember({ type: 'pageHeading' }),
    defineArrayMember({ type: 'menuCards' }),
    defineArrayMember({ type: 'textWithMediaSection' }),
    defineArrayMember({ type: 'teamGrid' }),
    defineArrayMember({ type: 'storySection' }),
    defineArrayMember({ type: 'merchListing' }),
    defineArrayMember({ type: 'contactFormSection' }),
    defineArrayMember({ type: 'imageGrid' }),
  ],
  options: {
    insertMenu: {
      views: [{ name: 'grid' }, { name: 'list' }],
    },
  },
})
