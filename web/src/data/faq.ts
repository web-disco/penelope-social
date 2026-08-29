import type { FaqItem } from './types'
import {
  BAKEHOUSE_SITE_URL,
  CATERING_EVENTS_URL,
  CATERING_MENU_URL,
  ORDER_ONLINE_URL,
  RESERVATIONS_PATH,
  woodbridgeNap,
} from './site'

const address = `${woodbridgeNap.street}, ${woodbridgeNap.city}, ${woodbridgeNap.region} ${woodbridgeNap.postal}`

export const homeFaq: FaqItem[] = [
  {
    question: 'Where is Penelope Social?',
    answer: `Penelope Social is at <a href="/locations/woodbridge">${address}</a>. Phone <a href="tel:${woodbridgeNap.phoneDigits}">${woodbridgeNap.phone}</a>.`,
  },
  {
    question: 'What are the cafe and bar hours?',
    answer:
      '<strong>Cafe</strong>: Monday to Saturday 9am to 3pm, Sunday 8am to 12pm.<br><strong>Bar</strong>: Monday to Thursday 5pm to 10pm, Friday to Saturday 5pm to 1am.<br>Closed Sunday night.',
  },
  {
    question: 'Do you take reservations?',
    answer: `Yes. <a href="${RESERVATIONS_PATH}">Book a table</a> on Toast for dinner and the bar. Cafe lunch is mostly walk-in.`,
  },
  {
    question: 'How is Penelope Bakehouse related?',
    answer: `<a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> is the Scarborough bakehouse and focacceria. We serve that sourdough here. <a href="/sourdough-bakery">Social and Bakehouse</a> has both places.`,
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
      'Three brothers, Franco, Vince, and Giuliano Stalteri. Vince started the sourdough starter named Penelope. The restaurant and the Bakehouse grew from that.',
  },
  {
    question: 'Where is the restaurant?',
    answer: `<a href="/locations/woodbridge">${address}</a>. Cafe by day, kitchen and bar at night.`,
  },
  {
    question: 'How is Penelope Bakehouse related?',
    answer: `<a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> in Scarborough is the bakehouse and focacceria. Loaves, focaccia, and pizza dough for Social start there.`,
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
    answer: `Catering is food to-go, trays from the <a href="${CATERING_MENU_URL}">catering menu</a>. Events are hosted here: birthdays, work dinners, and private nights. Book both on this page.`,
  },
  {
    question: 'How much notice do you need?',
    answer: "We prefer 24 hours' notice for catering orders. Events need more lead time so we can hold the room and the kitchen.",
  },
  {
    question: 'Where is the event space?',
    answer: `At Penelope Social, <a href="/locations/woodbridge">${address}</a>.`,
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
    answer: `Phone <a href="tel:${woodbridgeNap.phoneDigits}">${woodbridgeNap.phone}</a> or email <a href="mailto:${woodbridgeNap.email}">${woodbridgeNap.email}</a>. We're at <a href="/locations/woodbridge">${address}</a>.`,
  },
  {
    question: 'How do I book a table?',
    answer: `Use <a href="${RESERVATIONS_PATH}">reservations</a> on Toast, or ask us on this form. Party size and time help.`,
  },
  {
    question: 'What are your hours?',
    answer:
      'Cafe: Monday to Saturday 9am to 3pm, Sunday 8am to 12pm.<br>Bar: Monday to Thursday 5pm to 10pm, Friday to Saturday 5pm to 1am.<br>Closed Sunday night.',
  },
]

export const woodbridgeFaq: FaqItem[] = [
  {
    question: 'Where is Penelope Social?',
    answer: `${address}. Phone ${woodbridgeNap.phone}.`,
  },
  {
    question: 'What are the cafe and bar hours?',
    answer:
      'Cafe: Monday to Saturday 9am to 3pm, Sunday 8am to 12pm.<br>Bar: Monday to Thursday 5pm to 10pm, Friday to Saturday 5pm to 1am.<br>Closed Sunday night.',
  },
  {
    question: 'Do you take reservations?',
    answer: `Yes. <a href="${RESERVATIONS_PATH}">Book a table</a> on Toast.`,
  },
  {
    question: 'How is Penelope Bakehouse related?',
    answer: `<a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> is the Scarborough bakehouse where the bread is baked. We serve it here.`,
  },
]

export const scarboroughFaq: FaqItem[] = [
  {
    question: 'What is Penelope Bakehouse?',
    answer: `A bakehouse and focacceria at 71 Howden Rd. Loaves, sandwiches, and pizza by the slice. Dinner and the bar are at <a href="/locations/woodbridge">Penelope Social</a>.`,
  },
  {
    question: 'Where do I order Bakehouse bread?',
    answer: `Visit <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a> for the menu, hours, and online order.`,
  },
  {
    question: 'Does Social serve Bakehouse bread?',
    answer:
      'Yes. Sourdough starts at the Scarborough bakehouse and is served at Social as sandwiches, pizza, and loaves on the menu.',
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
    answer: `On <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a>. Hours, photos, and online order too. Social menus (lunch, dinner, bar) stay on this site.`,
  },
  {
    question: 'Where is the bakery in Scarborough?',
    answer: `71 Howden Rd, Scarborough. That is Penelope Bakehouse. Penelope Social is at <a href="/locations/woodbridge">${address}</a>.`,
  },
  {
    question: 'Where is the sourdough baked?',
    answer: `Vince’s starter, Penelope, is the origin story. The loaves are baked at the Scarborough bakehouse and served at Social as sandwiches, pizza, and bread on the table.`,
  },
]
