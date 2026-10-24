/**
 * Zod schemas for every YAML file in src/content/. They run at build time, so
 * a typo, a missing field or a missing image fails the build instead of
 * shipping, and production keeps the last good deploy.
 *
 * Every object is strict: an unknown key (`objectPositon:`) is an error, not a
 * silently dropped field.
 *
 * Rules that need more than one file (internal links point at real pages,
 * menu-item cards and "from another menu" items name real dishes, callouts
 * name real menus) run in src/lib/content.ts.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { z } from 'astro/zod'

const text = z.string().trim().min(1)

/** Plain copy. HTML is never allowed in content. */
export const plain = text.refine((s) => !s.includes('<'), 'HTML is not allowed here. Write plain text.')

/**
 * Copy that may contain inline Markdown links: `[text](/path)`,
 * `[text](https://…)`, `[text](tel:…)`. Several paragraphs are separated by a
 * blank line. Rendered to <p> and <a> tags by content.ts.
 */
export const markdown = text.refine(
  (s) => !s.includes('<'),
  'HTML is not allowed. Use a Markdown link, [text](/path), instead of an <a> tag.',
)

/** `@order`, `@bakehouse/about`, … resolved from site.yaml `links` by content.ts. */
export const TOKEN = /^@([A-Za-z]+)([/#?].*)?$/

export const url = z
  .string()
  .trim()
  .refine(
    (s) => TOKEN.test(s) || /^(\/|#|https:\/\/|mailto:|tel:)/.test(s),
    'Must be /path, #anchor, https://…, mailto:, tel: or a link token like @order.',
  )

/** A file under public/, referenced by its public path. Must exist. */
const publicFile = z
  .string()
  .trim()
  .refine((s) => s.startsWith('/'), 'Must be a path inside public/, e.g. /images/og/default.png.')
  .refine((s) => existsSync(path.join(process.cwd(), 'public', s)), {
    message: 'File not found in public/. Check the filename and folder.',
  })

/**
 * A photo in src/assets/images/, by bare filename (`hero.jpg`). Astro converts
 * it to WebP and generates responsive widths at build time.
 */
const ASSETS = path.join(process.cwd(), 'src', 'assets', 'images')
const assetFile = z
  .string()
  .trim()
  .refine((s) => !s.includes('/'), 'Use the bare filename (hero.jpg), not a path. Photos live in src/assets/images/.')
  .refine(
    (s) => /\.(jpe?g|png|webp|avif)$/.test(s),
    'Use a JPEG, PNG, WebP or AVIF with a lower-case extension. iPhone HEIC photos: export as JPEG ("Most Compatible") first.',
  )
  .refine((s) => existsSync(path.join(ASSETS, s)), {
    message: 'File not found in src/assets/images/. Check the filename (it is case-sensitive).',
  })

export const image = z.strictObject({
  src: assetFile,
  alt: z.string().trim().refine((s) => !s.includes('<'), 'Plain text only.'),
  /** CSS object-position for a cropped photo, e.g. "center 42%" or "28% 10%". */
  objectPosition: plain.optional(),
})

/**
 * Video and other large files live in the R2 bucket `penelope`, served from
 * this domain (shared with Penelope Bakehouse). Upload under a new filename:
 * files are cached for a year.
 */
export const MEDIA_ORIGIN = 'https://media.penelopebakehouse.com/'
const mediaFile = z
  .string()
  .trim()
  .refine((s) => s.startsWith(MEDIA_ORIGIN), `Must be a ${MEDIA_ORIGIN}… URL (R2).`)

export const cta = z.strictObject({
  label: plain,
  url,
  style: z.enum(['primary', 'outline']).optional(),
  newTab: z.boolean().optional(),
})

export const navLink = z.strictObject({
  label: plain,
  url,
  newTab: z.boolean().optional(),
})

export const seo = z.strictObject({
  title: plain,
  description: plain,
  /** Share image, 1200×630, in public/images/og/. Defaults to site.yaml → seo.ogImage. */
  ogImage: publicFile.optional(),
  noIndex: z.boolean().optional(),
})

const faqItem = z.strictObject({ question: plain, answer: markdown })

/** A shared FAQ: a Markdown answer, or `hours: true` to print the cafe and bar hours. */
const sharedFaqItem = z.union([
  faqItem,
  z.strictObject({ question: plain, hours: z.literal(true) }),
])

/* ------------------------------------------------------------------ */
/* Page-builder sections                                              */
/* ------------------------------------------------------------------ */

const hero = z.strictObject({
  type: z.literal('hero'),
  image,
  heading: plain,
  body: plain,
  primaryCta: navLink,
  secondaryCta: navLink,
})

const pageHero = z.strictObject({
  type: z.literal('pageHero'),
  image,
  heading: plain,
  intro: plain,
})

const menuCard = z.strictObject({
  title: plain,
  line: plain.optional(),
  url,
  image,
})

/** One piece of the "What we're known for" sentence: words, or a linked card. */
const sentencePart = z.union([
  z.strictObject({ text: plain }),
  z.strictObject({ url, label: plain, after: plain.optional() }),
])

const menuCards = z.strictObject({
  type: z.literal('menuCards'),
  /**
   * The page's main menu row: anchored at #menu, large heading, and followed
   * by the callout of any menu that has `callout:` set (Happy Hour).
   */
  main: z.boolean().optional(),
  /** "sentence": one large line of type with photo pills, instead of tiles. */
  layout: z.literal('sentence').optional(),
  heading: plain.optional(),
  intro: plain.optional(),
  /** Show the Google rating (site.yaml → googleRating) under the intro. */
  rating: z.boolean().optional(),
  cta: navLink.optional(),
  cards: z.array(menuCard).min(1),
  sentence: z.array(sentencePart).optional(),
})

const textWithMedia = z.strictObject({
  type: z.literal('textWithMedia'),
  layout: z.enum(['image-first', 'copy-first']),
  heading: plain,
  body: markdown,
  image,
  cta: cta.optional(),
})

const waveMoment = z.strictObject({
  type: z.literal('waveMoment'),
  /** The phrase that scrolls along the wave. */
  wave: plain,
  line: plain,
  cta: navLink,
})

const richTextIntro = z.strictObject({
  type: z.literal('richTextIntro'),
  heading: plain,
  body: markdown,
})

const cateringIntro = z.strictObject({
  type: z.literal('cateringIntro'),
  body: markdown,
  cta: navLink,
})

const menuItemCards = z.strictObject({
  type: z.literal('menuItemCards'),
  heading: plain,
  intro: plain.optional(),
  rating: z.boolean().optional(),
  items: z
    .array(
      z.strictObject({
        /** The dish's name exactly as on the menu. */
        item: plain,
        /** Menu page and section it's listed under: /menus/lunch#pizza-slices. */
        link: url.refine((s) => /^\/menus\/[^/#?]+(#.+)?$/.test(s), 'Must be a menu link, e.g. /menus/lunch#pizza-slices.'),
        image,
      }),
    )
    .min(1),
  cta: navLink.optional(),
})

const stepTimeline = z.strictObject({
  type: z.literal('stepTimeline'),
  heading: plain,
  steps: z.array(z.strictObject({ title: plain, body: markdown })).min(1),
})

const comparisonTable = z.strictObject({
  type: z.literal('comparisonTable'),
  heading: plain,
  intro: plain.optional(),
  columns: z.array(plain).min(2),
  /** Which column is Penelope's, counting from 1. */
  highlight: z.number().int().min(1).optional(),
  rows: z.array(z.strictObject({ label: plain, values: z.array(plain).min(1) })).min(1),
})

const mediaTextCta = z.strictObject({
  type: z.literal('mediaTextCta'),
  layout: z.enum(['image-first', 'copy-first']),
  eyebrow: plain.optional(),
  heading: plain,
  body: markdown,
  image,
  ctas: z.array(cta).optional(),
})

const visitDetails = z.strictObject({
  type: z.literal('visitDetails'),
  heading: plain,
  intro: plain.optional(),
  ctas: z.array(cta).optional(),
  showAddress: z.boolean().optional(),
  hours: z.enum(['both', 'cafe', 'bar', 'none']).optional(),
  rows: z.array(z.strictObject({ label: plain, body: plain })).optional(),
  showMap: z.boolean().optional(),
  layout: z.enum(['copy-first', 'details-first']).optional(),
})

const faqSection = z.strictObject({
  type: z.literal('faqSection'),
  heading: plain,
  items: z.array(faqItem).min(1),
})

const finalCta = z.strictObject({
  type: z.literal('finalCta'),
  heading: plain,
  body: plain.optional(),
  ctas: z.array(cta).optional(),
  /** Google map of the restaurant beside the copy. Default true. */
  showMap: z.boolean().optional(),
})

const formField = z.strictObject({
  id: plain,
  name: plain,
  type: z.enum(['text', 'email', 'tel', 'number', 'date', 'select', 'textarea']),
  placeholder: plain,
  required: z.boolean().optional(),
  fullWidth: z.boolean().optional(),
  options: z.array(plain).optional(),
  note: plain.optional(),
})

const contactForm = z.strictObject({
  type: z.literal('contactForm'),
  /** "events" posts to /api/events and adds the catering-notice checkbox. */
  variant: z.enum(['contact', 'events']),
  heading: plain,
  intro: plain.optional(),
  fields: z.array(formField).min(1),
  submitLabel: plain,
  successMessage: plain,
  errorMessage: plain,
})

const merchListing = z.strictObject({ type: z.literal('merchListing') })

export const section = z.discriminatedUnion('type', [
  hero,
  pageHero,
  menuCards,
  textWithMedia,
  waveMoment,
  richTextIntro,
  cateringIntro,
  menuItemCards,
  stepTimeline,
  comparisonTable,
  mediaTextCta,
  visitDetails,
  faqSection,
  finalCta,
  contactForm,
  merchListing,
])

/* ------------------------------------------------------------------ */
/* Documents                                                          */
/* ------------------------------------------------------------------ */

export const homeSchema = z.strictObject({
  seo,
  sections: z.array(section).min(1),
})

/** src/content/pages/<slug>.yaml, served at /<slug>. */
export const pageSchema = z.strictObject({
  title: plain,
  /** Last crumb in the breadcrumb bar and BreadcrumbList. */
  breadcrumb: plain,
  seo,
  /**
   * Menu categories to describe in this page's Menu JSON-LD, so the prices in
   * structured data are the ones on /menus/*. `name` is the section's label.
   */
  schemaMenu: z
    .array(z.strictObject({ menu: plain, category: plain, name: plain }))
    .optional(),
  sections: z.array(section).min(1),
})

const menuItem = z.strictObject({
  title: plain,
  description: plain.optional(),
  price: plain.optional(),
})

/** A dish listed on another menu, shown here at this menu's price (Happy Hour). */
const linkedMenuItem = z.strictObject({
  /** The other menu's slug, e.g. dinner. */
  from: plain,
  /** The dish's name exactly as on that menu. */
  item: plain,
  price: plain,
})

/** src/content/menus/<slug>.yaml, served at /menus/<slug>. */
export const menuSchema = z.strictObject({
  /** Short name: callout title, offer links ("Happy Hour · 12"). */
  title: plain,
  /** H1 on the banner. */
  heading: plain,
  /** One line under the H1. */
  intro: plain,
  breadcrumb: plain,
  banner: image,
  seo,
  /** A block between the banner and the categories (the catering menu's "How to order"). */
  note: z.strictObject({ heading: plain, body: plain, cta: navLink }).optional(),
  /**
   * Feature this menu in a photo callout under the menu cards on the homepage
   * and /menus, and at the foot of each menu listed in `alsoOn`.
   */
  callout: z
    .strictObject({
      line: plain,
      ctaLabel: plain,
      image: image.optional(),
      alsoOn: z.array(plain).optional(),
    })
    .optional(),
  categories: z
    .array(
      z.strictObject({
        title: plain,
        /** The #anchor for links to this section. */
        anchor: z.string().regex(/^[a-z0-9-]+$/, 'Lower-case letters, numbers and hyphens only.'),
        description: markdown.optional(),
        items: z.array(z.union([menuItem, linkedMenuItem])),
      }),
    )
    .min(1),
})

/** src/content/merch/<slug>.yaml, served at /merchandise/<slug>. */
export const merchSchema = z.strictObject({
  /** Name on the /merchandise card. */
  title: plain,
  /** Name on the product page (heading and breadcrumb). */
  heading: plain,
  /** Listing order on /merchandise, lowest first. */
  order: z.number().int(),
  price: plain,
  description: plain,
  /** Banner photo behind the shared /merchandise hero copy. */
  banner: image,
  images: z.array(image).min(1),
  cta: cta.optional(),
  seo,
})

const footerLink = z.strictObject({ label: plain, url })

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Write the time as "HH:MM", 24-hour, in quotes: "17:00".')
const day = z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])

const hoursGroup = z.strictObject({
  label: plain,
  /** As printed: footer, /locations/woodbridge, the hours FAQs. */
  lines: z.array(plain).min(1),
  /** The same hours as data, for Google's structured data. Keep it in step with `lines`. */
  schedule: z.array(z.strictObject({ days: z.array(day).min(1), opens: time, closes: time })).min(1),
})

const phone = z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Write the phone as (905) 607-0606.')

const address = {
  name: plain,
  street: plain,
  city: plain,
  region: plain,
  postal: plain,
}

export const siteSchema = z.strictObject({
  /** Shared links, used as `@name` tokens in any url or Markdown link. */
  links: z.record(z.string().regex(/^[A-Za-z]+$/), z.string().url().startsWith('https://')),
  nap: z.strictObject({
    ...address,
    country: plain,
    phone,
    email: z.string().email(),
    geo: z.strictObject({ latitude: z.number(), longitude: z.number() }),
  }),
  hours: z.strictObject({ cafe: hoursGroup, bar: hoursGroup }),
  bakehouse: z.strictObject({
    ...address,
    phone,
    email: z.string().email(),
    hours: z.array(z.strictObject({ label: plain, lines: z.array(plain).min(1) })).min(1),
  }),
  /** Default share image when a page sets none. */
  seo: z.strictObject({ ogImage: publicFile }),
  googleRating: z.strictObject({ score: z.number().min(0).max(5), label: plain, url }),
  header: z.strictObject({
    logo: publicFile,
    logoAlt: plain,
    orderOnline: navLink,
    reservations: navLink,
  }),
  /** Header and drawer links, in order. Merch shows in the drawer only. */
  nav: z.array(navLink).min(1),
  /** The Menus dropdown (desktop) and the drawer's second screen. */
  menusDropdown: z
    .array(
      z.strictObject({
        heading: plain,
        links: z
          .array(z.strictObject({ label: plain, url, description: plain, image }))
          .min(1),
      }),
    )
    .min(1),
  footer: z.strictObject({
    logo: publicFile,
    logoAlt: plain,
    newsletter: z.strictObject({
      heading: plain,
      text: plain,
      placeholder: plain,
      buttonLabel: plain,
      consentText: plain,
      successMessage: plain,
      errorMessage: plain,
    }),
    menus: z.strictObject({ heading: plain, blurb: plain, blurbUrl: url, links: z.array(footerLink).min(1) }),
    /** The footer's Specialties column lists the Specialties group of menusDropdown. */
    specialties: z.strictObject({ heading: plain, blurb: plain }),
    /** The address itself comes from `nap`. */
    hours: z.strictObject({ heading: plain, locationLabel: plain, mapUrl: url }),
    /** Phone and email come from `nap`. */
    contact: z.strictObject({
      heading: plain,
      socialsLabel: plain,
      socials: z.array(z.strictObject({ platform: plain, url, icon: publicFile })),
      googleReview: footerLink,
    }),
  }),
  /** The bar above the header. */
  announcement: z.strictObject({
    enabled: z.boolean(),
    /** Show it off the production hostnames even while disabled, to check copy. */
    test: z.boolean().optional(),
    text: plain,
    mobileText: plain.optional(),
    url: url.optional(),
    newTab: z.boolean().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
  /** The seasonal promo modal. Keyed on its title: retitle it to show it again to people who closed it. */
  popup: z.strictObject({
    enabled: z.boolean(),
    test: z.boolean().optional(),
    title: plain,
    text: markdown.optional(),
    image: image.optional(),
    primaryCta: navLink,
    secondaryLabel: plain,
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    /** Days a closed popup stays hidden. */
    dismissDays: z.number().int().min(1),
  }),
})

/** src/content/faqs.yaml: FAQ sets by page. */
export const faqsSchema = z.strictObject({
  home: z.array(sharedFaqItem).min(1),
  about: z.array(sharedFaqItem).min(1),
  contact: z.array(sharedFaqItem).min(1),
  catering: z.array(sharedFaqItem).min(1),
  woodbridge: z.array(sharedFaqItem).min(1),
  scarborough: z.array(sharedFaqItem).min(1),
})

const banner = z.strictObject({ image, heading: plain, intro: plain })

/** src/content/about.yaml */
export const aboutSchema = z.strictObject({
  seo,
  banner,
  body: markdown,
  timeline: z.strictObject({
    heading: plain,
    steps: z.array(z.strictObject({ title: plain, body: plain })).min(1),
  }),
  video: z.strictObject({
    heading: plain,
    body: plain,
    /** The video file: a URL on the R2 media domain. */
    file: mediaFile,
    /** Still shown before the video plays: a URL on the R2 media domain. */
    poster: mediaFile,
    alt: plain,
    ctas: z.array(cta),
  }),
})

const location = z.strictObject({
  seo,
  heading: plain,
  intro: plain,
  image,
  /** The location's card on /locations. */
  card: z.strictObject({ title: plain, blurb: plain, cta: navLink }),
  details: z.strictObject({ heading: plain, body: markdown, ctas: z.array(cta) }),
})

/** src/content/locations.yaml */
export const locationsSchema = z.strictObject({
  hub: z.strictObject({ seo, heading: plain, intro: plain, image }),
  woodbridge: location,
  scarborough: location,
})
