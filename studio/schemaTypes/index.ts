// objects
import { seo } from './objects/seo'
import { link } from './objects/link'
import { button } from './objects/button'
import { quickLink } from './objects/quickLink'
import { menuItem } from './objects/menuItem'
import { menuCategory } from './objects/menuCategory'
import { teamMember } from './objects/teamMember'
import { formField } from './objects/formField'
import { hoursBlock } from './objects/hoursBlock'
import { social } from './objects/social'
import { storyVideo } from './objects/storyVideo'

// sections (page-builder blocks)
import { hero } from './sections/hero'
import { pageHero } from './sections/pageHero'
import { introSection } from './sections/introSection'
import { pageHeading } from './sections/pageHeading'
import { menuCards } from './sections/menuCards'
import { textWithMediaSection } from './sections/textWithMediaSection'
import { teamGrid } from './sections/teamGrid'
import { storySection } from './sections/storySection'
import { merchListing } from './sections/merchListing'
import { contactFormSection } from './sections/contactFormSection'
import { imageGrid } from './sections/imageGrid'

// documents
import { siteSettings } from './documents/siteSettings'
import { homepage } from './documents/homepage'
import { page } from './documents/page'
import { menu } from './documents/menu'
import { merchProduct } from './documents/merchProduct'

/**
 * The page-builder blocks, in the order they appear in the insert menu.
 * Keep in step with objects/pageBuilder.ts and web/src/components/PageBuilder.astro.
 */
export const sectionTypes = [
  hero,
  pageHero,
  introSection,
  pageHeading,
  menuCards,
  textWithMediaSection,
  teamGrid,
  storySection,
  merchListing,
  contactFormSection,
  imageGrid,
]

export const objectTypes = [
  seo,
  link,
  button,
  quickLink,
  menuItem,
  menuCategory,
  teamMember,
  formField,
  hoursBlock,
  social,
  storyVideo,
]

export const documentTypes = [siteSettings, homepage, page, menu, merchProduct]

export const schemaTypes = [...objectTypes, ...sectionTypes, ...documentTypes]
