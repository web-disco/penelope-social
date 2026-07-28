import type { StructureResolver } from 'sanity/structure'

/**
 * Site Settings is pinned to the top as a singleton; everything else is grouped
 * so editors see the site's shape rather than a flat type list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Penelope Social')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.divider(),

      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('menu').title('Menus'),
      S.documentTypeListItem('merchProduct').title('Merch'),
    ])
