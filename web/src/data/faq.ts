import type { FaqItem } from './types'
import {
  BAKEHOUSE_CATERING_URL,
  BAKEHOUSE_MENU_URL,
  BAKEHOUSE_SITE_URL,
  CATERING_EVENTS_URL,
  CATERING_MENU_URL,
  ORDER_ONLINE_URL,
  RESERVATIONS_PATH,
  scarboroughBakehouse,
  stackedHoursFaqHtml,
  woodbridgeNap,
} from './site'

const address = `${woodbridgeNap.street}, ${woodbridgeNap.city}, ${woodbridgeNap.region} ${woodbridgeNap.postal}`
const bakehouseAddress = `${scarboroughBakehouse.street}, ${scarboroughBakehouse.city}, ${scarboroughBakehouse.region} ${scarboroughBakehouse.postal}`

export const homeFaq: FaqItem[] = [
  {
    question: 'Where is Penelope Social?',
    answer: `Penelope Social is at <a href="/locations/woodbridge">${address}</a>, in Vaughan. Phone <a href="tel:${woodbridgeNap.phoneDigits}">${woodbridgeNap.phone}</a>.`,
  },
  {
    question: 'Where can I get sourdough pizza in Vaughan?',
    answer: `Here, at ${address}. Roman-style slices at lunch and 14-inch New York-style pies at dinner, both on our own sourdough. More on <a href="/pizza-vaughan">our sourdough pizza</a>.`,
  },
  {
    question: 'What are the cafe and bar hours?',
    answer: stackedHoursFaqHtml,
  },
  {
    question: 'Do you take reservations?',
    answer: `Yes. <a href="${RESERVATIONS_PATH}">Book a table</a> on Toast for dinner and the bar. Cafe lunch is mostly walk-in.`,
  },
  {
    question: 'How is Penelope Bakehouse related?',
    answer: `<a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> is the Scarborough bakehouse and focacceria. We serve that sourdough here. Bakehouse bakes it. Social is the cafe and bar.`,
  },
  {
    question: 'Where is the Penelope Bakehouse menu?',
    answer: `On <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a>. Hours and online order too.`,
  },
  {
    question: 'Do you offer catering and events?',
    answer: `Yes. Book trays or a night in the room on <a href="${CATERING_EVENTS_URL}">catering and events</a>. The tray list is at <a href="${CATERING_MENU_URL}">/menus/catering</a>. We prefer 24 hours' notice for catering.`,
  },
  {
    question: 'Can I order online?',
    answer: `Yes. <a href="${ORDER_ONLINE_URL}" target="_blank" rel="noopener noreferrer">Order online</a> through Toast for pickup.`,
  },
]

export const aboutFaq: FaqItem[] = [
  {
    question: 'Who runs Penelope Social?',
    answer:
      'The Stalteri brothers: Franco, Vince, Giuliano. Vince started the sourdough starter named Penelope. The restaurant and the Bakehouse grew from that.',
  },
  {
    question: 'Where is the restaurant?',
    answer: `<a href="/locations/woodbridge">${address}</a>. Woodbridge is in Vaughan. Cafe by day, kitchen and bar at night.`,
  },
  {
    question: 'How is Penelope Bakehouse related?',
    answer: `<a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> in Scarborough is the bakehouse and focacceria. Loaves and focaccia, plus pizza dough for Social, start there.`,
  },
  {
    question: 'Why is the starter named Penelope?',
    answer:
      'Vince made his first starter, Anastasia, in February 2018. He nearly lost it while opening the restaurant, revived it, and renamed it Penelope. The restaurant and the Bakehouse grew from that starter.',
  },
]

export const cateringFaq: FaqItem[] = [
  {
    question: 'What is the difference between catering and events?',
    answer: `Catering is food to-go, trays from the <a href="${CATERING_MENU_URL}">catering menu</a>. Events are hosted here: birthdays and work dinners, or a private night. Book both on this page.`,
  },
  {
    question: 'How much notice do you need?',
    answer: "We prefer 24 hours' notice for catering orders. Events need more lead time so we can hold the room and the kitchen.",
  },
  {
    question: 'Where is the event space?',
    answer: `At Penelope Social, <a href="/locations/woodbridge">${address}</a>, in Vaughan.`,
  },
  {
    question: 'Can I just order trays?',
    answer: `Yes. See the <a href="${CATERING_MENU_URL}">catering menu</a>, then send the form on this page. Choose “Catering” as the reason.`,
  },
]

/** Unique to /menus/catering — tray list and prices. */
export const cateringMenuFaq: FaqItem[] = [
  {
    question: 'Where do I book catering or an event?',
    answer: `This page is the tray list and prices. Book trays or a private night on <a href="${CATERING_EVENTS_URL}">Catering and events</a>.`,
  },
  {
    question: 'What comes on a catering tray?',
    answer:
      '24-slice pizzas, focaccia sandwiches (minimum of 6, each cut into 4), country sourdough and focaccia loaves, and salads that serve 8 to 10. Appetizers and pasta are listed when they are available.',
  },
  {
    question: 'How much notice do tray orders need?',
    answer: `We prefer 24 hours’ notice. Send the order on <a href="${CATERING_EVENTS_URL}">Catering and events</a> and choose “Catering”.`,
  },
  {
    question: 'Where is the Bakehouse menu?',
    answer: `On <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a>. These trays come from the Social kitchen.`,
  },
]

