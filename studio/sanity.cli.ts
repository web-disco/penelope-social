import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /*
   * Pinned so `sanity deploy` never prompts for a hostname, and — more to the
   * point — can never be answered with a different one, which would strand the
   * client on a Studio URL that stops being updated.
   */
  studioHost: 'penelope-social',
  /* Same reasoning — pinned so a later deploy targets this application rather
     than prompting and possibly creating a second one. */
  deployment: {
    appId: 'f7s9ifshn9bud22qkf48po6l',
  },
})
