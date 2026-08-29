import { PAGE_SEO } from './seo'
import { CATERING_EVENTS_URL } from './site'

export const cateringMenuMeta = PAGE_SEO['/menus/catering']!

export const cateringMenuCopy = {
  heading: 'Catering tray menu',
  intro:
    'Trays from the Woodbridge kitchen — not a private-event booking page, and not the Scarborough bakehouse menu. Party pizzas (24 slices), focaccia sandwiches (minimum of 6, cut in four), breads, and salads for 8–10. Prices are below. Prefer 24 hours’ notice; send the order on Catering and events.',
  noteHeading: 'How to order these trays',
  noteBody:
    'This URL is the list. /catering-events is where you enquire — trays to-go, or a night in the restaurant with food and drinks. Different page, different job.',
  cta: { label: 'Enquire about catering', url: CATERING_EVENTS_URL },
}
