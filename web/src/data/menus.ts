import { PAGE_SEO } from './seo'
import { CATERING_EVENTS_URL } from './site'

export const cateringMenuMeta = PAGE_SEO['/menus/catering']!

export const cateringMenuCopy = {
  heading: 'Catering tray menu',
  intro:
    'Party pizzas (24 slices), focaccia sandwiches (minimum of 6, cut in four), breads, and salads for 8–10. Prices are below. Prefer 24 hours’ notice; send the order on Catering and events.',
  noteHeading: 'How to order these trays',
  noteBody:
    'This page is the list and prices. Enquire on Catering and events — trays to-go, or a night in the restaurant.',
  cta: { label: 'Enquire about catering', url: CATERING_EVENTS_URL },
}
