/** Homepage copy. Repo wins over address-y Sanity so staging matches Bakehouse mood. */
import { MENUS_DROPDOWN } from './nav'

export const homeHeroFallback = {
  heading: 'Good food, better company at Penelope Social in Woodbridge',
  body: 'Focaccia sandwiches at lunch, sourdough pizza at dinner, and cocktails whenever you sit down.',
}

export const homeMenusFallback = {
  heading: 'On the menu',
  intro: 'Lunch, dinner, the bar, and catering trays, all from this kitchen.',
  /** /menus hub. Same H2; food-only lede, no sister-brand clause. */
  hubIntro: 'Focaccia sandwiches, pizza, shareable plates, and cocktails, plus trays when you want them.',
  ctaLabel: 'Explore our menus',
  ctaUrl: '/menus',
  cards: [
    {
      title: 'Lunch',
      line: 'Pizza and focaccia sandwiches',
      url: '/menus/lunch',
    },
    {
      title: 'Bar',
      line: 'Cocktails till late',
      url: '/menus/bar',
    },
    {
      title: 'Dinner',
      line: 'Pizza and shareables',
      url: '/menus/dinner',
    },
    {
      title: 'Catering',
      line: 'Trays for your event',
      url: '/menus/catering',
    },
  ],
}

export const homeBreadFallback = {
  heading: 'Good bread, served here every day',
  body: 'Loaves start at Penelope Bakehouse and land here as sandwiches and pizza, or as bread with dinner.',
  /** Same line, with "sandwiches" and "pizza" linked to their landing pages. */
  bodyHtml:
    'Loaves start at Penelope Bakehouse and land here as <a href="/sandwiches-vaughan">sandwiches</a> and <a href="/pizza-vaughan">pizza</a>, or as bread with dinner.',
  ctaLabel: 'Visit the Bakehouse',
  /**
   * The Bakehouse's page on this site, not penelopebakehouse.com. The sister
   * site is still one click further on (that page's Website row and its order
   * and catering buttons all go there), so nothing is unreachable — the
   * homepage just no longer hands visitors off to another domain mid-story.
   */
  ctaUrl: '/locations/scarborough',
}

export const homeEventsFallback = {
  heading: 'Events at Penelope',
  body: 'Birthdays, work dinners, and nights in the room, with food, drinks, and a table we will set.',
}

/** Homepage green band. Merch is in-store only, not e-comm. */
export const homeWaveMerch = {
  wave: 'Take a shirt home from Social',
  status: 'Hoodies, tees, totes. Purchase and pick them up in store.',
  ctaLabel: 'See merch',
  ctaUrl: '/merchandise',
}

/**
 * "What we're known for" on the homepage: the four dish landing pages, right
 * under "On the menu". Before this they were linked only from the hover-only
 * Menus dropdown, collapsed FAQ answers and one sentence near the foot of the
 * page, while "On the menu" sent pizza and sandwich intent to /menus/lunch.
 * Labels, lines and photos come from the dropdown so the three stay in step.
 */
const SPECIALTY_ALT: Record<string, string> = {
  '/cafe-in-vaughan': 'A latte with latte art at Penelope Social',
  '/pizza-vaughan': 'Sourdough pizza at Penelope Social',
  '/sandwiches-vaughan': 'An Italian focaccia sandwich',
  '/bakery-vaughan': 'Sourdough loaves from Penelope Bakehouse',
}

export const homeSpecialtiesBlock = {
  _type: 'menuCards',
  _key: 'specialties',
  layout: 'sentence',
  heading: "What we're known for",
  /* Read in order: plain words, then each landing page as a photo + link. The
     link text is the page's subject, so it doubles as descriptive anchor text. */
  sentence: [
    { text: 'Come in for' },
    { url: '/pizza-vaughan', label: 'sourdough pizza', after: ',' },
    { url: '/sandwiches-vaughan', label: 'Italian sandwiches', after: ',' },
    { text: 'coffee at our' },
    { url: '/cafe-in-vaughan', label: 'Italian cafe' },
    { text: 'and' },
    { url: '/bakery-vaughan', label: 'bread to take home', after: '.' },
  ],
  cards: (MENUS_DROPDOWN.find((group) => group.heading === 'Specialties')?.links ?? []).map((link) => ({
    _key: link.url,
    title: link.label,
    line: link.description,
    url: link.url,
    image: { _type: 'image', alt: SPECIALTY_ALT[link.url] ?? link.label, asset: { _ref: link.image, _type: 'reference' } },
  })),
}
