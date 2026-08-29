import { PAGE_SEO } from './seo'
import { BAKEHOUSE_SITE_URL } from './site'

export const aboutMeta = PAGE_SEO['/about']!

/**
 * About carries the Vince / origin story that used to live on
 * /sourdough-bakery. That URL now 301s here — do not leave a thin duplicate.
 */
export const aboutPage = {
  heading: 'About Penelope Social',
  subheading: 'A Woodbridge restaurant, and a family bakery story',
  paragraphs: [
    'Penelope Social is the restaurant in Woodbridge — cafe by day, kitchen and bar at night — at 125 Hawkview Blvd. We serve lunch, dinner, and drinks. The sourdough on the table comes from Penelope Bakehouse, our Scarborough micro-bakery.',
    'Three brothers — Franco, Vince, and Giuliano — built this place around good bread, a proper bar, and a room people stay in. The starter is named Penelope. The Bakehouse is where that starter still works. Social is where you sit down.',
    'On May 17, 2017, Vince Stalteri left construction as a project manager and engineer to follow food. The old career paid, and it was stable, but it was not the work he wanted. He kept the leap to himself at first. Cooking was the thing that felt honest.',
    'On January 1, 2018 he set out to learn sourdough. The mix of craft and science — chemistry, biology, physics in a bowl — became an obsession. In February he made his first starter, Anastasia. He neglected it for three weeks while opening the restaurant; it nearly died. He revived it instead of throwing it out, and when it came back he renamed it Penelope. The starter has been the through-line since: stay with the work.',
    'By 2024 Penelope was the foundation for the doughs at Social — breads and pizzas drawn from Italy and further. The aim is bread as food that feeds you, not an empty carb. The loaves now start at Penelope Bakehouse in Scarborough. Social is the Woodbridge room where you eat them.',
  ],
  timeline: {
    heading: 'How Penelope started',
    steps: [
      {
        title: '2017',
        body: 'On May 17, Vince left construction as a project manager and engineer. After years of a stable career that still felt empty, he followed food.',
      },
      {
        title: '2018',
        body: 'January 1 he began learning sourdough. In February he made starter Anastasia, neglected it three weeks while opening the restaurant, revived it, and renamed it Penelope.',
      },
      {
        title: '2024',
        body: 'Penelope became the base for the doughs at Penelope Social in Woodbridge — breads and pizzas inspired by Italy and beyond. The work is to treat bread as nourishing food.',
      },
      {
        title: '2026',
        body: 'Penelope Bakehouse opens in Scarborough — home for the sourdough that feeds Social, plus focaccia sandwiches and pizza by the slice. Visit penelopebakehouse.com.',
      },
    ],
  },
  videoTeaser: {
    heading: 'Inside the bake',
    body: `The family story starts with bread. Social is the Woodbridge restaurant. The loaves still come from the Bakehouse in Scarborough.`,
    layout: 'image-first' as const,
    video: {
      src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/674cc19b8d4f507a7318ec10_PENNY%20BREAD-transcode.mp4',
    },
    image: {
      alt: 'Hands shaping dough for Penelope',
      aspect: '9/16',
    },
    ctas: [{ label: 'Visit the Bakehouse', url: BAKEHOUSE_SITE_URL, style: 'primary' as const, newTab: true }],
  },
  banner: {
    src: 'https://cdn.prod.website-files.com/67356446e4922c58f5ca76c0/673feab787ea61dbd3013e50_about-banner.avif',
    alt: 'The room at Penelope Social in Woodbridge',
  },
}
