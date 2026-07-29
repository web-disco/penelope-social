import { defineField, defineType } from 'sanity'
import { BlockIcon } from '../blockIcon'

/**
 * Renders every merch product, ordered by their "Order" field.
 *
 * There is nothing to configure: the component ignores the block entirely and
 * reads the `merchProduct` documents. Sanity requires an object type to declare
 * at least one field, so `note` exists to carry the explanation — deliberately
 * with no `initialValue`, so it says its piece through the description instead
 * of writing a redundant string into every document that uses the block.
 */
export const merchListing = defineType({
  name: 'merchListing',
  title: 'Merch listing',
  type: 'object',
  icon: BlockIcon,
  fields: [
    defineField({
      name: 'note',
      title: 'Products',
      type: 'string',
      readOnly: true,
      description:
        'Every product under Merch appears here automatically, ordered by its Order field. Nothing to configure.',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Merch listing',
      subtitle: 'Every product, in their Order',
      media: BlockIcon,
    }),
  },
})
