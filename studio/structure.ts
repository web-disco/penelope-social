import type { StructureResolver } from 'sanity/structure'

/** Document types edited as singletons — one instance, no create/duplicate/delete. */
export const singletonTypes = new Set<string>(['homepage', 'siteSettings'])

/** The only actions allowed on a singleton. */
export const singletonActions = new Set<string>([
  'update',
  'publish',
  'unpublish',
  'discardChanges',
  'restore',
])

/**
 * Content first, chrome last. The homepage is pinned at the top as its own
 * entry rather than hiding inside the page list, which is where an editor
 * looking for the front page actually looks.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Penelope Social')
    .items([
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(S.document().schemaType('homepage').documentId('homepage').title('Homepage')),

      S.documentTypeListItem('page').title('Pages'),

      S.divider(),

      S.documentTypeListItem('menu').title('Menus'),
      S.documentTypeListItem('merchProduct').title('Merch'),

      S.divider(),

      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),
    ])
