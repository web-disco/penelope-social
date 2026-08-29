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
    answer: `Penelope Social is the restaurant at <a href="/locations/woodbridge">${address}</a>. Phone <a href="tel:${woodbridgeNap.phoneDigits}">${woodbridgeNap.phone}</a>. Woodbridge is the locality; we serve the wider Vaughan area.`,
  },
  {
    question: 'What are the cafe and bar hours?',
    answer:
      '<strong>Cafe</strong>: Monday–Saturday 9am–3pm, Sunday 8am–12pm.<br><strong>Bar</strong>: Monday–Thursday 5pm–10pm, Friday–Saturday 5pm–1am. Closed Sunday night.',
  },
  {
    question: 'Do you take reservations?',
    answer: `Yes. <a href="${RESERVATIONS_PATH}">Book a table</a> on Toast for dinner and the bar. Cafe lunch is mostly walk-in.`,
  },
  {
    question: 'Is this the same as Penelope Bakehouse?',
    answer: `No. Penelope Social is the Woodbridge cafe and bar at 125 Hawkview Blvd. <a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> is the Scarborough micro-bakery at 71 Howden Rd — that is where the sourdough is baked. We serve that bread here.`,
  },
  {
    question: 'Where is the Penelope Bakehouse menu?',
    answer: `The Scarborough bakehouse menu, hours, and online order live on <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a>. This site is Penelope Social — lunch, dinner, bar, and the catering tray list are here.`,
  },
  {
    question: 'Do you offer catering and events?',
    answer: `Yes. Catering trays and private events are booked on our <a href="${CATERING_EVENTS_URL}">catering and events</a> page. The tray menu lives at <a href="${CATERING_MENU_URL}">/menus/catering</a>. We prefer 24 hours' notice for catering.`,
  },
  {
    question: 'Can I order online?',
    answer: `Yes. <a href="${ORDER_ONLINE_URL}" target="_blank" rel="noopener noreferrer">Order online</a> through Toast for pickup, or come in at 125 Hawkview Blvd.`,
  },
]

export const aboutFaq: FaqItem[] = [
  {
    question: 'Who runs Penelope Social?',
    answer:
      'Three brothers — Franco, Vince, and Giuliano Stalteri. Vince started the sourdough starter named Penelope; the restaurant and the Bakehouse grew from that.',
  },
  {
    question: 'Where is the restaurant?',
    answer: `<a href="/locations/woodbridge">${address}</a>. Cafe by day, kitchen and bar at night.`,
  },
  {
    question: 'How is Penelope Bakehouse related?',
    answer: `<a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> in Scarborough is the micro-bakery sibling. Loaves, focaccia, and pizza dough for Social start there. It is not a second dining room.`,
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
    answer: `Catering is food to-go — trays from the <a href="${CATERING_MENU_URL}">catering menu</a>. Events are hosted here at the Woodbridge restaurant: birthdays, work dinners, and private nights. Book both on this page.`,
  },
  {
    question: 'How much notice do you need?',
    answer: "We prefer 24 hours' notice for catering orders. Events need more lead time so we can hold the room and the kitchen.",
  },
  {
    question: 'Where is the event space?',
    answer: `At Penelope Social, <a href="/locations/woodbridge">${address}</a> — not at the Scarborough Bakehouse.`,
  },
  {
    question: 'Can I just order trays?',
    answer: `Yes. See the <a href="${CATERING_MENU_URL}">catering menu</a>, then send the form on this page. Choose “Catering” as the reason.`,
  },
]

/** Unique to /menus/catering — tray list, not the events booking page. */
export const cateringMenuFaq: FaqItem[] = [
  {
    question: 'Is this the catering and events booking page?',
    answer: `No. This page is the tray list and prices. To order trays or book a private night in the restaurant, go to <a href="${CATERING_EVENTS_URL}">Catering and events</a>.`,
  },
  {
    question: 'What comes on a catering tray?',
    answer:
      '24-slice pizzas, focaccia sandwiches (minimum of 6, each cut into 4), country sourdough and focaccia loaves, and salads that serve 8–10. Appetizers and pasta are listed when they are available.',
  },
  {
    question: 'How much notice do tray orders need?',
    answer: `We prefer 24 hours’ notice. Send the order on <a href="${CATERING_EVENTS_URL}">Catering and events</a> and choose “Catering”.`,
  },
  {
    question: 'Is this the Penelope Bakehouse catering menu?',
    answer: `No. These trays come from Penelope Social’s Woodbridge kitchen. For the Scarborough bakehouse menu, go to <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a>.`,
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
      'Cafe: Monday–Saturday 9am–3pm, Sunday 8am–12pm. Bar: Monday–Thursday 5pm–10pm, Friday–Saturday 5pm–1am.',
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
      'Cafe: Monday–Saturday 9am–3pm, Sunday 8am–12pm.<br>Bar: Monday–Thursday 5pm–10pm, Friday–Saturday 5pm–1am.',
  },
  {
    question: 'Do you take reservations?',
    answer: `Yes. <a href="${RESERVATIONS_PATH}">Book a table</a> on Toast.`,
  },
  {
    question: 'Is this the same as Penelope Bakehouse?',
    answer: `Sister spots. This is the Woodbridge restaurant. <a href="${BAKEHOUSE_SITE_URL}">Penelope Bakehouse</a> is the Scarborough micro-bakery where the bread is baked.`,
  },
]

export const scarboroughFaq: FaqItem[] = [
  {
    question: 'Is there a Penelope Social dining room in Scarborough?',
    answer: `No. Penelope Bakehouse at 71 Howden Rd is a micro-bakery — counter service, loaves, sandwiches, and pizza by the slice. Dinner and the bar are at <a href="/locations/woodbridge">Penelope Social in Woodbridge</a>.`,
  },
  {
    question: 'Where do I order Bakehouse bread?',
    answer: `Visit <a href="${BAKEHOUSE_SITE_URL}">penelopebakehouse.com</a> for the Scarborough bakehouse menu, hours, and online order.`,
  },
  {
    question: 'Does Social serve Bakehouse bread?',
    answer:
      'Yes. Sourdough for the Woodbridge restaurant starts at the Scarborough bakehouse and is served here as sandwiches, pizza, and loaves on the menu.',
  },
]