export const contactFaq: FaqItem[] = [
  {
    question: 'How do I reach Penelope Social?',
    answer: `Phone <a href="tel:${woodbridgeNap.phoneDigits}">${woodbridgeNap.phone}</a> or email <a href="mailto:${woodbridgeNap.email}">${woodbridgeNap.email}</a>. We're at <a href="/locations/woodbridge">${address}</a>, in Vaughan.`,
  },
  {
    question: 'How do I book a table?',
    answer: `Use <a href="${RESERVATIONS_PATH}">reservations</a> on Toast, or ask us on this form. Party size and time help.`,
  },
  {
    question: 'What are your hours?',
    answer: stackedHoursFaqHtml,
  },
]

/**
 * Both location sets are copied from the pages penelopebakehouse.com serves for
 * the same two addresses — same questions, same order, same wording — so a
 * reader who lands on either site gets the same answers.
 *
 * The links are the one thing that cannot be copied verbatim. The Bakehouse
 * site is describing these locations from the outside, so its answers link to
 * penelopesocial.com and to its own /menu and /catering. Reproduced here those
 * would either point the reader at the domain they are already on, or 404 —
 * this site has no /menu or /catering. Each link therefore resolves to the
 * equivalent on this side: on-site paths for Social, penelopebakehouse.com for
 * anything that lives on the Bakehouse site.
 */
export const woodbridgeFaq: FaqItem[] = [
  {
    question: 'Where is Penelope Social?',
    answer: `${address}. Phone ${woodbridgeNap.phone}.`,
  },
  {
    // Same hours the Bakehouse page prints, but kept as the shared constant so
    // this cannot drift from the footer and hours table on this same page.
    question: 'What are the cafe and bar hours?',
    answer: stackedHoursFaqHtml,
  },
  {
    question: 'Do you take reservations?',
    answer: `Yes. <a href="${RESERVATIONS_PATH}">Book a table</a> on Toast, or see <a href="/menus">menus</a> and more.`,
  },
  {
    question: 'Can I order online?',
    answer: `Yes. <a href="${ORDER_ONLINE_URL}">Order online through Toast</a>, or use Order online on this page.`,
  },
  {
    question: 'Is this the same as Penelope Bakehouse?',
    answer: `We're sister spots. Penelope Social is the Woodbridge cafe and bar. <a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> is the Scarborough bakehouse and focacceria at ${scarboroughBakehouse.street} — where the bread is baked.`,
  },
  {
    question: 'Do you offer catering and events?',
    answer: `Yes. Plan catering and events through our <a href="${CATERING_EVENTS_URL}">catering and events page</a>.`,
  },
]

export const scarboroughFaq: FaqItem[] = [
  {
    question: 'Where is Penelope Bakehouse?',
    answer: `<a href="/locations">${bakehouseAddress}</a>. Phone <a href="tel:${scarboroughBakehouse.phoneDigits}">${scarboroughBakehouse.phone}</a>.`,
  },
  {
    question: 'What do you sell?',
    answer: `Sourdough bread, <a href="${BAKEHOUSE_MENU_URL}">focaccia sandwiches, pizza by the slice</a>, focaccia loaves, sweets, coffee, and drinks.`,
  },
  {
    question: 'Do you make focaccia sandwiches?',
    answer: `Yes. Our focacceria is inside the bakehouse. You'll find <a href="${BAKEHOUSE_MENU_URL}#sandwiches">Bianca, Classico, Calabrese</a>, Italian, Canadian, Caprese, and more.`,
  },
  {
    question: 'Do you have pizza by the slice?',
    answer: `Yes. Slices include <a href="${BAKEHOUSE_MENU_URL}#pizza">Margherita, NY Pepperoni, Vodka</a>, Spicy Vodka Pepp, and Bee Sting.`,
  },
  {
    question: 'Is the sourdough baked in-house?',
    answer:
      'Yes. Every loaf is naturally fermented, shaped, and baked fresh daily at our Scarborough bakehouse, including the bread for our other locations.',
  },
  {
    question: 'Do you offer catering?',
    answer: `Yes. Request catering through our <a href="${BAKEHOUSE_CATERING_URL}">catering page form</a> (24 hours' notice preferred). Trays of sandwiches, pizza, and more.`,
  },
  {
    question: 'Is this the same as Penelope Social?',
    answer: `We're <a href="/locations">sister spots</a>. Penelope Bakehouse is the Scarborough bakehouse and focacceria at ${scarboroughBakehouse.street}. <a href="/locations/woodbridge">Penelope Social</a> is the Woodbridge cafe and bar at ${woodbridgeNap.street}.`,
  },
]

/** /sourdough-bakery — bakehouse-confusion queries. */
export const sourdoughFaq: FaqItem[] = [
  {
    question: 'How are Social and Bakehouse related?',
    answer: `This page is on Penelope Social, the cafe and bar. <a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> is the Scarborough bakehouse and focacceria.`,
  },
  {
    question: 'Where is the Penelope Bakehouse menu?',
    answer: `On <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a>. Hours, photos, online order too. Social menus (lunch, dinner, bar) stay on this site.`,
  },
  {
    question: 'Where is the bakery in Scarborough?',
    answer: `71 Howden Rd, Scarborough. That is Penelope Bakehouse. Penelope Social is at <a href="/locations/woodbridge">${address}</a>.`,
  },
  {
    question: 'Where is the sourdough baked?',
    answer: `Vince’s starter, Penelope, is the origin story. The loaves are baked at the Scarborough bakehouse and served at Social as sandwiches and pizza, or as bread on the table.`,
  },
]
