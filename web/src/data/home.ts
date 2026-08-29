/** Homepage copy. Repo wins over address-y Sanity so staging matches Bakehouse mood. */

export const homeHeroFallback = {
  heading: 'Good food, better company',
  body: 'Focaccia sandwiches, sourdough pizza, and cocktails, made daily at our Woodbridge cafe and bar.',
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
      line: 'Focaccia sandwiches and pizza daily',
      url: '/menus/lunch',
    },
    {
      title: 'Bar',
      line: 'Cocktails, wine, and a late sit',
      url: '/menus/bar',
    },
    {
      title: 'Dinner',
      line: 'Pizza, handhelds, and shareable plates',
      url: '/menus/dinner',
    },
    {
      title: 'Catering',
      line: 'Trays of pizza and sandwiches',
      url: '/menus/catering',
    },
  ],
}

export const homeBreadFallback = {
  heading: 'Good bread, served here every day',
  body: 'Loaves start at Penelope Bakehouse and land here as sandwiches, pizza, and bread with dinner.',
  ctaLabel: 'Social and Bakehouse',
  ctaUrl: '/sourdough-bakery',
}

export const homeEventsFallback = {
  heading: 'Events at Penelope',
  body: 'Birthdays, work dinners, and nights in the room, with food, drinks, and a table we will set.',
}
