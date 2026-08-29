import { PAGE_SEO } from './seo'
import { BAKEHOUSE_SITE_URL } from './site'

export const aboutMeta = PAGE_SEO['/about']!

/**
 * Family story for /about. Years live only in the timeline.
 * /sourdough-bakery is the Social vs Bakehouse page — keep both routes.
 */
export const aboutPage = {
  heading: 'About Penelope Social',
  subheading:
    'A Woodbridge cafe and bar, with lunch, dinner, and drinks on Bakehouse sourdough.',
  paragraphs: [
    'We serve lunch, dinner, and drinks, with that sourdough as sandwiches, pizza, and bread.',
    'Three brothers, Franco, Vince, and Giuliano, built the room around good bread and a proper bar.',
  ],
  timeline: {
    heading: 'How Penelope started',
    steps: [
      {
        title: '2017',
        body: 'On May 17, Vince Stalteri left construction as a project manager and engineer to follow food.',
      },
      {
        title: '2018',
        body: 'He started learning sourdough and made his first starter, Anastasia. He nearly lost it, then revived it and renamed it Penelope.',
      },
      {
        title: '2024',
        body: 'Penelope became the base for the doughs at Social. Breads and pizzas drawn from Italy and further.',
      },
      {
        title: '2026',
        body: 'Penelope Bakehouse opens in Scarborough. Home for the sourdough that feeds Social, plus focaccia sandwiches and pizza by the slice.',
      },
    ],
  },
  videoTeaser: {
    heading: 'Inside the bake',
    body: 'Vince’s starter still works the dough, and we serve that bread here as sandwiches, pizza, and loaves.',
    layout: 'image-first' as const,
    video: {
      src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/674cc19b8d4f507a7318ec10_PENNY%20BREAD-transcode.mp4',
    },
    image: {
      alt: 'Hands shaping dough for Penelope',
      aspect: '3/2',
    },
    ctas: [{ label: 'Visit the Bakehouse', url: BAKEHOUSE_SITE_URL, style: 'primary' as const, newTab: true }],
  },
  banner: {
    src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/673feab787ea61dbd3013e50_about-banner.avif',
    alt: 'The room at Penelope Social',
  },
}
