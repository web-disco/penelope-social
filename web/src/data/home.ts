/** Homepage copy. Repo wins over address-y Sanity so staging matches Bakehouse mood. */

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
  status: 'Hoodies, tees, totes. Pick them up in store.',
  ctaLabel: 'See merch',
  ctaUrl: '/merchandise',
}
