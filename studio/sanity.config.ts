import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { structure, singletonActions, singletonTypes } from './structure'

export default defineConfig({
  name: 'penelope-social',
  title: 'Penelope Social',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Keep singletons out of the global "create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // No create / duplicate / delete on singletons — there is exactly one
    // Homepage and one Site Settings, and neither can be removed. The previous
    // filter only stripped duplicate/delete, and only for siteSettings.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
