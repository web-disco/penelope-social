import { PAGE_SEO } from './seo'
import { CATERING_EVENTS_URL } from './site'

export const cateringMenuMeta = PAGE_SEO['/menus/catering']!

export const cateringMenuCopy = {
  heading: 'Catering tray menu',
  intro: 'Party pizzas, sandwiches, breads, and salads.',
  noteHeading: 'How to order these trays',
  noteBody:
    'This page is the list and prices. Enquire on Catering and events for trays to-go, or a night in the restaurant.',
  cta: { label: 'Enquire about catering', url: CATERING_EVENTS_URL },
}
