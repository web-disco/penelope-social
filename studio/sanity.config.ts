import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'penelope-social',
  title: 'Penelope Social',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    /* Site Settings is a singleton — keep it out of the "create new" menu. */
    templates: (templates) => templates.filter((template) => template.schemaType !== 'siteSettings'),
  },
  document: {
    actions: (actions, context) =>
      context.schemaType === 'siteSettings'
        ? actions.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : actions,
  },
})
